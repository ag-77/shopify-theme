// CONFIG
let config = {
  jsGlobalPrefix: "theme-global",
  jsTemplatePrefix: "theme-template",
  scssPrefix: "theme",
  dev: "dev",
  build: "build",
  project: {
    themeName: ""
  }
}

let theme_config = {
  environment: '',
  directory: '',
  store: '',
  theme_id: ''
};

let json = '';

// Gulp required node modules
const argv = require('yargs').argv;
const autoprefixer = require('autoprefixer');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const cache = require('gulp-cached');
const cssimport = require('gulp-cssimport');
const filesExist = require('files-exist');
const fileSync = require('fs');
const gulp = require('gulp');
const include = require("gulp-include");
const map = require('map-stream');
const uglify = require('gulp-uglify');
const notify = require('gulp-notify');
const open = require('gulp-open');
const pipeline = require('readable-stream').pipeline;
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const shopifySettings = require('postcss-shopify-settings-variables');
const streamqueue = require('streamqueue');
const syntax = require('postcss-scss');
const term = require('terminal-kit').terminal;
const t2 = require('through2');
const themeKit = require('@shopify/themekit');
const yaml = require('js-yaml');
const zip = require('gulp-zip');

const cleanCSS = require('gulp-clean-css');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');


// On Error: show notification
onError = function (err) {

  // Show notification
  notify.onError({
    title: "GULP ERROR",
    message: "Error: <%= error.message %>",
    sound: "Frog" // Basso, Blow, Bottle, Frog, Funk, Glass, Hero, Morse, Ping, Pop, Purr, Sosumi, Submarine, Tink. If sound is simply true, Bottle
  })(err);

  // Continue pipe stream
  this.emit('end');
};

// Read theme config from config.yml
const read = (cb) => {

  var packageJson = JSON.parse(fileSync.readFileSync('./package.json'));
  if (typeof packageJson.project != "undefined") {
    config.project = packageJson.project;
  }

  return gulp.src(filesExist('./config.yml ', {
    onMissing: function (file) {
      term.white.bgRed('The file config.yml was not found.\nCreate a config.yml for personal use from config.yml.sample.\nDo not delete or rename comfig.yml.sample!\n');
      return false;
    }
  }))
  .pipe(
    map(function (file, cb) {
      if (file.isNull()) {
        return cb(null, file); // pass along
      }
      if (file.isStream()) {
        return cb(new Error("Streaming not supported"));
      }

      // Create json from config.yml
      try {
        json = yaml.load(String(file.contents.toString('utf8')));
      } catch (e) {
        console.log(e);
        console.log(json);
      }

      // Set default config
      theme_config.environment = 'development';

      // Set environment
      if (argv.env) {
        theme_config.environment = argv.env;
      }
      if (typeof json[theme_config.environment] == "undefined") {
        console.log('Environment does not exist');
        return false;
      }
      theme_config.store = json[theme_config.environment].store;
      theme_config.directory = json[theme_config.environment].directory;
      theme_config.theme_id = json[theme_config.environment].theme_id;

      console.log(json);
      console.log(theme_config);
      cb();
    })
  );
};

// Open admin from all environments' live sites from config.yml
const openAllEnvsAdmins = (cb) => {

  const entries = Object.entries(json)
  for (const key in entries) {
    if (entries.hasOwnProperty(key)) {
      const element = entries[key];

      var options = {
        uri: 'http://' + element[1].store + '/admin/themes'
      };
      gulp.src(__filename)
        .pipe(open(options));
    }
  }
  cb();
  return false;
};

// Open all environments' live sites from config.yml
const openAllEnvs = (cb) => {

  const entries = Object.entries(json)
  for (const key in entries) {
    if (entries.hasOwnProperty(key)) {
      const element = entries[key];

      var options = {
        uri: 'http://' + element[1].store  + '/?preview_theme_id=' + element[1].theme_id
      };
      gulp.src(__filename)
        .pipe(open(options));
    }
  }
  cb();
  return false;
};

// Stop gulp when in the menu
function terminate() {
  term.grabInput(false);
  setTimeout(function () {
    term.processExit(0);
  }, 1000);
}

const menu = (cb) => {

  var items = Object.keys(json);
  var menu = [];

  for (let index = 0; index < items.length; index++) {
    var l = items[index].length;
    var r = 11 - l;
    var space = '';
    for (let i = 0; i < r; i++) {
      space += ' ';
    }
    menu[index] = items[index] + space + ' : ' + json[items[index]].store;
  }

  // If > 1 environment, show menu
  if (!argv.env && menu.length > 1) {

    // Terminate on CTRL-C
    term.on('key', function (name, matches, data) {
      if (name === 'CTRL_C') {
        terminate();
      }
    });

    // Clear screen
    term.clear();

    // Show menu with all environments
    term.clear.green(
      "Select an environment to start developing:"
    ) ;
    term.singleColumnMenu(menu, function (error, response) {

      // set json[selected] as theme_config
      theme_config = json[items[response.selectedIndex]];
      theme_config.environment = items[response.selectedIndex];

      // term( '\n' ).eraseLineAfter.green(
      //   "Selected environment:\n"
      // ) ;
      // console.log(theme_config);

      cb();
    });
  } else {
    cb();
  }
};

// Stop term from grabbing input or CTRL-C won't work
async function stopMenu(cb) {

  term.grabInput(false);
  term.windowTitle( theme_config.store + ' | ' + theme_config.environment );
  cb();
};

// Create the required browsersync.reload file in /dev
const createBrowsersyncFile = (cb) => {
  fileSync.appendFileSync(config.dev + '/browsersync.reload', '');
  cb();
};

// Serve store.myshopify.com as localhost
async function serveLocal(cb) {

  // Clear screen
  term.clear();

  if (theme_config.store != undefined && theme_config.theme_id != undefined) {

    // Create the url
    var serveUrl = 'https://' + theme_config.store + '/?preview_theme_id=' + theme_config.theme_id;
    var adminUrl = 'https://' + theme_config.store + '/admin/themes';
    term.green(theme_config.environment + '\n');
    term.green('Theme: ' + serveUrl + '\n');
    term.green('Admin: ' + adminUrl + '\n');

    // Start browsersync
    browserSync.init({
      proxy: serveUrl,
      reloadDelay: 300,
      files: config.dev + "/browsersync.reload", // Watch for change in browsersync.reload (triggered after themekit has finished uploading)
      injectChanges: false, // Because css is served from cdn
      logFileChanges: false,
      snippetOptions: {
        rule: {
          match: /<\/head>/i,
          fn: function (snippet, match) {
            return snippet + match;
          }
        }
      }
    });
  }
};

// Watch files in DEV directory for changes
async function watchDev(cb) {

  // Stop term from grabbing input or CTRL-C won't work
  term.grabInput(false);

  // Watch for scss changes
  gulp.watch(config.dev + "/scss/**/*", gulp.series(concatScss, concatCriticalScss));

  // Watch for js changes
  gulp.watch(config.dev + "/js/**/*", gulp.series(concatAllJs));

  cb();
};

var themeProcess;

// Let ThemeKit watch files in BUILD directory for changes and send an update to browsersync.reload
async function watchBuild() {

  // Set environment to watch
  var watchEnv = theme_config.environment;

  // If all envs should be updated
  if (argv.allenvs) {

    // Change environmant to allenvs
    watchEnv = '--allenvs';
  }

  // Start themekit
  themeKit.command('watch', {
    env: watchEnv,
    verbose: 1,
    "allow-live": true,
    notify: config.dev + "/browsersync.reload"
  });
};

const concatAllJs = (cb) => {
  return concatJs(config.dev + "/js/*.js");
};

// Concat all js files to assets
// which will trigger themeKit to upload it to Shopify
const concatJs = (files) => {

  var result = pipeline(
    gulp.src(files),
    plumber({
      errorHandler: onError
    }),
    // Include all files
    include({
      includePaths: ['node_modules']
    }),
    // Babel ES6
    babel({
      presets: ['@babel/env'],
      sourceType: 'script'
    }),
    // Cache file, so unchanged files won't parse
    cache('concatJs'),
    // Rename
    rename(function (path) {
      path.basename = config.project.themeName + '-' + path.basename;
      path.extname = ".js";
    }),
    // Execute through2 to trigger a change because gulp 4 doesn't
    t2.obj((chunk, enc, cb) => {
      let date = new Date();
      chunk.stat.atime = date;
      chunk.stat.mtime = date;
      cb(null, chunk);
    }),
    // Write unminified version to dest
    gulp.dest(theme_config.directory + '/assets'),
    // Uglify
    uglify(),
    // Rename for minifed version
    rename({
      extname: '.min.js'
    }),
    // Execute through2 to trigger a change because gulp 4 doesn't
    t2.obj((chunk, enc, cb) => {
      let date = new Date();
      chunk.stat.atime = date;
      chunk.stat.mtime = date;
      cb(null, chunk);
    }),
    // Write minified version to dest
    gulp.dest(theme_config.directory + '/assets')
  );
  return result;
};

// Zip the theme
const zipTheme = (cb) => {
  const zipName = process.cwd().split('/').pop().replace(/-/g, " ").replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace('shopify ', '') + ' 0.1.0';

  term.green('Created "' + zipName + '.zip".\nUpload it to Shopify and don\'t forget to REMOVE IT when done!\n');

  gulp.src(config.build + '/**')
    .pipe(zip('archive.zip'))
    .pipe(rename(zipName + '.zip'))
    .pipe(gulp.dest('.'));
  cb();
};

// Concat all scss files to assets/themeName.scss.liquid
// which will trigger themeKit to upload it to Shopify
const concatScss = (cb) => {

  // Start creating css
  var scssPath = config.dev + '/scss/**/' + config.scssPrefix + '*.scss';
  var result = gulp.src(scssPath)
    .pipe(plumber({
      errorHandler: onError
    }))
    // Import all css imports
    .pipe(cssimport({
      includePaths: ['node_modules']
    }))
    // Parse SCSS
    .pipe(sass())
    // Autoprefix
    .pipe(postcss([shopifySettings, autoprefixer()], {
      syntax: syntax
    }))
    // Remove "" for liquid tags
    .pipe(replace('"{{', '{{'))
    .pipe(replace('}}"', '}}'))
    .pipe(replace('"{%', '{%'))
    .pipe(replace('%}"', '%}'))
    // Uglify
    .pipe(cleanCSS())
    // Rename
    .pipe(rename(function (path) {
      path.basename = config.project.themeName + '-' + path.basename;
      path.extname = ".css.liquid";
    }))
    // Execute through2 to trigger a change because gulp 4 doesn't
    .pipe(t2.obj((chunk, enc, cb) => {
      let date = new Date();
      chunk.stat.atime = date;
      chunk.stat.mtime = date;
      cb(null, chunk);
    }))
    // Store
    .pipe(gulp.dest(theme_config.directory + '/assets'));
  return result;
};

// Take critical.scss file and export it into snippets to use it inline in the head
const concatCriticalScss = (cb) => {
  // Start creating css
  var scssPath = config.dev + '/scss/**/critical.scss';
  var result = gulp.src(scssPath)
    .pipe(plumber({
      errorHandler: onError
    }))
    // Import all css imports
    .pipe(cssimport({
      includePaths: ['node_modules']
    }))
    // Parse SCSS
    .pipe(sass())
    // Autoprefix
    .pipe(postcss([shopifySettings, autoprefixer()], {
      syntax: syntax
    }))
    // Remove "" for liquid tags
    .pipe(replace('"{{', '{{'))
    .pipe(replace('}}"', '}}'))
    .pipe(replace('"{%', '{%'))
    .pipe(replace('%}"', '%}'))
    // Uglify
    .pipe(cleanCSS())
    // Rename
    .pipe(rename(function (path) {
      if(path.basename === 'theme-global') {
        path.basename = config.project.themeName + '-' + path.basename;
        path.extname = ".css.liquid";
      } else {
        path.basename = 'critical';
        path.extname = ".css.liquid";
      }
    }))
    // Execute through2 to trigger a change because gulp 4 doesn't
    .pipe(t2.obj((chunk, enc, cb) => {
      let date = new Date();
      chunk.stat.atime = date;
      chunk.stat.mtime = date;
      cb(null, chunk);
    }))
    // Store
    .pipe(gulp.dest(theme_config.directory + '/snippets'));
    return result;
}



// Create and export tasks
exports.default = gulp.series(
  read,
  menu,
  createBrowsersyncFile,
  gulp.parallel(
    stopMenu,
    watchDev,
    watchBuild
  ),
  serveLocal
);

exports.build = gulp.series(
  read,
  gulp.parallel(
    concatScss,
    concatCriticalScss,
    concatAllJs
  )
);

exports.buildCss = gulp.series(
  read,
  concatScss,
  concatCriticalScss
);

exports.buildJs = gulp.series(
  read,
  concatAllJs
);

exports.openadmins = gulp.series(
  read,
  openAllEnvsAdmins
);

exports.openenvs = gulp.series(
  read,
  openAllEnvs
);

exports.zip = gulp.series(
  read,
  zipTheme
);
