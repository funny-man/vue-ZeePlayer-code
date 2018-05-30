<template>
  <scroll class="listview"
          :data="data" ref="listview"
          :listenScroll="listenScroll"
          :probeType="probeType"
          @scroll="scroll"
  >
    <ul>
      <li v-for="(group,index) in data" :key="index" ref="listgroup">
        <h4 class="list-group-title">{{ group.title }}</h4>
        <ul>
          <li class="list-group-items" v-for="(item,index) in group.items" :key="index">
            <img class="avatar" v-lazy="item.avatar" alt="">
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item ,index) in shortcutList" :key="index" :data-index="index" :class="{select:index===curIndex}">{{ item }}</li>
      </ul>
    </div>
    <div class="loading-ct"  v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script >
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { getData } from 'common/js/dom'
export default {
  props: {
    data: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      scrollY: -1,
      curIndex: 0
    }
  },
  created() {
    //   this.listenScroll 和this.probeType 是scroll插件的额外配置
    this.listenScroll = true
    this.probeType = 3

    this.touch = {}
    this.listHeight = []
  },
  computed: {
    shortcutList() {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    }
  },
  methods: {
    onShortcutTouchStart(e) {
      let anchorIndex = getData(e.target, 'index')
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex, 500)
    },
    onShortcutTouchMove(e) {
      // console.log(e.pageY)e.pageY的写法只有在safari中有用
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      let delta = (this.touch.y2 - this.touch.y1) / 18 | 0
      let anchorIndex = this.touch.anchorIndex + delta
      this._scrollTo(anchorIndex, 500)
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    _scrollTo(index, x) {
      this.$refs.listview.scrollToElement(this.$refs.listgroup[index], x)
    },
    _calculateHeight() {
      this.listHeight = []
      const list = this.$refs.listgroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  //  观测data的数据变化
  watch: {
    //  检测props中data变化说明获取了数据等dom渲染获取每个listgroup的高度
    data() {
      console.log('获取的歌手数据到了')
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY() {
      console.log('scrollY数据变化了')
      // const listHeight = this.listHeight
      // for (let i = 0; i < listHeight.length; i++) {
      //   let height1 = listHeight[i]
      //   let height2 = listHeight[i + 1]
      // }
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style scoped lang="scss">
@import "~common/sass/variable.scss";
.listview {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  h4 {
    background-color: $color-timeline-loading;
    font-size: $font-size-s-x;
    color: $color-theme-1;
    line-height: 3;
    padding-left: 10px;
  }
  .list-group-items {
    display: flex;
    padding: 10px 0;
    margin: 0 19px;
    align-items: center;
    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
    .name {
      flex: 1;
      margin-left: 14px;
      font-size: $font-size-m;
      color: $color-theme-text-s;
    }
  }
  .list-shortcut {
    position: absolute;
    top: 50%;
    right: 4px;
    transform: translate(0, -50%);
    padding: 10px 0;
    text-align: center;
    border-radius: 20px;
    background-color: rgba(19, 59, 110, 0.3);
    font-size: $font-size-s;
    color: $color-text-l;
    ul {
      li {
        padding: 3px 4px 3px 4px;
        opacity: 0.6;
      }
      .select {
        color: $color-theme-1;
      }
    }
  }
}
</style>