<template>
  <div class="tab">
    <router-link tag="div" class="tab-item" to="/essence">
      <span class="tab-link">Essence</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/singer">
      <span class="tab-link">Singer</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/ranking">
      <span class="tab-link">Ranking</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/search">
      <span class="tab-link">Search</span>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
export default {}
</script>

<style scoped lang="scss">
@import "~common/sass/variable.scss";
  .tab {
    display: flex;
    padding: 20px 0 10px 0;
    overflow: hidden;
    .tab-item {
      padding: 10px 0;
      flex: 1;
      text-align: center;
      .tab-link {
        padding-bottom: 4px;
        font-size: $font-size-s-x;
        color: $color-theme-text-s;
      }
    }
    .router-link-active {
      .tab-link {
        color: $color-theme-text-l;
        font-size: $font-size-l;
        font-weight: 700;
        border-bottom: 2px solid $color-theme-1;
      }
    }
  }
</style>