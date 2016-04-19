// native packages
var path = require('path');

// vendor packages
var gulp = require('gulp');
var gutil = require('gulp-util');
var changed = require('gulp-changed');
var del = require('del');
var babel = require('gulp-babel');
var webpack = require('webpack');
var sourcemaps = require('gulp-sourcemaps');
var nodemon = require('gulp-nodemon');
var notify = require('gulp-notify');
var async = require('async');

// local modules
var webpackConfig = {
  development: require('./config/webpack.config.dev'),
  production: require('./config/webpack.config.prod'),
};
var babelConfig = {
  development: require('./config/babel.config.dev'),
  production: require('./config/babel.config.prod'),
};

var paths = {
  scripts: './src/server/**/*.js',
  reacts: './src/flux/**/*.js',
  statics: './src/public/**/*',
  nodemonWatchIgnore: [
    'gulpfile.js',
    'node_modules/**/*',
    'src/**/*',
    'public/js/bundle.js',
    'build/flux/**/*',
  ],
  targetDir: 'build',
};

function _babelStream(src, dest, config) {
  return gulp
    .src(src)
    .pipe(changed(dest))
    .pipe(sourcemaps.init())
      .pipe(babel(config))
      .on('error', notify.onError({
        title: 'babel fail',
        message: '<%= error.message %>',
      }))
    .pipe(sourcemaps.write({
      includeContent: false,
      sourceRoot: './src',
    }))
    .pipe(gulp.dest(dest));
}

function _webpackTask(config, cb) {
  webpack(config, function(err, stats) {
    if (err) {
      return cb(err);
    }
    var jsonStats = stats.toJson();
    if (jsonStats.errors.length > 0) {
      return cb(jsonStats.errors);
    }
    if (jsonStats.warnings.length > 0) {
      gutil.log(gutil.colors.yellow(jsonStats.warnings));
    }
    cb();
  });
}

// clean build files
gulp.task('clean', function() {
  return del.sync(paths.targetDir);
});

// build nodejs source files
gulp.task('build:nodejs', function() {
  return _babelStream(
    paths.scripts,
    path.join(paths.targetDir, 'server'),
    babelConfig.development
  );
});

// build reactjs source files
gulp.task('build:reactjs', ['build:nodejs'], function() {
  return _babelStream(
    paths.reacts,
    path.join(paths.targetDir, 'flux'),
    babelConfig.development
  );
});

// bundle react components
gulp.task('webpack:development', ['build:reactjs'], function(cb) {
  _webpackTask(webpackConfig.development, cb);
});

gulp.task('webpack:production', ['build:reactjs'], function(cb) {
  _webpackTask(webpackConfig.production, cb);
});

// copy static files
gulp.task('copy', function() {
  return gulp
    .src(paths.statics)
    .pipe(changed(path.join(paths.targetDir, 'public')))
    .pipe(gulp.dest(path.join(paths.targetDir, 'public')));
});

// watching source files
gulp.task('watch', ['build:development'], function() {
  gulp.watch(paths.scripts, ['build:nodejs']);
  gulp.watch(paths.reacts, ['build:reactjs', 'webpack:development']);
  gulp.watch(paths.statics, ['copy']);
});

// launch development server
gulp.task('serve', function(cb) {
  var started = false;
  var entryPath = path.join(paths.targetDir, 'server/server.js');

  return nodemon({
    script: entryPath,
    watch: [path.join(paths.targetDir, '**/*.js')],
    ext: 'js',
    env: {
      NODE_ENV: 'development',
    },
    ignore: paths.nodemonWatchIgnore,
  })
  .on('start', function() {
    if (!started) {
      cb();
      started = true;
    }
  })
  .on('restart', function() {
  });
});

// deploy to heroku
gulp.task('deploy', function(cb) {
  var pkg = require('./package.json');
  var fs = require('fs');
  var exec = require('child_process').exec;
  var appName = gutil.env.a || gutil.env.app || pkg.name;
  var isCreateNewApp = Boolean(gutil.env.c || gutil.env.create);

  gutil.log('deploy to heroku app:', gutil.colors.underline(appName));

  var execCmds = function(cmds, cwd, cbExec) {
    async.eachSeries(cmds, function(cmd, cbSeries) {
      gutil.log('execute command', gutil.colors.grey(cmd));
      exec(cmd, {
        cwd: cwd? path.join(process.cwd(), cwd): process.cwd(),
      }, function(err, stdout, stderr) {
        if (err) {
          return cbSeries({
            err: err,
            msg: err.message,
            cmd: cmd,
          });
        }
        if (stdout) {
          console.log(stdout);
        }
        cbSeries();
      });
    }, cbExec);
  };

  var cbCmdDone = function(err) {
    if (err) {
      gutil.log(gutil.colors.red('failed to deploy'));
      gutil.log(gutil.colors.red('\terror command:'));
      gutil.log(gutil.colors.red('\t\t' + err.cmd));
      gutil.log(gutil.colors.red('\terror message:'));
      gutil.log(gutil.colors.red('\t\t' + err.msg));
      return cb(err.err);
    }
    gutil.log(
      'Please open',
      gutil.colors.underline('https://' + appName + '.herokuapp.com'));
    cb();
  };

  async.series([
    function checkFolder(cbSeries) {
      if (!fs.existsSync('./.deploy')) {
        fs.mkdir('.deploy', 0766, cbSeries);
      } else {
        cbSeries();
      }
    },
    function checkGit(cbSeries) {
      if (!fs.existsSync('./.deploy/.git')) {
        execCmds([
          'git init',
        ], './.deploy', cbSeries);
      } else {
        cbSeries();
      }
    },
    function prepareFiles(cbSeries) {
      execCmds([
        'rm -f ./package.json',
        'rm -rf ./build',
        'cp ../config/Procfile ./',
        'cp ../package.json ./',
        'cp -r ../build ./',
      ], './.deploy', cbSeries);
    },
    function publish(cbSeries) {
      if (isCreateNewApp) {
        execCmds([
          'git add . -A',
          'heroku create ' + appName,
          'git commit -m "Deploy"',
          'git push heroku master -f',
        ], './.deploy', cbSeries);
      } else {
        execCmds([
          'git add . -A',
          'heroku git:remote -a ' + appName,
          'git commit -m "Deploy upgrade"',
          'git push heroku master -f',
        ], './.deploy', cbSeries);
      }
    },
  ], cbCmdDone);
});

gulp.task('build:production', function() {
  gulp.start(
    'clean',
    'build:nodejs',
    'build:reactjs',
    'webpack:production',
    'copy');
});

gulp.task('build:development', function() {
  gulp.start(
    'clean',
    'build:nodejs',
    'build:reactjs',
    'webpack:development',
    'copy',
    'watch');
});

gulp.task('default', function() {
  gulp.start('build:development');
});