//  essence页面的所有数据获取接口

import Jsonp from 'common/js/jsonp'
import { commonParams, options } from './jsonp-data-config'
import axios from 'axios'

//  首页轮播图的数据获取
export function getSliders() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    hostUin: 0,
    needNewCode: 1,
    format: 'jsonp'
  })
  return Jsonp(url, data, options)
}

//  歌单的数据获取
export function getHotList() {
  const url = '/api/getHotList'
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    uin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getSongList(disstid) {
  const url = '/api/getSongList'
  const data = Object.assign({}, commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    song_num: 20
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    let ret = res.data
    if (typeof ret === 'string') {
      let reg = /^\w+\((\{.*\})\)$/
      let matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    return Promise.resolve(ret)
  })
}