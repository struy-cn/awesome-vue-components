<template>
  <ResizeChart :hoverable="hoverable" :loading="loading" :title="title" :height="height">
    <template #chart>
      <PieChart v-bind="pieConfig" :data="dataSource" />
    </template>
  </ResizeChart>
</template>
<script>
import { defineComponent, ref, watch } from 'vue'
import { PieChart } from '@opd/g2plot-vue'
import ResizeChart from './ResizeChart'

export default defineComponent({
  components: {
    PieChart,
    ResizeChart
  },
  props: {
    title: { type: String, require: true },
    hoverable: { type: Boolean, default: true },
    loading: { type: Boolean, default: false },
    height: { type: Number, default: 300 },
    angleField: { type: Object, require: true },
    colorField: { type: Object, require: true },
    innerRadius: { type: Number, default: 0 },
    innerType: { type: Boolean, default: false },
    color: Object,
    dataSource: { type: Array, require: true }
  },
  setup (props) {
    const pieConfig = ref({
      height: props.height,
      appendPadding: 10,
      angleField: props.angleField.name,
      colorField: props.colorField.name,
      radius: 0.8,
      innerRadius: props.innerRadius,
      meta: {},
      label: {},
      legend: {
        position: 'bottom'
      },
      interactions: [{ type: 'element-active' }]
    })
    pieConfig.value.label = props.innerType
      ? {
          type: 'inner',
          offset: '-10%',
          content: '{percentage}'
        }
      : {
          type: 'spider',
          labelHeight: 28,
          content: '{name}：{percentage}'
        }
    watch(props, (nweProps) => {
      if (nweProps.angleField !== undefined) {
        pieConfig.value.angleField = nweProps.angleField.name
      }
      if (nweProps.colorField !== undefined) {
        pieConfig.value.colorField = nweProps.colorField.name
      }
      if (nweProps.height !== undefined) {
        pieConfig.value.height = nweProps.height
      }
    })
    return {
      pieConfig
    }
  }
})
</script>
