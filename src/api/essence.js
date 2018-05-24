//  essence页面的所有数据获取接口

import Jsonp from 'common/js/jsonp'
import { commonParams, options } from './jsonp-data-config'

//  首页轮播图的数据获取
export function getEssence() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  return Jsonp(url, data, options)
}

//  歌单的数据获取
export function getHotList() {
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  return Jsonp(url, data, options)
}