# gulp-extract-dep
> 提取html文件中的依赖文件

[English](./README.md)

## 什么时候我需要它?
有时候同事让我帮他写几个简单的页面, 仅仅使用JQuery等传统工具, 不要弄一堆的 node/npm 环境.

一般的做法是手动下载这些工具然后开始写页面了, 但是我讨厌这种繁琐的工作, `bower` 可以帮助我解决这个问题, 自动下载需要的库, 但是最后交付时我还得手动拷贝这些库文件, 以排除无关文件.

为了实现完全自动化步骤我写了这个插件, 它可以识别出 `html` 中引入的依赖并把它们集中输出.

## 安装
```bash
yarn add gulp-extract-dep
# 或者
npm install gulp-extract-dep
```

## 用法
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
const uglyfly = require('gulp-uglyfly')

function isJS(file) {
  return file.extname === '.js'
}

gulp.task('extract', function() {
  gulp.src('*.html')
    .pipe(extractDep({ outDepDir: 'lib' }))
    .pipe(gulpif(isJS, uglyfly()))
    .pipe(gulp.dest('dist'))
})
```

## 选项
- `prefix`

  默认值: 'bower_components'

  `html` 中引入依赖文件的前缀
- `depDir`

  默认值: 'bower_components'

  依赖文件的目录
- `outDepDir`

  默认值: ''

  依赖文件与 `html` 输出目录的相对路径, 如果留空的话输出到 html 同一目录, 否则输出到这个相对目录
