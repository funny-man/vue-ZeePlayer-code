<template>
  <div class="music-list">

    <div class="header">
      <div class="back">
        <i class="vue-music-icon icon-narrow" @click="goBack"></i>
      </div>
      <h3 class="title" v-html="title"></h3>
    </div>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="filter" :style="setBlur" ref="filter"></div>
    </div>
    <div class="play-btn" v-show="songs.length">
      <i class="vue-music-icon icon-play-a"></i>
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
      <div class="loading-ct"  v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import Loading from 'base/loading/loading'
import { prefixStyle } from 'common/js/dom'

const NAV_HEIGHT = 44
const transform = prefixStyle('transform')

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
      scrollY: 0,
      blur: 0
    }
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`
    },
    setBlur() {
      console.log(transform)
      return `backdrop-filter:blur(${this.blur}px);-webkit-backdrop-filter:blur(${this.blur}px);`
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
      this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`
      //  判断下滑放大图片
      if (newVal > 0) {
        scale = 1 + percent
        this.$refs.bgImage.style[transform] = `scale(${scale})`
      } else {
        // 定义模糊之的大小
        this.blur = Math.min(20 * percent, 20)
      }
      if (newVal < this.minTranslateY) {
        this.$refs.bgImage.style.zIndex = 1
        this.$refs.bgImage.style.paddingTop = `${NAV_HEIGHT}px`
        this.$refs.filter.style.backgroundColor = `#f54074`
      } else {
        this.$refs.bgImage.style.zIndex = 0
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.filter.style.backgroundColor = ``
      }
    }
  },
  components: {
    Scroll,
    SongList,
    Loading
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
      background: rgba(8, 22, 36, 0.4);
      transition: 1s background-color;
    }
  }
  .play-btn {
    position: fixed;
    z-index: 20;
    bottom: 20px;
    left: 50%;
    border-radius: 50%;
    transform: translate(-50%, 0);
    width: 60px;
    height: 60px;
    text-align: center;
    background-image: radial-gradient(70px at 55px 10px, $color-theme-1, $color-theme-2);
    box-shadow: 0 4px 13px rgba(8, 7, 48, 0.7);
    .icon-play-a {
      font-size: 25px;
      line-height: 60px;
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
    .song-list-wrapper {
      margin-top: 10px;
    }
    .loading-ct {
      width: 100%;
      position: absolute;
      top: 50%;
      transform: translate(0, -50%);
    }
  }
}
</style>