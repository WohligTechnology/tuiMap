var jsArray = [
    './bower_components/jquery/dist/jquery.js',
    './bower_components/typed.js/dist/typed.min.js',
    './js/jquery.parallax.js',
    './bower_components/fullpage.js/dist/jquery.fullpage.min.js',
    './bower_components/swiper/dist/js/swiper.js',
    './bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js',
    './bower_components/highcharts/highcharts.js',
    './bower_components/flexslider/jquery.flexslider-min.js',
    './bower_components/fancyBox/source/jquery.fancybox.js',
    './bower_components/tinymce-dist/tinymce.js',
    './bower_components/angular/angular.min.js',
    './bower_components/angular-loading-bar/build/loading-bar.min.js',
    './bower_components/angular-ui-tinymce/src/tinymce.js',
    './bower_components/angular-animate/angular-animate.js',
    './bower_components/ng-img-crop/compile/minified/ng-img-crop.js',
    './bower_components/angular-flexslider/angular-flexslider.js',
    './bower_components/angular-sanitize/angular-sanitize.min.js',
    './bower_components/ui-router/release/angular-ui-router.min.js',
    './bower_components/angular-bootstrap/ui-bootstrap.min.js',
    './bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
    './bower_components/highcharts-ng/src/highcharts-ng.js',
    './bower_components/angular-translate/angular-translate.js',
    './bower_components/lodash/lodash.js',
    './bower_components/angulartics/dist/angulartics.min.js',
    './bower_components/angular-fade-image-loading/angular-fade-image-loading.min.js',
    // './bower_components/angulartics-google-analytics/dist/angulartics-google-analytics.min.js',
    // './bower_components/angular-mappy/build/angular-mappy.js',
    './js/mapping.js',
    './js/map_data.js',
    // './bower_components/angular-mappy/_mapdata.js',
    './bower_components/jquery-bridget/jquery-bridget.js',
    './bower_components/ev-emitter/ev-emitter.js',
    './bower_components/desandro-matches-selector/matches-selector.js',
    './bower_components/fizzy-ui-utils/utils.js',
    './bower_components/get-size/get-size.js',
    './bower_components/outlayer/item.js',
    './bower_components/outlayer/outlayer.js',
    './bower_components/masonry/masonry.js',
    './bower_components/imagesloaded/imagesloaded.js',
    // './bower_components/angular-masonry/angular-masonry.js',
    './js/masonry-edited.js',
    './bower_components/angular-ui-select/dist/select.js',
    './bower_components/ng-scrollbar/dist/ng-scrollbar.min.js',
    './bower_components/angular-swiper/dist/angular-swiper.js',
    './bower_components/moment/moment.js',
    './bower_components/jStorage/jstorage.js',
    './js/imageUpload.js',
    './bower_components/angular-rangeslider/angular.rangeSlider.js',
    './bower_components/angular-file-upload/dist/angular-file-upload.js',
    './bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js',
    './bower_components/intl-tel-input/build/js/intlTelInput.js',
    './bower_components/intl-tel-input/lib/libphonenumber/build/utils.js',
    './bower_components/international-phone-number/releases/international-phone-number.js',
    './node_modules/ng-intl-tel-input/dist/ng-intl-tel-input.js',
    './js/app.js',
    './js/language.js',
    './js/controllers.js',
    './js/templateservice.js',
    './js/navigation.js',
    './js/myLife.js',
    './js/templateservice.js',
    './js/fileuploadservice.js',
    './js/ongojourney.js',
    './js/itinerary.js',
    './js/commontask.js',
    './js/activity.js',
    './js/locallife.js',
    './js/travelibroservice.js',
    './js/agent.js',
    './js/anchorSmoothScroll.js',
    //please do not change it
    './w/js/templates.js',

];
var replacehostFrom = "http://localhost/demo/";
var replacehostTo = "http://wohlig.co.in/demo2/";

var ftpString = "U2FsdGVkX19KJ4w0W1pxaUyRsJcjQO5RL98s2rfWnmpoGlaoPfxb8Ibdl0yu5NoHaLfSDmk2WnqRVpQfIAB8wv/Srsy/Y9OUyx5gs3ZutJ2MdGMlS8IaMJmfLSp77xVx1yuRD4aFlRuo0yQ/Ldy2pA==";

var uploadingFolder = "travelibro";
var password = "";



//Do not change anything below
//Do not change anything below
//Do not change anything below
//Do not change anything below
//Do not change anything below
//Do not change anything below

var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpSequence = require('gulp-sequence');
var clean = require('gulp-clean');
var wait = require('gulp-wait');
var connect = require("gulp-connect");




var templateCacheBootstrap = "firstapp.run(['$templateCache', function($templateCache) {";

gulp.task('imagemin', function () {

    var imagemin = require('gulp-imagemin');

    return gulp.src('./img/**')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }]
        }))
        .pipe(gulp.dest('./img2/'));
});


gulp.task('deploy', function () {
    var prompt = require("gulp-prompt");
    return gulp.src('./index.html')
        .pipe(prompt.prompt([{
            type: 'password',
            name: 'password',
            message: 'Enter Encryption Password:'
        }], function (res) {
            password = res.password;
            gulp.start('ftp');
        }));
});



gulp.task('ftp', function () {
    var CryptoJS = require("crypto-js");
    var ftp = require('vinyl-ftp');
    var decrypted = CryptoJS.AES.decrypt(ftpString, password);
    var decryptedJSON = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));

    decryptedJSON.log = gutil.log;
    decryptedJSON.parallel = 1;
    var conn = ftp.create(decryptedJSON);


    var globs = [
        './production/**',
    ];

    // using base = '.' will transfer everything to /public_html correctly
    // turn off buffering in gulp.src for best performance

    return gulp.src(globs, {
            base: './production',
            buffer: false
        })
        .pipe(conn.newer('/public_html/' + uploadingFolder)) // only upload newer files
        .pipe(conn.dest('/public_html/' + uploadingFolder));

});

gulp.task('clean:production', function () {
    return gulp.src('./production', {
            read: false
        })
        .pipe(wait(200))
        .pipe(clean({
            force: true
        }));
});

gulp.task('clean:tmp', function () {
    return gulp.src('./tmp', {
            read: false
        })
        .pipe(wait(200))
        .pipe(clean({
            force: true
        }));
});

gulp.task('clean:w', function () {
    return gulp.src('./w', {
            read: false
        })
        .pipe(wait(200))
        .pipe(clean());
});

gulp.task('minify:css', function () {
    var replace = require('gulp-replace');
    var rename = require('gulp-rename');
    var minifyCss = require('gulp-minify-css');
    var concat = require('gulp-concat');
    return gulp.src('./w/main.css')

    .pipe(minifyCss({
            keepSpecialComments: 0,
            rebase: false
        }))
        .pipe(rename('w.css'))
        .pipe(replace('url(../', 'url('))
        .pipe(replace("url('../", "url('"))
        .pipe(replace('url("../', 'url("'))
        .pipe(gulp.dest('./w/'));
});

gulp.task('copy:indexhtml', function () {
    var gulpCopy = require('gulp-copy');
    return gulp.src("./w/index.html")
        .pipe(gulpCopy("./production/", {
            prefix: 1
        }));
});

gulp.task('gzipfile', function () {
    var gzip = require('gulp-gzip');
    gulp.src('./w/index.html')
        .pipe(gzip({
            preExtension: 'gz'
        }))
        .pipe(gulp.dest('./production/'));
});

gulp.task('tarball', function () {
    var tar = require('gulp-tar');
    gulp.src('./production/**')
        .pipe(tar('production.tar'), {
            "mode": 0755,
            "type": 'directory'
        })
        .pipe(gulp.dest('./'));
});

gulp.task('inlinesource', function () {
    var inline = require('gulp-inline');
    return gulp.src('./w/index.html')
        .pipe(inline({
            base: './w',
            disabledTypes: ['svg', 'img'] // Only inline css files
        }))
        .pipe(gulp.dest('./w/'));
});



gulp.task('uglify:js', function () {
    var uglify = require('gulp-uglify');
    var stripDebug = require('gulp-strip-debug');
    return gulp.src('./w/w.js')
        // .pipe(stripDebug())
        .pipe(uglify({
            mangle: false
        }))
        .pipe(gulp.dest('./w'));
});

gulp.task('concat:js', function () {
    var concat = require('gulp-concat');
    var replace = require('gulp-replace');
    return gulp.src(jsArray)
        .pipe(concat('w.js'))
        .pipe(replace(replacehostFrom, replacehostTo))
        .pipe(gulp.dest('./w'));
});

gulp.task('templatecache', function () {
    var templateCache = require('gulp-angular-templatecache');
    return gulp.src('./w/views/**/*.html')
        .pipe(templateCache({
            root: "views/",
            templateHeader: templateCacheBootstrap
        }))
        .pipe(gulp.dest('./w/js/'));
});


gulp.task('copy:img', function () {
    var gulpCopy = require('gulp-copy');
    return gulp.src("./img/**")
        .pipe(gulpCopy("./production/"));
});

gulp.task('copy:fonts', function () {
    var gulpCopy = require('gulp-copy');
    return gulp.src("./fonts/**")
        .pipe(gulpCopy("./production/"));
});


gulp.task('sass:production', function () {
    var sass = require('gulp-sass');
    gulp.src('./sass/*.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(gulp.dest('./w'));
});

gulp.task('sass:development', function () {
    var sass = require('gulp-sass');
    var sourcemaps = require('gulp-sourcemaps');
    gulp.src('./sass/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./css'))
        .pipe(connect.reload());
});
gulp.task('minify:indexproduction', function () {
    var rename = require('gulp-rename');
    var opts = {
        conditionals: true,
        spare: true
    };
    var minifyHTML = require('gulp-minify-html');
    return gulp.src('./indexproduction.html')
        .pipe(minifyHTML(opts))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./w/'));
});
gulp.task('minify:views', function () {
    var minifyHTML = require('gulp-minify-html');
    var opts = {
        conditionals: true,
        spare: true
    };

    return gulp.src('./views/**/*.html')
        .pipe(minifyHTML(opts))
        .pipe(gulp.dest('./w/views/'));
});
gulp.task('connect:html', function () {
    gulp.src('./**/*.html')
        .pipe(connect.reload());
});
gulp.task('connect:js', function () {
    gulp.src('./js/*.js')
        .pipe(connect.reload());
});
gulp.task('watch:all', function () {
    var watch = require('gulp-watch');
    var open = require('gulp-open');
    connect.server({
        root: './',
        livereload: true
    });
    gulp.src(__filename)
        .pipe(open({
            uri: 'http://localhost:8080'
        }));
    gulp.watch(['./**/*.html', './sass/*.scss', './js/*.js'], ['sass:development', 'connect:html', 'connect:js']);
});

gulp.task('zip', function () {
    var zip = require('gulp-zip');
    return gulp.src('./production/**/*')
        .pipe(zip('production.zip'))
        .pipe(gulp.dest('./'));
});



gulp.task('renamePHP', function () {
    var rename = require('gulp-rename');
    return gulp.src("./production/index.html")
        .pipe(rename("./production/index.php"))
        .pipe(gulp.dest("./"));
});



gulp.task('watch', ["sass:development", "watch:all"]);
gulp.task('default', ["sass:development", "watch:all"]);
gulp.task('development', ["sass:development", "watch:all"]);
gulp.task('minifyhtml', ["minify:indexHTML", "minify:views", "templatecache"]);
gulp.task('copy', ["copy:img", "copy:fonts"]);

gulp.task('clearimage', ["clean:pImages", "clean:pFont"]);
gulp.task('production2', gulpSequence(["copy:img", "copy:fonts", "sass:production", "minify:indexproduction", "minify:views"], 'clean:tmp', "concat:js", 'clean:tmp', "templatecache", "uglify:js", "minify:css", 'clean:tmp', "inlinesource", 'clean:tmp', "gzipfile", 'clean:tmp', 'clean:tmp', "zip"));
gulp.task('productionc', gulpSequence(["copy:img", "copy:fonts", "sass:production", "minify:indexproduction", "minify:views"], 'clean:tmp', "concat:js", 'clean:tmp', "templatecache", "uglify:js", "minify:css", 'clean:tmp', "inlinesource", 'clean:tmp', 'clean:production', "gzipfile", 'clean:tmp', 'clean:tmp', "zip", 'deploy'));
gulp.task('production', gulpSequence(["copy:img", "copy:fonts", "sass:production", "minify:indexproduction", "minify:views"], 'clean:tmp', "concat:js", 'clean:tmp', "templatecache", "uglify:js", "minify:css", 'clean:tmp', "inlinesource", 'clean:tmp', "copy:indexhtml", 'clean:tmp', 'clean:tmp', "zip", 'renamePHP'));
