<template>
  <div>
    <ResizeChart :title="title" :hoverable="hoverable" :loading="loading" :height="height">
      <template #extra>
        <slot name="extra"></slot>
      </template>
      <template #chart>
        <DualAxesChart v-bind="dualAxesConfig" :data="[dataSource,dataSource]" />
      </template>
    </ResizeChart>
  </div>
</template>
<script>
import { defineComponent, ref, watch } from 'vue'
import { DualAxesChart } from '@opd/g2plot-vue'
import ResizeChart from './ResizeChart'

export default defineComponent({
  components: {
    DualAxesChart,
    ResizeChart
  },
  props: {
    title: { type: String, require: true },
    hoverable: { type: Boolean, default: true },
    loading: { type: Boolean, default: false },
    height: { type: Number, default: 300 },
    xField: { type: Object, require: true },
    yField: { type: Array[Object], require: true },
    targetValue: { type: Number },
    columnColor: { type: [Object, String], require: false },
    columnSeriesField: { type: Object, require: false },
    columnIsGroup: { type: Boolean, default: false },
    columnIsStack: { type: Boolean, default: false },
    dataSource: {
      type: [Array, Function],
      require: true,
      default () {
        return []
      }
    }
  },
  setup (props) {
    const dualAxesConfig = ref({
      height: props.height,
      xField: props.xField.name,
      yField: props.yField.map(x => x.name),
      meta: {},
      color: {},
      legend: {
        position: 'bottom'
      },
      yAxis: {},
      limitInPlot: false,
      geometryOptions: [
        {
          geometry: 'column',
          color: (type) => {
            if (typeof props.columnColor === 'string') {
              return props.columnColor
            }
            for (const key in props.columnColor) {
              if (Object.hasOwnProperty.call(props.columnColor, key)) {
                const color = props.columnColor[key]
                if (props.columnSeriesField) {
                  // 颜色配置可以是针对值，也可以是全部
                  if (type[props.columnSeriesField.name] === key || key === '*') {
                    return color
                  }
                }
              }
            }
          },
          isGroup: props.columnIsGroup,
          isStack: props.columnIsStack,
          seriesField: props.columnSeriesField ? props.columnSeriesField.name : null,
          label: {
            // 可手动配置 label 数据标签位置
            position: 'bottom', // 'top', 'bottom', 'middle'
            // 可配置附加的布局方法
            layout: [
              // 柱形图数据标签位置自动调整
              { type: 'interval-adjust-position' },
              // 数据标签防遮挡
              { type: 'interval-hide-overlap' },
              // 数据标签文颜色自动调整
              { type: 'adjust-color' }
            ]
          }
        },
        {
          geometry: 'line',
          label: {
          },
          point: {}
        }
      ]
    })
    dualAxesConfig.value.meta[props.xField.name] = ref(props.xField.meta).value
    props.yField.forEach(y => {
      dualAxesConfig.value.meta[y.name] = ref(y.meta).value
      dualAxesConfig.value.yAxis[y.name] = { max: y.meta.max, min: 0 }
    })
    const targetValueChange = () => {
      if (props.targetValue !== undefined && props.targetValue !== 0) {
        const annotations = [
          {
            type: 'text',
            position: ['min', props.targetValue],
            content: '目标' + props.targetValue,
            offsetY: 5,
            offsetX: -60,
            style: {
              color: 'green',
              textBaseline: 'bottom'
            }
          },
          {
            type: 'line',
            start: ['min', props.targetValue],
            end: ['max', props.targetValue],
            style: {
              stroke: 'red',
              lineDash: [4, 4]
            }
          }
        ]
        dualAxesConfig.value.annotations = annotations
      } else {
        delete dualAxesConfig.value.annotations
      }
    }
    targetValueChange()
    watch(props, (nweProps) => {
      if (nweProps.xField !== undefined) {
        dualAxesConfig.value.xField = nweProps.xField.name
      }
      if (nweProps.yField !== undefined) {
        dualAxesConfig.value.yField = props.yField.map(x => x.name)
      }
      if (nweProps.height !== undefined) {
        dualAxesConfig.value.height = nweProps.height
      }
      targetValueChange()
    })
    return {
      dualAxesConfig
    }
  }
})
</script>
