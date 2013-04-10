// Generated on 2013-03-06 using generator-webapp 0.1.5
'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // load local tasks from /tasks/grunt folder
    grunt.loadNpmTasks('grunt-bless', 'grunt-devtools');

    grunt.initConfig({
        watch: {
            compass: {
                files: ['sass/**/*.scss'],
                tasks: ['compass', 'bless']
            },
            livereload: {
                files: [
                    'inc/**/*.html',
                    '*.html',
                    'css/*.css',
                    'js/**/*js',
                    'img/**/*.{png,jpg,jpeg,webp}'
                ],
                tasks: ['livereload']
            }
        },
        connect: {
            options: {
                port: 8888,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost',
                base: ''
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, '')
                        ];
                    }
                }
            },
            qa: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, '')
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, '')
                        ];
                    }
                }
            }
        },
        open: {
            local: {
                path: 'http://localhost:<%= connect.options.port %>'
            },
            wiki: {
                path: 'https://bitbucket.org/wdavidow/sapient-vzw-mobile-lifestyle-store'
            }
        },
        clean: {
            all: ['.tmp', 'dist/*', 'dist/.*']
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                'js/{,*/}*.js'
            ]
        },
        bless: {
            options: {
                // compress: false,
                // cleanup: true,
                // force: false,
                // imports: true,
                // cacheBuster: true
            },
            debug: {
                files: {
                    'css/styles.css': [
                        'css/styles.css'
                    ]
                }
            },
            dist: {
                options: {
                    cacheBuster: false
                },
                files: {
                    'css/styles.css': [
                        'css/styles.css'
                    ]
                }
            }
        },
        compass: {
            options: {
                sassDir: 'sass',
                cssDir: 'css',
                imagesDir: 'img',
                javascriptsDir: 'js',
                fontsDir: 'fonts',
                relativeAssets: true
            },
            debug: {
                options: {
                    debugInfo: false
                }
            }
        },
        imagemin: {
            all: {
                files: [{
                    expand: true,
                    cwd: 'img',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: 'images'
                }]
            }
        },
    });

    grunt.renameTask('regarde', 'watch');

    grunt.registerTask('build', 'Build task, 3 options: debug, dist, qa', function (target) {
        grunt.task.run(['clean']);

        if (target === 'debug' || target === undefined) {
            return grunt.task.run([
                'compass',
                //'optimize',
                'bless:debug'
            ]);
        }

    });

    grunt.registerTask('optimize', 'Internal task used by `build` task', function (target) {
        if (target === 'debug' || target === 'qa' || target === 'livereload' || target === undefined) {
            return grunt.task.run([
                //'includereplace',
                //'concat',
                //'bless'
                //'imagemin',
                //'rig',

            ]);
        }

        if (target === 'dist') {
            return grunt.task.run([
                //'concat',
                //'imagemin',
                //'rig',
                'bless'
            ]);
        }
    });

    grunt.registerTask('server', 'Launch node server; 3 options: debug, dist, qa', function (target) {
        if (target === 'debug' || target === undefined) {
            return grunt.task.run([
                'build:debug',
                'livereload-start',
                'connect:livereload',
                'open:local',
                'watch'
            ]);
        }

        if (target === 'dist') {
            return grunt.task.run([
                'build:dist',
                'connect:dist:keepalive'
            ]);
        }

        if (target === 'qa') {
            return grunt.task.run([
                'build:qa',
                'connect:qa',
                'open:local',
                'watch'
            ]);
        }
    });

    grunt.registerTask('default', [
        'open:wiki'
    ]);
};
