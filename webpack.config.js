var webpack = require('webpack');
var path = require('path');
const MinifyPlugin = require("babel-minify-webpack-plugin");

var BUILD_DIR = path.resolve(__dirname, 'static/');
var APP_DIR = path.resolve(__dirname, 'src/');

var config = {
  entry: APP_DIR + '/index.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'release-display.js'
  },
  devtool: 'source-map',
  // plugins: [
  //   new MinifyPlugin()
  // ],
  module : {
    
    loaders : [
      {
        test : /\.jsx?/,
        include : APP_DIR,
        loader : 'babel-loader'
      }
    ]
  }
};

module.exports = config;