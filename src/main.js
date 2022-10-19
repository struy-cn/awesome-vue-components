import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import App from './App.vue'
import 'ant-design-vue/dist/antd.less'
import routes from './routes/router.config'
import { createRouter, createWebHashHistory } from 'vue-router'
import * as Icons from '@ant-design/icons-vue'

const app = createApp(App)

const router = createRouter({
    history: createWebHashHistory(),
    routes // `routes: routes` 的缩写
})
router.beforeEach((to, from, next) => {
    window.document.title = `${to.meta.title}`
    next()
})
// 注册图标组件
for (const i in Icons) {
    app.component(i, Icons[i])
}
app.use(Antd)
app.use(router)
app.mount('#app')
