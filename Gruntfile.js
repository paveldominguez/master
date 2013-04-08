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
    grunt.loadTasks('tasks/grunt');

    grunt.initConfig({
        watch: {
            compass: {
                files: ['sass/{,*/}*.{scss,sass}'],
                tasks: ['compass']
            },
            livereload: {
                files: [
                    '{,*/}*.html',
                    '{.tmp,}css/{,*/}*.css',
                    '{.tmp,}js/{,*/}*.js',
                    'img/{,*/}*.{png,jpg,jpeg,webp}'
                ],
                tasks: ['optimize:livereload', 'livereload']
            }
        },
        connect: {
            options: {
                port: 9000,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'dist')
                        ];
                    }
                }
            },
            qa: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'dist')
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, 'dist')
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
                path: ''
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
                'js/{,*/}*.js',
                '!js/vendor/*'
            ]
        },
        compass: {
            options: {
                sassDir: 'sass',
                cssDir: '.tmp/css',
                imagesDir: 'img',
                javascriptsDir: 'js',
                fontsDir: 'fonts',
                importPath: 'app/components',
                relativeAssets: true
            },
            debug: {
                options: {
                    debugInfo: true
                }
            },
            dist: {
                options: {
                    outputStyle: 'nested',
                    noLineComments: true
                }
            },
            qa: {
                options: {
                    outputStyle: 'expanded'
                }
            }
        },
        includereplace: {
            compile: {
                // options: {
                //     // Global variables available in all files
                //     globals: {
                //         foo: 'bar',
                //     },
                //     prefix: '<!-- @@', // HTML comment style: <!-- @@include('foo.bar') -->
                //     suffix: ' -->'
                // },
                src: '*.html', // Files to perform replacements and includes with
                dest: 'dist' // Destinaion directory to copy files to
            }
        },
        rig: {
            all: {
                files: {
                    'dist/js/app.js': [
                        'js/build.js',
                        'js/ready.js'
                    ],
                    'js/vendor/jquery.js': [
                        'components/jquery/jquery.js'
                    ],
                    'dist/scripts/vendor/plugins.js': [
                        'js/vendor/plugins.js'
                    ]
                }
            }
        },
        concat: {
            all: {
                files: {
                    'dist/css/style.css': [
                        '.tmp/css/{,*/}*.css',
                        'css/{,*/}*.css'
                    ]
                }
            }
        },
        imagemin: {
            all: {
                files: [{
                    expand: true,
                    cwd: 'img',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: 'dist/images'
                }]
            }
        },
        copy: {
            debug: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '',
                    dest: 'dist',
                    src: [
                        '*.{ico,txt}',
                        '.htaccess',
                        'fonts/**'
                    ]
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '',
                    dest: 'dist',
                    src: [
                        '*.{ico,txt}',
                        '.htaccess',
                        'fonts/**',
                        'inc/*.html',
                        '{,*/}*.html'
                    ]
                }]
            }
        }
    });

    grunt.renameTask('regarde', 'watch');

    grunt.registerTask('build', 'Build task, 3 options: debug, dist, qa', function (target) {
        grunt.task.run(['clean']);

        if (target === 'debug' || target === undefined) {
            return grunt.task.run([
                'compass:debug',
                'optimize:debug'
            ]);
        }

        if (target === 'dist') {
            return grunt.task.run([
                'compass:dist',
                'optimize:dist'
            ]);
        }

        if (target === 'qa') {
            return grunt.task.run([
                'compass:qa',
                'optimize:qa'
            ]);
        }
    });

    grunt.registerTask('optimize', 'Internal task used by `build` task', function (target) {
        if (target === 'debug' || target === 'qa' || target === 'livereload' || target === undefined) {
            return grunt.task.run([
                'includereplace',
                'concat',
                //'imagemin',
                'rig',
                'copy:debug'
            ]);
        }

        if (target === 'dist') {
            return grunt.task.run([
                'concat',
                //'imagemin',
                'rig',
                'copy:dist'
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
