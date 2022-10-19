import dayjs from 'dayjs'

/**
 * 快捷的时间筛选
 */
export const quickDates = {
  currMonth: () => [dayjs().startOf('month').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
  lastWeek: () => [dayjs().subtract(1, 'week').startOf('week').format('YYYY-MM-DD'), dayjs().subtract(1, 'week').endOf('week').format('YYYY-MM-DD')],
  lastMonth: () => [dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'), dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD')],
  lastHalfYear: () => [dayjs().subtract(6, 'month').startOf('month').format('YYYY-MM-DD'), dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD')]
}

/**
 * 快捷的月份
 */
export const quickMonths = {
  lastMonth: () => [dayjs().subtract(1, 'month'), dayjs()],
  lastHalfYear: () => [dayjs().subtract(6, 'month'), dayjs()],
  thisYear: () => [dayjs().startOf('year'), dayjs()],
  lastOneYear: () => [dayjs().subtract(12, 'month'), dayjs()]
}
/**
* 某个月的上个月
*/
export function someMonthLastMonth (dr) {
  let res = quickDates.currMonth()
  if (typeof dr === 'object' & dr.length === 2) {
    const start = dr[0]
    res = [dayjs(start).subtract(1, 'month').startOf('month').format('YYYY-MM-DD'), dayjs(start).subtract(1, 'month').endOf('month').format('YYYY-MM-DD')]
  }
  return res
}

/**
* 某个月的下个月
*/
export function someMonthNextMonth (dr) {
  let res = quickDates.currMonth()
  if (typeof dr === 'object' & dr.length === 2) {
    const start = dr[0]
    const newStart = dayjs(start).add(1, 'month').startOf('month').format('YYYY-MM-DD')
    const newEed = dayjs(start).add(1, 'month').endOf('month').format('YYYY-MM-DD')
    if (dayjs(newStart).format('YYYY') === dayjs().format('YYYY') && Number(dayjs(newStart).format('MM')) < Number(dayjs().format('MM'))) {
      res = [newStart, newEed]
    }
  }
  return res
}

export function dateFormat (dateStr) {
  return dayjs(dateStr).format('YYYY-MM-DD HH:mm:ss')
}

export function nullDateFormat (dataStr) {
  if (dataStr === '1970-01-01') {
    return '-'
  } else {
    return dataStr
  }
}

export function second2Hour (second) {
  return (second / 60 / 60).toFixed(2)
}
