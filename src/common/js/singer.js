// 通过类的初始化处理singer数据保留需要用到的
export default class Singer {
  constructor({name, id}) {
    this.id = id
    this.name = name
    this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
  }
}