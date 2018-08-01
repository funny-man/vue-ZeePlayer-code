<template>
  <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import { getSongList } from 'api/essence'
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
      return this.disc.dissname
    },
    bgImage() {
      return this.disc.imgurl
    },
    ...mapGetters([
      'disc'
    ])
  },
  created() {
    this._getSongList()
  },
  methods: {
    _getSongList() {
      if (!this.disc.dissid) {
        this.$router.push(`/essence`)
        return
      }
      getSongList(this.disc.dissid).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSong(res.cdlist[0].songlist)
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
      list.forEach((musicData) => {
        // es6的解构赋值
        // let { musicData } = item
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