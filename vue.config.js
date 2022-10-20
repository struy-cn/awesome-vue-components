const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: '/awesome-vue-components/',
  assetsDir: 'static',
  transpileDependencies: true,
  devServer: {
    open: true
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#1DA57A',
            'link-color': '#1DA57A',
            'border-radius-base': '6px'
          },
          javascriptEnabled: true
        }
      }
    }
  }
})
