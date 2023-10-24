const { mergeSassVariables } = require('@vuetify/cli-plugin-utils')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  transpileDependencies: ['vuetify'],
  chainWebpack: config => {
    const modules = ['vue-modules', 'vue', 'normal-modules', 'normal']
    modules.forEach(match => {
      config.module
        .rule('sass')
        .oneOf(match)
        .use('sass-loader')
        .tap(opt => mergeSassVariables(opt, "'@/styles/variables.scss'"))
      config.module
        .rule('scss')
        .oneOf(match)
        .use('sass-loader')
        .tap(opt => mergeSassVariables(opt, "'@/styles/variables.scss';"))
    })
    config.entry('app').add('babel-polyfill', 'whatwg-fetch', './src/main.js')
  },

  // debug setting
  configureWebpack: {
    devtool: 'source-map',
  },
  devServer: {
    proxy: 'http://127.0.0.1:8000',

    // proxy: process.env.NODE_ENV === 'production' ? 'http://127.0.0.1' : 'http://127.0.0.1',

    // disableHostCheck: true, // 跳过host检查，可以通过电脑中配置的域名进行访问。
    // proxy: 'http://164.70.94.68/',
  },
}
