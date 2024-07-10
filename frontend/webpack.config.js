const path = require('path');

module.exports = {
  mode: 'development', 
  entry: './src/index.js', 
  devtool: 'source-map', 
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: [
          /node_modules\/html5-qrcode/,
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], 
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), 
  },
};