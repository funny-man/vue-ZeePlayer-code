//  用Promise封装一个jsonp供后面使用
import originJSONP from 'jsonp'
//  下面是吧JSONP用promise封装起来供后面使用
export default function jsonp(url, data, option) {
  return new Promise((resolve, reject) => {
    url += (url.indexOf('?') >= 0 ? '&' : '?') + paran(data)
    //  JSONP的三个参数url, option，fn
    //  fn是个回调函数；有两个参数是err，和data
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}
function paran(data) {
  let url = ''
  for (let key in data) {
    let value = data[key] !== undefined ? data[key] : ''
    url += `&${key}=${encodeURIComponent(value)}`
  }
  return url ? url.substring(1) : ''
}