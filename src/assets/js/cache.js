class LocalStorageCache {
  constructor () {
    this.name = 'cache.js'
  }
  set (key, value) {
    try {
      value = typeof value === 'object' ? JSON.stringify(value) : value
      localStorage.setItem(key, value)
    } catch (e) {
      alert('浏览器不支持LocalStorage')
    }
  }
  get (key, isObj = false) {
    try {
      var data = localStorage.getItem(key)
      return isObj ? JSON.parse(data) : data
    } catch (e) {
      alert('浏览器不支持LocalStorage')
    }
  }
  del (key) {
    localStorage.removeItem(key)
  }catch (e) {
    alert('浏览器不支持LocalStorage')
  }
}
export default new LocalStorageCache()
