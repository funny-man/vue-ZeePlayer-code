<template>
  <transition name="slide">
    <div class="user-center">
      <div class="header">
        <div class="back" @click="back">
          <i class="vue-music-icon icon-narrow"></i>
        </div>
        <div class="switches-wrapper">
          <switches @switch="switchItem" :switches="switches" :currentIndex="currentIndex"></switches>
        </div>
      </div>
      <div class="play-btn-ct" v-show="showBtn" @click="random">
        <div class="play-btn" ref="playBtn">
          <i class="vue-music-icon icon-play-a"></i>
          <span>随机播放</span>
        </div>
      </div>
      <div class="list-wrapper">
        <scroll class="favorite" v-if="currentIndex===0" ref="favorite" :data="favoriteList">
          <div class="song-list-ct" ref="favoriteList">
            <song-list :songs="favoriteList" @seletc="selectSong"></song-list>
          </div>
        </scroll>
        <scroll class="play-history" v-if="currentIndex===1" ref="playHistory" :data="playHistory">
          <div class="song-list-ct" ref="playHistoryList">
            <song-list :songs="playHistory" @seletc="selectSong"></song-list>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <no-result :title="noResultDesc"></no-result>
      </div>
    </div>
  </transition>
</template>
<script type="text/ecmascript-6">
import Switches from 'base/switches/switches'
import SongList from 'base/song-list/song-list'
import Scroll from 'base/scroll/scroll'
import { normalizeSong } from 'common/js/song'
import NoResult from 'base/no-result/no-result'

import { mapGetters, mapActions } from 'vuex'
import { playlistMixin } from 'common/js/mixin'
export default {
  mixins: [playlistMixin],
  data() {
    return {
      currentIndex: 0,
      switches: [
        {
          name: '我喜欢的'
        },
        {
          name: '最近听的'
        }
      ]
    }
  },
  computed: {
    showBtn() {
      if (this.currentIndex === 0) {
        return this.favoriteList.length
      } else {
        return this.playHistory.length
      }
    },
    noResult() {
      if (this.currentIndex === 0) {
        return !this.favoriteList.length
      } else {
        return !this.playHistory.length
      }
    },
    noResultDesc() {
      if (this.currentIndex === 0) {
        return '暂无收藏歌曲'
      } else {
        return '你还没有听过歌曲'
      }
    },
    // 把vuex中缓存格式的数据转换成我们需要的songlist格式
    normalizeFavoriteList() {
      let list = []
      let favoriteList = this.favoriteList.slice()
      favoriteList.forEach(song => {
        list.push(normalizeSong(song))
      })
      return list
    },
    normalizePlayHistory() {
      let list = []
      let playHistory = this.playHistory.slice()
      playHistory.forEach(song => {
        list.push(normalizeSong(song))
      })
      return list
    },
    ...mapGetters([
      'favoriteList',
      'playHistory'
    ])
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '74px' : ''
      if (this.currentIndex === 0) {
        this.$refs.favoriteList.style.paddingBottom = bottom
        this.$refs.favorite.refresh()
      } else {
        this.$refs.playHistoryList.style.paddingBottom = bottom
        this.$refs.playHistory.refresh()
      }
    },
    back() {
      this.$router.back()
    },
    switchItem(index) {
      this.currentIndex = index
    },
    selectSong(song) {
      song = normalizeSong(song)
      this.insertSong({ song, isFullScreen: true })
      // this.$refs.topTip.show()
    },
    random() {
      if (this.currentIndex === 0) {
        this.randomPlay(this.normalizeFavoriteList)
      } else {
        this.randomPlay(this.normalizePlayHistory)
      }
    },
    ...mapActions([
      'insertSong',
      'randomPlay'
    ])
  },
  components: {
    Switches,
    Scroll,
    SongList,
    NoResult
  }
}
</script>
<style scoped lang="scss">
@import "~common/sass/variable.scss";
.user-center {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 500;
  background-color: $color-bg;
  &.slide-enter-active,
  &.slide-leave-active {
    transition: all 0.3s;
  }
  &.slide-enter,
  &.slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
  .header {
    display: flex;
    // background-color: red;
    height: 44px;
    align-items: center;
    .back {
      position: absolute;
      top: 0;
      left: 0;
      height: 44px;
      width: 44px;
      text-align: center;
      line-height: 44px;
      .vue-music-icon {
        font-size: 26px;
        color: $color-icon-3;
        display: inline-block;
        transform: rotate(45deg);
      }
    }
    .switches-wrapper {
      flex: 1;
    }
  }
  .play-btn-ct {
    text-align: center;
    padding: 10px 0;
    background-color: #1f2531;
    .play-btn {
      display: inline-block;
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
  }
  .list-wrapper {
    position: fixed;
    top: 100px;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    .favorite {
      width: 100%;
      height: 100%;
    }
    .play-history {
      width: 100%;
      height: 100%;
    }
  }
  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>