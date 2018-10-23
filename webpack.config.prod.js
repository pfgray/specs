var webpack = require('webpack'),
    path = require('path');

// PATHS
var PATHS = {
  app: __dirname + '/src/main',
  target: __dirname + '/target/scala-2.12/resource_managed/main'
};

module.exports = {
  entry: PATHS.app + '/js/index.js',
  output: {
    path: PATHS.target + '/assets',
    filename: 'main.js'
  },
  module: {
    rules:[{
      test: /\.(jsx?|tsx?)$/,
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
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: {
      styles: path.resolve(__dirname, './src/main/styles/'),
      src: path.resolve(__dirname, './src/main/js')
    }
  }
};
