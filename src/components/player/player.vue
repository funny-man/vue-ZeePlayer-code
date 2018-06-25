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
          <div class="back" @click="togglePanel">
            <i class="vue-music-icon icon-narrow"></i>
          </div>
          <h3 class="title">PLAYER</h3>
        </div>
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdRotate" ref="cd">
                <img class="cd-image" v-lazy="currentSong.image">
              </div>
            </div>
            <div class="text">
              <h3 class="song-name" v-html="currentSong.name"></h3>
              <p class="singer-name" v-html="currentSong.singer"></p>
            </div>
          </div>
          <div class="middle-r"></div>
        </div>
        <div class="bottom">
          <div class="progressbar-ct">
            <div class="progressbar-wrapper"
                 ref="progressbarWrapper"
                 @touchstart.prevent="progressTouchStart"
            >
              <div class="progressbar">
                <div class="progressbar-cur" :style="progressBarCur">
                  <div class="progressbar-btn"
                       @touchstart.prevent.stop="progressBtnTouchStart"
                       @touchmove.prevent.stop="progressBtnTouchMove"
                       @touchend.prevent="progressBtnTouchEnd"
                  ></div>
                </div>
                <div class="progressbar-loading"></div>
                <div class="play-time">
                    <span class="cur">{{ format(curTime) }}</span>
                    <span class="total">{{ format(totalTime) }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="btns">
            <div class="btn play-mod">
              <i class="vue-music-icon icon-loop-list"></i>
            </div>
            <div class="btn prev" @click="prev">
              <i class="vue-music-icon icon-prev"></i>
            </div>
            <div class="btn playing" @click="togglePlaying">
              <i class="vue-music-icon" :class="playIcon"></i>
            </div>
            <div class="btn next" @click="next">
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
      <div class="mini-player" v-show="!fullScreen" @click="togglePanel">
        <div class="mini-cd-wrapper">
          <div class="cd" :class="cdRotate">
            <img class="cd-image" :src="currentSong.image">
          </div>
        </div>
        <div class="text">
          <h3 class="song-name" v-html="currentSong.name"></h3>
          <p class="singer-name" v-html="currentSong.singer"></p>
        </div>
        <div class="btn play-btn" @click.stop="togglePlaying">
          <i class="vue-music-icon" :class="playIcon"></i>
        </div>
        <div class="btn list-btn" @click.stop="play">
          <i class="vue-music-icon icon-song-list"></i>
        </div>
      </div>
    </transition>

    <audio  :src="songUrl"
            v-if="currentSong"
            autoplay="autoplay"
            ref="audio"
            @canplay="ready"
            @error="error"
            @timeupdate="updateTime"
    ></audio>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations } from 'vuex'
import animations from 'create-keyframe-animation'

export default {
  data() {
    return {
      totalTime: 0,
      curTime: 0,
      shouldUpdate: true,
      touch: {}
    }
  },
  computed: {
    progressBarCur() {
      return `width: ${this.curTime / this.totalTime * 100}%;`
    },
    songUrl() {
      if (!this.currentSong) return
      return `http://dl.stream.qqmusic.qq.com/${this.currentSong.key.filename}?vkey=${this.currentSong.key.vkey}&guid=7342124872&uin=0&fromtag=66`
    },
    playIcon() {
      return this.playing ? 'icon-pause-b' : 'icon-play-b'
    },
    cdRotate() {
      return this.playing ? 'play' : 'play pause'
    },
    ...mapGetters([
      'fullScreen',
      'playlist',
      'currentSong',
      'playing',
      'currentIndex'
    ])
  },
  methods: {
    progressTouchStart(e) {
      console.log(111111)
      let pageX = e.touches[0].pageX
      let progressbarMarginLeft = this.$refs.progressbarWrapper.offsetLeft
      let progressbarWidth = this.$refs.progressbarWrapper.clientWidth
      // 通过百分比和歌曲总长度计算要定位的时长
      // 这里其实可以不设置this.curTime的值也会触发@timeupdate事件修改
      // 但是出发时间有时间差导致点击后等一下进度条才会变化没有跟随
      this.curTime = (pageX - progressbarMarginLeft) / progressbarWidth * this.totalTime
      this.$refs.audio.currentTime = (pageX - progressbarMarginLeft) / progressbarWidth * this.totalTime
    },
    progressBtnTouchStart(e) {
      this.touch.pageX = e.touches[0].pageX
    },
    progressBtnTouchMove(e) {
      let pageX = e.touches[0].pageX
      let progressbarMarginLeft = this.$refs.progressbarWrapper.offsetLeft
      let progressbarWidth = this.$refs.progressbarWrapper.clientWidth

      this.curTime = (pageX - progressbarMarginLeft) / progressbarWidth * this.totalTime
      this.$refs.audio.currentTime = (pageX - progressbarMarginLeft) / progressbarWidth * this.totalTime
    },
    progressBtnTouchEnd() { },
    togglePanel() {
      this.setFullScreen(!this.fullScreen)
    },
    togglePlaying() {
      this.setPlayingState(!this.playing)
    },
    play() {
      this.$refs.audio.play()
      this.setPlayingState(true)
    },
    // pause() {
    //   this.$refs.audio.pause()
    //   this.setPlayingState(false)
    // },
    next() {
      console.log('next')
      let index = this.currentIndex + 1
      if (index === this.playlist.length) {
        index = 0
      }
      this.setCurrentIndex(index)
    },
    prev() {
      console.log('prev')
      let index = this.currentIndex - 1
      if (index === -1) {
        index = this.playlist.length - 1
      }
      this.setCurrentIndex(index)
    },
    ready(e) {
      this.play()
      this.totalTime = e.target.duration
    },
    error() { },
    updateTime(e) {
      if (!this.shouldUpdate) return
      this.shouldUpdate = false
      setTimeout(() => {
        this.curTime = e.target.currentTime
        this.shouldUpdate = true
      }, 1000)
    },
    // 该函数把获取的事件设置成--：--格式
    format(time) {
      let min = Math.floor(time / 60)
      let sec = Math.floor(time % 60)
      let minStr = min >= 10 ? min : '0' + min
      let secStr = sec >= 10 ? sec : '0' + sec
      return minStr + ':' + secStr
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
      animations.runAnimation(this.$refs.cdWrapper, 'enterMove', done)
    },
    afterEnter() {
      animations.unregisterAnimation('enterMove')
      this.$refs.cdWrapper.style.animation = ''
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
      animations.runAnimation(this.$refs.cdWrapper, 'leaveMove', done)
    },
    afterLeave() {
      animations.unregisterAnimation('leaveMove')
      this.$refs.cdWrapper.style.animation = ''
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
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX'
    })
  },
  watch: {
    playing(newPlaying) {
      let audio = this.$refs.audio
      if (!audio) return
      newPlaying ? audio.play() : audio.pause()
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
        .cd-wrapper {
          display: inline-block;
          .cd {
            display: inline-block;
            width: 60vw;
            height: 60vw;
            border-radius: 50%;
            &.play {
              animation: rotate 20s linear infinite;
            }
            &.pause {
              animation-play-state: paused;
            }
            .cd-image {
              display: block;
              width: 100%;
              border-radius: 50%;
              box-shadow: 0px 4px 9px rgba(9, 15, 28, 1);
            }
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
      width: 100%;
      bottom: 30px;
      .progressbar-ct {
        display: inline-block;
        width: 100%;
        text-align: center;
        .progressbar-wrapper {
          display: inline-block;
          width: 90%;
          height: 22px;
          .progressbar {
            position: relative;
            display: inline-block;
            width: 100%;
            height: 2px;
            border-radius: 1000px;
            background-color: $color-timeline;
            .progressbar-cur {
              position: absolute;
              top: 0;
              left: 0;
              z-index: 2;
              height: 100%;
              width: 0;
              border-radius: 1000px;
              transition: all 0.4s;
              background-image: linear-gradient(
                left,
                $color-theme-2,
                $color-theme-1
              );
              .progressbar-btn {
                display: inline-block;
                position: absolute;
                top: 50%;
                right: 0px;
                width: 18px;
                transform: translate3d(50%, -50%, 0);
                height: 18px;
                border: 2px solid #ffeaf0;
                border-radius: 50%;
                background-color: $color-theme-1;
              }
            }
            .progressbar-loading {
              position: absolute;
              z-index: 1;
              background-color: $color-timeline-loading;
              top: 0;
              left: 0;
              height: 100%;
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
      }
      .btns {
        margin-top: 45px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .btn {
          color: $color-icon-3;
          padding: 10px;
          > .vue-music-icon {
            font-size: 24px;
          }
          .icon-play-b {
            font-size: 60px;
            color: $color-theme-1;
          }
          .icon-pause-b {
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
    .mini-cd-wrapper {
      display: inline-block;
      margin-left: 20px;
      .cd {
        display: inline-block;
        width: 50px;
        border-radius: 50%;
        &.play {
          animation: rotate 20s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
        .cd-image {
          display: block;
          width: 100%;
          border-radius: 50%;
        }
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
      .icon-play-b {
        font-size: 30px;
        color: $color-theme-1;
      }
      .icon-pause-b {
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
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>