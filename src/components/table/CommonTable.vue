<template>
    <div>
    <div class="analys-box" v-if="columnNumAnalys">
        <a-row :gutter="10">
          <a-col :span="12">
            <CommPie :title="`${columnNumAnalys.title}-饼图`" :height="250"
            :angleField="{ name: analysSource.value, meta: { alias: '数量' } }" :loading="loading" :colorField="{ name: columnNumAnalys.field, meta: { alias: columnNumAnalys.title } }"
            :dataSource="columnNumAnalys.data">
            </CommPie>
          </a-col>
          <a-col :span="12">
            <CommColumn :loading="loading" :title="`${columnNumAnalys.title}-柱状图`" :height="250"  :dataSource="columnNumAnalys.data"
            :xField="{ name: columnNumAnalys.field, meta: { alias: columnNumAnalys.title } }"
            :yField="{ name: analysSource.value, meta: { alias: '数量', formatter: (x) => `${x}` } }"
            :color="'#61DDAA'">
            </CommColumn>
          </a-col>
        </a-row>
    </div>
    <a-table :columns="columns"
        :pagination="pagination"
        :row-key="rowKey"
        @change="change"
        :data-source="dataSource"
        :loading="loading"
        :scroll="scroll">
        <template #title v-if="exportOpen">
          <a-tooltip>
            <template #title>
              导出下方表格数据，详情页面导出所有数据，不必选择分页大小
            </template>
            <a-button type="dashed" size="small" @click="exportExecl">导出</a-button>
          </a-tooltip>
        </template>
        <template #headerCell="{ title, column }">
            <span>
                {{ title }}
            </span>
            <template v-if="column.desc">
                <a-tooltip>
                <template #title>{{ column.desc }}</template>
                <QuestionCircleOutlined style="margin-left: 3px;" />
                </a-tooltip>
            </template>
            <template v-if="column.analys&&(dataSource&&dataSource.length > 0)">
                <a-popover :title="`${column.title}-分析`" placement="bottomRight">
                    <template #content>
                        <p>
                        <a-radio-group @change="numAnalys(column)" v-model:value="analysSource.value">
                            <a-radio style="display: block" value="num" >不同{{ column.title }}数量分布</a-radio>
                            <a-radio  style="display: block" v-for="numCol in genNumCols()" :value="numCol.dataIndex" :key="numCol.dataIndex">不同{{ column.title }}{{ numCol.title}}分布</a-radio>
                        </a-radio-group>
                        </p>
                    </template>
                    <PieChartOutlined :style="`margin-left: 3px;color: ${columnNumAnalys&&columnNumAnalys.field === column.dataIndex? '#1DA57A':''};`" @click="numAnalysSwitch(column)" />
                </a-popover>
            </template>
        </template>
        <template #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
        <div style="padding: 8px">
          <a-input
            ref="searchInput"
            :placeholder="`搜索 ${column.title}`"
            :value="selectedKeys[0]"
            style="width: 188px; margin-bottom: 8px; display: block"
            @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
            @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)"
          />
          <a-button
            type="primary"
            size="small"
            style="width: 90px; margin-right: 8px"
            @click="handleSearch(selectedKeys, confirm, column.dataIndex)"
          >
            <template #icon><SearchOutlined /></template>
            搜索
          </a-button>
          <a-button size="small" style="width: 90px" @click="handleReset(clearFilters)">
            重置
          </a-button>
        </div>
      </template>
        <template #bodyCell="bodyCell">
            <!-- 加一个和原始slot一样的出口 -->
            <slot name="bodyCell" v-bind="bodyCell"></slot>
        </template>
    </a-table>
    </div>
</template>
<script>

import { defineComponent, ref, watch, onMounted } from 'vue'
import message from 'ant-design-vue/es/message'
import CommPie from '../charts/CommPie.vue'
import CommColumn from '../charts/CommColumn.vue'
import { groupBy } from '../../util/tools'
import * as XLSX from 'xlsx/xlsx.mjs'
import dayjs from 'dayjs'
export default defineComponent({
  components: {
    CommPie,
    CommColumn
  },
  props: {
    columns: { type: Array, default: () => [] },
    blockColumns: { type: Array, default: () => [] },
    exportOpen: { type: Boolean, default: false },
    desc: { type: String, default: '' },
    dataSource: { type: Array, default: () => [] },
    rowKey: { type: Function },
    scroll: { type: Object },
    loading: { type: Boolean, default: false },
    columnAnalys: { type: Boolean, default: false },
    pagination: { type: Object, default: () => { return { showTotal: (total, range) => { return `记录 ${range[0]}-${range[1]}，总计 ${total} 条` }, showSizeChanger: true } } }
  },
  emits: ['change'],
  setup (props, ctx) {
    const columnNumAnalys = ref(undefined)
    const analysSource = ref({ value: undefined })
    const searchText = ref('')
    const searchedColumn = ref('')
    const searchInput = ref()
    const numAnalys = (column) => {
      columnNumAnalys.value = {}
      columnNumAnalys.value.title = column.title
      columnNumAnalys.value.field = column.dataIndex
      columnNumAnalys.value.data = []
      const groupByValues = groupBy(props.dataSource, column.dataIndex)
      if (analysSource.value.value === 'num') {
        columnNumAnalys.value.title = `不同${columnNumAnalys.value.title}数量分布`
      } else {
        const addTitle = props.columns.find(x => x.dataIndex === analysSource.value.value).title
        columnNumAnalys.value.title = `不同${columnNumAnalys.value.title}${addTitle}分布`
      }
      for (const value in groupByValues) {
        const obj = {}
        obj[column.dataIndex] = value
        if (analysSource.value.value === 'num') {
          obj.num = groupByValues[value].length
        } else {
          const datas = groupByValues[value]
          obj[analysSource.value.value] = datas.map(x => x[analysSource.value.value]).reduce((a, b) => a + b)
        }
        columnNumAnalys.value.data.push(obj)
      }
    }
    const numAnalysSwitch = (column) => {
      if (columnNumAnalys.value && columnNumAnalys.value.field === column.dataIndex) {
        columnNumAnalys.value = undefined
        analysSource.value.value = undefined
      }
    }
    const genNumCols = () => {
      const numCols = []
      try {
        if (props.dataSource && props.dataSource.length > 0) {
        // 可排序的字段缩小计算范围
          const sorter = props.columns.filter(x => Object.hasOwnProperty.call(x, 'sorter'))
          const anyData = props.dataSource[0]
          for (const index in sorter) {
          // 至少是数字字段
            if (!isNaN(anyData[sorter[index].dataIndex])) {
              numCols.push(sorter[index])
            }
          }
        }
        return numCols
      } catch (e) {
        console.log(e)
        return numCols
      }
    }
    const change = (e) => {
      ctx.emit('change', e)
    }

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm()
      searchText.value = selectedKeys[0]
      searchedColumn.value = dataIndex
    }

    const handleReset = clearFilters => {
      clearFilters({
        confirm: true
      })
      searchText.value = ''
    }
    const exportExecl = () => {
      const newDataSource = props.dataSource.map(data => {
        const newData = {}
        for (const key in data) {
          if (!props.blockColumns.includes(key)) {
            const field = props.columns.find(col => col.dataIndex === key)
            let fieldV = data[key]
            if (fieldV instanceof Array && fieldV.length > 0) {
              // 字符串需要拼接
              if (typeof fieldV[0] === 'string') {
                fieldV = fieldV.reduce((a, b) => `${a},${b}`)
              } else {
                console.warn('export field is not string', key, fieldV)
              }
            } else if (typeof fieldV === 'boolean') {
              fieldV = fieldV ? '是' : '否'
            }
            if (field && field.title) {
              newData[field.title] = fieldV
            } else {
              if (!(fieldV instanceof Array)) {
                newData[key] = fieldV
              }
            }
          }
        }
        return newData
      })
      if (newDataSource.length === 0) {
        message.warning('暂无数据可导出!')
        return
      }
      const worksheet = XLSX.utils.json_to_sheet(newDataSource)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, '导出数据')
      XLSX.writeFile(workbook, `export${props.desc ? `-${props.desc}` : ''}-${dayjs().format('YYYY-MM-DD_HHmm')}.xlsx`)
    }
    onMounted(() => {
    })
    watch(props, () => {
      columnNumAnalys.value = undefined
      analysSource.value.value = undefined
    })
    return {
      columnNumAnalys,
      searchText,
      searchedColumn,
      searchInput,
      handleSearch,
      handleReset,
      numAnalys,
      numAnalysSwitch,
      analysSource,
      genNumCols,
      change,
      exportExecl
    }
  }
})
</script>
<style>
.ant-table-column-sorter,.ant-table-filter-trigger{
    margin-left: 2px ;
}
.analys-box{
    margin-bottom: 15px;
}
</style>
