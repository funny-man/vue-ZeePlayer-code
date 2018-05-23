import Jsonp from 'common/js/jsonp'
import { commonParams, options } from './jsonp-data-config'

export function getEssence() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  return Jsonp(url, data, options)
}