<template>
  <div id="essence" ref="essence">
    <scroll class="essence-ct" :data="hotList" ref="scroll">
      <div ref="essenceWrapper">
        <div v-if="sliders.length" class="essence-slider">
          <slider>
            <div v-for="item in sliders" :key="item.id">
              <a :href="item.linkUrl">
                <img :src="item.picUrl"  @load="loadImage"  :onerror="errorImg">
              </a>
            </div>
          </slider>
        </div>
        <div class="essence-list">
          <h2>HIT LIST</h2>
          <ul>
            <li class="clearfix" v-for="(item,index) in hotList" :key="index" @click="selectItem(item)">
              <div class="list-pic">
                <img v-lazy="item.imgurl" alt="">
              </div>
              <div class="text">
                <div class="text-ct">
                  <h3 class="name" v-html="item.dissname">{{ item.dissname }}</h3>
                  <p class="clicks"><span>播放量：</span><span v-html="item.listennum"></span></p>
                </div>
              </div>
              <div class="icon">
                <i class="vue-music-icon icon-arrow"></i>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-ct"  v-show="!hotList.length">
        <loading></loading>
      </div>
    </scroll>
    <transition name="slide-fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import Slider from 'base/slider/slider'
import Loading from 'base/loading/loading'
import { playlistMixin } from 'common/js/mixin'
import { mapMutations } from 'vuex'

import { getSliders, getHotList } from 'api/essence'
import { ERR_OK } from 'api/jsonp-data-config'

export default {
  mixins: [playlistMixin],
  data: function () {
    return {
      sliders: [],
      hotList: [],
      errorImg: 'this.src="' + require('common/image/errorimg@2x.png') + '"'
    }
  },

  //  生命周期钩子：在实例创建完成后被立即调用。在这一步，实例已完成以下的配置：数据观测 (data observer)，属性和方法的运算，watch/event 事件回调。然而，挂载阶段还没开始，$el 属性目前不可见。
  created() {
    this._getSliders()
    this._getHotList()
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '74px' : ''
      this.$refs.essenceWrapper.style.paddingBottom = bottom
      this.$refs.scroll.refresh()
    },
    selectItem(item) {
      this.$router.push({
        path: `/essence/${item.dissid}`
      })
      this.setDisc(item)
    },
    _getSliders() {
      getSliders().then(res => {
        if (res.code === ERR_OK) {
          this.sliders = res.data.slider
        }
      })
    },
    _getHotList() {
      getHotList().then(res => {
        if (res.code === ERR_OK) {
          this.hotList = res.data.list
        }
      }, (req) => {
      })
    },
    loadImage() {
      //  节流!只要有一个图片load成功我们就设置checkLoaded为true后面就不会执行这个函数了
      if (!this.checkLoaded) {
        this.checkLoaded = true
        // 由于图片load完后是很大的所以立刻refresh()还是会计算错误是后面多出空间
        // 延迟使slider控件中的_setSliderWidth()先设置了轮播图的宽度然后在执行refresh()
        setTimeout(() => {
          this.$refs.scroll.refresh()
        }, 5000)
      }
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
    // ,
    // setErrorImg() {
    //   this.defaultImg = '{height: 10px}'
    //   console.log(this.defaultImg)
    // }
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
}
</script>

<style scoped lang="scss">
@import "~common/sass/variable.scss";
#essence {
  width: 100%;
  position: fixed;
  top: 113px;
  bottom: 0;
  .essence-ct {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .essence-slider {
      position: relative;
      width: 100%;
      overflow: hidden;
    }
    .essence-list {
      margin-top: 28px;
      h2 {
        text-align: center;
        font-size: 10px;
        color: $color-theme-text-s;
        font-weight: 700;
        letter-spacing: 3px;
      }
      > ul {
        margin-top: 3px;
        > li {
          display: flex;
          align-items: center;
          margin: 0 19px 0 19px;
          padding: 20px 0;
          border-bottom: 1px solid #101622;
          .list-pic {
            > img {
              display: block;
              width: 60px;
            }
          }
          .text {
            flex: 1;
            margin-left: 14px;
            margin-right: 14px;
            overflow: hidden;
            .text-ct {
              h3 {
                color: $color-text-l;
                font-size: $font-size-m;
                padding: 1px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              p {
                color: $color-text-s;
                font-size: $font-size-s;
                margin-top: 10px;
                padding: 1px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
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
    .loading-ct {
      width: 100%;
      height: 20px;
      position: absolute;
      top: 50%;
      transform: translate(0, -50%);
    }
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