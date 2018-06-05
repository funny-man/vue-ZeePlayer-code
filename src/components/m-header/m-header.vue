<template>
  <div class="m-header">
    <h1 class="music-logo">logo</h1>
    <i class="vue-music-icon icon-user"></i>
  </div>
</template>

<script type="text/ecmascript-6">
export default {}
</script>

<style scoped lang="scss">
@import "~common/sass/variable.scss";
@import "~common/sass/mixin.scss";
.m-header {
  position: relative;
  width: 100%;
  height: 44px;
  // background-color: #282d38;
  .music-logo {
    float: left;
    display: block;
    width: 86px;
    height: 32px;
    margin: 6px 0 0 0;
    @include bg-image("logo");
    text-indent: -9999px;
  }
  .icon-user {
    float: right;
    font-size: 26px;
    line-height: 44px;
    margin-right: 19px;
    color: $color-icon-3;
  }
}
</style>
