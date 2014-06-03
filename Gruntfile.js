module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // grunt-replace
    replace: {
      dist: {
        options: {
          patterns: [
            {
              match: 'vertexShader',
              replacement: '<%= grunt.file.read("shaders/shader.vert") %>'
            },
            {
              match: 'fragmentShader',
              replacement: '<%= grunt.file.read("shaders/shader.frag") %>'
            }
          ]
        },
        files: [{src: ['./index-template.html'], dest: './index.html'}]
      }
    },
    // grunt-contrib-watch
    watch: {
      scripts: {
        files: ['shaders/shader.*'],
        tasks: ['replace']
      }
    }
  });

  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['replace']);
};