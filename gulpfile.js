const { src, dest } = require('gulp')
const extractDep = require('./dist/index.min.js')
const gulpif = require('gulp-if')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const cleanCSS = require('gulp-clean-css')

function isJS(file) {
  return file.extname === '.js'
}

function isCSS(file) {
  return file.extname === '.css'
}

exports.default = function() {
  return src('test/test.html')
    .pipe(extractDep({ prefix: './dependencies', depDir: 'test/dependencies', outDepDir: 'lib' }))
    .pipe(gulpif(isJS, babel({
      presets: ['@babel/preset-env']
    })))
    .pipe(gulpif(isJS, uglify()))
    .pipe(gulpif(isCSS, cleanCSS()))
    .pipe(dest('demo'))
}
