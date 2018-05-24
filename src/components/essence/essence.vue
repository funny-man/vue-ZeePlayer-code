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
      </div>
    </div>
  </div>
</template>

<script >
import { getEssence } from 'api/essence'
import { ERR_OK } from 'api/jsonp-data-config'
import Slider from 'base/slider/slider'

export default {
  data: function () {
    return {
      sliders: '',
      songList: null
    }
  },
  created() {
    this._getEssence()
  },
  methods: {
    _getEssence() {
      getEssence().then(res => {
        if (res.code === ERR_OK) {
          this.sliders = res.data.slider
          this.songList = res.data.songList
        }
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
  color: #000;
  .essence-ct {
    .essence-wrapper {
      overflow: hidden;
    }
    .essence-list {
      text-align: center;
      margin-top: 20px;
      h2 {
        font-size: 10xp;
        color: $color-theme-text-s;
        font-weight: 700;
        letter-spacing: 3px;
      }
    }
  }
}
</style>