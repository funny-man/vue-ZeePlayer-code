<template>
  <scroll class="suggest" :data="result" :pullup="pullup" @scrollToEnd="searchMore">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item,index) in result" :key="index" @click="selectItem(item,index)">
        <div class="icon">
          <i class="vue-music-icon" :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <div class="loading-ct" v-show="hasMore">
        <loading></loading>
      </div>
    </ul>
  </scroll>
</template>
<script type="text/ecmascript-6">
import { search } from 'api/search'
import { ERR_OK } from 'api/jsonp-data-config'
import { createSong } from 'common/js/song'
import { getSongKey } from 'api/song-key'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'

const perpage = 20

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
      result: [],
      pullup: true,
      hasMore: true
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
      this.hasMore = true
      search(this.keyWord, this.page, this.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          this.result = this._genResult(res.data)
          this.result.forEach((item) => {
            this._getSongKey(item.mid)
          })
          console.log(res.data)
          this._checkMore(res.data)
        }
      })
    },
    searchMore() {
      if (!this.hasMore) {
        return
      }
      this.page++
      search(this.keyWord, this.page, this.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          let a = this._genResult(res.data)
          a.forEach((item) => {
            this._getSongKey(item.mid)
          })
          this.result = this.result.concat(a)
          console.log(this.result)
          this._checkMore(res.data)
        }
      })
    },
    _checkMore(data) {
      const song = data.song
      if (!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
        this.hasMore = false
      }
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
      if (data.zhida && data.zhida.singerid && this.page === 1) {
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
    Scroll,
    Loading
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
    padding-bottom: 40px;
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
    .loading-ct {
      width: 100%;
      height: 10px;
      position: relative;
      margin-top: 20px;
    }
  }
}
</style>