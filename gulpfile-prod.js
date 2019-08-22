const gulp = require("gulp");

// CSS
const sass = require("gulp-sass");
sass.compiler = require('node-sass');
const autoprefixer = require('gulp-autoprefixer');
// JS
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
// Browser Sync
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
// Clean
const clean = require('gulp-clean');

gulp.task("img", (done) => {
    gulp.src("./resources/assets/img/**/*")
        .pipe(gulp.dest("./public/img"));
    done();
});

// Fontawesome-free webfonts
gulp.task('icons', function() {
    return gulp.src('./node_modules/@fortawesome/fontawesome-free/webfonts/*')
        .pipe(gulp.dest('./public/webfonts/'));
});

// -----------------------------------------------------------------CSS
// My SCSS
gulp.task("scss", () => {
    return gulp.src("./resources/assets/scss/**/*.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('./resources/assets/temp/'))
        .pipe(browserSync.stream());
});

// Autoprefixer CSS
gulp.task("css", () => {
    return gulp.src("./resources/assets/css/**/*.css")
        .pipe(autoprefixer())
        .pipe(gulp.dest('./resources/assets/temp/'))
        .pipe(browserSync.stream());
});

// Concat CSS
gulp.task("concat-css", (done) => {
    return gulp.src("./resources/assets/temp/**/*.css")
        .pipe(concat("app.css"))
        .pipe(gulp.dest('./public/css'))
        .pipe(browserSync.stream());
});

// -----------------------------------------------------------------JS
// jQuery JS
gulp.task("jquery", () => {
    return gulp.src("./node_modules/jquery/dist/jquery.js")
        .pipe(concat("jquery.js"))
        .pipe(gulp.dest("./public/js"))
        .pipe(browserSync.stream());
});

// Bootstrap JS
gulp.task("bootstrap-js", () => {
    return gulp.src("./node_modules/bootstrap/dist/js/bootstrap.js")
        .pipe(concat("bootstrap.js"))
        .pipe(gulp.dest("./public/js"))
        .pipe(browserSync.stream());
});
// Add Bootstrap & jQuery
gulp.task("base-js", 
    gulp.parallel("jquery", "bootstrap-js")
);

gulp.task("my-js", () => {
    return gulp.src("./resources/assets/js/*.js")
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat("my.js"))
        .pipe(uglify())
        .pipe(gulp.dest("./resources/assets/temp/"))
        .pipe(browserSync.stream());
});

gulp.task("libs-js", () => {
    return gulp.src("./resources/assets/js/libs/**/*.js")
        .pipe(concat("libs.js"))
        .pipe(uglify())
        .pipe(gulp.dest("./resources/assets/temp/"))
        .pipe(browserSync.stream());
});

// Concat JS
gulp.task("js", (done) => {
    return gulp.src("./resources/assets/temp/**/*.js")
        .pipe(concat("app.js"))
        .pipe(gulp.dest("./public/js"))
        .pipe(browserSync.stream());
});

// ------------------------------------------------------SERVER
gulp.task("browser-init", () => {
    return browserSync.init({
        proxy: { 
            target: 'http://49-dev0013.ukrposhta.loc:8998/telemarket/home/' 
          } 
    });
});

gulp.task("watch", () => {
    gulp.watch(["./resources/views/**/*.php"]).on("change", reload);
    gulp.watch("./resources/assets/scss/**/*.scss", gulp.series("scss"));
    gulp.watch("./resources/assets/css/**/*.css", gulp.series("css"));
    gulp.watch("./resources/assets/temp/*", gulp.series("concat-css"));
    gulp.watch("./resources/assets/js/**/*.js", gulp.series("js"));
    return;
});

gulp.task("server", 
    gulp.parallel("watch", "browser-init")
);

// ----------------------------------------------------CLEAN
gulp.task("clean", (done) => {
    gulp.src('./public/**/*', {read: false})
        .pipe(clean()),
    gulp.src('./resources/assets/temp/**/*', {read: false})
        .pipe(clean())
    done();
});

gulp.task("clean-temp", (done) => {
    gulp.src('./resources/assets/temp/**/*', {read: false})
        .pipe(clean())
    done();
});

gulp.task("default",
    gulp.series(
        "clean-temp",
        "icons",
        "scss",
        "css",
        "concat-css",
        "base-js",
        "libs-js",
        "my-js",
        "js",
        "img",
        "server"
));