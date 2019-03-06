import { Transform } from "stream"
import path from 'path'
import fs from 'fs'
import Vinyl from 'vinyl'
import PlugError from 'plugin-error'

const TAG_RE = /(?<=<\w+\b[^>]*(src|href)=("|'))([^"']+)(?=\2>)/g
// dependencies array
const deps = []

// replace dependencies reference to outDir relative
function replaceStr(content, prefix, depDir, outDepDir) {
  return content.replace(TAG_RE, str => {
    if (str.indexOf(prefix) === 0) {
      let name = path.basename(str)
      // modify reference path
      let ref = str.replace(prefix, outDepDir)
      // avoid repeat add
      if (deps.length && deps.reduce((a, b) => str === a.origin || str == b.origin, {})) {
        return ref
      }
      deps.push({
        name,
        origin: str,
        path: str.replace(prefix, depDir)
      })
      return ref
    }
    return str
  })
}

class ExtractDepStream extends Transform {
  constructor(option) {
    super({ objectMode: true })

    option.prefix = option.prefix || 'bower_components'
    option.depDir = option.depDir || 'bower_components'
    option.outDepDir = option.outDepDir || ''

    for (let prop in option) {
      if (option.hasOwnProperty(prop)) {
        this[prop] = option[prop]
      }
    }
  }

  _transform(file, enc, callback) {
    if (file.extname === '.html') {
      let content = replaceStr(file.contents.toString(), this.prefix, this.depDir, this.outDepDir)
      file.contents = Buffer.from(content)

      // add deps file
      deps.forEach(dep => {
        let depFile = new Vinyl({
          path: `${this.outDepDir}/${dep.name}`
        })
        try {
          depFile.contents = fs.readFileSync(dep.path)
        } catch (err) {
          let message = `Can't open the dependency file "${dep.origin}" in "${dep.path}"`
          callback(new PlugError('gulp-extract-dep', message))
          return
        }
        this.push(depFile)
      })
    }
    this.push(file)
    callback()
  }
}

module.exports = function(option) {
  let stream = new ExtractDepStream(option)
  return stream
}