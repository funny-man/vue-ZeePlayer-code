import { playMode } from 'common/js/config'

const state = {
  singer: {},
  //  设置播放器控件的状态
  playing: false,
  fullScreen: false,
  playlist: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  disc: {}
}

export default state