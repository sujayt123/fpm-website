module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

    ngAnnotate: {
        options: {
            singleQuotes: true
        },
        app: {
            files: {
                'public/release/min-safe/app.js': ['public/js/app.js'],
                'public/release/min-safe/routes.js': ['public/js/routes.js'],
                'public/release/min-safe/ComputeService.js': ['public/js/service/ComputeService.js'],
                'public/release/min-safe/sharedProperties.js': ['public/js/service/sharedProperties.js'],
                'public/release/min-safe/FormCtrl.js': ['public/js/controller/FormCtrl.js'],
                'public/release/min-safe/FailureCtrl.js': ['public/js/controller/FailureCtrl.js'],
            }
        }
    },

    concat: {
        js: {
            src: ['public/release/min-safe/app.js', 'public/release/min-safe/routes.js', 'public/release/min-safe/ComputeService.js', 'public/release/min-safe/sharedProperties.js', 'public/release/min-safe/FormCtrl.js', 'public/release/min-safe/FailureCtrl.js'],
            dest: 'public/release/app.js'
        }
    },

    uglify: {
        my_target: {
          files: {
            'public/release/app.min.js': ['public/release/app.js']
          }
        }
      },

    clean: ['public/release/app.js', 'public/release/min-safe', 'public/release/templates.js'],

    watch: {
        files: ['public/css/**', 'public/js/**', 'public/**/*.html'],
        tasks: ['default']
    },

    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['ngAnnotate', 'concat', 'uglify', 'clean']);
    grunt.registerTask('fresh', ['default', 'watch']);
};