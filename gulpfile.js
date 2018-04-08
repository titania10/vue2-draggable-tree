const gulp = require("gulp");
const path = require('path');

//引入组件
const iconfont = require('gulp-iconfont'),
	iconfontCss = require('gulp-iconfont-css'),
	notify = require('gulp-notify'),
	del = require('del'),
	runSequence = require('run-sequence'),
	watch = require('gulp-watch');

//将svg转换成iconfont
let fontName = 'iconfont';
let runTimestamp = Math.round(Date.now()/1000);
gulp.task('svg2icon', function(){
	return gulp.src(['./src/components/tree/static/svg/*.svg'], {base: 'src'})
		.pipe(iconfontCss({
			fontName: fontName,
			path: './src/components/tree/static/template/_icons.css',
			targetPath: '../style/_icons.styl',
			fontPath: '../fonts/',
			cssClass: 'icons'
		}))
		.pipe(iconfont({
			fontName: fontName, // required
			prependUnicode: false, // recommended option
			formats: ['ttf', 'eot', 'woff'], // default, 'woff2' and 'svg' are available
			timestamp: runTimestamp, // recommended to get consistent builds when watching files
			normalize:true,
			fontHeight: 1024
		}))
		.pipe(gulp.dest('./src/components/tree/fonts'))
		.pipe(notify({message: 'svg2icon done!'}));
});

//clean
gulp.task('clean', function () {
	return del([
		'./src/components/tree/fonts/'
	]);
});

//watching file change
gulp.task('watch', function() {
	gulp.watch('src/components/tree/static/svg/*.svg', ['svg2icon']);
});

//开发环境
gulp.task('iconfont', function(){
	runSequence(
		['clean'],
		['svg2icon', 'watch']
	);
});

gulp.task('default', ['iconfont']);

