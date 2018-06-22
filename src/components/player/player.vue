<template>
  <div class="player" v-show="playlist.length>0">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="header">
          <div class="back" @click="toggle">
            <i class="vue-music-icon icon-narrow"></i>
          </div>
          <h3 class="title">PLAYER</h3>
        </div>
        <div class="middle">
          <div class="middle-l">
            <div class="cd" ref="cd">
              <img class="cd-image" v-lazy="currentSong.image">
            </div>
            <div class="text">
              <h3 class="song-name" v-html="currentSong.name"></h3>
              <p class="singer-name" v-html="currentSong.singer"></p>
            </div>
          </div>
          <div class="middle-r"></div>
        </div>
        <div class="bottom">
          <div class="line-ct">
            <div class="line">
              <div class="line-playing"></div>
              <div class="line-loading"></div>
              <div class="play-time">
                  <span class="cur">--:--</span>
                  <span class="total">--:--</span>
              </div>
            </div>
          </div>

          <div class="btns">
            <div class="btn play-mod">
              <i class="vue-music-icon icon-loop-list"></i>
            </div>
            <div class="btn prev">
              <i class="vue-music-icon icon-prev"></i>
            </div>
            <div class="btn play">
              <i class="vue-music-icon icon-play-b"></i>
            </div>
            <div class="btn next">
              <i class="vue-music-icon icon-next"></i>
            </div>
            <div class="btn collection">
              <i class="vue-music-icon icon-like-n"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="toggle">
        <div class="cd">
          <img class="cd-image" :src="currentSong.image">
        </div>
        <div class="text">
          <h3 class="song-name" v-html="currentSong.name"></h3>
          <p class="singer-name" v-html="currentSong.singer"></p>
        </div>
        <div class="btn play-btn" @click.stop="gogo">
          <i class="vue-music-icon icon-play-a"></i>
        </div>
        <div class="btn list-btn">
          <i class="vue-music-icon icon-song-list"></i>
        </div>
      </div>
    </transition>

    <audio :src="songUrl" v-if="songKey" ref="audio"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations } from 'vuex'
import animations from 'create-keyframe-animation'

export default {
  computed: {
    songUrl() {
      return `http://dl.stream.qqmusic.qq.com/${this.songKey.filename}?vkey=${this.songKey.vkey}&guid=7342124872&uin=0&fromtag=66`
    },
    ...mapGetters([
      'fullScreen',
      'playlist',
      'currentSong',
      'songKey'
    ])
  },
  methods: {
    gogo() {
      console.log(9090)
    },
    toggle() {
      if (this.fullScreen) {
        this.setFullScreen(false)
      } else {
        this.setFullScreen(true)
      }
    },
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale()
      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(${1.1})`
        },
        100: {
          transform: `translate3d(0,0,0) scale(${1})`
        }
      }

      //  定义动画
      animations.registerAnimation({
        name: 'enterMove',
        // the actual array of animation changes
        animation,
        // optional presets for when actually running the animation
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })

      // 运行
      // done是一个回调 动画执行完成就会执行这个函数然后进行下一个动画
      animations.runAnimation(this.$refs.cd, 'enterMove', done)
    },
    afterEnter() {
      animations.unregisterAnimation('enterMove')
      this.$refs.cd.style.animation = ''
    },
    leave(el, done) {
      const { x, y, scale } = this._getPosAndScale()
      let animation = {
        0: {
          transform: `translate3d(0,0,0) scale(${1})`
        },
        100: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        }
      }

      //  定义动画
      animations.registerAnimation({
        name: 'leaveMove',
        // the actual array of animation changes
        animation,
        // optional presets for when actually running the animation
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })

      // 运行
      // done是一个回调 动画执行完成就会执行这个函数然后进行下一个动画
      animations.runAnimation(this.$refs.cd, 'leaveMove', done)
    },
    afterLeave() {
      animations.unregisterAnimation('leaveMove')
      this.$refs.cd.style.animation = ''
    },
    // 这个函数计算cd要缩放大小以及移动坐标
    _getPosAndScale() {
      // 屏幕宽高
      const vw = window.innerWidth
      const vh = window.innerHeight

      const targetCdWidth = 50
      const targetCdLeft = 50
      const targetCdBottom = 19
      const cdWidth = vw * 0.6
      const cdTop = targetCdWidth / 60

      // 缩放比例
      const scale = targetCdWidth / cdWidth
      const x = -(vw / 2 - targetCdLeft)
      const y = vh - cdTop - targetCdBottom

      return {
        x,
        y,
        scale
      }
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN'
    })
  },
  watch: {
    songUrl() {
      console.log(11111)
      this.$nextTick(() => {
        this.$refs.audio.play()
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import "~common/sass/variable";
.player {
  .normal-player {
    position: fixed;
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
      color: $color-theme-text-s;
      .back {
        position: absolute;
        right: 0;
        padding-right: 10px;
        .icon-narrow {
          display: inline-block;
          font-size: 26px;
          padding: 9px;
        }
      }
      .title {
        display: inline-block;
        line-height: 44px;
        letter-spacing: 4px;
        font-size: $font-size-s;
        font-weight: 500;
      }
    }
    .middle {
      margin-top: 60px;
      text-align: center;
      .middle-l {
        .cd {
          display: inline-block;
          width: 60vw;
          height: 60vw;
          border-radius: 50%;
          .cd-image {
            display: block;
            width: 100%;
            border-radius: 50%;
            box-shadow: 0px 4px 9px rgba(9, 15, 28, 1);
          }
        }
        .text {
          margin: 0 auto;
          width: 90vw;
          .song-name {
            color: $color-text-l;
            font-size: $font-size-l;
            margin-top: 20px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .singer-name {
            color: $color-text-s;
            font-size: $font-size-s-x;
            margin-top: 14px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
    .bottom {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 40px;
      .line-ct {
        display: flex;
        justify-content: space-around;
        .line {
          position: relative;
          display: inline-block;
          width: 90%;
          height: 2px;
          border-radius: 1000px;
          background-color: $color-timeline;
          .line-playing::before {
            content: "";
            display: inline-block;
            position: absolute;
            top: -9px;
            right: -9px;
            width: 18px;
            height: 18px;
            border: 2px solid #ffeaf0;
            border-radius: 50%;
            background-color: $color-theme-1;
          }
          .line-playing {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 2;
            height: 2px;
            width: 120px;
            border-radius: 1000px;
            background-image: linear-gradient(
              left,
              $color-theme-2,
              $color-theme-1
            );
          }
          .line-loading {
            position: absolute;
            z-index: 1;
            background-color: $color-timeline-loading;
            top: 0;
            left: 0;
            height: 2px;
            width: 240px;
            border-radius: 1000px;
          }
          .play-time {
            font-size: $font-size-s;
            color: $color-theme-text-s;
            .cur {
              position: absolute;
              top: 16px;
              left: 0;
            }
            .total {
              top: 16px;
              position: absolute;
              right: 0;
            }
          }
        }
      }
      .btns {
        margin-top: 60px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .btn {
          color: $color-icon-3;
          > .vue-music-icon {
            font-size: 24px;
          }
          .icon-play-b {
            font-size: 60px;
            color: $color-theme-1;
          }
          .icon-prev,
          .icon-next {
            color: $color-icon-1;
          }
        }
      }
    }
  }
  .normal-enter-active,
  .normal-leave-active {
    transition: all 0.4s;
    .header,
    .bottom {
      transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
    }
  }
  .normal-enter, .normal-leave-to /* .normal-leave-active below version 2.1.8 */ {
    opacity: 0;
    .header {
      transform: translate3d(0, -100px, 0);
    }
    .bottom {
      transform: translate3d(0, 160px, 0);
    }
  }
  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    right: 5px;
    bottom: 5px;
    left: 5px;
    height: 64px;
    border-radius: 5px;
    // background-color: $color-bg;
    background-color: rgba(29, 36, 52, 0.95);
    box-shadow: 0px 4px 9px rgba(9, 15, 28, 1);
    .cd {
      display: inline-block;
      width: 50px;
      margin-left: 20px;
      border-radius: 50%;
      .cd-image {
        display: block;
        width: 100%;
        border-radius: 50%;
      }
    }
    .text {
      flex: 1;
      margin-left: 10px;
      margin-right: 20px;
      overflow: hidden;
      .song-name {
        color: $color-text-l;
        font-size: $font-size-m;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .singer-name {
        color: $color-text-s;
        font-size: $font-size-s;
        margin-top: 6px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .btn {
      padding: 14px;
      .icon-play-a {
        font-size: 30px;
        color: $color-theme-1;
      }
      .icon-song-list {
        font-size: 24px;
      }
    }
  }
  .mini-enter-active,
  .mini-leave-active {
    transition: all 0.4s ease;
  }
  .mini-enter, .mini-leave-to /* .mini-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
}
</style>