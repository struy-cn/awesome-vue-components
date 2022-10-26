<template>
  <a-layout style="height:auto;">
    <a-layout-sider v-show="!withOutfullscreen &&!showByIframe" v-model:collapsed="collapsed" :trigger="null"
      collapsible
      :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0, transition: 'all 0.1s' }">
      <div class="logo">
        <router-link style="color:rgba(255, 255, 255, 0.65);" to="/">
          <span v-if="!collapsed">
            AVC
          </span>
          <span v-if="collapsed">
            V
          </span>
        </router-link>
      </div>
      <a-menu v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys" theme="dark" mode="inline"
        @click="handleClick">
        <template v-for="route in routes[0].children" v-bind:key="route.path">
          <a-menu-item v-if="!route.children || route.children.filter(x => !x.meta.hide).length === 0"
            v-bind:key="route.path">
            <template v-if="route.meta.icon">
              <component :is="route.meta.icon" />
            </template>
            <span>
              <router-link class="menu-title-link" :to="route.path">
                {{ route.meta.title}}
              </router-link>
            </span>
          </a-menu-item>
          <a-sub-menu v-if="route.children&&route.children.filter(x => !x.meta.hide).length > 0"
            v-bind:key="route.path">
            <template #title>
              <template v-if="route.meta.icon">
                <component :is="route.meta.icon" />
              </template>
              <span>
                <router-link class="menu-title-link" :to="route.path">
                  {{ route.meta.title}}
                </router-link>
              </span>
            </template>
            <template v-for="routeSub in route.children" v-bind:key="routeSub.path">
              <a-menu-item v-if="!routeSub.children" :key="routeSub.path">
                <template v-if="routeSub.meta.icon">
                  <component :is="routeSub.meta.icon" />
                </template>
                <span>
                  {{ routeSub.meta.title}}
                </span>
              </a-menu-item>
            </template>
          </a-sub-menu>
        </template>
      </a-menu>
    </a-layout-sider>
    <a-layout
      :style="{ marginLeft: withOutfullscreen||showByIframe ?'0':(collapsed ? '80px' : '200px'), minHeight: '100vh', transition: 'all 0.1s' }">
      <a-layout-header v-show="!withOutfullscreen && !showByIframe"
        style="background: #fff; padding: 0 15px;color: rgba(0, 0, 0, 0.85);">
        <menu-unfold-outlined v-if="collapsed" class="trigger" @click="collapsedChange()" />
        <menu-fold-outlined v-else class="trigger" @click="collapsedChange()" />
        <span v-show="!showByIframe" style="margin-left: 15px;" title="将本页内容全屏">
          <fullscreen-outlined @click="fullscreen" class="trigger" v-if="!fullscreenOpen" />
        </span>
        <span  style="margin-left: 15px;" >
          <a href="https://github.com/struy-cn/awesome-vue-components">awesome-vue-components</a>, this`s good project
        </span>
        <div class="header-index-right">
          <bug-outlined class="trigger" title="查看调试信息" @click="openDebug" />
          <a-divider type="vertical" />
          <a-avatar src="https://joeschmoe.io/api/v1/random"></a-avatar>
        </div>
      </a-layout-header>
      <a-layout-content :style="{ padding: '0 10px', background: '#f0f2f5' }">
        <a-breadcrumb :style="{ margin: '10px 0', padding: fullscreenOpen?'0':'5px 0' }">
          <a-breadcrumb-item>{{ pageTitle }}</a-breadcrumb-item>
        </a-breadcrumb>
        <fullscreen-exit-outlined style="position: absolute;right: 25px;top: 15px;" v-if="fullscreenOpen"
          @click="fullscreen" class="trigger" />
        <div :style="{ background: '#fff', padding: '15px' }">
          <router-view></router-view>
        </div>
      </a-layout-content>
      <a-layout-footer :style="{ textAlign: 'center' }">
        Copyright 2022～{{ new Date().getFullYear() }}
        <a-divider type="vertical" />
        <a href="http://struy.cn">struy</a>
        <a-divider type="vertical" />
        <a href="https://github.com/struy-cn/awesome-vue-components"><github-outlined /></a>
      </a-layout-footer>
    </a-layout>
  </a-layout>
  <a-drawer width="50%" title="调试信息" placement="bottom" :visible="debugVisible"
    @close="() => { debugVisible = !debugVisible }">
    <template v-for="value,key in debugInfo" :key="key">
      <p>{{ key }}：{{ value }}</p>
    </template>
  </a-drawer>
</template>
<script >
import { reactive, toRefs, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import routes from '../routes/router.config'
import { fullscreenSwitch } from '../util/tools'
export default {
  name: 'BaseLayout',
  components: {
  },
  setup () {
    const router = useRouter()
    const route = useRoute()
    const pageTitle = ref(route.meta.title)
    const debugInfo = ref({})
    const state = reactive({
      selectedKeys: [route.path],
      collapsed: false,
      fullscreenOpen: false,
      showByIframe: false, // 是否是展示在
      withOutfullscreen: false, // 外部全屏，如果页面作为iframe则强制全屏
      openKeys: ['/summary']
    })
    const debugVisible = ref(false)
    const openDebug = () => {
      debugVisible.value = !debugVisible.value
      debugInfo.value.innerHeight = window.innerHeight
      debugInfo.value.innerWidth = window.innerWidth
      for (const key in navigator) {
        const element = navigator[key]
        if (typeof element === 'string' && element !== '') {
          debugInfo.value[key] = element
        }
      }
    }
    document.onfullscreenchange = (event) => {
      console.log(event)
    }
    window.addEventListener('message', (event) => {
      switch (event.data.type) {
        case 'fullscreen':
          state.withOutfullscreen = event.data.data
          break
        default:
          break
      }
    })
    state.showByIframe = (self !== top)
    const fullscreen = () => {
      const main = document.getElementsByTagName('main')[0]
      fullscreenSwitch(main, () => {
        state.fullscreenOpen = true
      }, () => {
        state.fullscreenOpen = false
      })
    }
    const handleClick = (menuInfo) => {
      router.push(menuInfo.key)
    }
    const setPageTitle = () => {
      state.selectedKeys = [route.path]
      const parent = router.getRoutes().find(x => x.children.filter(y => y.path === route.path).length > 0)
      let title = route.meta.title
      if (parent !== undefined) {
        state.openKeys = [parent.path]
        title = `${parent.meta.title} / ${title}`
      }
      pageTitle.value = title
    }
    const collapsedChange = () => {
      state.collapsed = !state.collapsed
      // const query = Object.assign({ collapsed: state.collapsed }, route.query)
      // router.push({ query })
    }
    setPageTitle()
    watch(route, () => {
      setPageTitle()
    })

    return { ...toRefs(state), handleClick, routes, pageTitle, collapsedChange, fullscreen, openDebug, debugVisible, debugInfo }
  }
}
</script>
<style>
.header-index-right {
  float: right;
  margin-right: 10px;
}
.menu-title-link{
  color: rgba(255, 255, 255, 0.65) !important;
}
.menu-title-link::selection{
  color: #fff !important;
}
.menu-title-link:hover {
  color: #fff !important;
}
.logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
  text-align: center;
  font-size: 20px;
  color: #fff;
}
.site-layout .site-layout-background {
  background: #fff;
}
body{
  background: '#fff' !important
}

[data-theme="dark"] .site-layout .site-layout-background {
  background: #141414;
}
</style>
