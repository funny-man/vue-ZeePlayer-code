// 工具方法

// 洗牌函数
export function shuffle(arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

// 获取区间内随机数

function getRandomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1))
}

// 节流函数
export function debounce(fn, delay) {
  // 这里的arguments是debounce的参数
  let timer
  return function () {
    // 这里的arguments是fn的参数
    var args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}