"use strict";

var gulp = require("gulp");
var imagemin = require("gulp-imagemin");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync");
var mqpacker = require("css-mqpacker");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var svgstore = require("gulp-svgstore");
var svgmin = require("gulp-svgmin");
var run = require("run-sequence");
var del = require("del");

gulp.task("style", function(){
	gulp.src("scss/style.scss")
		.pipe(plumber())
		.pipe(sass())
		.pipe(postcss([
			autoprefixer({browsers: [
				"last 1 version",
				"last 2 Chrome versions",
				"last 2 Firefox versions",
				"last 2 Opera versions",
				"last 2 Edge versions"
			]}),
			mqpacker({
				sort: true
			})
		]))
		//.pipe(gulp.dest("build/css"))
        .pipe(gulp.dest("css"))
		//.pipe(minify())
		//.pipe(rename("style.min.css"))
        .pipe(gulp.dest("css"))
		//.pipe(gulp.dest("build/css"))
		.pipe(server.reload({stream: true}));
});

gulp.task("images", function(){
	return gulp.src("build/images/*.{png,jpg,gif}")
		.pipe(imagemin([
			imagemin.optipng({optimizationlevel: 3}),
			imagemin.jpegtran({progressive: true})
		]))
		.pipe(gulp.dest("build/images"));
});

gulp.task("symbols", function(){
	//return gulp.src("build/images/*.svg")
    return gulp.src("images/*.svg")
		.pipe(svgmin())
		.pipe(svgstore({
			inlineSvg: true
		}))
		.pipe(rename("symbols.svg"))
        .pipe(gulp.dest("images"));
		//.pipe(gulp.dest("build/images"));
});

gulp.task("serve", function(){
	server.init({
		//server: "build"
        server: "."
	});
    gulp.watch("scss/style.scss", ["style"]);
    gulp.watch("scss/mixins.scss", ["style"]);
    gulp.watch("scss/blocks/*.scss", ["style"]);
	gulp.watch("*.html")
		.on("change", server.reload);
});

gulp.task("build", function(fn){
	run("clean", "copy", "style", "images", "symbols", fn);
});

gulp.task("copy", function(){
	return gulp.src([
		"images/**",
		"*.html"
		], {
			base: "."
		})
		.pipe(gulp.dest("build"));
});

gulp.task("clean", function(){
	return del("build");
});