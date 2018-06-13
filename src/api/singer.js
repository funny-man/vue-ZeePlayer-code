//  singer页面的所有数据获取接口

import Jsonp from 'common/js/jsonp'
import { commonParams, options } from './jsonp-data-config'

//  获取singer数据
export function getSinger() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: '100',
    pagenum: '1',
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    g_tk: 1664029744
  })
  return Jsonp(url, data, options)
}

//  获取singerDetail数据
export function getSingerDetail(singerId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 50,
    songstatus: 1,
    g_tk: 2122270467,
    singermid: singerId
  })
  return Jsonp(url, data, options)
}