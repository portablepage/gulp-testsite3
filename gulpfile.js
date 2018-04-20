var gulp = require('gulp');
var twig = require('gulp-twig-pipe');
var jsonCombine = require('gulp-jsoncombine');
var markdown = require('gulp-marked-json');
var runSequence = require('run-sequence');
var rename = require('gulp-rename');
var fs = require('fs');
var path = require('path');

var postsPath = './tmp/';
var configPath = './content/config/';
var templatePath = './template/';
var distPath = './dist/';


function getFolders(dir) {
    return fs.readdirSync(dir)
      .filter(function(file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
    });
}


gulp.task('build', function(callback) {
  runSequence('to-json',
              ['copy-assets'],
              'compile',
              callback);
});


gulp.task('to-json', function () {
	
	return gulp.src('./content/posts/**/*.md')
    .pipe(markdown({
        pedantic: true,
        smartypants: true
    }))
    .pipe(rename({extname: ".json"})) // this is not absolutely necessary, but otherwise the json files are saved as .md
    .pipe(gulp.dest('./tmp/'));
    



});


gulp.task('compile', function () { // second param makes the task depend on to-json
	
	var folders = getFolders(postsPath);
	
	  var tasks = folders.map(function(folder) { // loop through folders and assign to tasks var (which gets returned)
	
		  	   gulp.src('./tmp/'+folder+'/*.json')
			  	
		  	    	.pipe(jsonCombine(folder+".json",function(data){
					
					var dataArr = Object.values(data); // convert object to array
					
		  			var newdata = {}; // creating array key for posts
		  			newdata['posts'] = dataArr.reverse(); // order descending
					newdata['site'] = require(configPath+'site.json');
					newdata['pages'] = require(configPath+'pages.json');
		      			return new Buffer(JSON.stringify(newdata));
		   		}))
			
		      .pipe(gulp.dest(distPath+'api/')) // this generates the api 
		      .pipe(twig(templatePath+'index.html'))
		      .pipe(gulp.dest(distPath)); // this generates the pages
	
	  	}); // end loop
	
	
	  return tasks;



 
 
});


gulp.task('copy-assets', function () {
	
	    return gulp.src([templatePath+'assets/**/*']).pipe(gulp.dest(distPath+'assets'));
	
});

gulp.task('callback-example', function(callback) {
    // Use the callback in the async function
    
    console.log('done');
});

