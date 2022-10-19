import axios from 'axios'
import notification from 'ant-design-vue/es/notification'

// 创建 axios 实例
const API = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // api base_url
  timeout: 60000 // 请求超时时间
})
const err = (error) => {
  console.log('request error:', error)
  if (error.response) {
    const data = error.response.data
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
    }
  }
  return Promise.reject(error)
}

// request interceptor
API.interceptors.request.use(config => {
  // console.log('请求拦截', config.baseURL, config.url, config.params, config.data)
  return config
}, err)

// response interceptor
API.interceptors.response.use((response) => {
  if (response.status === 200) {
    // console.log('响应拦截', response.data)
    return response.data
  }
}, err)
export default API
