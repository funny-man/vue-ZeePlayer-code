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

<script type="text/ecmascript-6">
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
      default: 1300
    },
    showDot: {
      type: Boolean,
      default: true
    },
    click: {
      type: Boolean,
      default: true
    },
    threshold: {
      type: Number,
      default: 0.3
    },
    speed: {
      type: Number,
      default: 400
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
    this.update()
    window.addEventListener('resize', () => {
      console.log('改变窗口')
      //  enabled属性判断scroll是否处于启动状态
      if (!this.slide | !this.slide.enabled) {
        return
      }
      console.log('改变窗口2')
      clearTimeout(this.resizeTimer)
      this.resizeTimer = setTimeout(() => {
        this.refresh()
        if (this.autoPlay) {
          this._play()
        }
      }, 60)
    })
  },
  //  生命周期钩子；keep-alive 组件激活时调用。该钩子在服务器端渲染期间不被调用。
  activated() {
    if (this.autoPlay) {
      console.log('组件激活了')
      this.refresh()
    }
  },
  // //  生命周期钩子；实例销毁之前调用。在这一步，实例仍然完全可用。该钩子在服务器端渲染期间不被调用
  // deactivated() {
  //   clearTimeout(this.timer)
  // },
  // //  生命周期钩子；Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。
  // beforeDestroy() {
  //   clearTimeout(this.timer)
  // },
  methods: {
    update() {
      if (this.slide) {
        // 销毁slide实例
        this.slide.destroy()
      }
      // $nextTick在dom渲染好后执行
      this.$nextTick(() => {
        this.init()
      })
    },
    // 重新计算scroll
    refresh() {
      this._setSliderWidth(true)
      this.slide.refresh()
    },
    //  上一页
    prev() {
      this.slide.prev()
    },
    //  下一页
    next() {
      this.slide.next()
    },
    init() {
      clearTimeout(this.timer)
      this.pageIndex = 0
      this._setSliderWidth()
      if (this.showDot) {
        this._initDots()
      }
      this._initSlider()
      if (this.autoPlay) {
        this._play()
      }
    },
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
      this.slide = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        click: this.click,
        bounce: false,
        stopPropagation: true,
        snap: true,
        snapLoop: this.loop,
        snapThreshold: this.threshold,
        snapSpeed: this.speed
      })
      this.slide.on('scrollEnd', this._onScrollEnd)
      this.slide.on('touchEnd', () => {
        if (this.autoPlay) {
          this._play()
        }
      })
      this.slide.on('beforeScrollStart', () => {
        if (this.autoPlay) {
          clearTimeout(this.timer)
        }
      })
    },
    _onScrollEnd() {
      let index = this.slide.getCurrentPage().pageX
      this.pageIndex = index - 1
      if (this.autoPlay) {
        this._play()
      }
    },
    _initDots() {
      this.dots = new Array(this.children.length)
    },
    _play() {
      // console.log(this.pageIndex)
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.next()
      }, this.interval)
    }
  }
}
</script>

<style scoped lang="scss">
@import "~common/sass/variable.scss";
.slider {
  // overflow: hidden;
  min-height: 1px;
  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    .slider-item {
      float: left;
      display: block;
      overflow: hidden;
      > a {
        display: block;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        padding: 8px;
        overflow: hidden;
        text-decoration: none;
        > img {
          display: block;
          width: 100%;
          border-radius: 8px;
          box-shadow: 0px 4px 9px rgba(9, 15, 28, 1);
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