<template>
  <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
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
      return this.singer.name
    },
    bgImage() {
      return this.singer.avatar
    },
    ...mapGetters([
      'singer'
    ])
  },
  created() {
    this._getSingerDetail()
  },
  methods: {
    _getSingerDetail() {
      if (!this.singer.id) {
        this.$router.push(`/singer`)
        return
      }
      getSingerDetail(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
          console.log('getSong')
          console.log(res.data)
          this.songs = this._normalizeSong(res.data.list)
          // 前面的songs可以渲染出歌手歌单列表然后后台执行获取歌单每首歌的key
          this.songs.forEach((item) => {
            this._getSongKey(item.mid)
          })
          console.log('newSong')
          console.log(this.songs)
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
        // es6的解构赋值
        let { musicData } = item
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