<template>
  <a-config-provider :locale="locale">
      <router-view />
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

export default {
  name: 'App',
  components: {
  },
  data () {
    return {
      locale: zhCN
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: auto;
  width: 100%;
  position: relative;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
