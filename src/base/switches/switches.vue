<template>
<div class="switches">
  <ul>
    <li class="switch-item"
        :class="{'active':currentIndex===index}"
        v-for="(item,index) in switches"
        :key="index"
        @click="switchItem(index)"
    >
      <span>{{ item.name }}</span>
    </li>
  </ul>
</div>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    switches: {
      type: Array,
      default: () => { return [] }
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    switchItem(index) {
      this.$emit('switch', index)
    }
  }
}
</script>
<style scoped lang="scss">
@import "~common/sass/variable";
.switches {
  display: inline-block;
  width: 100%;
  ul {
    display: flex;
    align-items: center;
    width: 200px;
    margin: 0 auto;
    border: 1px solid $color-theme-text-s;
    border-radius: 4px;
  }
  .switch-item {
    flex: 1;
    padding: 6px;
    text-align: center;
    font-size: $font-size-m;
    color: $color-theme-text-s;
    &.active {
      background: $color-theme-text-s;
      color: $color-theme-text-l;
    }
  }
}
</style>