<template>
  <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import { getTopMusicList } from 'api/ranking'
import { getSongKey } from 'api/song-key'
import { ERR_OK } from 'api/jsonp-data-config'
import { createSong } from 'common/js/song'
import MusicList from 'components/music-list/music-list'

export default {
  data() {
    return {
      songs: []
    }
  },
  computed: {
    title() {
      return this.topList.topTitle
    },
    bgImage() {
      if (this.songs.length) {
        return this.songs[0].image
      }
      return ''
    },
    ...mapGetters([
      'topList'
    ])
  },
  created() {
    this._getTopMusicList()
  },
  methods: {
    _getTopMusicList() {
      if (!this.topList.id) {
        this.$router.push(`/ranking`)
        return
      }
      getTopMusicList(this.topList.id).then(res => {
        if (res.code === ERR_OK) {
          console.log(res.songlist)
          this.songs = this._normalizeSong(res.songlist)
          // 前面的songs可以渲染出歌手歌单列表然后后台执行获取歌单每首歌的key
          this.songs.forEach((item) => {
            this._getSongKey(item.mid)
          })
        }
      })
    },
    _getSongKey(id) {
      getSongKey(id).then(res => {
        if (res.code === ERR_OK) {
          this.songs.forEach((item) => {
            if (item.mid === res.data.items[0].songmid) {
              item.key = res.data.items[0]
            }
          })
        }
      })
    },
    _normalizeSong(list) {
      let ret = []
      list.forEach((item) => {
        const musicData = item.data
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>

<style scoped lang="scss">
</style>