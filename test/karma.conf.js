// Karma configuration
// Generated on 2017-03-16

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    // as well as any additional frameworks (requirejs/chai/sinon/...)
    frameworks: [
      'jasmine'
    ],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'bower_components/angular/angular.js',
      'bower_components/jquery/dist/jquery.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-messages/angular-messages.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-touch/angular-touch.js',
      'bower_components/angular-ui-grid/ui-grid.js',
      'bower_components/angular-md5/angular-md5.js',
      'bower_components/AngularJS-OAuth2/dist/angularJsOAuth2.js',
      'bower_components/angular-aria/angular-aria.js',
      'bower_components/angular-material/angular-material.js',
      'bower_components/ngstorage/ngStorage.js',
      'bower_components/kjur-jsrsasign/jsrsasign-all-min.js',
      'bower_components/angular-websocket/dist/angular-websocket.js',
      'bower_components/angular-input-masks/angular-input-masks-standalone.js',
      'bower_components/moment/moment.js',
      'bower_components/angular-moment/angular-moment.js',
      'bower_components/sweetalert2/dist/sweetalert2.js',
      'bower_components/bootstrap-fileinput/js/fileinput.min.js',
      'bower_components/angular-loading-bar/build/loading-bar.js',
      'bower_components/angular-translate/angular-translate.js',
      'bower_components/angular-file-model/angular-file-model.js',
      'bower_components/angular-ui-select/dist/select.js',
      'bower_components/select2/select2.js',
      'bower_components/bootstrap-select/dist/js/bootstrap-select.js',
      'bower_components/angular-bootstrap-fileinput/angular-bootstrap-fileinput.js',
      'bower_components/pdfjs-dist/build/pdf.js',
      'bower_components/pdfjs-dist/build/pdf.worker.js',
      'bower_components/pdfjs-dist/build/pdf.combined.js',
      'bower_components/angular-pdf/dist/angular-pdf.js',
      'bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js',
      'bower_components/angular-ui-switch/angular-ui-switch.js',
      'bower_components/ng-file-upload/ng-file-upload.js',
      'bower_components/angular-tree-control/angular-tree-control.js',
      'bower_components/angular-mocks/angular-mocks.js',
      // endbower
      'app/scripts/**/*.js',
      'test/mock/**/*.js',
      'test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // web server port
    port: 8090,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'PhantomJS','PhantomJS_custom'
    ],

    // Which plugins to enable
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-junit-reporter',
      'karma-coverage',
      'karma-spec-reporter'
    ],
    

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'

    reporters: ['junit', 'coverage','spec'],

    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'test/spec/**/*.js': ['coverage']
    },

     junitReporter: {
       outputFile: 'test-results.xml',
       suite: ''
     },

     coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },
    customLaunchers: {
      'PhantomJS_custom': {
        base: 'PhantomJS',
        options: {
          windowName: 'my-window',
          settings: {
            webSecurityEnabled: false
          },
        },
        flags: ['--load-images=true'],
        debug: true
      }
    },

    phantomjsLauncher: {
      // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
      exitOnResourceError: true
    }
  });
};
