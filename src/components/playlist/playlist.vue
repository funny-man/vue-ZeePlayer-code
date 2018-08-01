<template>
  <transition name="list-fade">
    <div class="playlist" @click="hide" v-show="showFlag">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="vue-music-icon" :class="iconMode" @click="changeMode"></i>
            <span class="text" @click="changeMode">{{modeText}}</span>
            <span class="clear" @click="showConfirm"><i class="vue-music-icon icon-dle"></i></span>
          </h1>
        </div>
        <scroll ref="listContent" :data="sequenceList" class="list-content" :refreshTime="refreshTime">
          <transition-group ref="list" name="list" tag="ul">
            <li :key="item.id"
                class="item"
                v-for="(item,index) in sequenceList"
                @click="selectItem(item,index)">
              <span class="current">
                <i class="vue-music-icon" :class="getCurrentIcon(item)"></i>
              </span>
              <span class="text">{{item.name}}</span>
              <span @click.stop="toggleFavorite(item)" class="like">
                <i class="vue-music-icon" :class="getFavoriteIcon(item)"></i>
              </span>
              <span @click.stop="deleteOne(item)" class="delete">
                <i class="vue-music-icon icon-icon-test"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div @click="addSong" class="add">
            <i class="vue-music-icon icon-icon-test"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div @click="hide" class="list-close">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" @confirm="confirmClear" text="是否清空播放列表" confirmBtnText="清空"></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import { mapMutations, mapActions } from 'vuex'
import { playMode } from 'common/js/config'
import Scroll from 'base/scroll/scroll'
import Confirm from 'base/confirm/confirm'
import AddSong from 'components/add-song/add-song'
import { playerMixin } from 'common/js/mixin'

export default {
  mixins: [playerMixin],
  data() {
    return {
      showFlag: false,
      refreshDelay: 120,
      refreshTime: 100
    }
  },
  computed: {
    modeText() {
      return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
    }
  },
  methods: {
    show() {
      this.showFlag = true
      setTimeout(() => {
        this.$refs.listContent.refresh()
        this.scrollToCurrent(this.currentSong)
      }, 20)
    },
    hide() {
      this.showFlag = false
    },
    showConfirm() {
      this.$refs.confirm.show()
    },
    confirmClear() {
      console.log('确定清空')
      this.clearSongList()
      this.hide()
    },
    getCurrentIcon(item) {
      if (this.currentSong.id === item.id) {
        return 'icon-play-a'
      }
      return ''
    },
    selectItem(item, index) {
      if (this.mode === playMode.random) {
        index = this.playlist.findIndex((song) => {
          return song.id === item.id
        })
      }
      this.setCurrentIndex(index)
      // this.setPlayingState(true)
    },
    deleteOne(item) {
      console.log('删除一个歌曲')
      this.deleteSong(item)
      if (!this.playlist.length) {
        this.hide()
      }
    },
    addSong() {
      this.$refs.addSong.show()
    },
    scrollToCurrent(current) {
      const index = this.sequenceList.findIndex((song) => {
        return song.id === current.id
      })
      this.$refs.listContent.scrollToElement(this.$refs.list.$el.children[index], 300)
    },
    ...mapMutations({
      // setFullScreen: 'SET_FULL_SCREEN',
      // setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX'
      // setPlayMode: 'SET_PLAY_MODE',
      // setPlayList: 'SET_PLAYLIST'
    }),
    ...mapActions([
      'deleteSong',
      'clearSongList'
    ])
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!this.showFlag || newSong.id === oldSong.id) {
        return
      }
      setTimeout(() => {
        this.scrollToCurrent(newSong)
      }, 20)
    }
  },
  components: {
    Scroll,
    Confirm,
    AddSong
  }
}
</script>

<style scoped lang="scss">
@import "~common/sass/variable";
// @import "~common/sass/mixin";

.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  background-color: rgba(12, 22, 36, 0.932);

  &.list-fade-enter-active,
  &.list-fade-leave-active {
    transition: opacity 0.3s;

    .list-wrapper {
      transition: all 0.3s;
    }
  }

  &.list-fade-enter,
  &.list-fade-leave-to {
    opacity: 0;

    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }

  &.list-fade-enter,
  .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #1f2533;
    border-radius: 10px 10px 0 0;
    .list-header {
      position: relative;
      padding: 10px 15px;
      border-bottom: 1px solid $color-bg;
      .title {
        display: flex;
        align-items: center;
        .vue-music-icon {
          padding: 6px;
          font-size: $font-size-l-x;
          color: $color-theme-text-s;
        }

        .text {
          flex: 1;
          font-size: $font-size-m;
          color: $color-theme-text-s;
        }

        .clear {
          // extend-click();
          .icon-clear {
            font-size: $font-size-l;
            color: $color-theme-text-s;
          }
        }
      }
    }

    .list-content {
      max-height: 240px;
      overflow: hidden;
      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 10px 0 20px;
        overflow: hidden;

        &.list-enter-active,
        &.list-leave-active {
          transition: all 0.1s;
        }

        &.list-enter,
        &.list-leave-to {
          height: 0;
        }

        .current {
          width: 17px;
          margin-right: 4px;
          font-size: $font-size-m;
          color: $color-theme-1;
        }

        .text {
          flex: 1;
          font-size: $font-size-m;
          color: $color-theme-text-l;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .like {
          width: 40px;
          height: 40px;
          text-align: center;
          line-height: 40px;
          // margin-right: 10px;
          font-size: $font-size-m;
          color: $color-theme-text-s;
          .icon-like-y {
            color: $color-theme-1;
          }
        }

        .delete {
          width: 40px;
          height: 40px;
          text-align: center;
          line-height: 40px;
          font-size: $font-size-m;
          color: $color-theme-text-s;
        }
      }
    }
    .list-operate {
      width: 90vw;
      margin: 10px auto 20px auto;
      .add {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px 16px;
        border: 1px solid $color-theme-1;
        border-radius: 100px;
        color: $color-theme-1;
        > .vue-music-icon {
          margin-right: 5px;
          font-size: $font-size-m-x;
          transform: rotate(45deg);
        }

        .text {
          font-size: $font-size-m;
        }
      }
    }

    .list-close {
      text-align: center;
      line-height: 50px;
      background: $color-bg;
      font-size: $font-size-m;
      color: $color-theme-text-s;
    }
  }
}
</style>