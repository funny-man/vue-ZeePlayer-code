<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box  ref="searchBox" :inputPrompt="inputPrompt" @query="nos"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!keyWord">
      <div class="shortcut">
        <div class="hot-key">
          <h3 class="title">热门搜索</h3>
          <ul>
            <li class="item" v-for="(item,index) in hotkey" :key="index" @click="addKeyWord(item.k)">{{item.k}}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="search-result" v-show="keyWord">
      <Suggest :keyWord="keyWord" @seletc="selectItem"></Suggest>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import SearchBox from 'base/search-box/search-box'
import Suggest from 'components/suggest/suggest'
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/jsonp-data-config'
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      inputPrompt: '搜索歌曲/歌手',
      hotkey: [],
      keyWord: ''
    }
  },
  created() {
    this._getHotKey()
  },
  methods: {
    nos(a) {
      console.log(a)
      this.keyWord = a
    },
    selectItem(item, index, songs) {
      this.selectPlay({
        list: songs,
        index
      })
    },
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotkey = res.data.hotkey.slice(0, 6)
        }
      })
    },
    addKeyWord(key) {
      this.$refs.searchBox.setKeyWord(key)
    },
    ...mapActions([
      'selectPlay'
    ])
  },
  components: {
    SearchBox,
    Suggest
  }
}
</script>

<style scoped lang="scss">
@import "~common/sass/variable";
.search {
  .search-box-wrapper {
    margin-top: 10px;
  }
  .shortcut-wrapper {
    margin-top: 30px;
    .shortcut {
      .hot-key {
        .title {
          font-size: $font-size-s-x;
          color: $color-theme-text-s;
          margin-left: 15px;
        }
        ul {
          padding-top: 5px;
          padding-right: 15px;
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
  }
}
</style>