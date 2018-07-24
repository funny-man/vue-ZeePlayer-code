<template>
  <div class="search-list">
    <ul>
      <li class="search-item" v-for="(item,index) in searches" :key="index" @click="selectItem(item)">
        <span class="text">{{ item }}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="vue-music-icon icon-icon-test"></i>
        </span>
      </li>
    </ul>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    searches: {
      type: Array,
      default: function () { return [] }
    }
  },
  methods: {
    selectItem(item) {
      this.$emit('select', item)
    },
    deleteOne(item) {
      this.$emit('delete', item)
    }
  }
}
</script>
<style scoped lang="scss">
@import "~common/sass/variable";
.search-list {
  margin-top: 5px;
  ul {
    .search-item {
      display: flex;
      align-items: center;
      font-size: $font-size-m;
      color: $color-text-l;
      padding: 6px 0;
      .text {
        flex: 1;
      }
      .icon{
        padding: 6px;
        margin-right: -6px;
      }
    }
  }
}
</style>