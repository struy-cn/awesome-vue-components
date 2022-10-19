<template>
    <a-range-picker ref="dateRangeRef" :allowClear="allowClear" :allowEmpty="allowEmpty"
        :disabled-date="disabledAfterDate?disabledDate:undefined" :disabled="disabled" v-model:value="dateRange"
        :size="size"
        :value-format="defaultFormat" :style="{width: width}" @change="emitChange"  @openChange="openChange">
        <template #renderExtraFooter>
            <a @click="chnageDateRange(quickDates.lastWeek())">
                <a-tag>上周</a-tag>
            </a>
            <a @click="chnageDateRange(quickDates.currMonth())">
                <a-tag>本月</a-tag>
            </a>
            <a @click="chnageDateRange(quickDates.lastMonth())">
                <a-tag color="success">上个月</a-tag>
            </a>
            <a v-if="dateRange && dateRange.length == 2" @click="chnageDateRange(someMonthLastMonth(dateRange))">
                <a-tag color="success">{{ someMonthLastMonth(dateRange)[0].slice(5, 7) }}月份</a-tag>
            </a>
            <a v-if="dateRange && dateRange.length == 2 && Number(someMonthNextMonth(dateRange)[0].slice(5, 7)) <= currMonth"
                @click="chnageDateRange(someMonthNextMonth(dateRange))">
                <a-tag color="success">{{ someMonthNextMonth(dateRange)[0].slice(5, 7) }}月份</a-tag>
            </a>
            <a @click="chnageDateRange(quickDates.lastHalfYear())">
                <a-tag>近半年</a-tag>
            </a>
        </template>
    </a-range-picker>
    <span style="padding-top: 8px;" v-if="showQuick && !disabled">
        <a @click="chnageDateRange(quickDates.lastMonth())">
            <a-tag color="success">上个月</a-tag>
        </a>
        <a v-if="dateRange && dateRange.length == 2" @click="chnageDateRange(someMonthLastMonth(dateRange))">
            <a-tag color="success">{{ someMonthLastMonth(dateRange)[0].slice(5, 7) }}月份</a-tag>
        </a>
        <a v-if="dateRange && dateRange.length == 2 && Number(someMonthNextMonth(dateRange)[0].slice(5, 7)) <= currMonth"
            @click="chnageDateRange(someMonthNextMonth(dateRange))">
            <a-tag color="success">{{ someMonthNextMonth(dateRange)[0].slice(5, 7) }}月份</a-tag>
        </a>
      </span>
</template>
<script>

import dayjs from 'dayjs'
import { quickDates, someMonthLastMonth, someMonthNextMonth } from '../../util/date'
import { defineComponent, ref, computed } from 'vue'
export default defineComponent({
  props: {
    value: {
      type: Array,
      default: () => {
        return quickDates.currMonth()
      }
    },
    allowClear: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    showQuick: { type: Boolean, default: true },
    disabledAfterDate: { type: Boolean, default: true },
    width: {
      type: [Number, String],
      default: () => {
        return '100%'
      }
    },
    size: { type: String, default: 'default' },
    allowEmpty: {
      type: Array,
      default: () => {
        return [false, false]
      }
    }
  },
  emits: ['changed', 'openChange', 'closeChange', 'update:value'],
  setup (props, ctx) {
    const dateRangeRef = ref()
    const currMonth = ref(Number(dayjs().format('MM')))
    const defaultFormat = ref('YYYY-MM-DD')
    const disabledDate = current => {
      // 不能选择今天之后
      return current && current > dayjs().endOf('day')
    }
    const dateRange = computed({
      get: () => props.value,
      set: (value) => ctx.emit('update:value', value)
    })
    const chnageDateRange = (newData) => {
      dateRange.value = newData
      dateRangeRef.value.blur()
      currMonth.value = Number(dayjs().format('MM'))
      emitChange(newData)
      openChange(false)
    }
    const emitChange = (newData) => {
      if (typeof newData === 'boolean' && !newData) {
        ctx.emit('changed', dateRange.value)
      } else if (typeof newData !== 'boolean') {
        ctx.emit('changed', newData)
      }
    }
    const openChange = (open) => {
      if (open) {
        ctx.emit('openChange', open)
      } else {
        ctx.emit('closeChange', open)
      }
    }
    return {
      dateRangeRef,
      currMonth,
      disabledDate,
      quickDates,
      someMonthLastMonth,
      someMonthNextMonth,
      chnageDateRange,
      emitChange,
      openChange,
      dateRange,
      defaultFormat
    }
  }
})
</script>
