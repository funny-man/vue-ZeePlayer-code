<template>
  <div id="essence">
    <div class="essence-ct">
      <div v-if="sliders.length" class="essence-wrapper">
        <slider>
          <div v-for="item in sliders" :key="item.id">
            <a :href="item.linkUrl">
              <img :src="item.picUrl" alt="">
            </a>
          </div>
        </slider>
      </div>
      <div class="essence-list">
        <h2>HIT LIST</h2>
        <ul>
          <li class="clearfix" v-for="(item,index) in hotList" :key="index">
            <div class="list-pic">
              <img :src="item.imgurl" alt="">
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
  </div>
</template>

<script >
import { getEssence, getHotList } from 'api/essence'
import { ERR_OK } from 'api/jsonp-data-config'
import Slider from 'base/slider/slider'

export default {
  data: function () {
    return {
      sliders: '',
      hotList: null
    }
  },
  created() {
    this._getEssence()
    this._getHotList()
  },
  methods: {
    _getEssence() {
      getEssence().then(res => {
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
        console.log(req)
      })
    }
  },
  components: {
    Slider
  }
}
</script>

<style scoped lang="scss">
@import "~common/sass/variable.scss";
#essence {
  overflow: hidden;
  .essence-ct {
    .essence-wrapper {
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
          border-bottom: 1px solid $color-timeline;
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
                font-size: 15px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              p {
                color: $color-text-s;
                font-size: 10px;
                margin-top: 11px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
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
.clearfix:after {
  content: "";
  display: block;
  clear: both;
}
</style>