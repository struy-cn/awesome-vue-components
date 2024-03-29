const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: '/',
  assetsDir: 'static',
  transpileDependencies: true,
  devServer: {
    open: true,
    port: 8088
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
