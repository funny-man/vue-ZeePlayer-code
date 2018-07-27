import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  activated() {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

export const playerMixin = {
  computed: {
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'mode'
    ])
  },
  methods: {
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
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    })
  }
}

export const searchMixin = {
  data() {
    return {
      keyWord: ''
    }
  },
  computed: {
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    keyWordChange(keyWord) {
      this.keyWord = keyWord
    },
    blurInput() {
      this.$refs.searchBox.blur()
    },
    saveSearch() {
      this.saveSearchHistory(this.keyWord)
    },
    addKeyWord(key) {
      this.$refs.searchBox.setKeyWord(key)
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
    // ...mapMutations({
    //   setCurrentIndex: 'SET_CURRENT_INDEX',
    //   setPlayMode: 'SET_PLAY_MODE',
    //   setPlayList: 'SET_PLAYLIST'
    // })
  }
}