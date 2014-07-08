'use strict';

var path = require('path');
var exec = require('child_process').exec;
var NOW = Date.now();
var isWin = !!process.platform.match(/^win/);

module.exports = function(grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Common paths to be used by tasks
        base: {
            'dev': './web/',
            'dist': './web/dist',
            'temp': './web/.tmp'
        },

        // ### config for grunt-shell
        // command line tools
        shell: {
            git: {
                command: 'git pull',
                options: {
                    stdout: true
                }
            }
        },

        // ### Config for grunt-contrib-clean
        // Clean up files as part of other tasks
        clean: {
            dist: {
                src: ['<%= base.dist %>/']
            }
        },

        // ### Config for grunt-contrib-copy
        // Prepare files for builds / releases
        copy: {
            img: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= base.dev %>/img/',
                        src: ['./*.{png, jpg, gif}'],
                        dest: '<%= base.dist %>/img/'
                    }
                ]
            },
            html: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= base.dev %>',
                        src: ['./*.html'/*, '!<%= base.dev %>/js/tmpl/*.html'*/],
                        dest: '<%= base.dist %>/'
                    }
                ]
            }
        },

        requirejs: {
            dist: {
                options: {
                    almond: true,
                    baseUrl: '<%= base.dev %>/js',
                    name: 'main',
                    mainConfigFile: '<%= base.dev %>/js/main.js',
                    out: '<%= base.dist %>/js/main.js',
                    optimize: 'uglify',
                    preserveLicenseComments: false,
                    useStrict: true,
                    wrap: true
                }
            }
        },

        compass: {
            dev: {
                options: {
                    config: './config.rb'
                }
            },
            dist: {
                options: {
                    config: './config.rb',
                    outputStyle: 'compressed',
                    force: true,
                    // environment: 'production',
                    assetCacheBuster: false,
                    relativeAssets: false
                }
            }
        },

        imagemin: {
            options: {
                optimizationLevel: 0
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= base.dev %>/img/',
                        src: ['./*.{png, jpg, gif}'],
                        dest: '<%= base.dist %>/img/'
                    }
                ]
            }
        },

        jst: {
            compile: {
                options: {
                    prepend: function() {
                        var vars = function() {
                            var _ = {};

                            _.defaults = function(obj) {
                                Array.prototype.slice.call(arguments, 1).forEach(function(source) {
                                    if (source) {
                                        for (var prop in source) {
                                            if (obj[prop] === void 0) obj[prop] = source[prop];
                                        }
                                    }
                                });
                                return obj;
                            };

                            _.escape = function(string) {
                                var escapeMap = {
                                    '&': '&amp;',
                                    '<': '&lt;',
                                    '>': '&gt;',
                                    '"': '&quot;',
                                    "'": '&#x27;'
                                };
                                var escapeRegexe = new RegExp('[' + Object.keys(escapeMap).join('') + ']', 'g');

                                if (string == null) return '';
                                return ('' + string).replace(escapeRegexe, function(match) {
                                    return escapeMap[match];
                                });
                            };
                        };
                        var entire = vars.toString();

                        // entire = entire.replace(/(^\s+|\s+$)/gm, '');

                        return entire.slice(entire.indexOf('{') + 1, entire.lastIndexOf('}'));
                    },
                    amd: true,
                    namespace: 'JST',
                    processName: function(filename) {
                        var f = path.basename(filename, '.html');
                        return f.replace(/(?:_|-)(\w{1}?)/g, function(m) {
                            return m.toUpperCase().slice(1);
                        });
                    },
                    prettify: true,
                    processContent: function(src) {
                        return src
                            .replace(/\<\!\-\-[\s\S]*?\-\-\>/g, '') // remove comments
                            .replace(/(^\s+|\s+$)/gm, ''); // remove whitespaces
                    }
                },
                files: {
                    '<%= base.dev %>/js/tmpl.js': ['<%= base.dev %>/tmpl/*.html']
                }
            }
        },

        useminPrepare: {
            options: {
                dest: '<%= base.dist %>/'
            },
            html: {
                src: ['<%= base.dev %>/*.html']
            }
        },

        rev: {
            dist: {
                options: {
                    algorithm: 'sha1',
                    length: 4
                },
                src: [
                    '<%= base.dist %>/js/*.js',
                    '<%= base.dist %>/css/*.css'/*,
                    '<%= base.dist %>/img/*.{jpg,jpeg,png,gif}'*/
                ]
            }
        },

        usemin: {
            html: ['<%= base.dist %>/*.html']
        },

        // ### Config for grunt-contrib-watch
        // Watch files and livereload in the browser during development
        watch: {
            'build-css': {
                files: [
                    '<%= base.dev %>/scss/**/*.scss',
                    '<%= base.dev %>/img/**/*.{png, jpg}'
                ],
                tasks: ['compass:dev']
            },
            'build-tmpl': {
                files: ['<%= base.dev %>/tmpl/**/*.html'],
                tasks: ['jst']
            }
        },

        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    '<%= base.dist %>/index.html': '<%= base.dist %>/index.html',
                }
            }
        }
    });

    grunt.registerTask('default', ['jst', 'compass:dev', 'watch']);

    grunt.registerTask('release', function() {
        // grunt.task.run('shell:git');
        grunt.task.run('clean:dist');
        // build templates
        grunt.task.run('jst');
        // build js
        grunt.task.run('requirejs');
        // build scss files
        // grunt.task.run('compass:dist');
        // minify images
        if(isWin) grunt.task.run('copy:img');
        else grunt.task.run('imagemin');
        // combile and uglify js files
        grunt.task.run('copy:html');
        grunt.task.run('useminPrepare');
        grunt.task.run('concat:generated');
        grunt.task.run('cssmin');
        grunt.task.run('uglify:generated');
        grunt.task.run('rev');
        grunt.task.run('usemin');
        // html mini
        grunt.task.run('htmlmin');
    });

    grunt.registerTask('dist', ['release']);
};
