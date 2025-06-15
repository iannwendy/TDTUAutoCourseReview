const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    popup: './src/popup/index.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/popup/popup.html',
      filename: 'popup.html',
      chunks: ['popup'],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '../manifest.json',
          to: 'manifest.json',
        },
        {
          from: '../background.js',
          to: 'background.js',
        },
        {
          from: '../content.js',
          to: 'content.js',
        },
        {
          from: '../tdtu-survey.js',
          to: 'tdtu-survey.js',
        },
        {
          from: '../icons',
          to: 'icons',
        },
      ],
    }),
  ],
  devtool: 'cheap-source-map',
}; 