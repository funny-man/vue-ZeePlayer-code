import { playMode } from 'common/js/config'
import { loadSearch, loadPlay } from 'common/js/cache'

const state = {
  singer: {},
  //  设置播放器控件的状态
  playing: false,
  fullScreen: false,
  playlist: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  disc: {},
  topList: {},
  searchHistory: loadSearch(),
  playHistory: loadPlay()
}

export default state