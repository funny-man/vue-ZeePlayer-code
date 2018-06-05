<template>
  <!-- @touchmove.prevent阻止头部加tab的touchmove事件 -->
  <!-- 由于下面是固定定位#app相当于只包裹了m-header和tab所以@touchmove.prevent作用于#app相当于只作用于m-header和tab -->
  <div id="app" @touchmove.prevent>
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
import Tab from 'components/tab/tab'
export default {
  components: {
    MHeader,
    Tab
  }
}
</script>

<style scoped lang="scss">
</style>