const webpack = require('webpack')
const path = require('path')
const pkg = require('./package.json')

const env = process.env.NODE_ENV
const isProd = env === 'production'
const isDev = env === 'development'
const isTest = env === 'test'

process.env.VERSION = pkg.version

const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(env),
    'process.env.VERSION': JSON.stringify(pkg.version),
    __DEV__: isDev,
    __TEST__: isTest
  })
]

if (isProd) {
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }))
}

module.exports = {
  output: {
    library: 'jss',
    libraryTarget: 'umd'
  },
  plugins,
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        query: {
          presets: pkg.babel.presets,
          plugins: pkg.babel.plugins.concat(isTest ? ['rewire'] : [])
        },
        test: /\.js$/,
        exclude: /node_modules/
      },
      {
        loader: 'json-loader',
        test: /\.json$/
      }
    ]
  },
  devtool: 'source-map',
  resolve: {
    alias: {
      jss: path.join(__dirname, 'src')
    }
  }
}
