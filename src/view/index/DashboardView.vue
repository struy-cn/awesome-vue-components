<template>
  <div class="search-box">
    <a-form ref="queryRef" class="ant-advanced-search-form" :model="queryParam"
      @finish="onQueryFinish">
      <a-row :gutter="24">
        <a-col :span="6">
          <a-form-item :name="`projectKey`" :label="`产品线`" :rules="[{ required: false, message: '请选择产品线' }]">
            <a-select :disabled="loading" mode="multiple" :filterOption="filterOption" :max-tag-count="2"
              v-model:value="queryParam.projectKey" placeholder="选择产品线" :allowClear="true">
              <a-select-option value="LA">里阿(LA)</a-select-option>
              <a-select-option value="XT">讯腾(XT)</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item :name="`dateRange`" :label="`时间`" :rules="[{ type: 'array',required: false, message: '请选择时间' }]">
            <DateRange :showQuick="!isFullScreen()" :disabled="loading" v-model:value="dateRange"
              @closeChange="onQueryFinish"></DateRange>
          </a-form-item>
        </a-col>
        <a-col :span="7">
        </a-col>
        <a-col :span="5" style="text-align: right">
          <a-button type="primary" html-type="submit" :disabled="loading">搜索</a-button>
          <a-button style="margin: 0 8px" @click="() => queryRef.resetFields()" :disabled="loading">重置</a-button>
          <a style="font-size: 12px" @click="queryExpand = !queryExpand">
            <template v-if="queryExpand">
              <UpOutlined />
            </template>
            <template v-else>
              <DownOutlined />
            </template>
            更多
          </a>
        </a-col>
      </a-row>
      <a-row>
        <a-col v-show="queryExpand" :span="8">
        </a-col>
      </a-row>
    </a-form>
  </div>
  <a-alert type="warning">
    <template #message>
      <span>一些警告信息...</span>
    </template>
  </a-alert>
  <a-row :gutter="8" style="margin-top: 15px;">
    <a-col :span="12">
      <CommPie :title="`需求耗时分布`" :height="300" :loading="loading"
          :angleField="{ name: 'value', meta: { alias: '耗时' } }"
          :colorField="{ name: 'type', meta: { alias: '类型' } }"
          :dataSource="pieData">
      </CommPie>
    </a-col>
    <a-col :span="12">
      <CommDualAxes title="需求吞吐量" :height="300" :loading="loading" :dataSource="dualAxesData"
          :xField="{ name:'time', meta: { alias: '时间' } }"
          :yField="[{ name: `value`, meta: { alias: '数量' } },{ name: `count`, meta: { alias: '完成率', formatter: (x) => `${x}%`,max:100 } }]"
          columnColor="#f6bd15">
          <template #extra>
          <a href="#">今日</a>
          <a-divider type="vertical" />
          <a href="#">本周</a>
          <a-divider type="vertical" />
          <a href="#">本月</a>
          <a-divider type="vertical" />
          <a href="#">上月</a>
          <a-divider type="vertical" />
          <a href="#">半年</a>
          <a-divider type="vertical" />
          <a href="#">一年</a>
          <a-divider type="vertical" />
        </template>
        </CommDualAxes>
    </a-col>
  </a-row>
  <a-row :gutter="8" style="margin-top: 15px;">
    <a-col :span="12">
      <CommColumn :title="`研发周期分布`" :height="300" :loading="loading"
          :dataSource="columnData"
          :xField="{ name:'year', meta: { alias: '月份' } }"
          :yField="{ name: `value`, meta: { alias: '耗时', formatter: (x) => `${x}` } }"
          :seriesField="{ name: `type`, meta: { alias: '阶段类型' } }"
          :focePercent="false"
          :color="{ '产品阶段': '#fe6b3b','研发阶段': '#f6903d', '测试阶段': '#f6bd15'}">
        </CommColumn>
    </a-col>
    <a-col :span="12">
      <CommLine :title="`缺陷创建&解决趋势`" :height="300"
          :loading="loading"
          :dataSource="lineData"
          :xField="{ name:'year', meta: { alias: '时间' } }"
          :yField="{ name: `value`, meta: { alias: '缺陷数量', formatter: (x) => `${x}` } }"
          :seriesField="{ name: `type`, meta: { alias: '类型' } }"
          :color="{ '创建数': '#fe6b3b', '解决数': '#61DDAA'}">
          <template #extra>
                <MonthRange
                  v-if="bugLineRangeMonthMode"
                  width="207px"
                  size="small"
                  :disabled="loading"
                  v-model:value="bugLineMonthRange"
                  @closeChange="bugLineRangeChange"
                />
               <DateRange v-else v-model:value="bugLineMonthRange" :disabled="loading" :showQuick="false" width="207px" size="small" @closeChange="bugLineRangeChange" ></DateRange>
                <a  @click="bugLineRangeModeSwitch">{{bugLineRangeMonthMode?'按天':'按月'}}筛选</a>
          </template>
        </CommLine>
    </a-col>
  </a-row>
</template>
<script>
import { defineComponent, ref } from 'vue'
import { isFullScreen,filterOption } from '../../util/tools'
import { quickDates,quickMonths } from '../../util/date'
import DateRange from '@/components/date/DateRange'
import CommColumn from '@/components/charts/CommColumn.vue'
import CommPie from '@/components/charts/CommPie.vue'
import MonthRange from '@/components/date/MonthRange.vue'
import CommLine from '@/components/charts/CommLine.vue'
import CommDualAxes from '@/components/charts/CommDualAxes.vue'

const dualAxesData = [
  { time: '1月', value: 350, count: 100 },
  { time: '2月', value: 900, count: 70 },
  { time: '3月', value: 300, count: 85 },
  { time: '4月', value: 450, count: 65 },
  { time: '5月', value: 470, count: 78 },
  { time: '6月', value: 470, count: 60 },
  { time: '7月', value: 470, count: 40 }
]
const dualAxesConfig = {
  height: 300,
  xField: 'time',
  yField: ['value', 'count'],
  meta: {
    time: {
      alias: '时间'
    },
    value: {
      alias: '当月数量'
    },
    count: {
      alias: '当月数量'
    }
  },
  geometryOptions: [
    {
      geometry: 'column'
    },
    {
      geometry: 'line',
      lineStyle: {
        lineWidth: 2
      }
    }
  ]
}
const pieData = [
  { type: '7天内', value: 27 },
  { type: '14天内', value: 40 },
  { type: '30天内', value: 18 },
  { type: '大于30天', value: 15 }
]

const columnData = [
    {
      year: '1月',
      value: 3,
      type: '产品阶段'
    },
    {
      year: '1月',
      value: 4,
      type: '研发阶段'
    },
    {
      year: '1月',
      value: 3.5,
      type: '测试阶段'
    },
    {
      year: '2月',
      value: 5,
      type: '产品阶段'
    },
    {
      year: '2月',
      value: 4.9,
      type: '研发阶段'
    },
    {
      year: '2月',
      value: 6,
      type: '测试阶段'
    },
    {
      year: '3月',
      value: 7,
      type: '产品阶段'
    },
    {
      year: '3月',
      value: 9,
      type: '研发阶段'
    },
    {
      year: '3月',
      value: 13,
      type: '测试阶段'
    },
    {
      year: '4月',
      value: 3,
      type: '产品阶段'
    },
    {
      year: '4月',
      value: 4,
      type: '研发阶段'
    },
    {
      year: '4月',
      value: 3.5,
      type: '测试阶段'
    },
    {
      year: '5月',
      value: 5,
      type: '产品阶段'
    },
    {
      year: '5月',
      value: 4.9,
      type: '研发阶段'
    },
    {
      year: '5月',
      value: 6,
      type: '测试阶段'
    },
    {
      year: '6月',
      value: 7,
      type: '产品阶段'
    },
    {
      year: '6月',
      value: 9,
      type: '研发阶段'
    },
    {
      year: '6月',
      value: 13,
      type: '测试阶段'
    }
  ]

export default defineComponent({
  components: {
    DateRange,
    CommColumn,
    CommPie,
    MonthRange,
    CommLine,
    CommDualAxes
},
  setup() {
    const queryExpand = ref(false)
    const loading = ref(false)
    const queryParam = ref({
      page: 1,
      pageSize: 10
    })
    const dateRange = ref(quickDates.currMonth())
    const onQueryFinish = (values) => {
      loading.value = true
      console.log('Received values of form: ', values)
      console.log('queryParam: ', queryParam)
      setTimeout(() => {
        loading.value = false
      },500)
    }
    const bugLineRangeModeSwitch = () => {
      bugLineRangeMonthMode.value = !bugLineRangeMonthMode.value
      if (bugLineRangeMonthMode.value) {
        bugLineMonthRange.value = quickMonths.lastMonth()
      } else {
        bugLineMonthRange.value = dateRange.value
      }
    }
    const bugLineRangeMonthMode = ref(false)
    const bugLineMonthRange = ref(dateRange.value)
    const lineData = [
      { year: '1月', value: 3, type: '创建数' },
      { year: '2月', value: 4, type: '创建数' },
      { year: '3月', value: 3.5, type: '创建数'},
      { year: '4月', value: 5, type: '创建数'},
      { year: '5月', value: 4.9, type: '创建数' },
      { year: '6月', value: 6, type: '创建数' },
      { year: '7月', value: 7, type: '创建数' },
      { year: '1月', value: 4, type: '解决数'},
      { year: '2月', value: 3, type: '解决数' },
      { year: '3月', value: 2, type: '解决数' },
      { year: '4月', value: 6, type: '解决数' },
      { year: '5月', value: 3, type: '解决数' },
      { year: '6月', value: 2, type: '解决数' },
      { year: '7月', value: 6, type: '解决数' }
    ]
    return {
      queryExpand,
      queryParam,
      loading,
      dateRange,
      lineData,
      bugLineRangeMonthMode,
      bugLineMonthRange,
      pieData,
      dualAxesData,
      dualAxesConfig,
      columnData,
      isFullScreen,
      filterOption,
      onQueryFinish,
      bugLineRangeModeSwitch,
      quickDates
    }
  }
})

</script>
