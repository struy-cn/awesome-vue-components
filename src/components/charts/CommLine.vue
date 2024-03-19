<template>
  <div>
    <ResizeChart :title="title" :hoverable="hoverable" :loading="loading" :height="height">
      <template #extra>
        <slot name="extra"></slot>
        <!-- 显示表格数据 -->
        <a title="显示原始数据表" @click="switchShowTable">
          <table-outlined />
        </a>
      </template>
      <template #chart>
        <LineChart v-bind="lineConfig" :data="dataSource" />
        <a-table v-if="dataSource&&dataSource.length > 0&&showTable" :dataSource="dataSource" :columns="tableColumns" :scroll="{ y: (height -40) }"></a-table>
      </template>
    </ResizeChart>
  </div>
</template>
<script>
import { defineComponent, ref, watch } from 'vue'
import { LineChart } from '@opd/g2plot-vue'
import ResizeChart from './ResizeChart'

export default defineComponent({
  components: {
    LineChart,
    ResizeChart
  },
  props: {
    title: { type: String, require: true },
    hoverable: { type: Boolean, default: true },
    loading: { type: Boolean, default: false },
    height: { type: Number, default: 300 },
    xField: { type: Object, require: true },
    yField: { type: Object, require: true },
    seriesField: { type: Object, require: false },
    color: { type: [Object, String], require: false },
    targetValue: { type: Number },
    dataSource: {
      type: [Array, Function],
      require: true,
      default () {
        return []
      }
    }
  },
  emits: ['dateChange'],
  setup (props) {
    const showTable = ref(false)
    const lineConfig = ref({
      height: props.height,
      padding: 'auto',
      autoFit: true,
      xField: props.xField.name,
      yField: props.yField.name,
      seriesField: props.seriesField ? props.seriesField.name : null,
      smooth: false,
      legend: {
        position: 'bottom'
      },
      slider: {
        start: 0,
        end: 1
      },
      meta: {},
      label: {},
      point: {}
    })
    const tableColumns = ref([
      {
        title: props.xField.meta ? props.xField.meta.alias : props.xField.name,
        dataIndex: props.xField.name
      },
      {
        title: props.yField.meta ? props.yField.meta.alias : props.yField.name,
        dataIndex: props.yField.name
      }
    ])
    lineConfig.value.meta[props.xField.name] = ref(props.xField.meta).value
    lineConfig.value.meta[props.yField.name] = ref(props.yField.meta).value
    if (props.seriesField) {
      lineConfig.value.meta[props.seriesField.name] = ref(props.seriesField.meta).value
      tableColumns.value.push({ title: props.seriesField.meta ? props.seriesField.meta.alias : props.seriesField.name, dataIndex: props.seriesField.name })
    }
    lineConfig.value.color = (type) => {
      for (const key in props.color) {
        if (Object.hasOwnProperty.call(props.color, key)) {
          const color = props.color[key]
          if (props.seriesField) {
            // 颜色配置可以是针对值，也可以是全部
            if (type[props.seriesField.name] === key || key === '*') {
              return color
            }
          }
        }
      }
    }
    const switchShowTable = () => {
      showTable.value = !showTable.value
    }
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
        lineConfig.value.annotations = annotations
      } else {
        delete lineConfig.value.annotations
      }
    }
    targetValueChange()
    watch(props, (nweProps) => {
      if (nweProps.xField !== undefined) {
        lineConfig.value.xField = nweProps.xField.name
      }
      if (nweProps.yField !== undefined) {
        lineConfig.value.yField = nweProps.yField.name
      }
      if (nweProps.seriesField !== undefined) {
        lineConfig.value.seriesField = nweProps.seriesField.name
      }
      if (nweProps.height !== undefined) {
        lineConfig.value.height = nweProps.height
      }
      targetValueChange()
    })
    // 处理
    return {
      lineConfig,
      switchShowTable,
      tableColumns,
      showTable
    }
  }
})
</script>
