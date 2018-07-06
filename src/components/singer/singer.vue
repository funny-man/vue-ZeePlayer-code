<template>
  <div id="singer" ref="singer">
    <list-view :data="singerData" @select="selectSinger" ref="list"></list-view>
    <transition name="slide-fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import listView from 'base/listview/listview'
import { getSinger } from 'api/singer'
import Singer from 'common/js/singer'
import { ERR_OK } from 'api/jsonp-data-config'
import { mapMutations } from 'vuex'
import { playlistMixin } from 'common/js/mixin'

const HOT_SINGER_LEN = 10
const HOT_NAME = '热门'

export default {
  mixins: [playlistMixin],
  data: function () {
    return {
      singerData: []
    }
  },
  created() {
    this._getSinger()
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '74px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.list.refresh()
    },
    selectSinger(singer) {
      //  this.$router是router的编程式的跳转接口
      //  前面tab的跳转用的是<router-link tag="div" class="tab-item" to="/essence">
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      console.log('setSinger:')
      console.log(singer)
      this.setSinger(singer)
    },
    _getSinger() {
      getSinger().then(res => {
        if (res.code === ERR_OK) {
          console.log('getSingers:')
          console.log(res.data)
          this.singerData = this._normalizeSinger(res.data.list)
        }
      })
    },
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: '热门',
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer(item.Fsinger_name, item.Fsinger_mid))
        }
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer(item.Fsinger_name, item.Fsinger_mid))
      })
      //  处理map把数据分组
      let hot = []
      let ret = []
      let other = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        } else {
          val.title = '#'
          other.push(val)
        }
      }
      //  把其他的数据汇总成title为'#'的数组里面
      let otherMerge = {
        items: [],
        title: '#'
      }
      other.forEach((v, index) => {
        otherMerge.items = otherMerge.items.concat(v.items)
      })
      // 排序abcd...
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(otherMerge, ret)
    },
    ...mapMutations({
      // 将 `this.setSinger()` 映射为 `this.$store.commit('SET_SINGER')`
      // vuex提供的语法糖可以吧commit的方法使用组件内部的方法调用
      setSinger: 'SET_SINGER'
    })
  },
  components: {
    listView
  }
}
</script>

<style scoped lang="scss">
@import "~common/sass/variable.scss";
#singer {
  position: fixed;
  width: 100%;
  top: 113px;
  bottom: 0;
  // overflow: hidden;
  // background-color: #101622;
  .loading-ct {
    width: 100%;
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
  }
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}
.slide-fade-enter, .slide-fade-leave-to /* .slide-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  // transform: translate3d(100%,0,0)
  transform: scale(0);
}
</style>