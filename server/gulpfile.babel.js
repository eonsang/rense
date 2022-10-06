import gulp from "gulp";
import babel from "gulp-babel";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import sass from "gulp-sass";
import sourcemaps from "gulp-sourcemaps";
import uglify from "gulp-uglify";
import plumber from "gulp-plumber";
import imagemin from "gulp-imagemin";
import del from "del";
import concat from "gulp-concat";
import notify from "gulp-notify";
import tailwindcss from "tailwindcss";

const scss = () => {
  return gulp
    .src("src/static/dev/scss/**/*.scss")
    .pipe(
      plumber({
        handleError: function (err) {
          console.log(err);
          this.emit("end");
        },
      })
    )
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "" }).on("error", sass.logError))
    .pipe(
      postcss([tailwindcss("./tailwind.config.js"), require("autoprefixer")])
    )
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("src/static/dist/css"));
};

const plugin = () => {
  return gulp
    .src(["src/static/dev/plugins/**/*"], { since: gulp.lastRun(plugin) })
    .pipe(gulp.dest("src/static/dist/plugins"));
};

const js = () => {
  return gulp
    .src("src/static/dev/assets/js/**/*.js")
    .pipe(
      plumber({
        errorHandler: function (err) {
          notify.onError({
            title: "Gulp error in " + err.plugin,
            message: err.toString(),
          })(err);
        },
      })
    )
    .pipe(babel())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(concat("ui.js"))
    .pipe(gulp.dest("src/static/dist/js"));
};

//  이미지 용량 최소화
const minImg = () => {
  return gulp
    .src("src/static/dev/assets/images/**/*")
    .pipe(imagemin())
    .pipe(gulp.dest("src/static/dist/images"));
};

const watchTask = () => {
  gulp.watch("src/static/dev/scss/**/*.scss", scss);
  gulp.watch("src/static/dev/js/**/*.js", js);
  gulp.watch("src/static/dev/image/**/*.{jpg,jpeg,png,gif,svg}", minImg);
};

const clean = () => {
  return del("src/static/dist");
};

exports.default = gulp.series(
  clean,
  gulp.parallel(scss, js, plugin, minImg),
  gulp.parallel(watchTask)
);

exports.build = gulp.series(clean, scss, js, minImg, plugin);
