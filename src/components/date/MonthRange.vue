<template>
    <a-range-picker ref="monthRangeRef"
        :allowClear="allowClear"
        :allowEmpty="allowEmpty"
        :disabled-date="disabledAfterMonth?disabledMonth:undefined"
        :disabled="disabled"
        v-model:value="monthRange"
        :size="size"
        :format="defaultFormat"
        :style="{width: width}"
        :mode="rangeMode"
        @panelChange="panelChange"
        @change="emitChange"
        @openChange="openChange">
        <template #renderExtraFooter>
            <a @click="chnageMonthRange(quickMonths.lastHalfYear())">
                <a-tag>近半年</a-tag>
            </a>
            <a @click="chnageMonthRange(quickMonths.thisYear())">
                <a-tag>今年以来</a-tag>
            </a>
            <a @click="chnageMonthRange(quickMonths.lastOneYear())">
                <a-tag>近一年</a-tag>
            </a>
        </template>
    </a-range-picker>
</template>
<script>

import dayjs from 'dayjs'
import { quickMonths, someMonthLastMonth, someMonthNextMonth } from '../../util/date'
import { defineComponent, ref, computed } from 'vue'
export default defineComponent({
  props: {
    value: {
      type: Array,
      default: () => {
        return quickMonths.lastMonth()
      }
    },
    allowClear: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    disabledAfterMonth: { type: Boolean, default: true },
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
    const monthRangeRef = ref()
    const defaultFormat = ref('YYYY-MM')
    const rangeMode = ref(['month', 'month'])
    const disabledMonth = current => {
      // 不能选择这个月之后
      return current && current > dayjs().endOf('month')
    }
    const monthRange = computed({
      get: () => props.value,
      set: (value) => ctx.emit('update:value', value)
    })
    const panelChange = (newData, mode) => {
      monthRange.value = newData
      rangeMode.value = [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]]
      emitChange(newData)
      openChange(false)
    }
    const chnageMonthRange = (newData) => {
      monthRange.value = newData
      monthRangeRef.value.blur()
      emitChange(newData)
      openChange(false)
    }
    const emitChange = (newData) => {
      if (typeof newData === 'boolean' && !newData) {
        ctx.emit('changed', monthRange.value)
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
      monthRangeRef,
      disabledMonth,
      quickMonths,
      someMonthLastMonth,
      someMonthNextMonth,
      chnageMonthRange,
      panelChange,
      emitChange,
      openChange,
      monthRange,
      defaultFormat,
      rangeMode
    }
  }
})
</script>
