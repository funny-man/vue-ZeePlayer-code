<template>
  <div class="player" v-show="playlist.length>0">
    <div class="normal-player" v-show="fullScreen">
      <div class="header">
        <div class="back" @click="toggle">
          <i class="vue-music-icon icon-narrow"></i>
        </div>
        <h3 class="title">PLAYER</h3>
      </div>
    </div>

    <div class="mini-player" v-show="!fullScreen" @click="toggle">

    </div>
    </div>
</template>
<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'fullScreen',
      'playlist',
      'currentSong'
    ])
  },
  methods: {
    toggle() {
      console.log(1)
      if (this.fullScreen) {
        this.$store.commit('SET_FULL_SCREEN', false)
      } else {
        this.$store.commit('SET_FULL_SCREEN', true)
      }
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
        font-size: $font-size-s;
      }
    }
  }
  .mini-player {
    position: fixed;
    right: 8px;
    bottom: 8px;
    left: 8px;
    height: 64px;
    border-radius: 5px;
    // background-color: $color-bg;
    background-color: pink;
  }
}
</style>