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
        <div class="switches-wrapper">
          <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
        </div>
        <div class="list-wrapper">
          <scroll class="play-history" v-show="currentIndex===0" ref="playHistoryList" :data="playHistory" :refreshTime="refreshTime">
            <div class="song-list-ct">
              <song-list :songs="playHistory" @seletc="selectSong"></song-list>
            </div>
          </scroll>
          <scroll class="search-history" v-show="currentIndex===1" ref="searchHistoryList" :data="searchHistory" :refreshTime="refreshTime">
            <div class="search-list-ct">
              <search-list :searches="searchHistory" @select="addKeyWord" @delete="deleteOneSearch"></search-list>
            </div>
          </scroll>
        </div>
        <div class="sousuolishi"></div>
      </div>
      <div class="search-result" v-show="keyWord">
        <Suggest :keyWord="keyWord" :showSinger="showSinger" :isFullScreen="false" @listScroll="blurInput" @select="selectSuggest"></Suggest>
      </div>
      <div class="top-tip-ct">
        <top-tip class="top-tip-ct" ref="topTip" :delay="1000">
          <p>已添加到播放列表</p>
        </top-tip>
      </div>
    </div>
  </transition>
</template>
<script type="text/ecmascript-6">
import SearchBox from 'base/search-box/search-box'
import Suggest from 'components/suggest/suggest'
import Switches from 'base/switches/switches'
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import SearchList from 'base/search-list/search-list'
import TopTip from 'base/top-tip/top-tip'
import { searchMixin } from 'common/js/mixin'
import { normalizeSong } from 'common/js/song'

import { mapGetters, mapActions } from 'vuex'

export default {
  mixins: [searchMixin],
  data() {
    return {
      showFlag: false,
      showSinger: false,
      switches: [
        { name: '最近播放' },
        { name: '搜索历史' }
      ],
      currentIndex: 0,
      refreshTime: 100
    }
  },
  computed: {
    ...mapGetters([
      'playHistory',
      'searchHistory',
      'currentSong'
    ])
  },
  methods: {
    show() {
      this.showFlag = true
      setTimeout(() => {
        if (this.currentIndex === 0) {
          this.$refs.playHistoryList.refresh()
        } else {
          this.$refs.searchHistoryList.refresh()
        }
      }, 20)
    },
    hide() {
      this.showFlag = false
    },
    selectSong(song, index) {
      if (index !== 0) {
        song = normalizeSong(song)
        this.insertSong({ song, isFullScreen: false })
        this.$refs.topTip.show()
      }
    },
    selectSuggest() {
      this.$refs.topTip.show()
      this.saveSearch()
    },
    switchItem(index) {
      this.currentIndex = index
    },
    deleteOneSearch(key) {
      this.deleteSearchHistory(key)
    },
    ...mapActions([
      'insertSong'
    ])
  },
  watch: {
    // searchHistory() {
    //   setTimeout(() => {
    //     this.$refs.searchHistoryList.refresh()
    //   }, 20)
    // },
    keyWord(newVal) {
      if (newVal) return
      setTimeout(() => {
        if (this.currentIndex === 0) {
          this.$refs.playHistoryList.refresh()
        } else {
          this.$refs.searchHistoryList.refresh()
        }
      }, 20)
    },
    currentIndex(newVal) {
      setTimeout(() => {
        if (newVal === 0) {
          this.$refs.playHistoryList.refresh()
        } else {
          this.$refs.searchHistoryList.refresh()
        }
      }, 20)
    }
  },
  components: {
    SearchBox,
    SongList,
    SearchList,
    Scroll,
    Switches,
    TopTip,
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
  .shortcut {
    .switches-wrapper {
      // width: 100%;
      margin-top: 15px;
    }
    .list-wrapper {
      position: fixed;
      top: 155px;
      bottom: 0;
      width: 100%;
      overflow: hidden;
      .play-history {
        width: 100%;
        height: 100%;
      }
      .search-history {
        height: 100%;
        margin: 0 15px;
      }
    }
  }
  .search-result {
    position: fixed;
    top: 96px;
    bottom: 0;
    width: 100%;
  }
  .top-tip-ct {
    text-align: center;
    font-size: $font-size-m;
    color: #fff;
    line-height: 44px;
  }
}
</style>