gulp = require "gulp"
to5 = require "gulp-6to5"
stylus = require "gulp-stylus"
smap = require "gulp-sourcemaps"
concat = require "gulp-concat"
plumber = require "gulp-plumber"
notify = require "gulp-notify"
exec = require "child_process"
exec = exec.exec
bs = require "browser-sync"

order = [
    "src/js/util/_header.js"
    "src/js/util/variable.js"
    "src/js/directive/guideline.js"
    "src/js/component/guideline.js"
    "src/js/component/ruler-grid.js"
    "src/js/component/ruler-point.js"
    "src/js/class/guidelines.js"
    "src/js/class/rulers.js"
    "src/js/main.js"
    "src/js/util/_footer.js"
]

gulp.task "concat", ->
  gulp.src order
    .pipe concat "app.js"
    .pipe gulp.dest "src/js"

gulp.task "6to5", ["concat"], ->
  # gulp.src "src/js/**/*.js"
  gulp.src "src/js/app.js"
    .pipe plumber {errorHandler: notify.onError("<%= error.message %>") }
    .pipe do to5
    .pipe gulp.dest "dist/js"

gulp.task "stylus", ->
  gulp.src "src/styl/**/*.styl"
    .pipe plumber {errorHandler: notify.onError("<%= error.message %>") }
    .pipe do stylus
    .pipe gulp.dest "dist/css"

gulp.task "runscript", (cb) ->
  exec "node ./dist/js/app.js", (err, stdout, stderr) ->
    console.log stdout
    # console.log stderr
    cb err

gulp.task "default", ->
  bs.init null,
    server:
      baseDir: ["demo","bower_components", "dist"]
      directory: false
    notify: false
    host: "localhost"
  gulp.watch ["src/js/**/*.js"], ["6to5", bs.reload]
  gulp.watch ["src/styl/**/*.styl"], ["stylus", bs.reload]
