// run the FOLLOWING BEFORE trying to run gulp
// npm install gulp-cli -g
// npm install gulp -D
// npm install
//
var fs = require("fs");
var gulp = require("gulp");
var browserSync = require("browser-sync").create();
var sass = require("gulp-sass");
var prefix = require("gulp-autoprefixer");
var cp = require("child_process");
var gulpImagemin = require("gulp-imagemin");
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
var concat = require("gulp-concat");
var cleanCSS = require("gulp-clean-css");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var postcss = require("gulp-postcss");
var mqpacker = require("css-mqpacker");
var babel = require("gulp-babel");

var jekyll = process.platform === "win32" ? "jekyll.bat" : "jekyll";
var messages = {
  jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build',
};

/**
 * Build the Jekyll Site
 */
gulp.task("jekyll-build", function (done) {
  browserSync.notify(messages.jekyllBuild);
  return cp.spawn(jekyll, ["build"], { stdio: "inherit" }).on("close", done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task("jekyll-rebuild", ["jekyll-build"], function () {
  browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task("browser-sync", ["jekyll-build", "sass", "bundle-js"], function () {
  browserSync.init({
    server: {
      baseDir: "_site",
    },
  });
});

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds). Also create minified versions for production use.
 */
gulp.task("sass", function () {
  return gulp
    .src("assets/_scss/main.scss")
    .pipe(
      sass({
        includePaths: ["scss"],
        onError: browserSync.notify,
      })
    )
    .pipe(postcss([mqpacker]))
    .pipe(
      prefix(["last 15 versions", "> 5%", "ie 10", "ie 11"], { cascade: true })
    )
    .pipe(gulp.dest("_site/assets/css"))
    .pipe(gulp.dest("assets/css"))
    .pipe(
      cleanCSS({
        compatibility: "ie9",
        processImportFrom: ["!fonts.googleapis.com"],
      })
    )
    .pipe(rename({ extname: ".min.css" }))
    .pipe(gulp.dest("_site/assets/css"))
    .pipe(gulp.dest("assets/css"))
    .pipe(browserSync.stream());
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task("watch", function () {
  gulp.watch("assets/_scss/*.scss", ["sass"]);
  gulp.watch(
    ["assets/js/**/*.js", "!assets/js/**/*.min.js", "!assets/js/bundle.js"],
    ["bundle-js"]
  );
  gulp.watch(
    [
      "*.md",
      "*.html",
      "_layouts/*.html",
      "_includes/*.html",
      "_events/*",
      "_posts/*",
      "_data/*",
    ],
    ["jekyll-rebuild"]
  );
});

/**
 * Bundle js files together and then created minified versions and publish them to the correct locations.
 */
gulp.task("bundle-js", function () {
  return gulp
    .src(["assets/js/vendor/simple-lightbox.js", "assets/js/main.js"])
    .pipe(concat("bundle.js"))
    .pipe(gulp.dest("assets/js"))
    .pipe(
      babel({
        presets: ["env"],
      })
    )
    .pipe(uglify())
    .pipe(rename({ extname: ".min.js" }))
    .pipe(gulp.dest("assets/js"))
    .pipe(browserSync.stream());
});

// run "gulp images" to process images from assets/_src_img to /uploads folder to be used on the site
gulp.task("images", function () {

  // return gulp
  //   .src(['uploads/**/*.{jpg,png,jpeg}'])
  //   .pipe(
  //     gulpImagemin({
  //       interlaced: true,
  //       progressive: true,
  //       optimizationLevel: 5,
  //       svgoPlugins: [{ removeViewBox: true }],
  //     })
  //   )
  //   .pipe(gulp.dest("uploads"));

  return imagemin(['uploads/**/*.{jpg,png,jpeg}'], 'uploads', {
    use: [
      imageminWebp({ quality: 75 })
    ]
  }).then((images) => {
    console.log('Images optimized');
    images.forEach(img => {
      console.log(img.path);
    })
  });

});

gulp.task("assign-version", function () {
  // var VERSION = '1';
  var regex = /VERSION\s\=\s\'(\d+)\'/;
  var content = fs.readFileSync("sw.js").toString();

  var version = parseInt(content.match(regex)[1]);
  var newVersion = parseInt(Math.random() * 9999999);
  console.log(`Updading version number from ${version} to ${newVersion}`);

  content = content.replace(regex, `VERSION = '${newVersion}'`);

  fs.writeFileSync('sw.js', content);

})

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task("default", ["browser-sync", "assign-version", "watch"]);

gulp.task("publish", ["images", "assign-version", "jekyll-build"]);