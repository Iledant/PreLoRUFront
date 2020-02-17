const webpack = require('webpack')
const CompressionPlugin = require('compression-webpack-plugin')
process.env.VUE_APP_VERSION = require('./package.json').version

module.exports = {
  productionSourceMap: false,
  // transpileDependencies: [
  //   'vuetify'
  // ]
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      return {
        plugins: [
          new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
          new CompressionPlugin()
        ]
      }
    }
    return {
      plugins: [
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
      ]
    }
  }
}
