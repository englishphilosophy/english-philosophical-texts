/*
 * Command-line module for importing texts.
 */
import fs from 'fs'
import oll from './oll.js'
import tcp from './tcp.js'

// create an object containing all the importers
const importers = { oll, tcp }

// command line arguments
const path = `./texts/${process.argv[2]}`
const importer = importers[process.argv[3]]

// sanity check 1
if (!fs.existsSync(path)) {
  throw new Error(`Bad path ${path}`)
}

// sanity check 2
if (!importer) {
  throw new Error(`No converter ${process.argv[3]}`)
}

// run the import
importer(path)
