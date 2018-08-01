<template>
  <div class="scroll" ref="scroll">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'

export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    pullup: {
      type: Boolean,
      default: false
    },
    beforeScroll: {
      type: Boolean,
      default: false
    },
    refreshTime: {
      type: Number,
      default: 20
    }
  },
  mounted() {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  activated() {
    console.log('组件激活了')
    this.refresh()
  },
  methods: {
    _initScroll() {
      if (!this.$refs.scroll) {
        return
      }
      this.scroll = new BScroll(this.$refs.scroll, {
        probeType: this.probeType,
        click: this.click
      })
      if (this.listenScroll) {
        let me = this
        this.scroll.on('scroll', (pos) => {
          //  在监听 this.scroll的scroll在拍派发个自定义事件scroll同时传入pos参数让别的地方监听
          me.$emit('scroll', pos)
        })
      }
      if (this.pullup) {
        let me = this
        this.scroll.on('scrollEnd', () => {
          if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
            me.$emit('scrollToEnd')
          }
        })
      }
      if (this.beforeScroll) {
        let me = this
        this.scroll.on('beforeScrollStart', () => {
          me.$emit('beforeScroll')
        })
      }
    },
    enable() {
      //  this.scroll存在才会执行this.scroll.enable()
      this.scroll && this.scroll.enable()
    },
    disable() {
      this.scroll && this.scroll.disable()
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        console.log('刷新')
        this.refresh()
      }, this.refreshTime)
    }
  }
}
</script>

<style scoped lang="scss">
</style>