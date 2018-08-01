<template>
  <div class="search" @touchmove.prevent>
    <div class="search-box-wrapper">
      <search-box  ref="searchBox" :inputPrompt="inputPrompt" @query="keyWordChange"></search-box>
    </div>
    <scroll class="shortcut-wrapper" :data="shortcut" v-show="!keyWord" ref="scroll">
      <div class="shortcut" ref="shortcut">
        <div class="hot-key">
          <h3 class="title">热门搜索</h3>
          <div class="hot-key-list">
            <ul>
              <li class="item" v-for="(item,index) in hotkey" :key="index" @click="addKeyWord(item.k)">{{item.k}}</li>
            </ul>
          </div>
        </div>
        <div class="search-history" v-show="searchHistory.length">
          <h3 class="title clearfix">
            <span class="text">搜索历史</span>
            <span class="clear" @click="showConfirm">
              <i class="vue-music-icon icon-dle"></i>
            </span>
          </h3>
          <div class="search-list-wrapper">
            <search-list :searches="searchHistory" @select="addKeyWord" @delete="deleteOneSearch"></search-list>
          </div>
        </div>
      </div>
    </scroll>
    <div class="search-result" v-show="keyWord">
      <Suggest :keyWord="keyWord" @listScroll="blurInput" @select="saveSearch"></Suggest>
    </div>
    <confirm ref="confirm"
             text="是否要清空所有搜索记录？"
             confirmBtnText="清空"
             @confirm="deleteAllSearch"
    >
    </confirm>
    <transition name="slide-fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import SearchBox from 'base/search-box/search-box'
import SearchList from 'base/search-list/search-list'
import Suggest from 'components/suggest/suggest'
import Scroll from 'base/scroll/scroll'
import Confirm from 'base/confirm/confirm'
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/jsonp-data-config'
import { mapActions } from 'vuex'
import { searchMixin, playlistMixin } from 'common/js/mixin'

export default {
  mixins: [searchMixin, playlistMixin],
  data() {
    return {
      inputPrompt: '搜索歌曲/歌手',
      hotkey: []
    }
  },
  computed: {
    shortcut() {
      return this.hotkey.concat(this.searchHistory)
    }
  },
  created() {
    this._getHotKey()
  },
  // mounted() {
  // setTimeout(() => {
  //   this.$refs.scroll.refresh()
  // }, 5000)
  // },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '74px' : ''
      this.$refs.shortcut.style.paddingBottom = bottom
      this.$refs.scroll.refresh()
    },
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotkey = res.data.hotkey.slice(0, 10)
        }
      })
    },
    deleteOneSearch(key) {
      this.deleteSearchHistory(key)
    },
    deleteAllSearch() {
      this.clearSearchHistory()
    },
    showConfirm() {
      this.$refs.confirm.show()
    },
    ...mapActions([
      'clearSearchHistory'
    ])
  },
  watch: {
    keyWord(newVal) {
      if (newVal) return
      setTimeout(() => {
        this.$refs.scroll.refresh()
      }, 20)
    }
  },
  components: {
    SearchBox,
    SearchList,
    Suggest,
    Scroll,
    Confirm
  }
}
</script>

<style scoped lang="scss">
@import "~common/sass/variable";
.search {
  width: 100%;
  position: fixed;
  top: 113px;
  bottom: 0;
  .search-box-wrapper {
    margin-top: 10px;
  }
  .shortcut-wrapper {
    position: fixed;
    top: 164px;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    .shortcut {
      // height: 100%;
      margin: 0 15px;
      padding-top: 20px;
      .hot-key {
        .title {
          font-size: $font-size-s-x;
          color: $color-theme-text-s;
        }
        .hot-key-list {
          padding: 15px 0;
          ul {
            margin: -10px 0 0 -15px;
            .item {
              display: inline-block;
              font-size: $font-size-m;
              color: $color-text-l;
              background-color: #222937;
              padding: 6px;
              margin-left: 15px;
              margin-top: 10px;
              border-radius: 3px;
            }
          }
        }
      }
      .search-history {
        .title {
          display: flex;
          align-items: center;
          font-size: $font-size-s-x;
          color: $color-theme-text-s;
          .text {
            flex: 1;
          }
          .clear {
            padding: 6px;
            margin-right: -6px;
          }
        }
      }
    }
  }
  .search-result {
    position: fixed;
    top: 164px;
    bottom: 0;
    width: 100%;
  }
}
.clearfix:after {
  content: "";
  display: block;
  clear: both;
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}
.slide-fade-enter, .slide-fade-leave-to /* .slide-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  // transform: translate3d(100%,0,0)
  transform: scale(0);
}
</style>