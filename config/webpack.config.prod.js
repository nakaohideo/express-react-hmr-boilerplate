var path = require('path');
var webpack = require('webpack');
var babelConfig = require('./babel.config.prod');

module.exports = {
  // devtool: 'source-map',
  entry: [
    path.join(__dirname, '../src/flux/index'),
  ],
  output: {
    path: path.join(__dirname, '../build/public/js'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  externals: {
    jquery: 'jQuery',
    mongoose: 'mongoose',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        BROWSER: JSON.stringify(true),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
    }),
    new webpack.ProvidePlugin({
      fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch',
    }),
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      include: path.join(__dirname, '../src'),
      loader: 'babel',
      query: babelConfig,
    },],
  },
};