var fs = require('fs');

module.exports = function(grunt) {

    /* CONST */
    var JSASSEMBLED = 'IBL.js',
        CSSASSEMBLED = 'IBL.css',
        JSASSEMBLED_MIN = 'IBL.min.js',
        CSSASSEMBLED_MIN = 'IBL.min.css';

    var jsPath, cssPath,
        jsFiles = {}, 
        cssFiles = {},
        data = fs.readFileSync('./config.js'),
        arrayJS = [],
        arrayCSS = [];

    data = JSON.parse(data.toString());
    jsPath = data.out.js + "/";
    cssPath = data.out.css + "/";

    jsFiles[jsPath + JSASSEMBLED] = arrayJS;
    cssFiles[cssPath + CSSASSEMBLED] = arrayCSS;

    Object.keys(data.files).forEach(function(type) {
        data.files[type].forEach(function(file) {
            if( type === 'vendors' ) {
                arrayJS.push(file);
            } else {
                arrayJS.push(file + '/' + file.split('/').pop() + '.js');
                arrayJS.push(file + '/' + file.split('/').pop() + '.template.js');
                arrayCSS.push(file + '/' + file.split('/').pop() + '.css');
            }
        });
    });

    grunt.initConfig({
        concat: {
            js: {
                options: {
                    separator: '\n;'
                },
                files: jsFiles
            },
            css: {
                options: {
                    separator: '\n'
                },
                files: cssFiles
            }
        },
        uglify: {
            build: {
                src: jsPath + JSASSEMBLED,
                dest: jsPath + JSASSEMBLED_MIN
            }
        },
        cssmin: {
            dist: {
                src: cssPath + CSSASSEMBLED,
                dest: cssPath + CSSASSEMBLED_MIN
            }
        },
        watch: {
            scripts: {
                files: ['**/*.js', '!**/node_modules/**'],
                tasks: ['concat', 'uglify']
            },
            styles: {
                files: ['**/*.css'],
                tasks: ['concat', 'cssmin']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['concat', 'uglify', 'cssmin', 'watch']);
}
