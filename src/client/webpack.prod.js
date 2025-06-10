const path = require('path');

const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const common = require('./webpack.common.js');

// Read up more at
//  - https://webpack.js.org/guides/production/
//  - https://vue-loader.vuejs.org/en/workflow/production.html
//
module.exports = merge(common, {
  devtool: 'source-map',
  plugins: [
    // short-circuits all Vue.js warning code
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    // minify with dead-code elimination
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    // copy assets to dist
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../../assets'),
        to: path.resolve(__dirname, '../../dist/client/assets')
      }
    ])
  ]
});
