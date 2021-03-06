# gulp-extract-dep
> extract all dependencies in html

[Chinese Document](./README.zh-CN.md)

## When I need it?
Sometime I have a task that write some simple page using JQuery or others tools but don't through node/npm.
I can't like manual download libraries so the `bower` is useful to me.
It not only contains compressed library code, but many other files.
I must only have the page code and the smallest libraries on when delivering the task.
So the plugin was born.

## Install
```bash
yarn add gulp-extract-dep
# or
npm install gulp-extract-dep
```

## Test
```
npm run test
# or
yarn test
```

## Usage
A little more complicated example is in `gulpfile.js`, and there are some other examples:

```javascript
const extractDep = require('gulp-extract-dep')

gulp.task('extract', function() {
  gulp.src('*.html')
    .pipe(extractDep())
    .pipe(gulp.dest('dist'))
})
```

```javascript
const extractDep = require('gulp-extract-dep')
const gulpif = require('gulp-if')
const uglify = require('gulp-uglify')

function isJS(file) {
  return file.extname === '.js'
}

gulp.task('extract', function() {
  gulp.src('*.html')
    .pipe(extractDep({ outDepDir: 'lib' }))
    .pipe(gulpif(isJS, uglify()))
    .pipe(gulp.dest('dist'))
})
```

## Options
- `prefix`

  default: 'bower_components'

  the dependencies reference prefix of html file
- `depDir`

  default: 'bower_components'

  the dependencies directory
- `outDepDir`

  default: ''

  the dependencies output relative directory, if remain empty, it would output in html file directory together.
