<template>
  <a-card :hoverable="hoverable" :loading="loading" :title="title" :headStyle="{padding: '0 15px'}"
    :bodyStyle="{padding:'15px'}">
    <template #extra>
      <span class="extra">
        <slot name="extra"></slot>
        <a @click="fullscreen">
          <fullscreen-outlined v-if="!fullscreenOpen" />
          <fullscreen-exit-outlined v-else />
        </a>
      </span>
    </template>
    <slot name="chart"></slot>
  </a-card>
</template>
<script>
import { defineComponent, ref } from 'vue'
import { fullscreenSwitch } from '../../util/tools'
export default defineComponent({
  props: {
    title: { type: String, require: true },
    hoverable: { type: Boolean, default: true },
    loading: { type: Boolean, default: false },
    height: { type: Number, default: 300 }
  },
  emits: ['dateChange'],
  setup (props, context) {
    const lastHeigth = ref(`${props.height}px`)
    const fullscreenOpen = ref(false)
    const dateRange = ref(props.initDateRange)
    const fullscreen = (e) => {
      const chart = e.srcElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement
      fullscreenSwitch(chart, () => {
        lastHeigth.value = chart.getElementsByTagName('canvas')[0].style.height
        chart.getElementsByTagName('canvas')[0].style.height = `${window.innerHeight}px`
        fullscreenOpen.value = true
      }, () => {
        chart.getElementsByTagName('canvas')[0].style.height = lastHeigth.value
        fullscreenOpen.value = false
      })
    }
    const dateChange = (date) => {
      context.emit('dateChange', date)
    }
    return {
      fullscreen,
      dateChange,
      dateRange,
      fullscreenOpen
    }
  }
})
</script>
<style>
  .extra{
    display: flex;
  }
  .extra>a{
    padding-left: 8px;
  }
</style>
