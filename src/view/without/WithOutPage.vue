<!--通知群组页面-->
<template>
    <div style="position: absolute;
  height:100vh;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;">
      <div class="ant-message" :style="`top: ${toolsClose?'-38px':`0px`};transition: all 0.2s;`" v-show="showTools">
        <div class="ant-message-notice" style="padding: 0;">
          <span class="ant-message-notice-content">
            <span>
              <warning-two-tone two-tone-color="#eb2f96" />
              本页面由???加载
            </span>
            <a-divider type="vertical" />
            <a href="javascritp:void(0)" @click="back">返回</a>
            <a-divider type="vertical" />
            <a href="#">主页</a>
            <a-divider type="vertical" />
            <a :href="link" target="_blank">原页面
            </a>
            <a-divider type="vertical" />
            <caret-up-filled v-if="!toolsClose" class="trigger" @click="() => { toolsClose = !toolsClose }" />
            <caret-down-filled style=" position: absolute;top: 100%;right: 50%;" class="trigger" v-else
              @click="() => { toolsClose = !toolsClose }" v-on:mouseover="() => { toolsClose = !toolsClose }" />
          </span>
        </div>
      </div>
      <iframe id="iframe" width="100%" height="100%" frameborder="0" :src="link"></iframe>
    </div>
</template>

<script>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
export default {
  props: {
    pageLink: { type: String, default: '' },
    showTools: { type: Boolean, default: true }
  },
  setup (props) {
    const route = useRoute()
    const link = ref(props.pageLink)
    const toolsClose = ref(false)
    const back = () => {
      window.history.back()
    }
    if (route.params.link) {
      link.value = decodeURIComponent(route.params.link)
    }
    if (props.showTools) {
      const closeToolsTimer = setTimeout(() => {
        toolsClose.value = true
        clearTimeout(closeToolsTimer)
      }, 3000)
    }
    return {
      back,
      link,
      toolsClose
    }
  }
}
</script>
