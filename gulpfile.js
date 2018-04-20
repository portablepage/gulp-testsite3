var gulp = require('gulp');
var twig = require('gulp-twig-pipe');
var data = require('gulp-data');
var fs = require('fs');
var path = require('path');

gulp.task('compile', function () { // second param makes the task depend on to-json
	
	gulp.src('./data/*.json')
			  	
	.pipe(data(function(file) { 
			
		var data = JSON.parse(fs.readFileSync('./data/' + path.basename(file.path)));
		var dataArr = Object.values(data); // convert object to array
		var newdata = {}; // creating array key for posts
		newdata['posts'] = dataArr;
		return newdata;
		//return new Buffer(JSON.stringify(newdata));
		
	}))
			
	// .pipe(gulp.dest('./api/')) // this generates the api 
	.pipe(twig('./index.html', {dataSource: 'data'}))
	.pipe(gulp.dest('site')); // this generates the pages
	
});


gulp.task('copy-assets', function () {
	
	return gulp.src(['./assets/**/*']).pipe(gulp.dest('./site/assets'));
});

gulp.task('copy-admin', function () {
	
	return gulp.src(['./admin/index.html']).pipe(gulp.dest('./site/admin/index.html'));
});

gulp.task('default', ['compile', 'copy-assets', 'copy-admin']);

