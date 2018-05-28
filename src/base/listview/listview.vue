<template>
  <scroll class="listview" :data="data">
    <ul>
      <li v-for="(group,index) in data" :key="index">
        <h4 class="list-group-title">{{ group.title }}</h4>
        <ul>
          <li class="list-group-items" v-for="(item,index) in group.items" :key="index">
            <img class="avatar" v-lazy="item.avatar" alt="">
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut">
      <ul>
        <li v-for="(item ,index) in shortcutList" :key="index">{{ item }}</li>
      </ul>
    </div>
  </scroll>
</template>

<script >
import Scroll from 'base/scroll/scroll'
export default {
  props: {
    data: {
      type: Array,
      default: null
    }
  },
  computed: {
    shortcutList() {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    }
  },
  components: {
    Scroll
  }
}
</script>

<style scoped lang="scss">
@import "~common/sass/variable.scss";
.listview {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  h4 {
    background-color: $color-timeline-loading;
    font-size: $font-size-s-x;
    color: $color-theme-1;
    line-height: 3;
    padding-left: 10px;
  }
  .list-group-items {
    display: flex;
    padding: 10px 0;
    margin: 0 19px;
    align-items: center;
    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
    .name {
      flex: 1;
      margin-left: 14px;
      font-size: $font-size-m;
      color: $color-theme-text-s;
    }
  }
  .list-shortcut {
    position: absolute;
    top: 50%;
    right: 4px;
    transform: translate(0, -50%);
    padding: 10px 4px;
    text-align: center;
    border-radius: 20px;
    background-color: $color-timeline-loading;
    font-size: $font-size-s;
    color: $color-text-l;
    opacity: .4;
    ul {
      li {
        margin: 6px 0;
      }
    }
  }
}
</style>