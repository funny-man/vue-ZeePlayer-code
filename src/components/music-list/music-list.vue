<template>
  <div class="music-list">
    <div class="header">
      <div class="back">
        <i class="vue-music-icon icon-narrow" @click="goBack"></i>
      </div>
      <div class="play" v-show="showPlay">
        <i class="vue-music-icon icon-play-a"></i>
      </div>
      <h3 class="title" v-html="title"></h3>
    </div>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-btn" v-show="songs.length" ref="playBtn">
        <i class="vue-music-icon icon-play-a"></i>
        <span>随机播放</span>
      </div>
      <div class="filter" :style="setBlur" ref="filter"></div>
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
        <song-list :songs="songs" @seletc="selectItem"></song-list>
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
import { mapActions, mapMutations } from 'vuex'
import { getSongKey } from 'api/song-key'
import { ERR_OK } from 'api/jsonp-data-config'

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
      blur: 0,
      showPlay: false
    }
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`
    },
    setBlur() {
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
    },
    selectItem(item, index) {
      this._getSongKey(item.mid)
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    _getSongKey(id) {
      getSongKey(id).then(res => {
        if (res.code === ERR_OK) {
          console.log(res.data.items[0])
          this.setSongKey(res.data.items[0])
        }
      })
    },
    ...mapActions([
      'selectPlay'
    ]),
    ...mapMutations({
      setSongKey: 'SET_SONG_KEY'
    })
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
        this.$refs.playBtn.style.bottom = `1000px`
        this.showPlay = true
      } else {
        this.$refs.bgImage.style.zIndex = 0
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.filter.style.backgroundColor = ``
        this.$refs.playBtn.style.bottom = `20px`
        this.showPlay = false
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
    color: #fff;
    .back {
      position: absolute;
      padding-left: 10px;
      .icon-narrow {
        display: inline-block;
        font-size: 26px;
        padding: 9px;
        transform: rotate(45deg);
      }
    }
    .play {
      position: absolute;
      right: 0;
      padding-right: 10px;
      .icon-play-a {
        display: inline-block;
        font-size: 26px;
        padding: 9px;
      }
    }
    .title {
      display: inline-block;
      line-height: 44px;
      font-size: $font-size-m;
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
    .play-btn {
      position: absolute;
      z-index: 20;
      bottom: 20px;
      left: 50%;
      transform: translate(-50%, 0);
      padding: 8px 16px;
      text-align: center;
      background-image: radial-gradient(
        150px at 100px 0px,
        $color-theme-1,
        $color-theme-2
      );
      border-radius: 100px;
      box-shadow: 0 4px 13px rgba(8, 7, 48, 0.7);
      .icon-play-a {
        display: inline-block;
        vertical-align: middle;
        font-size: 20px;
        opacity: 0.7;
      }
      > span {
        display: inline-block;
        vertical-align: middle;
        font-size: $font-size-s-x;
        opacity: 0.7;
      }
    }
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