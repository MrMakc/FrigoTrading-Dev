'use strict';

//  GULP MODULES DECLARATION
// ======================================== */

const gulp = require('gulp'),
  fs = require('fs'),
  del = require('del'),
  colors = require("colors/safe"),
  rename = require('gulp-rename'),
  livereload = require('gulp-livereload'),
  connect = require('gulp-connect-multi')(),
  runSequence = require('run-sequence'),
  notify = require('gulp-notify'),
  header = require('gulp-header'),

  // TOOLS
  plumber = require('gulp-plumber'),
  buffer = require('vinyl-buffer'),
  source = require('vinyl-source-stream'),
  sourcemaps = require('gulp-sourcemaps'),

  // HTML
  twig = require('gulp-twig'),
  toJson = require('gulp-to-json'), // Create json file for listing html pages

  // CSS
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  cleancss = require('gulp-clean-css'),

  // IMAGES
  imagemin = require('gulp-imagemin'),
  svgSprite = require('gulp-svg-sprite'),

  // JS
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  modernizr = require('gulp-modernizr'),
  stripDebug = require('gulp-strip-debug'),
  // ES6
  babelify = require('babelify'),
  browserify = require('browserify'),

  run = require('gulp-run'),
  os = require('os');

const pkg = JSON.parse(fs.readFileSync('./package.json')),
  dataExemples = {
    // load here all your data exemple if needed
    // then in template you can call data : {{ dataHome.title }}
    dataHome: JSON.parse(fs.readFileSync(pkg.path.src + '/data/home.json')),
    dataList: JSON.parse(fs.readFileSync(pkg.path.src + '/data/list.json')),
  };

const banner = [
  '/**',
  ' ** <%= pkg.name %>',
  ' ** @author <%= pkg.author %>',
  ' ** @version v<%= pkg.version %>',
  ' **/',
  ''
].join('\n');


//  GULP TASK
// ======================================== */

// CHECK PROJECT NAME

// BUILD TEMPLATES using gulp-twig
// See https://www.npmjs.com/package/gulp-twig
// ======================================== */
gulp.task('html:clean', function () {
  del([
    pkg.path.dist + '/styleguide/*.html',
    pkg.path.dist + '/pages/*.html',
    pkg.path.dist + '/popins/*.html',
  ]);
});
gulp.task('html:build', function () {
  gulp.src([
    pkg.path.src + '/views/**/*.twig',
    '!' + pkg.path.src + '/views/{components,components/**}',
    '!' + pkg.path.src + '/views/{layout,layout/**}',
  ])
    .pipe(plumber())
    .pipe(twig({
      data: dataExemples
    }))
    .on('error', function (err) {
      notify({
        title: 'Gulp Build TWIG',
        message: 'Check the Task Runner or console for more details.'
      }).write(err);
      console.error(err);
      this.emit('end');
    })
    .pipe(plumber.stop())
    .pipe(rename({extname: '.html'}))
    .pipe(gulp.dest(pkg.path.dist+'/'));
});
gulp.task('html:json', function () {
  setTimeout(function(){
    return gulp.src(pkg.path.dist + '/pages/*.html')
      .pipe(toJson({
        relative: true,
        filename: pkg.path.dist + '/pages/pages.json'
      }))
      .on('end', function () {
        gulp.src(pkg.path.dist + '/popins/*.html')
          .pipe(toJson({
            relative: true,
            filename: pkg.path.dist + '/popins/popins.json'
          }));
      })
      .on('end', function () {
        livereload.changed(pkg.path.dist + '/pages/');
      });
  }, 1000);
});


// BUILD CSS
// Compile SASS to CSS, autoprefix & minify
// See https://github.com/sass/node-sass#options for options
// ======================================== */
gulp.task('build-css', function () {
  return gulp.src(pkg.path.src + '/assets/scss/*.scss')
    .pipe(sourcemaps.init()) // create sourcemap
    .pipe(sass({
      outputStyle: 'expanded', // possible values : nested, expanded, compact, compressed

    }))
    .on('error', function (err) {
      notify({
        title: 'Gulp Build CSS',
        message: 'Check the Task Runner or console for more details.'
      }).write(err);
      console.error(err);
      this.emit('end');
    })
    .pipe(autoprefixer()) // autoprefix (browserlist is defined in package.json)
    .pipe(rename('styles.css')) // rename file to styles.css
    .pipe(sourcemaps.write('./')) // create sourcemap
    .pipe(gulp.dest(pkg.path.dist + '/assets/css')) // output file in dist/ folder
    .pipe(cleancss()) // minify autoprefixed CSS with gulp-clean-css. See https://github.com/jakubpawlowicz/clean-css#how-to-use-clean-css-api for options
    .pipe(header(banner, {pkg: pkg}))
    .pipe(rename({extname: '.min.css'})) // rename it with suffix .min.css
    .pipe(gulp.dest(pkg.path.dist + '/assets/css')) // output minified file in dist/ folder
    .pipe(livereload()); // trigger livereload
});

// BUILD ES6 :
// babel + Minify
// ======================================== */
gulp.task('build-js', function () {
  return browserify({
    entries: [pkg.path.src + '/assets/js/scripts-front.js'],
    standalone: 'global',
    debug: true
  })
    .transform('babelify', {
      presets: ['babel-preset-es2015']
    })
    .transform('browserify-shim', {global: true, settingsGlobal: true})
    .bundle()
    .on('error', function (err) {
      notify({
        title: 'Gulp Build JS',
        message: 'Check the Task Runner or console for more details.'
      }).write(err);
      console.error(err);
      this.emit('end');
    })
    .pipe(source('scripts-front.js'))
    .pipe(buffer())
    .pipe(gulp.dest(pkg.path.dist + '/assets/js'))
    .pipe(rename({extname: '.min.js'})) // rename it with suffix .min.js
    .pipe(stripDebug()) // Strip console, alert, and debugger statements from JavaScript code https://www.npmjs.com/package/gulp-strip-debug
    .pipe(uglify()) // uglify it with gulp-uglify. See https://www.npmjs.com/package/gulp-uglify for options
    .pipe(sourcemaps.write('./')) // create sourcemap
    .pipe(header(banner, {pkg: pkg}))
    .pipe(gulp.dest(pkg.path.dist + '/assets/js')) // output minified JS file in the output folder
    .pipe(livereload()); // trigger livereload
});


// JS HINT
// ======================================== */
gulp.task('lint', function () {
  return gulp.src([
    pkg.path.src + '/assets/js/*.js',
    pkg.path.src + '/assets/js/class/*.js'
  ])
    .pipe(jshint({
      expr: true
    }))
    .pipe(notify(function (file) { // Use gulp-notify as jshint reporter
      if (file.jshint.success) { // Don't show something if success
        return false;
      }
      const errors = file.jshint.results.map(function (data) {
        if (data.error) {
          return '(' + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
        }
      }).join('\n');
      return file.relative + ' (' + file.jshint.results.length + ' errors)\n' + errors;
    }))
    .pipe(jshint.reporter('default'));
});


// BUILD MODERNIZR
// gulp-modernizr will find references of a feature in JS & CSS and build a custom Modernizr according to what it finds
// See https://github.com/Modernizr/customizr#config-file for build options.
// See https://github.com/Modernizr/Modernizr/blob/master/lib/config-all.json for feaure list
//  You can explicitly force the build to exclude or include tests (see Below):
// ======================================== */
gulp.task('build-modernizr', function () {
  return gulp.src([
    pkg.path.src + '/assets/js/**/*.js',
    pkg.path.src + '/assets/scss/**/*.scss'
  ])
    .pipe(modernizr('modernizr.min.js', {
      cache: true,
      options: ['setClasses', 'addTest', 'html5printshiv', 'testProp', 'fnBind'],
      tests: [
        'touchevents',
        'mediaqueries',
        'cssgrid',
        'calc',
        'flexbox',
        'flexboxlegacy',
        'objectfit',
      ],
      excludeTests: [
      ]
    }))
    .pipe(uglify())
    .pipe(header(banner, {pkg: pkg}))
    .pipe(gulp.dest(pkg.path.dist + '/assets/js/libs'));
});


// BUILD DEPENDENCIES
// All dependencies (JS or CSS) are installed via npm
// ======================================== */
gulp.task('vendors', function () {

  /** vendors : css */
  gulp.src([
    pkg.path.vendors + '/gridlex/src/*.scss',
    pkg.path.vendors + '/slick-carousel/slick/slick.scss', //slick-carousel (npm install --save slick-carousel)
  ])
    .pipe(rename({prefix: '_', extname: '.scss'}))
    .pipe(gulp.dest(pkg.path.src + '/assets/scss/vendors'));

    // normalize.scss
    gulp.src([
        pkg.path.vendors + '/normalize-scss/sass/**/*.scss'
    ],{base: './node_modules/normalize-scss/sass/'})
        .pipe(gulp.dest(pkg.path.src + '/assets/scss/vendors'));

  /** vendors : jquery */
  gulp.src([
    pkg.path.vendors + '/jquery/dist/jquery.min.js'
  ])
    .pipe(gulp.dest(pkg.path.dist + '/assets/js/libs'));

  /** vendors : js */
  return browserify({
    entries: [
      pkg.path.src + '/assets/js/vendors.js',
    ],
    standalone: 'global',
    debug: true
  })
    .transform('babelify', {
      presets: ['babel-preset-es2015']
    })
    .transform('browserify-shim', {global: true, settingsGlobal: true})
    .bundle()
    .on('error', function (err) {
      notify({
        title: 'Gulp Vendors JS',
        message: 'Check the Task Runner or console for more details.'
      }).write(err);
      console.error(err);
      this.emit('end');
    })
    .pipe(source('vendors.js'))
    .pipe(buffer())
    .pipe(gulp.dest(pkg.path.dist + '/assets/js'))
    .pipe(stripDebug()) // Strip console, alert, and debugger statements from JavaScript code https://www.npmjs.com/package/gulp-strip-debug
    .pipe(uglify()) // uglify it with gulp-uglify. See https://www.npmjs.com/package/gulp-uglify for options
    .pipe(gulp.dest(pkg.path.dist + '/assets/js')); // output minified JS file in the output folder
});


// Minify PNG, JPEG, GIF & SVG.
// See https://github.com/sindresorhus/gulp-imagemin for options
// ======================================== */
gulp.task('images:all', function () {
  return gulp.src(pkg.path.src + '/assets/img/**/*')
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
        plugins: [
          {mergePaths: true},
          {removeViewBox: false},
          {removeTitle: true},
          {mergePaths: true},
          {convertShapeToPath: true},
          {moveElemsAttrsToGroup: true},
          {collapseGroups: true},
          {removeUselessStrokeAndFill: true},
          {
            convertPathData: {straightCurves: false},
          }]
      })
    ]))
    .on('error', function (err) {
      notify({
        title: 'Gulp Build TWIG',
        message: 'Check the Task Runner or console for more details.'
      }).write(err);
      console.error(err);
      this.emit('end');
    })
    .pipe(gulp.dest(pkg.path.dist + '/assets/img'));
});
let svgSpriteconfig = {
  shape                 : {
    dimension           : { // Set maximum dimensions
      maxWidth          : 32,
      maxHeight         : 32
    },
  },
  mode                  : {
    symbol              : { // Activate the «symbol» mode
      render            : {
        css             : false, // CSS output option for icon sizing
        scss            : false // SCSS output option for icon sizing
      },
      dest              : '.',
      sprite            : 'icon-sprite.svg', // Sprite path and name
      example           : true // Build a sample page, please!
    }
  },
  svg                   : {
    doctypeDeclaration  : false,
    dimensionAttributes : false
  }
};

gulp.task('images:spritesvg', function() {
  return gulp.src(pkg.path.src + '/assets/img/svg/*')
    .pipe(plumber())
    .pipe(svgSprite(svgSpriteconfig))
    //.pipe(gulp.dest(pkg.path.src + '/assets/img/svg/'))
    .pipe(gulp.dest(pkg.path.dist + '/assets/img/svg/'))
    .pipe(livereload()); // trigger livereload
});

gulp.task('images:svgtwig', function () {
  return gulp.src(pkg.path.dist + '/assets/img/svg/*')
    .pipe(rename({extname: '.svg.twig'}))
    .pipe(gulp.dest(pkg.path.dist + '/assets/img/svg.twig/'))
    .pipe(gulp.dest(pkg.path.src + '/assets/img/svg.twig/'));
});
gulp.task('images', function (callback) {
  runSequence(
    ['images:all'],
    //['images:svgtwig'],
    ['images:spritesvg'],
    callback
  );
});


// COPY FONT FOLDER IN SRC TO DIST
// ======================================== */
gulp.task('font', function () {
  return gulp.src(pkg.path.src + '/assets/font/**/*')
    .pipe(gulp.dest(pkg.path.dist + '/assets/font'));
});


// COPY STYLEGUIDE_ASSETS FOLDER IN SRC TO DIST
// ======================================== */
gulp.task('styleguide_assets', function () {
  gulp.src(pkg.path.src + '/_styleguide/**/*')
    .pipe(gulp.dest(pkg.path.dist + '/_styleguide'));
});


// CLEAN ALL FILE OF DIST FOLDER
// ======================================== */
gulp.task('clean', function () {
  del([
    pkg.path.dist + '/**/*',
    '!' + pkg.path.dist + '/index.html',
    '!' + pkg.path.dist + '/robot.txt',
    pkg.path.src + '/assets/scss/vendors',
    pkg.path.src + '/assets/img/svg.twig',
  ]);
});


// WATCH
// watch .scss .js .html *img files in src/ folder
// ======================================== */
gulp.task('watch', function () {
  livereload.listen();
  gulp.watch(pkg.path.src + '/assets/js/**/*.js', ['js']);
  gulp.watch(pkg.path.src + '/assets/scss/**/*.scss', ['css']);
  gulp.watch(pkg.path.src + '/assets/ajax/**/*.json', ['ajax']);
  gulp.watch(pkg.path.src + '/data/*.json', ['html']);
  gulp.watch(pkg.path.src + '/views/**/*.twig', ['html']);
  gulp.watch([
    pkg.path.src + '/assets/img/**/*',
    '!' + pkg.path.src + '/assets/img/svg.twig/*',
  ], ['images']);
});

gulp.task('connect', connect.server({
  root: [pkg.path.dist],
  port: 8080,
  livereload: false,
  open: {
    browser: '' // can be chrome, firefox, etc.
  }
}));

// DEFAULT TASKS
// ======================================== */
gulp.task('js', function (callback) {
  runSequence(['lint'], ['build-js'], callback);
});
gulp.task('css', function (callback) {
  runSequence(['build-css'], callback);
});
gulp.task('html', function (callback) {
  runSequence(['html:clean'], ['html:build'], ['html:json'], callback);
});


/**
 * Init project files (styleguide...)
 * If you want to re-init the project, BEFORE you will need to execute: gulp clean
 */
gulp.task('init', function (callback) {
  runSequence(
    ['styleguide_assets', 'vendors', 'font'],
    callback
  );
});


/**
 * THIS WILL RUN IN THIS ORDER:
 *   - img, js and css in parallel
 *   - html
 *   - Finally call the callback function
 **/
gulp.task('default', function (callback) {
  runSequence(
    ['images', 'js', 'css'],
    ['html'],
    callback
  );
});

/**
 * Start project run default then connect and watch
 */
gulp.task('start', function (callback) {
  runSequence(
    ['default'],
    ['connect', 'watch'],
    callback
  );
});


/*================== LAUNCH RSYNC COMMAND "npm script prep" (SEE PACKAGE.JSON) ==========================*/
gulp.task('prep', function () {
  if( os.platform() === 'win32' ){
    return run('npm run prepWin').exec();
  }else{
    return run('npm run prepNix').exec();
  }
});
