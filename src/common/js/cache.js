import storage from 'good-storage'

const SEARCH_KEY = '__SEARCH__'
const SEARCH_MAX_LENGTH = 15

// 设置缓存
export function saveSearch(keyWord) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, keyWord, (item) => {
    return item === keyWord
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, searches)
  return searches
}

function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

// 删除单个缓存
export function deleteSearch(keyWord) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === keyWord
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

// 清空缓存
export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

// 从本地获取缓存的方法用于设置state中searchHistory状态的初始值
export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}