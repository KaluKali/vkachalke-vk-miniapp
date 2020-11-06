const fs = require('fs');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (options) => ({
  target: 'web',
  devtool: options.devtool,
  mode: options.mode,
  entry: options.entry,
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
    publicPath: process.env.NODE_ENV !== 'production' ? '/' : './',
    chunkFilename: '[id].chunk.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        resolve: {
          extensions: ['.js', '.jsx'],
        },
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: 'file-loader',
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.(s*)css$/,
        use: process.env.NODE_ENV === 'production' ? [MiniCssExtractPlugin.loader, 'css-loader'] : ['style-loader', 'css-loader'],
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
    disableHostCheck: true,
    compress: false,
    host: '0.0.0.0',
    https: true,
    port: 10888,
    cert: fs.readFileSync('fullchain.pem'),
    key: fs.readFileSync('privkey.pem'),
  },
  plugins: options.plugins.concat(
    [
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
    ],

  ),
});
