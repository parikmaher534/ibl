var fs = require('fs');

module.exports = function(grunt) {

    /* CONST */
    var JSASSEMBLED = 'IBL.js',
        CSSASSEMBLED = 'IBL.css',
        JSASSEMBLED_MIN = 'IBL.min.js',
        CSSASSEMBLED_MIN = 'IBL.min.css';

    var jsPath, cssPath, type,
        initConfig = {},
        jsFiles = {}, 
        cssFiles = {},
        data = fs.readFileSync('./config.js'),
        arrayJS = [],
        arrayCSS = [];

    
    for( var i = 0; i < process.argv.length; i++ ) {
        if( 
            process.argv[i] === '--dev' ||
            process.argv[i] === '--production' 
        ){
            type = process.argv[i].slice(2);
            break;
        }
    };

    if( !type ) {
        console.log('Please input params: --dev or --production');
        return false;
    };


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


    initConfig.concat = {
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
    };

    if( type === 'production' ) {
        initConfig.uglify = {
            build: {
                src: jsPath + JSASSEMBLED,
                dest: jsPath + JSASSEMBLED_MIN
            }
        };
        initConfig.cssmin = {
            dist: {
                src: cssPath + CSSASSEMBLED,
                dest: cssPath + CSSASSEMBLED_MIN
            }
        };
    }

    initConfig.watch = {
        scripts: {
            files: ['**/*.js', '!**/node_modules/**'],
            tasks: ['concat', type === 'production' && 'uglify']
        },
        styles: {
            files: ['**/*.css'],
            tasks: ['concat', type === 'production' && 'cssmin']
        }
    };


    console.log(initConfig)


    grunt.initConfig(initConfig);


    /* Load tasks */
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    
    if( type === 'production' ) {
        grunt.loadNpmTasks('grunt-contrib-cssmin');
        grunt.loadNpmTasks('grunt-contrib-uglify');
    }


    /* Tasks registration */
    regTasks = ['concat', 'watch'];

    if( type === 'production' ) regTasks.push('uglify', 'cssmin');

    grunt.registerTask('default', ['concat', 'watch']);
}
