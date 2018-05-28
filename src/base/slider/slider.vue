<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="group">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item,index) in dots" :key="index" v-bind:class="{'active':index==pageIndex}"></span>
    </div>
  </div>
</template>

<script >
import BScroll from 'better-scroll'
import { addClass } from 'common/js/dom'
export default {
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 3000
    }
  },
  data: function () {
    return {
      children: null,
      dots: [],
      pageIndex: 0
    }
  },
  //  生命周期钩子；dom已经加载完执行这个钩子；如果是要操作dom一般是要在这个之后钩子或之后才行
  mounted() {
    setTimeout(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()
      if (this.autoPlay) {
        this._play()
      }
    }, 20)
    window.addEventListener('resize', () => {
      this._setSliderWidth(true)
      //  better-scroll一个接口重新new BScroll
      this.slider.refresh()
    })
  },
  //  生命周期钩子；keep-alive 组件激活时调用。该钩子在服务器端渲染期间不被调用。
  activated() {
    if (this.autoPlay) {
      this._play()
    }
  },
  //  生命周期钩子；实例销毁之前调用。在这一步，实例仍然完全可用。该钩子在服务器端渲染期间不被调用
  deactivated() {
    clearTimeout(this.timer)
  },
  //  生命周期钩子；Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。
  beforeDestroy() {
    clearTimeout(this.timer)
  },
  methods: {
    _setSliderWidth(isResize) {
      this.children = this.$refs.group.children
      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, 'slider-item')
        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      if (this.loop && !isResize) {
        width += 2 * sliderWidth
      }
      this.$refs.group.style.width = width + 'px'
    },
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: true,
        snapLoop: this.loop,
        snapThreshold: 0.3,
        snapSpeed: 400,
        click: true
      })
      this.slider.on('scrollEnd', () => {
        let index = this.slider.getCurrentPage().pageX
        if (this.loop) {
          index -= 1
        }
        this.pageIndex = index
        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._play()
        }
      })
      // this.slider.on('beforeScrollStart', () => {
      //   if (this.autoPlay) {
      //     clearTimeout(this.timer)
      //   }
      // })
    },
    _initDots() {
      for (let i = 0; i < this.children.length; i++) {
        this.dots.push('')
      }
    },
    _play() {
      let index = this.pageIndex + 1
      if (this.loop) {
        index += 1
      }
      this.timer = setTimeout(() => {
        this.slider.goToPage(index, 0, 400)
      }, this.interval)
    }
  }
}
</script>

<style scoped lang="scss">
@import "~common/sass/variable.scss";
.slider {
  overflow: hidden;
  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    .slider-item {
      float: left;
      display: block;
      > a {
        display: block;
        box-sizing: border-box;
        width: 100%;
        padding: 8px;
        overflow: hidden;
        text-decoration: none;
        > img {
          display: block;
          width: 100%;
          border-radius: 8px;
          box-shadow: 0px 4px 9px rgba($color: #090f1c, $alpha: 0.7);
        }
      }
    }
  }
  .dots {
    display: block;
    text-align: center;
    font-size: 0;
    margin-top: 7px;
    .dot {
      display: inline-block;
      width: 4px;
      height: 4px;
      margin: 0 6px;
      background-color: $color-theme-text-s;
      border-radius: 50%;
      &.active {
        background-color: $color-theme-text-l;
      }
    }
  }
}
</style>