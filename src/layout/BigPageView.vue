<template>
    <div style="
  height:100vh;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;" :style="{position: position}">
      <div class="ant-message" :style="`top: ${toolsClose?'-38px':`0px`};transition: all 0.2s;`" v-show="showTools">
        <div class="ant-message-notice" style="padding: 0;">
          <span class="ant-message-notice-content">
            <span>
                <warning-two-tone two-tone-color="#eb2f96" />
                由XX加载此页面
                </span>
                <a-divider type="vertical" />
                <a href="javascritp:void(0)" @click="back"><arrow-left-outlined />上一页</a>
                <a-divider type="vertical" />
                <a href="#"><home-outlined />首页</a>
                <slot name="tools">
                </slot>
                <a-divider type="vertical" />
                <caret-up-filled v-if="!toolsClose" class="trigger" @click="() => { toolsClose = !toolsClose }" />
                <caret-down-filled style=" position: absolute;top: 100%;right: 50%;" class="trigger" v-else
                @click="() => { toolsClose = !toolsClose }" v-on:mouseover="() => { toolsClose = !toolsClose }" />
          </span>
        </div>
      </div>
      <slot name="content">
        <router-view></router-view>
      </slot>
    </div>
</template>

<script>
import { ref } from 'vue'
export default {
  props: {
    showTools: { type: Boolean, default: true },
    position: { type: String, default: 'absolute' }
  },
  setup (props) {
    const toolsClose = ref(false)
    const back = () => {
      window.history.back()
    }
    if (props.showTools) {
      const closeToolsTimer = setTimeout(() => {
        toolsClose.value = true
        clearTimeout(closeToolsTimer)
      }, 3000)
    }
    return {
      back,
      toolsClose
    }
  }
}
</script>
