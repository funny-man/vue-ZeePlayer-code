<template>
  <scroll class="listview"
          :data="data"
          ref="listview"
          :listenScroll="listenScroll"
          :probeType="probeType"
          @scroll="scroll"
  >
    <ul ref="listct">
      <li v-for="(group,index) in data" :key="index" ref="listgroup">
        <h4 class="list-group-title">{{ group.title }}</h4>
        <ul>
          <li  @click="selectItem(item)" class="list-group-items" v-for="item in group.items" :key="item.id">
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
    <div class="fixed-title-ct" v-show="scrollY<=0" ref="fixed">
      <h4 class="fixed-title">{{  fixedTitle }}</h4>
    </div>
    <div class="loading-ct"  v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { getData } from 'common/js/dom'
//  设置常量
const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 36

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
      curIndex: 0,
      diff: 0,
      fixedTop: 0
    }
  },
  created() {
    //   this.listenScroll 和this.probeType 是scroll插件的额外配置
    this.listenScroll = true
    this.probeType = 3

    this.touch = {}
    this.listGroupHeight = []
  },
  computed: {
    shortcutList() {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle() {
      return this.data[this.curIndex] ? this.data[this.curIndex].title : ''
    }
  },
  methods: {
    refresh() {
      this.$refs.listview.refresh()
    },
    selectItem(item) {
      this.$emit('select', item)
    },
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
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      let anchorIndex = this.touch.anchorIndex + delta
      this._scrollTo(anchorIndex, 500)
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    _scrollTo(index, x) {
      if (index === null) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.listGroupHeight.length - 2) {
        index = this.listGroupHeight.length - 2
      }
      this.$refs.listview.scrollToElement(this.$refs.listgroup[index], x)
    },
    _calculateHeight() {
      // 设置歌手每个listgroup的高度
      this.listGroupHeight = []
      const list = this.$refs.listgroup
      let height = 0
      this.listGroupHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        // 遍历listgroup
        let item = list[i]
        // 获取每个group底部到最定点的高度
        height += item.clientHeight
        this.listGroupHeight.push(height)
      }
    }
  },
  //  观测data的数据变化
  watch: {
    //  检测props中data变化说明获取了数据等dom渲染获取每个listgroup的高度
    data() {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY(newY) {
      const listGroupHeight = this.listGroupHeight
      //  newY大于0相当于在顶部还是往下拉
      if (newY > 0) {
        this.curIndex = 0
        return
      }
      // 正常滚动
      for (let i = 0; i < listGroupHeight.length - 1; i++) {
        let height1 = listGroupHeight[i]
        let height2 = listGroupHeight[i + 1]
        if ((height1 = -newY || height1 < -newY) && -newY < height2) {
          this.curIndex = i
          this.diff = height2 + newY
          return
        }
      }
    },
    diff(newVal) {
      let fixedTop = (this.diff > 0 && this.diff < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      // 这里我们可以利用v:bind绑定style设置top值或者dom操作设置top值也是能实现的
      // 这里使用transform偏移是由于transform的性能好点
      // 使用translate3d可以开启gpu加速
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
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
  > ul {
    // padding-bottom: 76px;
    .list-group-title {
      background-color: #1c2230;
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
  }
  .list-shortcut {
    position: absolute;
    top: 50%;
    right: 4px;
    transform: translate(0, -50%);
    z-index: 2;
    padding: 10px 0;
    text-align: center;
    border-radius: 20px;
    background-color: rgba(19, 59, 110, 0.3);
    font-size: $font-size-s;
    color: $color-text-l;
    ul {
      li {
        padding: 3px 5px 3px 5px;
        opacity: 0.6;
      }
      .select {
        color: $color-theme-1;
      }
    }
  }
  .fixed-title-ct {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    .fixed-title {
      background-color: #1c2230;
      font-size: $font-size-s-x;
      color: $color-theme-1;
      width: 100%;
      line-height: 3;
      padding-left: 10px;
    }
  }
}
</style>