if (process.env.IS_READY != 'true') {
  require('dotenv').config()
}
module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // auto reload
    watch: {
      options: {
        livereload: false
      },
      dev: {
        files: [
          './*.js',
          './app/*/*.js',
          './app/*/*/*.js',
          './app/*/*/*/*.js',
          './routes/*.js',
          './bin/*.js'
        ],
        tasks: ['express:dev'],
        options: {
          spawn: false
        }
      }
    },
    express: {
      options: {
        script: './node/index.js'
      },
      dev: {
        options: {
          script: './bin/www'
        }
      }
    }
  })

  // Load the plugin
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-express-server')

  // Default task(s).
  grunt.registerTask('default', ['express', 'watch:dev'])
}
