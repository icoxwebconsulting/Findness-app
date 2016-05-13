var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var uglify = require('gulp-uglify');
var merge = require('merge-stream');
//ion-autocomplete/dist/ion-autocomplete.css
var paths = {
    css: [
        './www/lib/ionic/css/ionic.css',
        './www/lib/ion-autocomplete/dist/ion-autocomplete.css',
        './www/css/style.css'
    ],
    js: [
        './www/lib/angular-resource/angular-resource.min.js',
        './www/lib/bcryptjs/dist/bcrypt.min.js',
        './www/lib/ion-autocomplete/dist/ion-autocomplete.js',
        './www/lib/angular-credit-cards/release/angular-credit-cards.js',
        './www/lib/moment/min/moment.min.js',
        './www/lib/moment/locale/es.js',
        './www/js/**/*.js'
    ]
};

gulp.task('default', ['css', 'uglify']);

gulp.task('css', function (done) {
    var cssStream = gulp.src(paths.css);

    merge(cssStream)
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(concat('main.css'))
        .pipe(rename({extname: '.min.css'}))
        .pipe(gulp.dest('./www/res/'))
        .on('end', done);
});

gulp.task('uglify', function (done) {
    gulp.src(paths.js)
        .pipe(concat('main.js'))
        //.pipe(uglify({mangle: false}))
        //.on('error', function (error) {
        //    console.log(error);
        //})
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest('www/res/'))
        .on('end', done);
});

gulp.task('watch', function () {
    gulp.watch(paths.css, ['css']);
    gulp.watch(paths.js, ['uglify']);
});

gulp.task('install', ['git-check'], function () {
    return bower.commands.install()
        .on('log', function (data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task('git-check', function (done) {
    if (!sh.which('git')) {
        console.log(
            '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});
