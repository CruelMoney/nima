var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');
var NodemonPlugin = require('nodemon-webpack-plugin');

function isProd(valProd, valDev) {
  return process.env.NODE_ENV === 'production' ? valProd : valDev;
}

const output = isProd({
  path: __dirname + '/build',
  filename: 'bundle.js',
  chunkFilename: isProd('[id].[hash].chunk.js', '[id].chunk.js'),
}, {
  path: __dirname + '/build',
  filename: 'bundle.js',
  library: 'keystone',
  libraryTarget: 'umd',
  umdNamedDefine: true
})

module.exports = {
  entry: './src/index.js',
  resolve: {
    extensions: ['.js', '.jsx']
  },
  output,
  target: 'node',
  externals: [
    nodeExternals()
  ],
  node: {
    __dirname: false
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loaders: 'babel-loader',
        options: {
          presets: ['env', 'react-app'],
          plugins: [
            require.resolve("babel-plugin-dynamic-import-node")
          ]
        }
      },
      {
        test: /\.(css|svg)?$/,
        loaders: 'null-loader'
      }
    ],
  },
  plugins: isProd([
      new webpack.optimize.UglifyJsPlugin()
    ], [
      new NodemonPlugin()
    ])
}
