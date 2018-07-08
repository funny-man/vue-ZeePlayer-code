import Vue from 'vue'
import Router from 'vue-router'
// 首页的4个tab页
import Essence from 'components/essence/essence'
import Singer from 'components/singer/singer'
import Ranking from 'components/ranking/ranking'
import Search from 'components/search/search'
// 二级路由界面
import SingerDetail from 'components/singer-detail/singer-detail'
import Disc from 'components/disc/disc'

Vue.use(Router)

export default new Router({
  routes: [
    {
      //  这个路由设置首次进入页面默认进入/essence路由下的页面
      path: '/',
      redirect: '/essence'
    },
    {
      path: '/essence',
      name: 'Essence',
      component: Essence,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      name: 'Singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/ranking',
      name: 'Ranking',
      component: Ranking
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    }
  ]
})
