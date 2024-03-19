<template>
  <div>
    <ResizeChart :hoverable="hoverable" :loading="loading" :title="title" :height="height">
      <template #extra>
        <slot name="extra"></slot>
        <a v-if="columnConfig.isStack&&!columnConfig.isGroup" title="切换百分比显示"
          @click="switchPerCent">
          <percentage-outlined v-if="!columnConfig.isPercent" />
          <field-number-outlined v-else/>
        </a>
        <!-- 显示表格数据 -->
        <a title="显示原始数据表" @click="switchShowTable">
          <table-outlined />
        </a>
      </template>
      <template #chart>
        <column-chart v-if="dataSource&&dataSource.length > 0" v-bind="columnConfig" :data="dataSource" />
        <a-empty v-else />
        <a-table v-if="dataSource&&dataSource.length > 0&&showTable" :dataSource="dataSource" :columns="tableColumns" :scroll="{ y: (height -40) }"></a-table>
      </template>
    </ResizeChart>
  </div>
</template>
<script>
import { defineComponent, ref, watch } from 'vue'
import { ColumnChart } from '@opd/g2plot-vue'
import ResizeChart from './ResizeChart'
export default defineComponent({
  components: {
    ColumnChart,
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
    isGroup: { type: Boolean, default: false },
    color: { type: [Object, String], require: false },
    dataSource: { type: Array, require: true },
    targetValue: { type: Number },
    focePercent: { type: Boolean, default: false }
  },
  emits: ['dateChange'],
  setup (props) {
    const showTable = ref(false)
    const columnConfig = ref({
      height: props.height,
      autoFit: true,
      isPercent: false,
      isGroup: props.isGroup,
      isStack: !!props.seriesField,
      xField: props.xField.name,
      yField: props.yField.name,
      seriesField: props.seriesField ? props.seriesField.name : null,
      colorField: props.seriesField ? null : props.xField.name,
      smooth: true,
      legend: {
        position: 'bottom'
      },
      meta: {
      },
      color: {},
      label: {
        // 可手动配置 label 数据标签位置
        position: 'middle', // 'top', 'bottom', 'middle'
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
    columnConfig.value.meta[props.xField.name] = ref(props.xField.meta).value
    columnConfig.value.meta[props.yField.name] = ref(props.yField.meta).value
    if (props.seriesField) {
      columnConfig.value.meta[props.seriesField.name] = ref(props.seriesField.meta).value
      tableColumns.value.push({ title: props.seriesField.meta ? props.seriesField.meta.alias : props.seriesField.name, dataIndex: props.seriesField.name })
    }
    columnConfig.value.color = (type) => {
      if (typeof props.color === 'string') {
        return props.color
      }
      for (const key in props.color) {
        if (Object.hasOwnProperty.call(props.color, key)) {
          const color = props.color[key]
          if (props.seriesField) {
            // 颜色配置可以是针对值，也可以是全部
            if (type[props.seriesField.name] === key || key === '*') {
              return color
            }
          } else if (columnConfig.value.colorField) {
            if (type[columnConfig.value.colorField] === key || key === '*') {
              return color
            }
          }
        }
      }
    }
    const switchPerCent = () => {
      if (!columnConfig.value.isPercent) {
        columnConfig.value.label.content = (item) => {
          return `${(item[columnConfig.value.yField] * 100).toFixed(2)}%`
        }
        columnConfig.value.meta[props.yField.name].formatter = (x) => {
          return `${(x * 100).toFixed(2)}%`
        }
      } else {
        columnConfig.value.meta[props.yField.name].formatter = props.yField.meta.formatter
        columnConfig.value.label.content = (item) => {
          const formatter = props.yField.meta.formatter
          if (formatter) {
            return `${formatter(item[columnConfig.value.yField])}`
          }
        }
      }
      columnConfig.value.isPercent = !columnConfig.value.isPercent
    }
    if (props.focePercent) {
      switchPerCent()
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
        columnConfig.value.annotations = annotations
      } else {
        delete columnConfig.value.annotations
      }
    }
    targetValueChange()
    watch(props, (nweProps) => {
      if (nweProps.xField !== undefined) {
        columnConfig.value.xField = nweProps.xField.name
      }
      if (nweProps.yField !== undefined) {
        columnConfig.value.yField = nweProps.yField.name
      }
      if (nweProps.seriesField !== undefined) {
        columnConfig.value.seriesField = nweProps.seriesField.name
      }
      if (nweProps.height !== undefined) {
        columnConfig.value.height = nweProps.height
      }
      if (nweProps.isGroup !== undefined) {
        columnConfig.value.isGroup = nweProps.isGroup
      }
      targetValueChange()
    })
    // 处理
    return {
      columnConfig,
      switchPerCent,
      switchShowTable,
      tableColumns,
      showTable
    }
  }
})
</script>
