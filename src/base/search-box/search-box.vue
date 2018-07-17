<template>
  <div id="search-box">
    <div class="search-wrapper">
      <i class="vue-music-icon icon-search"></i>
      <input type="text" class="box" :placeholder="inputPrompt" v-model="keyWord"/>
      <div class="del" v-show="keyWord" @click="clear">
        <i class="vue-music-icon icon-icon-test"></i>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    inputPrompt: {
      type: String,
      default: '说出你的故事...'
    }
  },
  data() {
    return {
      keyWord: ''
    }
  },
  created() {
    this.$watch('keyWord', (newkeyWord) => {
      this.$emit('query', newkeyWord)
    })
  },
  methods: {
    clear() {
      this.keyWord = ''
    },
    setKeyWord(key) {
      this.keyWord = key
    }
  }
}
</script>
<style scoped lang="scss">
@import "~common/sass/variable";
#search-box {
  .search-wrapper {
    display: block;
    position: relative;
    margin: 0 15px;
    box-shadow: 0px 2px 6px rgba(9, 15, 28, 1);
    .icon-search {
      position: absolute;
      top: 0;
      left: 0;
      font-size: 34px;
      color: $color-bg;
      line-height: 40px;
      margin-left: 10px;
    }
    .box {
      display: block;
      background-color: #1f2633;
      width: 100%;
      height: 40px;
      border-radius: 3px;
      box-sizing: border-box;
      padding-left: 50px;
      padding-right: 38px;
      font-size: $font-size-m-x;
      color: $color-text-l;
      caret-color: $color-theme-1;
      font-weight: 500;
      outline: none;
    }
    .box::placeholder {
      color: #2c3444;
    }
    .del {
      position: absolute;
      top: 50%;
      right: 0;
      margin-top: -10px;
      width: 20px;
      height: 20px;
      background-color: $color-bg;
      border-radius: 50%;
      text-align: center;
      margin-right: 10px;
      .icon-icon-test {
        font-size: 14px;
        color: #1f2633;
        line-height: 20px;
      }
    }
  }
}
</style>