<template>
  <div class="music-list">

    <div class="header">
      <div class="back">
        <i class="vue-music-icon icon-narrow" @click="goBack"></i>
      </div>
      <h3 class="title" v-html="title"></h3>
    </div>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll
      class="list"
      ref="list"
      :data="songs"
      :listenScroll="listenScroll"
      :probeType="probeType"
      @scroll="scroll"
    >
      <div class="song-list-wrapper">
        <song-list :songs="songs"></song-list>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'

const NAV_HEIGHT = 44

export default {
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      scrollY: 0
    }
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`
    }
  },
  created() {
    this.listenScroll = true
    this.probeType = 3
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minTranslateY = -(this.imageHeight - NAV_HEIGHT)
    this.$refs.list.$el.style.top = `${this.$refs.bgImage.clientHeight}px`
  },
  methods: {
    goBack() {
      this.$router.push(`/singer`)
    },
    scroll(pos) {
      this.scrollY = pos.y
    }
  },
  watch: {
    scrollY(newVal) {
      let translateY = Math.max(this.minTranslateY, newVal)
      let scale = 1
      let percent = Math.abs(newVal / this.imageHeight)
      let blur = 0

      this.$refs.layer.style['transform'] = `translate3d(0,${translateY}px,0)`
      this.$refs.layer.style['webkitTransform'] = `translate3d(0,${translateY}px,0)`
      //  判断下滑放大图片
      if (newVal > 0) {
        scale = 1 + percent
        this.$refs.bgImage.style['transform'] = `scale(${scale})`
        this.$refs.bgImage.style['webkitTransform'] = `scale(${scale})`
      } else {
        // 定义模糊之的大小
        blur = Math.min(20 * percent, 20)
      }
      if (newVal < this.minTranslateY) {
        this.$refs.bgImage.style.zIndex = 1
        this.$refs.bgImage.style.paddingTop = `${NAV_HEIGHT}px`
      } else {
        this.$refs.bgImage.style.zIndex = 0
        this.$refs.bgImage.style.paddingTop = '70%'
      }
      // 高斯模糊功能仅限ios使用；安卓上没有效果也不影响
      this.$refs.filter.style['backdrop-filter'] = `blur(${blur}px)`
      this.$refs.filter.style['wibkitBackdrop-filter'] = `blur(${blur}px)`
      console.log(this.$refs.filter.style)
    }
  },
  components: {
    Scroll,
    SongList
  }
}
</script>
<style scoped lang="scss">
@import "~common/sass/variable";
.music-list {
  position: fixed;
  z-index: 20;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: $color-bg;
  .header {
    position: fixed;
    left: 0;
    right: 0;
    z-index: 2;
    text-align: center;
    .back {
      position: absolute;
      padding-left: 10px;
      .icon-narrow {
        display: inline-block;
        font-size: 26px;
        color: #fff;
        padding: 9px;
        transform: rotate(45deg);
      }
    }
    .title {
      display: inline-block;
      line-height: 44px;
    }
  }
  .bg-image {
    position: relative;
    z-index: 0;
    width: 100%;
    // 由于padding尺寸用百分比是按照宽度来算的所以这里可以代替高度设置比例
    padding-top: 70%;
    background-size: cover;
    transform-origin: top;
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
      // backdrop-filter:blur(3.153598335759268px);
    }
  }
  .bg-layer {
    position: relative;
    height: 100%;
    background-color: $color-bg;
  }
  .list {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    // overflow: hidden;
  }
}
</style>