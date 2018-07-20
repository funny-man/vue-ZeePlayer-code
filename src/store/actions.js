import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'

// 当多个状态一起操作也可以在这里面设置；
// 例如同时要设置播放的列表播放器显示状态...

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

//   歌单歌手页面点击播放歌曲初始化（整个歌单加入播放列表）
export const selectPlay = function ({ commit, state }, { list, index }) {
  console.log(1)
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    index = findIndex(randomList, list[index])
    commit(types.SET_PLAYLIST, randomList)
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
//   随机播放初始化
export const randomPlay = function ({ commit }, list) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
//   搜索列表播放歌曲初始化（单个歌曲插入播放列表）
//   整个搜索到个歌曲点击播放逻辑是>>先插入到当前播放歌曲后面>>然后查找是否有同样歌曲>>然后删除同样歌曲
export const insertSong = function ({ commit, state }, song) {
  // ****
  // 这里在state.playlist后面使用slice()是为了创建一个副本
  // 如果不创建副本由于state.playlist是一个对象直接复制是浅拷贝当下面修改playlist同时会修改state.playlist
  // 而vux里面的state只能通过commit方式修改
  // 因此我们要深拷贝state.playlist到playlist
  // state.currentIndex由于是数字所以不存在这个问题
  // ****
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playlist[currentIndex]
  // 判断当前点击的歌曲是不是在当前播放列表并且返回索引
  let fpIndex = findIndex(playlist, song)
  // 当前播放歌曲后面插入新增歌曲
  playlist.splice(currentIndex + 1, 0, song)
  // 插入歌曲为当前播放歌曲所以+1
  currentIndex++
  // 判断是否包含这首歌做相应操作
  if (fpIndex > -1) {
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1)
      currentIndex--
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
  }
  // 同是要修改sequenceList
  // 由于有随机播放歌曲的情况所以playlist和sequenceList有可能是不一致的所以要分开添加
  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  let fsIndex = findIndex(sequenceList, song)
  sequenceList.splice(currentSIndex, 0, song)
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}