export const fieldSuffix = (value, suffix) => {
  return value ? `${value}${suffix}` : '0'
}
export const fieldSuffixDay = (value) => {
  return value !== -999 ? `${value}天` : '-'
}
export const fieldSuffixRen = (value) => {
  return value ? `${value}人` : '0人'
}
export const fieldSuffixRate = (value) => {
  return value !== -999 ? `${value}%` : '-'
}
export const fieldSuffixNum = (value) => {
  return value ? `${value}次` : '0次'
}

export const fieldSuffixhour = (value) => {
  return value ? `${value}h` : '0h'
}
