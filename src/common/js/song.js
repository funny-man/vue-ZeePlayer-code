import { getLyric } from 'api/song'
import { ERR_OK } from 'api/jsonp-data-config'
import { Base64 } from 'js-base64'

// 通过类的初始化处理song数据保留需要用到的
export default class Song {
  constructor({ id, mid, singer, name, album, duration, image }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
  }
  getLyric() {
    // 这里用Promise的原因就是每次通过Promise吧res.lyric传出去这样player.vue中就可以在then中得到数据在处理数据

    // 判断如果获取过各次数据则只要重新把歌词传到player.vue就好
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    // 否则直接获取歌词并通过Promise异步传给player.vue
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        console.log('请求.........歌词')
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          // eslint-disable-next-line
          reject('no lyric')
        }
      })
    })
  }
}
export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`
  })
}
export function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((el) => {
    ret.push(el.name)
  })
  return ret.join('/')
}