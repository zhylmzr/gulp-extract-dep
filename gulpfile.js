const { src, dest } = require('gulp')
const extractDep = require('./dist')
const gulpif = require('gulp-if')
const babel = require('gulp-babel')
const uglyfly = require('gulp-uglyfly')
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
    .pipe(gulpif(isJS, uglyfly()))
    .pipe(gulpif(isCSS, cleanCSS()))
    .pipe(dest('demo'))
}
