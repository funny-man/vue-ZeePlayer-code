import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'

// 当多个状态一起操作也可以在这里面设置；
// 例如同时要设置播放的列表播放器显示状态...

function finda(list, song) {
  console.log('hahassssssssssssssssssssss')
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

//   选择播放初始化
export const selectPlay = function ({ commit, state }, { list, index }) {
  console.log(1)
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    index = finda(randomList, list[index])
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