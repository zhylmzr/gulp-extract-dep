const extractDep = require('../dist')
const fs = require('fs')
const { src, dest } = require('gulp')

describe('Extract dependencied', function() {
	it('Extracted file should exist', done => {
		let stream = extractDep({ prefix: './dependencies', depDir: 'test/dependencies', outDepDir: 'lib' })

		let output = 'test/output'
		src('test/test.html')
			.pipe(stream)
			.pipe(dest(output))
			.on('finish', () => {
				try {
					fs.accessSync(`${output}/lib/main.css`)
					fs.accessSync(`${output}/lib/main.js`)
					done()
				} catch (err) {
					done(err)
				}
			})
	})
})