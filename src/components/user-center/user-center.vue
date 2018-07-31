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
      <div class="play-btn-ct">
        <div class="play-btn" ref="playBtn">
          <i class="vue-music-icon icon-play-a"></i>
          <span>随机播放</span>
        </div>
      </div>
      <!-- <div ref="playBtn" class="play-btn" @click="random">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll ref="favoriteList" class="list-scroll" v-if="currentIndex===0" :data="favoriteList">
          <div class="list-inner">
            <song-list :songs="favoriteList" @select="selectSong"></song-list>
          </div>
        </scroll>
        <scroll ref="playList" class="list-scroll" v-if="currentIndex===1" :data="playHistory">
          <div class="list-inner">
            <song-list :songs="playHistory" @select="selectSong"></song-list>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <no-result :title="noResultDesc"></no-result>
      </div> -->
    </div>
  </transition>
</template>
<script type="text/ecmascript-6">
import Switches from 'base/switches/switches'
export default {
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
  methods: {
    back() {
      this.$router.back()
    },
    switchItem(index) {
      this.currentIndex = index
    }
  },
  components: {
    Switches
    // Scroll,
    // SongList,
    // NoResult
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
    margin-top: 15px;
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
}
</style>