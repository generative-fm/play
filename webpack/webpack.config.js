'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fetch = require('node-fetch');
const { EnvironmentPlugin } = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const createInjectAssetsPlugin = require('./create-inject-assets-plugin');

const config = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    main: { import: './src', filename: '[name].[contenthash].js' },
    serviceWorker: { import: './src/service-worker/sw.js', filename: 'sw.js' },
  },
  output: {
    publicPath: '/',
    chunkFilename: '[id].[contenthash].js',
    path: path.join(__dirname, '../dist'),
  },
  resolve: {
    extensions: ['.json', '.js', '.jsx'],
    mainFields: ['generativeFmManifest', 'browser', 'module', 'main'],
  },
  devServer: {
    historyApiFallback: true,
    before: (app) => {
      app.get('/api/global/playtime', (req, res) =>
        fetch('http://stats.api.generative.fm/v1/global/playtime').then(
          (response) => {
            response.body.pipe(res);
          }
        )
      );
      app.post('/api/emissions', (req, res) => {
        res.sendStatus(200);
      });
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.join(__dirname, '../src'),
        use: ['babel-loader'],
      },
      {
        test: /\.(s?css)$/,
        include: path.join(__dirname, '../src'),
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.gfm.manifest.json$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: ['@babel/plugin-syntax-dynamic-import'],
            },
          },
          path.join(__dirname, './piece-loader.js'),
        ],
        include: path.join(__dirname, '../node_modules/@generative-music'),
        type: 'javascript/auto',
      },
      {
        test: /\.png$/,
        use: ['file-loader', 'image-webpack-loader'],
      },
      {
        test: /\.mp3$/,
        include: path.join(__dirname, '../src'),
        use: 'file-loader',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.template.html',
      excludeChunks: ['serviceWorker'],
    }),
    new EnvironmentPlugin({
      SAMPLE_FILE_HOST: '//localhost:6969',
      GFM_STATS_ENDPOINT: '/api',
      GFM_USER_ENDPOINT: 'https://user.api.generative.fm/v1',
    }),
    createInjectAssetsPlugin('sw.js'),
    new FaviconsWebpackPlugin({
      logo: './src/logo.png',
      manifest: './src/manifest.json',
      prefix: '',
      favicons: {
        theme_color: '#121212',
        background: '#121212',
      },
    }),
  ],
};

module.exports = config;