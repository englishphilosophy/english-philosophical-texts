/*
 * Convert texts from TCP to Markit.
 */
import fs from 'fs'
import path from 'path'
import request from 'sync-request'
import jsdom from 'jsdom'
import YAML from 'yamljs'

// cache of HTTP page requests
const docs = {}

// the main conversion function
export default function convert (filePath, noteUrls = []) {
  // read the file contents
  let fileContents = fs.readFileSync(filePath, 'utf-8')

  // check for YAML at the start of the document
  const yamlCheck = fileContents.match(/^---\n((.|\n)*?)\n---\n/)

  // get YAML data
  const data = YAML.parse(yamlCheck[1])

  if (data.contents) {
    data.contents.forEach((subFilePath) => {
      convert(`${path.dirname(filePath)}/${subFilePath}`, noteUrls)
    })
  } else {
    const url = data.sourceUrl.trim()
    const doc = docs[url] || new jsdom.JSDOM(request('GET', url).getBody('utf-8')).window.document
    if (!docs[url]) {
      // save to the cache for subsequent conversions
      docs[url] = doc
    }

    // set file contents to YAML data only (removing any previous import)
    fileContents = `---\n${yamlCheck[1]}\n---\n`

    // look for a section title, and maybe add it
    const title = doc.querySelector('#doccontent h2')
    if (title) {
      fileContents += convertTitle(noteUrls, title)
      fileContents += '\n\n'
    }

    // get text of all paragraphs and notes
    const paragraphs = Array.from(doc.querySelectorAll('#doccontent p, #doccontent .lg'))
      .map(convertParagraph.bind(null, noteUrls))
    const notes = noteUrls.map(convertFootnote)

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

// get title from the HTML document
function convertTitle (noteUrls, element) {
  // initialise text with title tag
  let text = '{title}\n'

  // add the paragraph content (formatting as Markit)
  text += `£1 ${markit(element.innerHTML)} £1`

  // return the text (wrapped at 80 characters)
  return text.replace(/(?![^\n]{1,80}$)([^\n]{1,80})\s/g, '$1\n')
}

// convert a paragraph and save any footnote data for later
function convertParagraph (noteUrls, element, index) {
  // initialise paragraph text with ID
  let text = `{#${(index + 1).toString(10)}} `

  Array.from(element.children).forEach((x) => {
    // chuck away page breaks
    if (x.classList.contains('pbtext')) {
      element.removeChild(x)
    }

    // handle footnotes
    if (x.classList.contains('ptr')) {
      noteUrls.push(x.querySelector('a[href]').getAttribute('href'))
      x.outerHTML = `[n${noteUrls.length}]`
    }
  })

  // add the paragraph content (formatting as Markit)
  text += markit(element.innerHTML)

  // return the text (wrapped at 80 characters)
  return text.replace(/(?![^\n]{1,80}$)([^\n]{1,80})\s/g, '$1\n')
}

// convert a footnote
function convertFootnote (url, index) {
  const doc = new jsdom.JSDOM(request('GET', url).getBody()).window.document
  const div = doc.querySelector('#doccontent > div')
  const id = (index + 1).toString(10)
  let text = `{#n${id}} `
  text += markit(div.innerHTML)
  return text.replace(/(?![^\n]{1,80}$)([^\n]{1,80})\s/g, '$1\n')
}

// convert html content to Markit
function markit (text) {
  return text
    .replace(/<div class="line">(.*?)<\/div>/g, '$1 //')
    .replace(/<span class="pbtext">.*?<\/span>/g, '')
    .replace(/<span class="rend-italic">(.*?)<\/span>/g, '_$1_')
    .replace(/<span class="notenumber">.*?<\/span>/g, '')
    .replace(/<span class="gap">•<\/span>/g, '[?]')
    .replace(/<span class="gap">〈◊〉<\/span>/g, '[??]')
    .replace(/<span class="gap">〈 in non-Latin alphabet 〉<\/span>/g, '$[Greek text]$')
    .replace(/∣/g, '') // ditch line breaks
    .replace(/\n\n/g, ' ') // sort out white space
    .replace(/\n/g, ' ')
    .replace(/&amp;/g, '&') // ampersands
    .replace(/‘|’/g, '\'') // apostrophes
    .replace(/“|”/g, '"') // quotes
    .replace(/Æ/g, '{AE}') // uppercase AE ligature
    .replace(/æ/g, '{ae}') // lowercase ae ligature
    .replace(/Œ/g, '{OE}') // uppercase OE ligature
    .replace(/œ/g, '{oe}') // lowercase oe ligature
    .trim().replace(/ {2}/g, ' ') // strip whitespace
}
