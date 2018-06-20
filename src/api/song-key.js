import Jsonp from 'common/js/jsonp'
import { commonParams } from './jsonp-data-config'

//  获取歌曲播放的key
export function getSongKey(songId) {
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
  const data = Object.assign({}, commonParams, {
    g_tk: 195219765,
    loginUin: 1297716249,
    hostUin: 0,
    format: 'json',
    notice: 0,
    platform: 'yqq ',
    needNewCode: 0,
    cid: 205361747,
    uin: 0,
    songmid: songId,
    filename: `C400${songId}.m4a`,
    guid: 7342124872,
    callback: 'MusicJsonCallback004680169373158849',
    jsonpCallback: 'MusicJsonCallback004680169373158849'
  })
  return Jsonp(url, data)
}