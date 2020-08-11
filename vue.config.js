const webpack = require('webpack')
process.env.VUE_APP_VERSION = require('./package.json').version

module.exports = {
  productionSourceMap: false,
  devServer: {
    proxy: 'http://localhost:5000',
  },
  chainWebpack: config => {
    config
      .plugin('moment')
      .use(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))
    if (process.env.NODE_ENV === 'production') {
      config
        .plugin('compression')
        .use(require.resolve('compression-webpack-plugin'))
    }
    config.module.rule('md')
      .test(/\.md$/)
      .use('vue-loader')
      .loader('vue-loader')
      .end()
      .use('vue-markdown-loader')
      .loader('vue-markdown-loader/lib/markdown-compiler')
      .options({
        raw: true,
      })
  },
  // configureWebpack: config => {
  //   const commonPlugins = [
  //     new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  //   ]
  //   if (process.env.NODE_ENV === 'production') {
  //     return {
  //       plugins: [...commonPlugins, new CompressionPlugin(),
  //       ],
  //     }
  //   }
  //   return {
  //     plugins: [...commonPlugins],
  //     module: {
  //       rules: [
  //         {
  //           test: /\.md$/,
  //           loader: 'vue-markdown-loader',
  //         },
  //       ],
  //     },
  //   }
  // },
}
