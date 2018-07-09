import { commonParams } from './jsonp-data-config'
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