// Generated on 2017-03-16 using generator-oas 0.0.16
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

    //sonarqube
    grunt.loadNpmTasks('grunt-sonar-runner');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    //ngdocs
   // grunt.loadNpmTasks('grunt-ngdocs');

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);


    // Automatically load required Grunt tasks
    require('jit-grunt')(grunt, {
        useminPrepare: 'grunt-usemin',
        ngtemplates: 'grunt-angular-templates',
        ngAnnotate: 'grunt-ng-annotate-patched',
     //   cdnify: 'grunt-google-cdn'
    });

    // Configurable paths for the application
    var appConfig = {
        app: require('./bower.json').appPath || 'app',
        dist: 'dist'
    };
    var serveStatic = require('serve-static');
    // Define the configuration for all the tasks
    grunt.initConfig({
        // Project settings
        yeoman: appConfig,

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            js: {
            files: ['<%= yeoman.app %>/scripts/{,*/,*/*/,*/*/*/,*/*/*/*/}*.js'],
            tasks: ['newer:jshint:all', 'newer:jscs:all'],
            options: {
                livereload: '<%= connect.options.livereload %>'
            }
        },
        jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'newer:jscs:test', 'karma']
    },
    styles: {
    files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
    tasks: ['newer:copy:styles', 'postcss']
},
gruntfile: {
    files: ['Gruntfile.js']
},
livereload: {
    options: {
        livereload: '<%= connect.options.livereload %>'
    },
    files: [
'<%= yeoman.app %>/{,*/,*/*/,*/*/*/,*/*/*/*/}*.html',
'.tmp/styles/{,*/}*.css',
'<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
]
}
},

        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                //hostname: 'localhost',
                //livereload: 35728
                hostname: '0.0.0.0',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    middleware: function(connect) {
                        return [
                            serveStatic('.tmp'),
                        connect().use(
                            '/bower_components',
                            serveStatic('./bower_components')
                            ),
                        connect().use(
                            '/app/styles',
                            serveStatic('./app/styles')
                            ),
                            serveStatic(appConfig.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    middleware: function(connect) {
                        return [
                            serveStatic('.tmp'),
                            serveStatic('test'),
                        connect().use(
                            '/bower_components',
                            serveStatic('./bower_components')
                            ),
                            serveStatic(appConfig.app)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    open: true,
                    base: '<%= yeoman.dist %>'
                }
            }
        },

        // Make sure there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: {
                src: [
                'Gruntfile.js',
            '<%= yeoman.app %>/scripts/{,*/}*.js'
            ]
        },
        test: {
            options: {
                jshintrc: 'test/.jshintrc'
            },
        src: ['test/spec/{,*/}*.js']
    }
},

        // Make sure code styles are up to par
        jscs: {
            options: {
                config: '.jscsrc',
                verbose: true
            },
            all: {
                src: [
                'Gruntfile.js',
            '<%= yeoman.app %>/scripts/{,*/}*.js'
            ]
        },
        test: {
        src: ['test/spec/{,*/}*.js']
    }
},

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                    '.tmp',
                '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git{,*/}*'
            ]
        }]
    },
    server: '.tmp'
},

        // Add vendor prefixed styles
        postcss: {
            options: {
                processors: [
                    require('autoprefixer')({ overrideBrowserslist: ['last 1 version'] })
                ]
            },
            server: {
                options: {
                    map: true
                },
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            }
        },

        // Automatically inject Bower components into the app
        wiredep: {
            app: {
                src: ['<%= yeoman.app %>/index.html'],
                ignorePath:  /\.\.\//
            },
            test: {
                devDependencies: true,
                src: '<%= karma.unit.configFile %>',
                ignorePath:  /\.\.\//,
                fileTypes: {
                    js: {
                        block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
                        detect: {
                            js: /'(.*\.js)'/gi
                        },
                        replace: {
                            js: '\'{{filePath}}\','
                        }
                    }
                }
            }
        },

        // Renames files for browser caching purposes
        filerev: {
            dist: {
                src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
        '<%= yeoman.dist %>/styles/{,*/}*.css',
    '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
    '<%= yeoman.dist %>/styles/fonts/*'
    ]
}
},

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },

        // Performs rewrites based on filerev and the useminPrepare configuration
        usemin: {
        html: ['<%= yeoman.dist %>/{,*/}*.html'],
    css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
js: ['<%= yeoman.dist %>/scripts/{,*/}*.js'],
options: {
    assetsDirs: [
    '<%= yeoman.dist %>',
    '<%= yeoman.dist %>/images',
    '<%= yeoman.dist %>/styles'
    ],
    patterns: {
        js: [
        [/(images\/[^''""]*\.(png|jpg|jpeg|gif|webp|svg))/g, 'Replacing references to images']
        ]
    }
}
},

        // The following *-min tasks will produce minified files in the dist folder
        // By default, your `index.html`'s <!-- Usemin block --> will take care of
        // minification. These next options are pre-configured if you do not wish
        // to use the Usemin blocks.
        // cssmin: {
        //   dist: {
        //     files: {
        //       '<%= yeoman.dist %>/styles/main.css': [
        //         '.tmp/styles/{,*/}*.css'
        //       ]
        //     }
        //   }
        // },
        // uglify: {
        //   dist: {
        //     files: {
        //       '<%= yeoman.dist %>/scripts/scripts.js': [
        //         '<%= yeoman.dist %>/scripts/scripts.js'
        //       ]
        //     }
        //   }
        // },
        // concat: {
        //   dist: {}
        // },

        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                src: '{,*/}*.{png,jpg,jpeg,gif}',
                dest: '<%= yeoman.dist %>/images'
            }]
        }
    },

    svgmin: {
        dist: {
            files: [{
                expand: true,
                cwd: '<%= yeoman.app %>/images',
            src: '{,*/}*.svg',
            dest: '<%= yeoman.dist %>/images'
        }]
    }
},

htmlmin: {
    dist: {
        options: {
            collapseWhitespace: true,
            conservativeCollapse: true,
            collapseBooleanAttributes: true,
            removeCommentsFromCDATA: true
        },
        files: [{
            expand: true,
            cwd: '<%= yeoman.dist %>',
            src: ['*.html'],
            dest: '<%= yeoman.dist %>'
        }]
    }
},

ngtemplates: {
    dist: {
        options: {
            module: 'poluxClienteApp',
            htmlmin: '<%= htmlmin.dist.options %>',
            usemin: 'scripts/scripts.js'
        },
        cwd: '<%= yeoman.app %>',
    src: 'views/{,*/}*.html',
    dest: '.tmp/templateCache.js'
}
},

        // ng-annotate tries to make the code safe for minification automatically
        // by using the Angular long form for dependency injection.
        ngAnnotate: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/scripts',
                    src: '*.js',
                    dest: '.tmp/concat/scripts'
                }]
            }
        },

        /* Replace Google CDN references
        cdnify: {
            dist: {
                html: ['<%= yeoman.dist %>/*.html']
            }
        },*/

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                    '*.{ico,png,txt}',
                    '*.html',
                    'documentos/**/*',
                'images/{,*/}*.{webp}',
            'styles/fonts/{,*/}*.*'
            ]
        }, {
            expand: true,
            cwd: '.tmp/images',
            dest: '<%= yeoman.dist %>/images',
            src: ['generated/*']
        }, {
            expand: true,
            cwd: 'bower_components/bootstrap/dist',
            src: 'fonts/*',
            dest: '<%= yeoman.dist %>'
        }, {
            expand: true,
            cwd: '<%= yeoman.app %>/views',
            src: '**/*.html',
            dest: '<%= yeoman.dist %>/views'
        }, {
            expand: true,
            cwd: '<%= yeoman.app %>/scripts',
            src: '**/*.json',
            dest: '<%= yeoman.dist %>/scripts'
        }, {
            expand: true,
            cwd: 'bower_components/bootstrap-fileinput/js/locales',
            src: 'es.js',
            dest: '<%= yeoman.dist %>/scripts'
        },{
            expand: true,
            cwd: 'bower_components/angular-ui-grid',
            src: ['*.eot', '*.svg', '*.ttf', '*.woff'],
            dest: '<%= yeoman.dist %>/styles'
        }, {
            expand: true,
            cwd: 'bower_components/angular-tree-control/fonts',
            src: ['*.eot', '*.svg', '*.ttf', '*.woff'],
            dest: '<%= yeoman.dist %>/styles'
        }, {
            expand: true,
            cwd: 'bower_components/angular-tree-control/images',
            src: ['*.png'],
            dest: '<%= yeoman.dist %>/images'
        }]
    },
    styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
    src: '{,*/}*.css'
}
},

        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: [
            'copy:styles'
            ],
            test: [
            'copy:styles'
            ],
            dist: [
            'copy:styles',
            'imagemin',
            'svgmin'
            ]
        },

        // Test settings
        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                singleRun: true
            }
        },

        //sonarqube
        sonarRunner: {
            analysis: {
                options: {
                    debug: true,
                    separator: '\n',
                    sonar: {
                        host: {
                            url: 'http://localhost:9000'
                        },
                        projectKey: 'sonar:polux_cliente:20181003',
                        projectName: 'polux_cliente',
                        projectVersion: '0.10',
                        sources: ['app','test'].join(','),
                        language: 'js',
                        sourceEncoding: 'UTF-8'
                    }
                }
            }
        },
        //ngdocs
        ngdocs: {
            options: {
                dest: 'docs',
                title: "Documentación Sistema de Trabajos de Grado Pólux",
            },
            directives:{
                src: ['app/scripts/directives/**/*.js'],
                title: 'Directives'
            },
            decorators:{
                src: ['app/scripts/decorators/*.js'],
                title: 'Decorators'
            },
            services:{
                src: ['app/scripts/services/*.js'],
                title: 'Services'
            },
            controllers: {
                src: ['app/scripts/controllers/**/*.js'],
                title: 'Controllers'
            },
            api: {
                src: ['app/scripts/*.js'],
                title: 'Polux'
            },
        }
    });


grunt.registerTask('serve', 'Compile then start a connect web server', function(target) {
    if (target === 'dist') {
        return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
        'clean:server',
        'wiredep',
        'concurrent:server',
        'postcss:server',
        'connect:livereload',
        'watch'
        ]);
});
grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function(target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
});
grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'postcss',
    'ngtemplates',
    'concat',
    'ngAnnotate',
    'copy:dist',
    //'cdnify',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin'
    ]);

grunt.registerTask('default', [
    'newer:jshint',
    'newer:jscs',
    'test',
    'build'
    ]);
grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function(target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
});

grunt.registerTask('test', [
    'clean:server',
    'wiredep',
    'concurrent:test',
    'postcss',
    'connect:test',
    'karma'
    ]);

grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'postcss',
    'ngtemplates',
    'concat',
    'ngAnnotate',
    'copy:dist',
    //'cdnify',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin'
    ]);

grunt.registerTask('default', [
    'newer:jshint',
    'newer:jscs',
    'test',
    'build'
    ]);
};
