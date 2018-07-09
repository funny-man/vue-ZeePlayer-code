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
        <div class="middle"
             ref="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-ct" ref="cdCt">
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
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p class="text"
                ref="lyricLine"
                :class="{'current': currentLineNum ===index}"
                v-for="(line,index) in currentLyric.lines"
                :key="index">{{ line.txt }}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <div class="progressbar-ct">
            <div class="progressbar-wrapper"
                 ref="progressbarWrapper"
                 @click="progressClick"
            >
              <div class="progressbar">
                <div class="progressbar-cur"  :class="{smooth:updateTimeLock}" :style="progressBarCur">
                  <div class="progressbar-btn"
                       @touchstart.prevent.stop="progressBtnTouchStart"
                       @touchmove.prevent.stop="progressBtnTouchMove"
                       @touchend.prevent.stop="progressBtnTouchEnd"
                  >
                    <img src="./loading.gif" :class="{loading:showLoading}">
                  </div>
                </div>
                <div class="progressbar-loading" ref="progressbarLoading"></div>
                <div class="play-time">
                    <span class="cur">{{ format(curTime) }}</span>
                    <span class="total">{{ format(totalTime) }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="btns">
            <div class="btn play-mod" @click="changeMode">
              <i class="vue-music-icon" :class="iconMode"></i>
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
            <div class="btn collection" @click="test">
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
            ref="audio"
            @canplay="ready"
            @error="error"
            @timeupdate="updateTime"
            @progress="progress"
            @waiting="waiting"
            @ended="end"
    ></audio>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations } from 'vuex'
import animations from 'create-keyframe-animation'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import Lyric from 'lyric-parser'
import Scroll from 'base/scroll/scroll'
import { prefixStyle } from 'common/js/dom'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

export default {
  data() {
    return {
      totalTime: 0,
      curTime: 0,
      shouldUpdate: true,
      updateTimeLock: true,
      showLoading: true,
      currentLyric: null,
      currentShow: 'cd',
      currentLineNum: 0,
      playingLyric: ''
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
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    cdRotate() {
      return this.playing ? 'play' : 'play pause'
    },
    ...mapGetters([
      'fullScreen',
      'playlist',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList'
    ])
  },
  created() {
    // 分别用于储存progress和middle部分touch事件的数据
    this.progressTouch = {}
    this.middleTouch = {}
  },
  methods: {
    test() {
      console.log('测试')
      console.log(this.$refs.cdCt.clientHeight)
    },
    middleTouchStart(e) {
      this.middleTouch.initiated = true
      this.middleTouch.moved = false
      let touch = e.touches[0]
      this.middleTouch.StartX = touch.pageX
      this.middleTouch.StartY = touch.pageY
    },
    middleTouchMove(e) {
      if (!this.middleTouch.initiated) {
        return
      }
      let touch = e.touches[0]
      let variableX = touch.pageX - this.middleTouch.StartX
      let variableY = touch.pageY - this.middleTouch.StartY
      if (Math.abs(variableX) < Math.abs(variableY)) return
      if (!this.middleTouch.moved) {
        this.middleTouch.moved = true
      }
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + variableX))
      this.middleTouch.percent = Math.abs(offsetWidth / window.innerWidth)

      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.lyricList.$el.style[transitionDuration] = 0
      this.$refs.middleL.style.opacity = 1 - this.middleTouch.percent
      this.$refs.middleL.style[transitionDuration] = 0
    },
    middleTouchEnd() {
      if (!this.middleTouch.moved) {
        return
      }
      let offsetWidth
      let opacity
      let time = 300
      if (this.currentShow === 'cd') {
        if (this.middleTouch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          opacity = 0
          this.currentShow = 'lyric'
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (this.middleTouch.percent < 0.9) {
          offsetWidth = 0
          opacity = 1
          this.currentShow = 'cd'
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
      this.$refs.middleL.style[transitionDuration] = `${time}ms`
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.middleL.style.opacity = opacity

      this.middleTouch.initiated = false
    },
    progressClick(e) {
      console.log(e)
      let pageX = e.pageX
      let progressbarMarginLeft = this.$refs.progressbarWrapper.offsetLeft
      let progressbarWidth = this.$refs.progressbarWrapper.clientWidth
      // 通过百分比和歌曲总长度计算要定位的时长
      // 这里其实可以不设置this.curTime的值也会触发@timeupdate事件修改
      // 但是出发时间有时间差导致点击后等一下进度条才会变化没有跟随
      let currentTime = (pageX - progressbarMarginLeft) / progressbarWidth * this.totalTime
      this.curTime = currentTime
      this.$refs.audio.currentTime = currentTime
      this.currentLyric.seek(currentTime * 1000)
    },
    progressBtnTouchStart(e) {
      this.updateTimeLock = false
    },
    progressBtnTouchMove(e) {
      this.progressTouch.pageX = e.touches[0].pageX
      this.progressTouch.progressbarMarginLeft = this.$refs.progressbarWrapper.offsetLeft
      this.progressTouch.progressbarWidth = this.$refs.progressbarWrapper.clientWidth
      let moveWidth = this.progressTouch.pageX - this.progressTouch.progressbarMarginLeft
      if (moveWidth > this.progressTouch.progressbarWidth) {
        moveWidth = this.progressTouch.progressbarWidth
      }
      this.curTime = moveWidth / this.progressTouch.progressbarWidth * this.totalTime
    },
    progressBtnTouchEnd() {
      let currentTime = (this.progressTouch.pageX - this.progressTouch.progressbarMarginLeft) / this.progressTouch.progressbarWidth * this.totalTime
      this.$refs.audio.currentTime = currentTime
      this.currentLyric.seek(currentTime * 1000)
      this.updateTimeLock = true
    },
    togglePanel() {
      this.setFullScreen(!this.fullScreen)
    },
    togglePlaying() {
      this.setPlayingState(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
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
      console.log(this.mode)
      this.resetData()
      if (this.playlist.length === 1) {
        this.loop()
      } else {
        let index = this.currentIndex + 1
        if (index === this.playlist.length) {
          index = 0
        }
        this.setCurrentIndex(index)
      }
    },
    prev() {
      console.log('prev')
      this.resetData()
      if (this.playlist.length === 1) {
        this.loop()
      } else {
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playlist.length - 1
        }
        this.setCurrentIndex(index)
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    changeMode() {
      console.log('changeMode')
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      // 如果是随机模式则把sequenceList（原始列表）重新洗牌设置到playList
      if (this.mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    ready(e) {
      console.log('可以播放哦')
      this.showLoading = false
      this.totalTime = e.target.duration
    },
    error() { },
    updateTime(e) {
      if (!this.shouldUpdate) return
      this.shouldUpdate = false
      setTimeout(() => {
        if (this.updateTimeLock) {
          this.curTime = e.target.currentTime
          // if (this.currentLyric) {
          //   this.currentLyric.seek(this.curTime * 1000)
          // }
        }
        this.shouldUpdate = true
      }, 1000)
    },
    progress() {
      console.log('loading...')
      let percent = this.$refs.audio.buffered.length ? (this.$refs.audio.buffered.end(this.$refs.audio.buffered.length - 1) / this.totalTime) : 0
      this.$refs.progressbarLoading.style.width = percent * 100 + '%'
    },
    waiting() {
      console.log('不能播放哦')
      this.showLoading = true
    },
    end() {
      this.mode === playMode.loop ? this.loop() : this.next()
    },
    // 该函数把获取的事件设置成--：--格式
    format(time) {
      let min = Math.floor(time / 60)
      let sec = Math.floor(time % 60)
      let minStr = min >= 10 ? min : '0' + min
      let secStr = sec >= 10 ? sec : '0' + sec
      return minStr + ':' + secStr
    },
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    resetData() {
      this.curTime = 0
      this.showLoading = true
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

      const miniCdWidth = 50 // minicd宽度
      const miniCdLeft = 50 // minicd中心距离左边距离
      const miniCdBottom = 37 // minicd中心距离底部距离
      const cdWidth = vw * 0.6 // cd宽度
      const cdTop = (this.$refs.middle.clientHeight - this.$refs.cdCt.clientHeight) / 2 + 44 + cdWidth / 2 // cd中心距离顶部距离
      const cdLeft = vw / 2 // cd中心距离左边距离

      // 缩放比例
      const scale = miniCdWidth / cdWidth
      // x和y轴的移动距离
      const x = -(cdLeft - miniCdLeft)
      const y = vh - cdTop - miniCdBottom

      return {
        x,
        y,
        scale
      }
    },
    _getLyric() {
      // currentSong是由于之前new Song得到这是一个面向对象的方法，每一个new Song得到的对象都有getLyric()方法
      this.currentSong.getLyric().then((lyric) => {
        console.log(this.currentLyric)
        this.currentLyric = new Lyric(lyric, this.handleLyric)
        if (this.playing) {
          this.currentLyric.play()
        }
        console.log('currentLyric')
        console.log(this.currentLyric)
      }).catch(() => {
        this.currentLyric = null
        this.playingLyric = ''
        this.currentLineNum = 0
      })
    },
    handleLyric({ lineNum, txt }) {
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 8]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      this.playingLyric = txt
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    })
  },
  components: {
    Scroll
  },
  watch: {
    currentSong(newSong, oldSong) {
      console.log('改变')
      if (this.currentLyric) {
        this.currentLyric.stop()
        this.currentTime = 0
        this.playingLyric = ''
        this.currentLineNum = 0
      }
      if (newSong === oldSong) return
      this.$nextTick(() => {
        console.log('watch')
        this.play()
        this._getLyric()
      })
    },
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
      position: fixed;
      top: 44px;
      bottom: 150px;
      width: 100%;
      text-align: center;
      white-space: nowrap;
      font-size: 0;
      &.middle::before {
        content: "";
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 100;
        width: 100%;
        height: 60px;
        background-image: linear-gradient(
          to top,
          rgba(24, 29, 40, 0),
          $color-bg
        );
      }
      &.middle::after {
        content: "";
        display: inline-block;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 100;
        width: 100%;
        height: 60px;
        background-image: linear-gradient(
          to bottom,
          rgba(24, 29, 40, 0),
          $color-bg
        );
      }
      .middle-l {
        display: inline-block;
        width: 100%;
        height: 100%;
        vertical-align: top;
        &.middle-l::before {
          content: "";
          display: inline-block;
          width: 0;
          height: 100%;
          vertical-align: middle;
        }
        .cd-ct {
          display: inline-block;
          vertical-align: middle;
          .cd-wrapper {
            position: relative;
            display: inline-block;
            width: 60vw;
            height: 60vw;
            .cd {
              display: inline-block;
              border-radius: 50%;
              width: 100%;
              height: 100%;
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
              padding: 1px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .singer-name {
              color: $color-text-s;
              font-size: $font-size-s-x;
              margin-top: 10px;
              padding: 1px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }
      .middle-r {
        position: relative;
        display: inline-block;
        width: 100%;
        height: 100%;
        vertical-align: top;
        overflow: hidden;
        .lyric-wrapper {
          padding: 100px 0;
          .text {
            font-size: $font-size-s-x;
            color: $color-text-s;
            line-height: 2;
            &.current {
              font-size: $font-size-m;
              color: $color-text-l;
            }
          }
        }
      }
    }
    .bottom {
      position: fixed;
      left: 0;
      right: 0;
      width: 100%;
      bottom: 10px;
      .dot-wrapper {
        display: block;
        text-align: center;
        font-size: 0;
        margin-bottom: 4px;
        .dot {
          display: inline-block;
          width: 4px;
          height: 4px;
          margin: 0 6px;
          background-color: $color-theme-text-s;
          border-radius: 50%;
          &.active {
            background-color: $color-theme-text-l;
          }
        }
      }
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
                > img {
                  width: 100%;
                  opacity: 0;
                }
                .loading {
                  opacity: 1;
                }
              }
            }
            .smooth {
              transition: all 0.4s;
            }
            .progressbar-loading {
              position: absolute;
              z-index: 1;
              background-color: $color-timeline-loading;
              top: 0;
              left: 0;
              height: 100%;
              width: 0;
              border-radius: 1000px;
              transition: all 0.4s;
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
        margin-top: 20px;
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
        background-color: pink;
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