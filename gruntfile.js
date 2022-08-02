'use strict';

module.exports = function (grunt) {

	
	const sass = require('node-sass');
  const matchdep = require('matchdep');
	const env = grunt.file.readJSON('env.json').env;

	matchdep.filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		build: parseInt(grunt.file.readJSON('data.json').build),

		'http-server': {
			'dev': {
				root: 'dev/',
				port: env.dev.port,
				host: env.dev.host,
				openBrowser : true,
				runInBackground: true,
			}
		},

		sass: {
			options: {
				implementation: sass,
				includePaths: ['node_modules/bootstrap/scss']
			},
			dev: {
				options: {
					style: 'expanded',
					sourcemap: 'none',
					noCache: true
				},
				files: {
					'dev/css/style.css': 'dev/sass/style.sass'
				}
			}
		},
		watch: {
			options: {
				livereload: {
					host: env.dev.host,
					port: 8081,
				}
			},
			grunt: { files: ['gruntfile.js'] },
			sass: {
				files: [ 'dev/sass/**/*.{sass,scss}' ],
				tasks: [ 'sass' ]
			},
			js: {
				files: [ 'dev/js/**/*.js', '!dev/js/{script,vendor}.js'  ],
				tasks: [ 'browserify:script' ]
			},
			html: {
				files: [ 'dev/**/*.nunjucks', 'data*.json' ],
				tasks: [ 'clean:html', 'nunjucks:dev' ]
			}
		},
		browserify: {
			script:{
				src: [ 'dev/js/index.js' ],
				dest:  'dev/js/script.js'
			}
		},
		postcss: {
			options: {
				processors: [
					require('autoprefixer')({
						diff: true 
					}), // add vendor prefixes
					require('cssnano')() // minify the result
				]
			},
			build: { flatten: true, src: 'dev/css/style.css', dest: 'build/css/style.<%= build %>.css' },
		},
		uglify: {
			options: { mangle: true, compress: true },
			build: {
				files: {
					'build/js/scripts.<%= build %>.js' : [ 'dev/js/vendor.js', 'dev/js/script.js' ]
				}
			}
		},
		nunjucks: {
			options: {
				data:  Object.assign(grunt.file.readJSON('data.json'), grunt.file.readJSON('env.json'))
			},
			dev: {
				options: {
					configureEnvironment: function(env, nunjucks) { env.addGlobal('target', 'dev'); },
				},
				files: [
					{
						expand: true, 
						cwd: 'dev/pages/', 
						src: ["**/*.nunjucks", "!templates/**"], 
						dest: "dev/", 
						ext: ".html"
					}
				]
			},
			build: {
				options: {
					data: grunt.file.readJSON('data.json'),
					configureEnvironment: function(env, nunjucks) { env.addGlobal('target', 'build'); },
				},
				files: [
					{
						expand: true, 
						cwd: 'dev/pages/', 
						src: ["**/*.nunjucks", "!templates/**"], 
						dest: "build/", 
						ext: ".html"
					}
				]
			}
		},
		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				files: [
					{
						expand: true,
						cwd: 'build/',
						src: "**/*.html",
						dest: "build/"
					}
				]
			}
		},
		copy: {
			build: {
				files: [
					{ expand: true, cwd: 'dev/', src:'{fonts,docs,img}/**/*', dest:'build/' }
				]
			},
			packages: {
				files: [
					{ src: ['build*.zip'], dest: '/', filter: 'isFile' }
				]
			}
		},
		clean: {
			build: ['build', 'build.zip'], 
			img: ['build/img/'],
			html: ['dev/**/*.html']
		},
		chmod: {
			options: {
				mode: '777'
			},
			build: {
				src: ['build', 'build/**/*']
			}
		},
		compress: {
			build:{
				options: {
					archive: 'build.zip',
					mode: 'zip'
				},
				files: [
					{ expand: true, cwd: 'build/', src:['**'], dest: '' }
				]
			}
		},
		buildnumber: {
			options: {
			  field: 'build',
			},
			files: ['data.json']
		},
	});

	grunt.registerTask('compile', [ 
		'sass',
		'browserify',
		'clean:html',
		'nunjucks:dev'
	]);

	grunt.registerTask('default', [
		'compile',
		'http-server',
		'watch'
	]);

	grunt.registerTask('build', [
		'buildnumber',
		'clean:build',
		'copy:build',
		'sass',
		'postcss:build',
		'browserify',
		'uglify:build',
		'nunjucks:build',
		'htmlmin',
		'chmod:build'
	]);
}
