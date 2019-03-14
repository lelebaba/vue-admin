import Vue from 'vue';
import Router from 'vue-router';
import Login from '../views/Login.vue';
import NotFound from '../views/404.vue';
import Home from '../views/Home.vue';
import Table from '../views/nav1/Table.vue';
import Form from '../views/nav1/Form.vue';
import User from '../views/nav1/User.vue';
import Echarts from '../views/charts/Echarts.vue'
import Comp from '../views/nav2/comp.vue'
import Device from '../views/nav2/device.vue'
import Server from '../views/nav2/server.vue'
import sysUser from '../views/nav2/sysUser.vue'

Vue.use(Router);

let routes = [
  {
    path: '/login',
    component: Login,
    name: '登录',
    hidden: true,
  },
  {
    path: '/404',
    component: NotFound,
    name: '出错啦',
    hidden: true,
  },
  //{ path: '/main', component: Main },
  {
    path: '/',
    component: Home,
    name: '物联云平台',

    // 图标样式class
    iconCls: 'el-icon-message',
    children: [
      // { path: '/main', component: Main, name: '主页', hidden: true },
      { path: 'table', component: Table, name: '控制面板' },
      { path: 'form', component: Form, name: '数据列表' }
    ],
  },
  {
      path: '/',
      component: Home,
      name: '系统管理',
      iconCls: 'fa fa-id-card-o',
      children: [
          { path: 'comp', component: Comp, name: '公司管理' },
					{ path: 'sysUser', component: sysUser, name: '用户管理' },
					{ path: 'server', component: Server, name: '服务器管理' },
          { path: 'device', component: Device, name: '设备管理' }
      ]
  },
  // {
  //     path: '/',
  //     component: Home,
  //     name: '',
  //     iconCls: 'fa fa-address-card',
  //     leaf: true,//只有一个节点
  //     children: [
  //         { path: '/page6', component: Page6, name: '导航三' }
  //     ]
  // },
  {
    path: '/',
    component: Home,
    name: 'Charts',
    iconCls: 'fa fa-bar-chart',
    children: [
      { path: 'echarts', component: Echarts, name: 'echarts' }
    ]
  },
  {
      path: '*',
      hidden: true,
      redirect: { path: '/404' }
  }
];

export default new Router({
	routes,
});
