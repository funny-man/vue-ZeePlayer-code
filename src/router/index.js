import Vue from 'vue'
import Router from 'vue-router'
import Essence from 'components/essence/essence'
import Singer from 'components/singer/singer'
import Ranking from 'components/ranking/ranking'
import Search from 'components/search/search'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/essence'
    },
    {
      path: '/essence',
      name: 'Essence',
      component: Essence
    },
    {
      path: '/singer',
      name: 'Singer',
      component: Singer
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
