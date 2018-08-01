import storage from 'good-storage'

// --------------------------------------------------------------------------
// 搜索历史缓存
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

// 删除单个缓存
export function deleteSearch(keyWord) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === keyWord
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

// 清空缓存
export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

// (读取缓存)从本地获取缓存的方法用于设置state中searchHistory状态的初始值
export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

// --------------------------------------------------------------------------
// 播放历史缓存
const PLAY_KEY = '__PLAY__'
const PLAY_MAX_LENGTH = 200

// 设置缓存
export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return item.id === song.id
  }, PLAY_MAX_LENGTH)
  storage.set(PLAY_KEY, songs)
  return songs
}
// (读取缓存)
export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}
// 删除单个歌曲缓存
// export function deletePlay(keyWord) {
//   let searches = storage.get(SEARCH_KEY, [])
//   deleteFromArray(searches, (item) => {
//     return item === keyWord
//   })
//   storage.set(SEARCH_KEY, searches)
//   return searches
// }

// 清空播放缓存
// export function clearPlay() {
//   storage.remove(SEARCH_KEY)
//   return []
// }

// --------------------------------------------------------------------------
// 设置收藏的缓存
const FAVORITE_KEY = '__FAVORITE__'
const FAVORITE_MAX_LENGTH = 200
// 添加Favorite
export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => {
    return item.id === song.id
  }, FAVORITE_MAX_LENGTH)
  storage.set(FAVORITE_KEY, songs)
  return songs
}
// 删除Favorite
export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}
// (读取Favorite)
export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}
// --------------------------------------------------------------------------
// 公用函数
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
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}