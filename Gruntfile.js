module.exports = function (grunt) {

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: true
      },
      all: [
        "Gruntfile.js",
        "app/**/*.js",
      ]
    },
    copy: {
      options: {
        processContent: false,
      },
      images: {
        expand: true,
        src: "app/assets/*.{png,jpg}",
        dest: "build/"
      },
      fonts: {
        expand: true,
        cwd: "node_modules/@fortawesome/fontawesome-free/",
        src: "webfonts/*",
        dest: "build/"
      },
    },
    concat: {
      options: {
        separator: ";",
      },
      main: {
        src: [
          "app/app.module.js",
          "app/**/*.js",
        ],
        dest: "build/main.js",
      },
      vendor: {
        src: [
          "node_modules/jquery/dist/jquery.js",
          "node_modules/popper.js/dist/umd/popper.js",
          "node_modules/bootstrap/dist/js/bootstrap.js",
          "node_modules/angular/angular.js",
          "node_modules/angular-animate/angular-animate.js",
          "node_modules/@uirouter/angularjs/release/angular-ui-router.js",
          "node_modules/angular-youtube-embed/src/angular-youtube-embed.js",
          "node_modules/angular-loading-bar/build/loading-bar.js",
          "node_modules/angularjs-toaster/toaster.js",
        ],
        dest: "build/vendor.js",
      },
    },
    uglify: {
      main: {
        options: {
          mangle: false,
        },
        files: {
          "build/main.js": ["build/main.js"],
        },
      },
      vendor: {
        files: {
          "build/vendor.js": ["build/vendor.js"],
        },
      }
    },
    cssmin: {
      all: {
        files: {
          "build/main.css": [
            "app/**/*.css",
          ],
          "build/vendor.css": [
            "node_modules/@fortawesome/fontawesome-free/css/all.css",
            "node_modules/bootstrap/dist/css/bootstrap.css",
            "node_modules/angular-loading-bar/build/loading-bar.css",
            "node_modules/angularjs-toaster/toaster.css",
          ],
        },
      }
    },
    htmlmin: {
      options: {
        removeComments: true,
        collapseWhitespace: true
      },
      index: {
        files: {
          "build/index.html": "index.build.html",
          "build/app/assets/changelog.html": "build/app/assets/changelog.html",
        }
      },
      dist: {
        files: [{
          expand: true,
          src: ["app/components/**/*.html"],
          dest: "build"
        }],
      },
    },
    cachebreaker: {
      main: {
        options: {
          match: [{
            "vendor.js": "build/vendor.js",
            "vendor.css": "build/vendor.css",
            "main.js": "build/main.js",
            "main.css": "build/main.css",
          }],
          replacement: "md5",
          position: "append"
        },
        files: {
          src: ["build/index.html"]
        },
      }
    },
    md2html: {
      main: {
        files: [{
          src: ["changelog.md"],
          dest: "build/app/assets/changelog.html"
        }]
      }
    },
  });

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-uglify-es");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-htmlmin");
  grunt.loadNpmTasks("grunt-cache-breaker");
  grunt.loadNpmTasks("grunt-md2html");

  grunt.registerTask("cq", [
    "jshint",
  ]);

  grunt.registerTask("build", [
    "copy",
    "concat",
    "uglify",
    "cssmin",
    "md2html",
    "htmlmin",
    "cachebreaker",
  ]);
};