var gulp = require("gulp");//导入gulp插件；
var webserver = require("gulp-webserver");//导入gulp服务插件
var livereload = require("gulp-livereload");//导入自动刷新插件；
var rubyScss = require("gulp-ruby-sass");//导入ruby编译插件；
var sourcemaps = require("gulp-sourcemaps");//导入map插件
var rename = require("gulp-rename");//导入重命名插件
var uglify = require("gulp-uglify");//导入压缩脚本插件
var changed = require("gulp-changed");//导入changed插件
var imagemin = require("gulp-imagemin");//导入图片压缩插件
var pngquant = require("imagemin-pngquant");//导入深度压缩
var concat = require("gulp-concat");//导入文件合并插件
//helloworld；
//gulp.task("任务名称",function(){调用此任务时，执行的回调函数});
//gulp.task("sayhello",function(){
//	console.log("helloworld");
//})
//
/**********自动刷新************/
gulp.task("reload",function(){
	gulp.src("src")//导入目标文件  index.html；
	//管道函数；
	.pipe(webserver({
		livereload:true,//是否自动刷新
		open:true //是否自动打开
	}))
})

/**********文件搬家************/
gulp.task("moveHtml",function(){
	//导入开发环境中html文件夹下所有html为后缀的文件
	gulp.src("src/html/*.html") 
	//导出到发布环境中的html文件夹下；
	.pipe(gulp.dest("dist/html"))
})

/**********sass编译************/
gulp.task("rubyScss",function(){
	//使用rubyScss编译src/scss/*.scss文件，输出压缩过后的css样式表；
	rubyScss("src/scss/*.scss",{style:"compressed"})
	//监听是否编译成功，若失败则打印错误原因；
	.on("error",function(err){
		if (err) {
			console.log(err);
		}
	})
	.pipe(gulp.dest("dist/css"));
})

/************脚本压缩************/
gulp.task("uglifyJs",function(){
	//导入脚本文件；
	gulp.src("src/js/*.js")
	//在sourcemap中记录未压缩脚本；
	.pipe(sourcemaps.init())
	//压缩脚本
	.pipe(uglify())
	//添加后缀名.min
	.pipe(rename({suffix:".min"}))
	//写入maps文件夹
	.pipe(sourcemaps.write("maps"))
	//输出至发布环境中
	.pipe(gulp.dest("dist/js"))
})

/************图片压缩************/
gulp.task("img",function(){
	//导入要压缩的图片
	gulp.src("src/image/*.{jpg,png,svg,gif}")
	//筛选未压缩的图片
	.pipe(changed("dist/image"))
	//压缩图片
	.pipe(imagemin({
		//深度压缩
		user:[pngquant]
	}))
	.pipe(gulp.dest("dist/image"));
})

/************文件合并************/
gulp.task("concatFile",function(){
	gulp.src("src/js/demo*.js")
	.pipe(concat("demo.js"))
	.pipe(gulp.dest("dist/js"))
})

/************监听************/
gulp.task("see",function(){
	gulp.watch("src/html/*.html",["moveHtml"])
	gulp.watch("src/scss/*.scss",["rubyScss"])
	gulp.watch("src/js/*.js",["uglifyJs"])
})










