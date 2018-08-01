import { commonParams, options } from './jsonp-data-config'
import Jsonp from 'common/js/jsonp'
import axios from 'axios'

export function getTopList() {
  const url = '/api/getTopList'
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    hostUin: 0,
    needNewCode: 1,
    format: 'json',
    uin: 0
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getTopMusicList(topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    needNewCode: 1,
    tpl: 3,
    page: 'detail',
    type: 'top',
    topid
  })
  return Jsonp(url, data, options)
}