<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <div class="title">
          <h3 class="text">添加歌曲到列表</h3>
        </div>
        <div class="close" @click="hide">
          <i class="vue-music-icon icon-icon-test"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box  ref="searchBox" :inputPrompt="'搜索歌曲'" @query="keyWordChange"></search-box>
      </div>
      <div class="shortcut" v-show="!keyWord">
      </div>
      <div class="search-result" v-show="keyWord">
        <Suggest :keyWord="keyWord" :showSinger="showSinger" @listScroll="blurInput" @select="saveSearch"></Suggest>
      </div>
    </div>
  </transition>
</template>
<script type="text/ecmascript-6">
import SearchBox from 'base/search-box/search-box'
import Suggest from 'components/suggest/suggest'

import { searchMixin } from 'common/js/mixin'
export default {
  mixins: [searchMixin],
  data() {
    return {
      showFlag: false,
      showSinger: false
    }
  },
  methods: {
    show() {
      this.showFlag = true
      // setTimeout(() => {
      //   if (this.currentIndex === 0) {
      //     this.$refs.songList.refresh()
      //   } else {
      //     this.$refs.searchList.refresh()
      //   }
      // }, 20)
    },
    hide() {
      this.showFlag = false
    }
    // selectSong(song, index) {
    //   if (index !== 0) {
    //     this.insertSong(new Song(song))
    //     this.$refs.topTip.show()
    //   }
    // },
    // selectSuggest() {
    //   this.$refs.topTip.show()
    //   this.saveSearch()
    // },
    // switchItem(index) {
    //   this.currentIndex = index
    // },
    // ...mapActions([
    //   'insertSong'
    // ])
  },
  components: {
    SearchBox,
    // SongList,
    // SearchList,
    // Scroll,
    // Switches,
    // TopTip,
    Suggest
  }
}
</script>
<style scoped lang="scss">
@import "~common/sass/variable";

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}
.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
.add-song {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: $color-bg;
  .header {
    position: relative;
    height: 44px;
    // background-color: #252d3f;
    text-align: center;
    line-height: 44px;
    .title {
      margin: 0 44px;
      font-size: $font-size-m;
      color: $color-theme-text-s;
    }
    .close {
      position: absolute;
      top: 0;
      right: 0;
      width: 44px;
      font-size: $font-size-l;
      color: $color-theme-text-s;
    }
  }
  .search-box-wrapper {
    padding-top: 10px;
  }
  .search-result {
    position: fixed;
    top: 96px;
    bottom: 0;
    width: 100%;
  }
}
</style>