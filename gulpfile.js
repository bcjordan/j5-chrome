'use strict';

var path = require('path');

var gulp = require('gulp');
var webpack = require('webpack');

gulp.task('bundle', function(cb) {
  webpack({
    entry: {
      ui: './ui',
      sandbox: './sandbox'
    },
    output: {
      path: path.join(__dirname, './build'),
      filename: '[name].js'
    },
    module: {
      loaders: [
        { test: /\.json$/, loader: "json" },,
        { test: /\.jsx$/, loader: 'jsx-loader?harmony=true' },
        { test: /\.css$/, loader: 'style-loader!css-loader' },
        { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },
        { test: /ui\.js$/, loader: "transform?brfs" }
      ]
    },
    plugins: [
      new webpack.IgnorePlugin(/^serialport$/)
    ],
    externals: {
      repl: 'repl'
    },
    resolveLoader: {
      // this is a workaround for loaders being applied
      // to linked modules
      root: path.join(__dirname, 'node_modules')
    },
    resolve: {
      // this is a workaround for aliasing a top level dependency
      // inside a symlinked subdependency
      root: path.join(__dirname, 'node_modules'),
      alias: {
        // replacing `fs` with a browser-compatible version
        net: 'browser-serialport',
        serialport: 'browser-serialport',
        fs: 'browser-serialport',
        tls: 'browser-serialport'
      }
    }
  }, cb);
});

gulp.task('copyBootstrap', function(){
  return gulp.src('./bootstrap/**')
    .pipe(gulp.dest('./build/bootstrap'));
});

gulp.task('copy', function() {
  return gulp.src(['./*.png', './manifest.json', './*.html', './background.js', './*.css', './node_modules/babel-core/browser.min.js'])
    .pipe(gulp.dest('./build/'));
});

gulp.task('default', ['bundle', 'copy', 'copyBootstrap']);
