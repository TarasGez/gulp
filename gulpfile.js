const gulp = require("gulp");

// CSS
const sass = require("gulp-sass");
sass.compiler = require('node-sass');
const autoprefixer = require('gulp-autoprefixer');
// JS
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
// IMG
const imagemin = require('gulp-imagemin');
const imageminPngquant = require('imagemin-pngquant');
const cache = require('gulp-cache');
// Browser Sync
const browserSync = require('browser-sync').create();
// Deploy
const zip = require('gulp-zip');
// Build
const clean = require('gulp-clean');

gulp.task("html", (done) => {
    gulp.src("./src/*.html")
        .pipe(gulp.dest("./dist"))
        .pipe(browserSync.stream());
    done();
});

gulp.task("images", (done) => {
    gulp.src("./src/img/**/*")
        .pipe(cache(
            imagemin([
                imageminPngquant({quality: [0.3, 0.5]})
            ])
            ))
        .pipe(gulp.dest("./dist/img"));
    done();
});

gulp.task("scss", (done) => {
    gulp.src("./src/scss/**/*.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
    done();
});

gulp.task("js", (done) => {
    gulp.src("./src/js/**/*.js")
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat("index.js"))
        .pipe(uglify())
        .pipe(gulp.dest("./dist/js"))
        .pipe(browserSync.stream());
    done();
});

gulp.task("browser-init", (done) => {
    browserSync.init({
        server: "./dist"
    });
    done();
});

gulp.task("watch", (done) => {
    gulp.watch("./src/*.html", gulp.series("html"));
    gulp.watch("./src/scss/**/*.scss", gulp.series("scss"));
    gulp.watch("./src/js/**/*.js", gulp.series("js"));
    // gulp.watch("./src/img/**/*", gulp.series("images"));
    done();
});

gulp.task("clean", (done) => {
    gulp.src('./dist/**/*', {read: false})
        .pipe(clean());
        done();
});

gulp.task("build", gulp.series(
    "clean",
    gulp.parallel("html", "scss", "js", "images")
    )
);

gulp.task("deploy", (done) => {
    gulp.src("./dist/**/*")
        .pipe(zip('deploy.zip'))
        .pipe(gulp.dest("./deploy/"));
        done();
})

gulp.task("default", gulp.series("html", "scss", "js", "images", "browser-init", "watch"));