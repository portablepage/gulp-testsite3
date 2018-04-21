var gulp = require('gulp');
var twig = require('gulp-twig-pipe');
var data = require('gulp-data');
var fs = require('fs');
var path = require('path');

gulp.task('compile', function () { // second param makes the task depend on to-json
	
	gulp.src('./content/pages/*.json')
			  	
	.pipe(data(function(file) { 
			
		var data = JSON.parse(fs.readFileSync('./content/pages/' + path.basename(file.path)));
		var dataArr = Object.values(data); // convert object to array
		var newdata = {}; // creating array key for posts
		newdata['posts'] = dataArr;
		
		// get menu
		var pages = JSON.parse(fs.readFileSync('./content/config/pages.json'));
		newdata['pages'] = pages;
		
		
		return newdata;
		//return new Buffer(JSON.stringify(newdata));
		
	}))
			
	// .pipe(gulp.dest('./api/')) // this generates the api 
	.pipe(twig('./template/index.html', {dataSource: 'data'}))
	.pipe(gulp.dest('site')); // this generates the pages
	
});


gulp.task('copy-assets', function () {
	
	return gulp.src(['./template/assets/**/*']).pipe(gulp.dest('./site/assets'));
});

gulp.task('copy-admin', function () {
	
	// return gulp.src(['./admin/*']).pipe(gulp.dest('./site/admin'));
});

gulp.task('default', ['compile', 'copy-assets', 'copy-admin']);

