<template>
  <div class="music-list">
    <div class="back">
      <i class="vue-music-icon icon-narrow" @click="goBack"></i>
    </div>
    <h3 class="title" v-html="title"></h3>
    <div class="bg-image" :style="bgStyle">
      <div class="filter"></div>
    </div>
    <scroll class="list" :data="songs">
      <div class="song-list-wrapper">
        <song-list :songs="songs"></song-list>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'

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
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`
    }
  },
  methods: {
    goBack() {
      this.$router.push(`/singer`)
    }
  },
  components: {
    Scroll,
    SongList
  },
  created() {
    console.log(this.title)
    console.log(this.bgImage)
    setTimeout(() => {
      console.log(this.songs)
    }, 1000)
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
  .back {
    .icon-narrow {
      float: left;
      font-size: 26px;
      line-height: 44px;
      margin-left: 19px;
      color: #fff;
      transform: rotate(45deg);
    }
  }
  .bg-image {
    width: 100%;
    // 由于padding尺寸用百分比是按照宽度来算的所以这里可以代替高度设置比例
    padding-top: 70%;
    background-size: cover;
    transform-origin: top;
  }
  .list{
    height: 200px;
    width: 100%;
    // height: 100%;
    overflow: hidden;
    // position: relative;
    background-color: #fff;
  }
}
</style>