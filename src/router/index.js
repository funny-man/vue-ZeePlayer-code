import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 首页的4个tab页
// import Essence from 'components/essence/essence'
// import Singer from 'components/singer/singer'
// import Ranking from 'components/ranking/ranking'
// import Search from 'components/search/search'
// import UserCenter from 'components/user-center/user-center'
// 二级路由界面
// import SingerDetail from 'components/singer-detail/singer-detail'
// import Disc from 'components/disc/disc'
// import TopList from 'components/top-list/top-list'

// 上面的写法换成下面这种让路由按需加载减少首次加载的速度
const Essence = (resolve) => {
  import('components/essence/essence').then((module) => {
    resolve(module)
  })
}
const Singer = (resolve) => {
  import('components/singer/singer').then((module) => {
    resolve(module)
  })
}
const Ranking = (resolve) => {
  import('components/ranking/ranking').then((module) => {
    resolve(module)
  })
}
const Search = (resolve) => {
  import('components/search/search').then((module) => {
    resolve(module)
  })
}
const UserCenter = (resolve) => {
  import('components/user-center/user-center').then((module) => {
    resolve(module)
  })
}
const SingerDetail = (resolve) => {
  import('components/singer-detail/singer-detail').then((module) => {
    resolve(module)
  })
}
const Disc = (resolve) => {
  import('components/disc/disc').then((module) => {
    resolve(module)
  })
}
const TopList = (resolve) => {
  import('components/top-list/top-list').then((module) => {
    resolve(module)
  })
}

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
      component: Ranking,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/search',
      name: 'Search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/user',
      name: 'UserCenter',
      component: UserCenter
    }
  ]
})
