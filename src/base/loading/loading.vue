<template>
  <div class="loading">
    <div class="loading-el"></div>
    <p class="loading-text" v-show="title">{{ title }}</p>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang="scss">
@import "~common/sass/variable.scss";
.loading {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  .loading-el:before {
    content: "";
    position: absolute;
    top: 0px;
    left: -18px;
    height: 10px;
    width: 10px;
    border-radius: 50%;
    animation: loaderg 1s ease-in-out infinite;
  }

  .loading-el {
    position: absolute;
    width: 10px;
    height: 10px;
    top: 50%;
    left: 50%;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: loaderm 1s ease-in-out infinite;
  }
  .loading-el:after {
    content: "";
    position: absolute;
    top: 0px;
    left: 18px;
    height: 10px;
    width: 10px;
    border-radius: 50%;
    animation: loaderd 1s ease-in-out infinite;
  }
  .loading-text {
    position: relative;
    top: 20px;
    font-size: $font-size-s;
    color: $color-theme-text-l;
  }
}
@-webkit-keyframes loaderg {
  0% {
    background-color: rgba(252, 95, 137, 0.2);
  }
  25% {
    background-color: rgba(252, 95, 137, 0.8);
  }
  50% {
    background-color: rgba(252, 95, 137, 0.2);
  }
  75% {
    background-color: rgba(252, 95, 137, 0.2);
  }
  100% {
    background-color: rgba(252, 95, 137, 0.2);
  }
}
@keyframes loaderg {
  0% {
    background-color: rgba(252, 95, 137, 0.2);
  }
  25% {
    background-color: rgba(252, 95, 137, 0.8);
  }
  50% {
    background-color: rgba(252, 95, 137, 0.2);
  }
  75% {
    background-color: rgba(252, 95, 137, 0.2);
  }
  100% {
    background-color: rgba(252, 95, 137, 0.2);
  }
}

@-webkit-keyframes loaderm {
  0% {
    background-color: rgba(252, 95, 137, 0.2);
  }
  25% {
    background-color: rgba(252, 95, 137, 0.2);
  }
  50% {
    background-color: rgba(252, 95, 137, 0.8);
  }
  75% {
    background-color: rgba(252, 95, 137, 0.2);
  }
  100% {
    background-color: rgba(252, 95, 137, 0.2);
  }
}
@keyframes loaderm {
  0% {
    background-color: rgba(252, 95, 137, 0.2);
  }
  25% {
    background-color: rgba(252, 95, 137, 0.2);
  }
  50% {
    background-color: rgba(252, 95, 137, 0.8);
  }
  75% {
    background-color: rgba(252, 95, 137, 0.2);
  }
  100% {
    background-color: rgba(252, 95, 137, 0.2);
  }
}

@-webkit-keyframes loaderd {
  0% {
    background-color: rgba(252, 95, 137, 0.2);
  }
  25% {
    background-color: rgba(252, 95, 137, 0.2);
  }
  50% {
    background-color: rgba(252, 95, 137, 0.2);
  }
  75% {
    background-color: rgba(252, 95, 137, 0.8);
  }
  100% {
    background-color: rgba(252, 95, 137, 0.2);
  }
}
@keyframes loaderd {
  0% {
    background-color: rgba(252, 95, 137, 0.2);
  }
  25% {
    background-color: rgba(252, 95, 137, 0.2);
  }
  50% {
    background-color: rgba(252, 95, 137, 0.2);
  }
  75% {
    background-color: rgba(252, 95, 137, 0.8);
  }
  100% {
    background-color: rgba(252, 95, 137, 0.2);
  }
}
</style>