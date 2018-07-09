<template>
  <div id="ranking" ref="ranking">
    <scroll class="ranking-ct" :data="topList" ref="rankingCt">
      <div class="top-list">
          <ul>
            <li class="item" v-for="(item) in topList" :key="item.id" @click="selectItem(item)">
              <div class="ranking-pic">
                <img v-lazy="item.picUrl">
              </div>
              <ul>
                <li class="song-list" v-for="(song,index) in item.songList" :key="index">
                  <p>
                    {{ index+1}}
                    <span class="songname">{{ song.songname }}</span>
                    -{{ song.singername }}
                  </p>
                </li>
              </ul>
            </li>
          </ul>
      </div>
      <!-- <div class="loading-ct"  v-show="!hotList.length">
        <loading></loading>
      </div> -->
    </scroll>
    <transition name="slide-fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import { getTopList } from 'api/ranking'
import { ERR_OK } from 'api/jsonp-data-config'
import { playlistMixin } from 'common/js/mixin'
import { mapMutations } from 'vuex'

export default {
  mixins: [playlistMixin],
  data() {
    return {
      topList: []
    }
  },
  created() {
    this._getTopList()
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '74px' : ''
      this.$refs.ranking.style.bottom = bottom
      this.$refs.rankingCt.refresh()
    },
    selectItem(item) {
      console.log(item)
      this.$router.push({
        path: `/ranking/${item.id}`
      })
      this.setTopList(item)
    },
    _getTopList() {
      getTopList().then(res => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList
          console.log(this.topList)
        }
      })
    },
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    })
  },
  components: {
    Scroll
  }
}
</script>

<style scoped lang="scss">
@import "~common/sass/variable.scss";
#ranking {
  width: 100%;
  position: fixed;
  top: 113px;
  bottom: 0;
  // overflow: hidden;
  .ranking-ct {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .top-list {
      // margin-top: 28px;
      > ul {
        margin-top: 3px;
        > .item {
          display: flex;
          align-items: center;
          margin: 0 19px 0 19px;
          padding: 20px 0;
          border-bottom: 1px solid #101622;
          .ranking-pic {
            > img {
              display: block;
              width: 80px;
            }
          }
          > ul {
            flex: 1;
            margin-left: 14px;
            margin-right: 14px;
            overflow: hidden;
            .song-list {
              overflow: hidden;
              width: 100%;
              > p {
                display: inline-block;
                width: 100%;
                color: $color-theme-text-s;
                font-size: $font-size-m;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 1.5;
                .songname {
                  margin-left: 10px;
                  color: $color-text-l;
                }
              }
            }
          }
          .icon {
            .icon-arrow {
              color: $color-text-l;
              font-size: 20px;
            }
          }
        }
      }
    }
  }
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