/*
 * Convert texts from the Online Library of Liberty to Markit.
 */
import fs from 'fs'
import path from 'path'
import request from 'sync-request'
import jsdom from 'jsdom'
import YAML from 'yamljs'

// cache of HTTP page requests
const docs = {}

// the main conversion function
export default function convert (filePath, noteIds = []) {
  // read the file contents
  let fileContents = fs.readFileSync(filePath, 'utf-8')

  // check for YAML at the start of the document
  const yamlCheck = fileContents.match(/^---\n((.|\n)*?)\n---\n/)

  // get YAML data
  const data = YAML.parse(yamlCheck[1])

  if (data.contents) {
    data.contents.forEach((subFilePath) => {
      convert(`${path.dirname(filePath)}/${subFilePath}`, noteIds)
    })
  } else {
    const source = data.sourceUrl.trim().split('#')
    const url = source[0]
    const divId = source[1]
    if (!divId) return
    const doc = docs[url] || new jsdom.JSDOM(request('GET', url).getBody('utf-8')).window
    if (!docs[url]) {
      // save to the cache for subsequent conversions
      docs[url] = doc
    }
    const div = doc[divId]

    // set file contents to YAML data only (removing any previous import)
    fileContents = `---\n${yamlCheck[1]}\n---\n`

    // look for a section title, and maybe add it
    const title = div.querySelector('h2')
    if (title) {
      fileContents += convertTitle(noteIds, title)
      fileContents += '\n\n'
    }

    // get text of all paragraphs and notes
    const paragraphs = Array.from(div.querySelectorAll('p, ul.poem'))
      .map(convertParagraph.bind(null, noteIds))
    const notes = noteIds.map(convertFootnote.bind(null, doc))

    // add paragraphs
    fileContents += paragraphs.join('\n\n')

    // add notes (if any)
    if (notes.length) {
      fileContents += '\n\n'
      fileContents += notes.join('\n\n')
    }

    // add file blank line and save to disk
    fileContents += '\n'
    fs.writeFileSync(filePath, fileContents)

    // tell someone about it
    console.log(`Imported ${data.id}`)
  }
}

// map title DOM element to Markit string
function convertTitle (noteIds, element) {
  // initialise text with title tag
  let text = '{title}\n'

  // loop through the element's children
  Array.from(element.children).forEach((c) => {
    // throw away page breaks and milestones
    if (c.classList.contains('pb') || c.classList.contains('milestone')) {
      c.innerHTML = ''
    }

    // store any note IDs
    if (c.classList.contains('footnote-link')) {
      noteIds.push(c.getAttribute('href').slice(1))
      c.innerHTML = noteIds.length.toString(10)
    }
  })

  // add the paragraph content (formatting as Markit)
  text += `£1 ${markit(element.innerHTML)} £1`

  // return the text (wrapped at 80 characters)
  return text.replace(/(?![^\n]{1,80}$)([^\n]{1,80})\s/g, '$1\n')
}

// map paragraph DOM element to Markit string
function convertParagraph (noteIds, element, index) {
  // initialise paragraph text with ID
  let text = `{#${(index + 1).toString(10)}} `

  // loop through the element's children
  Array.from(element.children).forEach((c) => {
    // throw away page breaks and milestones
    if (c.classList.contains('pb') || c.classList.contains('milestone')) {
      c.innerHTML = ''
    }

    // modify margin comments
    if (c.classList.contains('type-margin')) {
      c.innerHTML = `#${c.innerHTML}#`
    }

    // store any note IDs
    if (c.classList.contains('footnote-link')) {
      noteIds.push(c.getAttribute('href').slice(1))
      c.innerHTML = noteIds.length.toString(10)
    }
  })

  // add the paragraph content (formatting as Markit)
  text += markit(element.innerHTML)

  // return the text (wrapped at 80 characters)
  return text.replace(/(?![^\n]{1,80}$)([^\n]{1,80})\s/g, '$1\n')
}

// map note ID to Markit string
function convertFootnote (doc, divId, index) {
  // get the footnote div
  const div = doc.getElementById(divId)

  // initialise footnote text with ID
  let text = `{#n${(index + 1).toString(10)}} `

  // get inner HTML of all children of the footnote div
  const innerHTML = Array.from(div.querySelectorAll('p, ul.poem'))
    .reduce((sofar, current) => sofar + current.innerHTML, '')

  // add inner HTML to the text (formatting as Markit)
  text += markit(innerHTML)

  // return the text (wrapped at 80 characters)
  return text.replace(/(?![^\n]{1,80}$)([^\n]{1,80})\s/g, '$1\n')
}

// convert html content to Markit
function markit (text) {
  return text
    .replace(/<a[^>]*footnote-link.*?>(.*?)<\/a>/g, '[n$1]')
    .replace(/∥<a.*?<\/a>(.*?)∥/g, '$1') // throw away editorial notes
    .replace(/<span class="(ital|roman)">(.*?)<\/span>/g, '_$2_') // italics
    .replace(/<span class="c?sc">(.*?)<\/span>/g, '^$1^') // smallcaps
    .replace(/^<br>/, '//') // line breaks
    .replace(/<([^>]+)>/g, '') // remove all remaining HTML tags
    .replace(/§/g, '\\S') // section symbols
    .replace(/&amp;/g, '&') // ampersands
    .replace(/‘|’/g, '\'') // apostrophes
    .replace(/“|”/g, '"') // quotes
    .replace(/Æ/g, '{AE}') // uppercase AE ligature
    .replace(/æ/g, '{ae}') // lowercase ae ligature
    .replace(/Œ/g, '{OE}') // uppercase OE ligature
    .replace(/œ/g, '{oe}') // lowercase oe ligature
    .trim().replace(/ {2}/g, ' ') // strip whitespace
}
