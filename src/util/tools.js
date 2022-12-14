export function fullscreenSwitch (el, openedCallBack, preExitCallBack) {
  const fullscreenElement = document.fullscreenElement
  if (document.fullscreenEnabled) {
    if (fullscreenElement) {
      preExitCallBack()
      document.exitFullscreen()
    } else {
      el.requestFullscreen()
      openedCallBack()
    }
  }
}

/**
 * 是否全屏或者在框架中
 * @returns s
 */
export function isFullScreen () {
  return document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen || (self !== top)
}

/**
 * 
 * a-select 下拉查询
 * @param {当前输入} input 
 * @param {当前选项} option 
 * @returns 
 */
export function filterOption (input, option){
  return option.value.toLowerCase().includes(input.toLowerCase()) || option.children()[0].children.toLowerCase().includes(input.toLowerCase())
}

/**
 * 去重
 * @returns
 */
/* eslint no-extend-native: ["error", { "exceptions": ["Array"] }] */
export function distinct (arr) {
  const result = []
  const obj = {}
  for (const i of arr) {
    if (!obj[i]) {
      result.push(i)
      obj[i] = 1
    }
  }
  return result
}

/**
 * 分组
 * @param {*} datas
 * @param {*} field
 * @returns
 */
export function groupBy (datas, field) {
  return datas.reduce((acc, value) => {
    if (!acc[value[field]]) {
      acc[value[field]] = []
    }
    acc[value[field]].push(value)
    return acc
  }, {})
}
