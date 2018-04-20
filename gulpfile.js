var gulp = require('gulp');
var twig = require('gulp-twig-pipe');
var data = require('gulp-data');



gulp.task('compile', function () { // second param makes the task depend on to-json
	

	
		gulp.src('./data/*.json')
			  	
		.pipe(data(function(file) { 
			
			console.log(file);
					
					var dataArr = Object.values(file); // convert object to array
					
		  			var newdata = {}; // creating array key for posts
		  			newdata['posts'] = dataArr.reverse(); // order descending
					/*
					newdata['site'] = require('config/site.json');
					newdata['pages'] = require('config/pages.json');
					*/
					
		      			return new Buffer(JSON.stringify(newdata));
		}))
			
		// .pipe(gulp.dest('./api/')) // this generates the api 
		.pipe(twig('./index.html'))
		.pipe(gulp.dest('site')); // this generates the pages
	
	
 
});


gulp.task('copy-assets', function () {
	
	    return gulp.src(['./assets/**/*']).pipe(gulp.dest('./site/assets'));
	
});

gulp.task('default', ['compile', 'copy-assets']);

