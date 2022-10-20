import BaseLayout from '../layout/BaseLayout'
import RouterView from '../layout/RouterView'

const routes = [
  {
    path: '/',
    name: 'index',
    meta: { title: '首页' },
    component: BaseLayout, // 此处一定不能用 component: () => import(xx) ,基础布局不能懒加载
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: RouterView,
        redirect: '/index/dashboard',
        meta: { title: '图表', icon: 'fund-projection-screen-outlined' },
        children: [
          {
            path: '/index/dashboard',
            name: 'index-dashboard',
            component: () => import('@/view/index/DashboardView'),
            meta: { title: '常用图表', icon: 'bar-chart-outlined' }
          },
          {
            path: '/index/table',
            name: 'index-table',
            component: RouterView,
            meta: { title: '数据表格', icon: 'table-outlined' }
          }
        ]
      },
      {
        path: '/editor',
        name: 'editor',
        component: RouterView,
        redirect: '/index/editor',
        meta: { title: '编辑器', icon: 'fund-projection-screen-outlined' },
        children: [
          {
            path: '/index/editor',
            name: 'index-editor',
            component: RouterView,
            meta: { title: '代码编辑器', icon: 'bar-chart-outlined' }
          }
        ]
      }
    ]
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/view/error/NotFound')
  },
  {
    path: '/without/:link',
    name: 'without',
    component: () => import('@/view/without/WithOutPage')
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/404'
  }
]

export default routes
