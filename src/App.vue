<template>
  <!-- @touchmove.prevent阻止头部加tab的touchmove事件 -->
  <!-- #app相当于只包裹了m-header和tab所以@touchmove.prevent作用于#app同时作用于m-header和tab 下面的<router-view></router-view>内容用了固定定位不受影响-->
  <!-- 实现效果：不加@touchmove.prevent会导致你手指在m-header和tab滑动时候会出现偏移，然后回弹到原来位置 -->
  <div id="app" @touchmove.prevent>
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
import Tab from 'components/tab/tab'
import Player from 'components/player/player'
export default {
  components: {
    MHeader,
    Tab,
    Player
  }
}
</script>

<style scoped lang="scss">
</style>