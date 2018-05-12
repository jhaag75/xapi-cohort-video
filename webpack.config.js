var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    './xapi-videojs',
  ],
  output: {
      publicPath: 'dist/',
      filename: 'xapi-videojs.js'
  },
  devtool: 'source-map',
};
