var webpack = require('webpack'),
    path = require('path');

// PATHS
var PATHS = {
  app: __dirname + '/src/main',
  target: __dirname + '/target'
};

module.exports = {
  entry: PATHS.app + '/js/index.js',
  output: {
    filename: 'main.js'
  },
  devServer: {
    publicPath: "/assets/"
  },
  devtool: 'cheap-module-source-map',
  module: {
    rules:[{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: ['babel-loader'],
    },{
      test: /\.less$/,
      use: ['style-loader', 'css-loader', 'less-loader']
    },{
      test: /\.(png)$/,
      use: ['url-loader']
    }]
  },
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      styles: path.resolve(__dirname, './src/main/styles/')
    }
  }
};
