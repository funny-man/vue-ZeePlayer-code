//  singer页面的所有数据获取接口

import Jsonp from 'common/js/jsonp'
import { commonParams, options } from './jsonp-data-config'

//  singer数据获取
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