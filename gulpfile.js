'use strict';

/*
 *
 * Variables & Basic Configuration
 *
 */

// Gulp and Plugins
var gulp = require('gulp'),
  pkg = require('./package.json'),
  $ = require('gulp-load-plugins')({
    camelize: true,
    pattern: ['events', 'gulp-*', 'imagemin-pngcrush', 'main-bower-files', 'map-stream', 'opn', 'rimraf', 'run-sequence', 'shelljs']
  });

// Project paths
var paths = {

  // Source
  'source': {
    'root': './src',
    'assets': './src/assets',
    'fonts': './src/assets/fonts',
    'images': './src/assets/images',
    'js': './src/system',
    'sass': './src/assets/sass',
    'vendor': './src/vendor',
    'views': './src/system/views'
  },

  // Build
  'build': {
    'root': './site',
    'css': './site/css',
    'fonts': './site/fonts',
    'images': './site/images',
    'js': './site/js'
  }
};

// Server definition
var server = {
  'host': 'localhost',
  'port': '8080'
};

// AutoPrefixer Browser
var autoPrefixerBrowsers = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

// Error
var onError = function(err) {
  $.util.beep([0, 0, 0]);
  $.util.log($.util.colors.green(err));
  this.emit('end');
};

// Lint errors
var emmitLint = new $.events.EventEmitter();
var jsHintErrorReporter = $.mapStream(function(file, cb) {
  if (!file.jshint.success) {
    file.jshint.results.forEach(function(err) {
      if (err) {
        var msg = [
          $.path.basename(file.path),
          'Line  : ' + err.error.line,
          'Reason: ' + err.error.reason
        ];
        emmitLint.emit('error', new Error(msg.join('\n')));
      }
    });
  }
  cb(null, file);
});

/*
 *
 * Build Tasks
 *
 */

// Clear Build
gulp.task('buildClear', function(cb) {
  return $.rimraf(paths.build.root, cb);
});

// Install Components
gulp.task('install', function() {
  return gulp.src(['./bower.json', './package.json'])
    .pipe($.install());
});

// Build Bower Components
gulp.task('buildBower', function() {
  var filterJs = $.filter('*.js');
  var filterCss = $.filter('*.css');
  return gulp.src($.mainBowerFiles())
    .pipe($.changed(paths.build.js))
    .pipe(filterJs)
    .pipe($.concat('vendor.js'))
    .pipe($.uglify({
      mangle: false
    }))
    .pipe(gulp.dest(paths.build.js))
    .pipe($.size())
    .pipe(filterJs.restore())
    .pipe(filterCss)
    .pipe($.concat('vendor.css'))
    .pipe($.minifyCss({
      keepBreaks: true
    }))
    .pipe(gulp.dest(paths.build.css))
    .pipe($.size());
});

// Build Scripts
gulp.task('buildScripts', function() {
  return gulp.src(paths.source.js + '/**/*.js')
    .pipe($.changed(paths.build.js))
    .pipe($.using())
    .pipe($.sourcemaps.init())
    .pipe($.concat(pkg.name + '.js'))
    .pipe($.uglify({
      mangle: false
    }))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(paths.build.js))
    .pipe($.size());
});

// Lint Scripts
gulp.task('lintScripts', function() {
  return gulp.src(paths.source.js + '/**/*.js')
    .pipe($.changed(paths.build.js))
    // .pipe(cache('lintScripts'))
    .pipe($.plumber())
    .pipe($.jshint('.jshintrc', {
      fail: false
    }))
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe(jsHintErrorReporter)
    .on('error', $.notify.onError(function(error) {
      return error.message;
    }));
});

// Build Styles
gulp.task('buildStyles', function() {
  return gulp.src(paths.source.sass + '/**/*.sass')
    .pipe($.changed(paths.build.css))
    .pipe($.plumber({
      errorHandler: onError
    }))
    .pipe($.rubySass({
      sourcemapPath: '.',
      style: 'compressed',
      precision: 3
    }))
    // .pipe($.autoprefixer(autoPrefixerBrowsers))
    .pipe($.rename(function(path) {
      path.basename = pkg.name;
    }))
    .pipe(gulp.dest(paths.build.css))
    .pipe($.size());
});

// Build Fonts
gulp.task('buildFonts', function() {
  return gulp.src(paths.source.fonts + '/**/*.{eot,svg,ttf,woff}')
    .pipe($.newer(paths.source.fonts + '/**/*.{eot,svg,ttf,woff}'))
    .pipe($.changed(paths.build.fonts))
    .pipe($.flatten())
    .pipe(gulp.dest(paths.build.fonts))
    .pipe($.size());
});

// Build Images (svg)
gulp.task('buildImagesSVG', function() {
  return gulp.src(paths.source.images + '/**/*.svg')
    .pipe($.newer('./app/assets/images/**/*.svg'))
    .pipe($.changed(paths.build.images))
    .pipe(gulp.dest(paths.build.images))
    .pipe($.size());
});

// Build Images (gif, png and jpg)
gulp.task('buildImages', ['buildImagesSVG'], function() {
  var images = paths.source.images + '/**/*.{gif,png,jpg,jpeg}';
  return gulp.src(images)
    .pipe($.newer(images))
    .pipe($.changed(images))
    .pipe($.imagemin({
      optimizationLevel: 4,
      progressive: true,
      interlaced: true,
      use: [$.imageminPngcrush()]
    }))
    .pipe(gulp.dest(paths.build.images))
    .pipe($.size());
});

// Build HTML
gulp.task('buildHtml', function() {
  var vendorSources = [paths.build.css + '/vendor.css', paths.build.js + '/vendor.js'];
  var customSources = [paths.build.css + '/**/*.css', paths.build.js + '/**/*.js', '!' + paths.build.js + '/vendor.js', '!' + paths.build.css + '/vendor.css'];
  var views = [paths.source.views + '/**/*.html'];
  return gulp.src(paths.source.root + '/index.html')
    .pipe($.using())
    .pipe($.inject(gulp.src(customSources, {
      read: false
    }), {
      addRootSlash: false,
      ignorePath: 'site',
      relative: false
    }))
    .pipe($.inject(gulp.src(vendorSources, {
      read: false
    }), {
      addRootSlash: false,
      ignorePath: 'site',
      name: 'vendor'
    }))
    .pipe($.inject(gulp.src(views), {
      starttag: '<!-- views:html -->',
      transform: function(filePath, file) {
        return '<script type="text/ng-template" id="' + filePath.split('_')[1] + '">' + file.contents.toString('utf8') + '</script>';
      }
    }))
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(gulp.dest(paths.build.root))
    .pipe($.size());
});

// Server
gulp.task('server', function() {
  gulp.src(paths.build.root)
    .pipe($.webserver({
      fallback: 'index.html',
      host: server.host,
      port: server.port,
      livereload: true,
      open: true
    }));
});

// Open Browser
gulp.task('openBrowser', function() {
  return $.opn('http://' + server.host + ':' + server.port);
});

// Check if Git is installed
gulp.task('git-check', function(done) {
  var git = $.util.colors.green('  Git is installed!');
  if (!$.shelljs.which('git')) {
    git = $.util.colors.red('  Git is not installed.') +
      '\n  Git, the version control system, is required to download Ionic.' +
      '\n  Download git here: ' + $.util.colors.cyan('http://git-scm.com/downloads') +
      '\n  Once git is installed, run ' + $.util.colors.cyan('gulp install') + ' again.';
  }
  console.log(git);
  done();
});

// Watch
gulp.task('watch', function() {
  gulp.watch(paths.source.sass + '/**/*.sass', ['buildStyles']);
  gulp.watch(paths.source.fonts + '/**/*.{eot,svg,ttf,woff}', ['buildFonts']);
  gulp.watch(paths.source.js + '/**/*.js', ['buildScripts']);
  gulp.watch(paths.source.images + '/**/*.{svg,png,gif,jpg,jpeg}', ['buildImages']);
  gulp.watch(paths.source.root + '/**/*.html', ['buildHtml']);
  gulp.watch('./gulpfile.js', ['build']);
});

// Build Main Task
gulp.task('build', function(done) {
  $.runSequence(['buildClear'], 'buildBower', ['buildImages', 'buildStyles', 'buildScripts', 'buildFonts'], 'buildHtml', 'server', 'watch', done);
});

// Default Task
gulp.task('default', ['build']);
