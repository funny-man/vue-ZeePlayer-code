<template>
  <div class="song-list">
    <ul>
      <li v-for="(song,index) in songs" :key="index" class="item" @click="selectItem(song,index)">
        <div class="text">
          <div class="text-ct">
            <h3 class="name">{{ song.name }}</h3>
            <p class="desc">{{ getDesc(song) }}</p>
          </div>
        </div>
        <div class="icon">
          <i class="vue-music-icon icon-play-a"></i>
        </div>
      </li>
    </ul>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    songs: {
      type: Array,
      default: () => { }
    }
  },
  methods: {
    getDesc(song) {
      return `${song.singer}~${song.album}`
    },
    selectItem(item, index) {
      this.$emit('seletc', item, index)
    }
  }
}
</script>
<style scoped lang="scss">
@import "~common/sass/variable.scss";
.song-list {
  > ul {
    // padding-bottom: 76px;
    > li {
      display: flex;
      align-items: center;
      margin: 0 19px 0 19px;
      padding: 10px 0;
      border-bottom: 1px solid $color-timeline;
      .text {
        flex: 1;
        margin-left: 14px;
        margin-right: 14px;
        overflow: hidden;
        .text-ct {
          h3 {
            color: $color-text-l;
            font-size: $font-size-m;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          p {
            color: $color-text-s;
            font-size: $font-size-s;
            margin-top: 11px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
      .icon {
        .icon-play-a {
          color: $color-theme-text-s;
          font-size: 20px;
        }
      }
    }
  }
}
</style>