<template>
  <div id="singer">
    <list-view :data="singerData"></list-view>
  </div>
</template>

<script >
import listView from 'base/listview/listview'
import { getSinger } from 'api/singer'
import Singer from 'common/js/singer'
import { ERR_OK } from 'api/jsonp-data-config'

export default {
  data: function () {
    return {
      singerData: []
    }
  },
  created() {
    this._getSinger()
  },
  methods: {
    _getSinger() {
      getSinger().then(res => {
        if (res.code === ERR_OK) {
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
        if (index < 10) {
          map.hot.items.push(new Singer(item.Fsinger_id, item.Fsinger_name, item.Fsinger_mid))
        }
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer(item.Fsinger_id, item.Fsinger_name, item.Fsinger_mid))
      })
      //  处理map把数据分组
      let hot = []
      let ret = []
      let other = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === '热门') {
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
    }
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
  background-color: $color-timeline;
  .loading-ct {
    width: 100%;
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
  }
}
</style>