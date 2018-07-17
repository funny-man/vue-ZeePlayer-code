<template>
  <scroll class="suggest" :data="result">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item,index) in result" :key="index" @click="selectItem(song,index)">
        <div class="icon">
          <i class="vue-music-icon" :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
    </ul>
  </scroll>
</template>
<script type="text/ecmascript-6">
import { search } from 'api/search'
import { ERR_OK } from 'api/jsonp-data-config'
import { createSong } from 'common/js/song'
import { getSongKey } from 'api/song-key'
import Scroll from 'base/scroll/scroll'
export default {
  props: {
    keyWord: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1,
      result: []
    }
  },
  methods: {
    selectItem(item, index) {
      this.$emit('seletc', item, index, this.result)
    },
    getIconCls(item) {
      if (item.type === 'singer') {
        return 'icon-singer'
      } else {
        return 'icon-song'
      }
    },
    getDisplayName(item) {
      if (item.type === 'singer') {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    _search() {
      search(this.keyWord, this.page, this.showSinger).then(res => {
        if (res.code === ERR_OK) {
          this.result = this._genResult(res.data)
          this.result.forEach((item) => {
            this._getSongKey(item.mid)
          })
          console.log(res.data)
          console.log(this.result)
        }
      })
    },
    _getSongKey(id) {
      getSongKey(id).then(res => {
        if (res.code === ERR_OK) {
          this.result.forEach((item) => {
            if (item.mid === res.data.items[0].songmid) {
              item.key = res.data.items[0]
            }
          })
        }
      })
    },
    _genResult(data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        ret.push({ ...data.zhida, ...{ type: 'singer' } })
      }
      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list))
      }
      return ret
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((musicData) => {
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  watch: {
    keyWord() {
      this._search()
    }
  },
  components: {
    Scroll
  }
}
</script>
<style scoped lang="scss">
@import "~common/sass/variable";
.suggest {
  position: fixed;
  top: 180px;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  .suggest-list {
    padding-bottom: 30px;
    .suggest-item {
      display: flex;
      align-items: center;
      margin-top: 16px;
      .icon {
        margin-left: 15px;
        > .vue-music-icon {
          font-size: $font-size-l-x;
          color: $color-theme-text-s;
        }
      }
      .name {
        flex: 1;
        margin-left: 10px;
        margin-right: 15px;
        overflow: hidden;
        .text {
          font-size: $font-size-m;
          color: $color-text-l;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      }
    }
  }
}
</style>