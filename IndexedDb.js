export class IndexedDb {
  
  constructor(dbName = 'default') {
    this.dbName = dbName
  }
  
  async open() {
    return new Promise((resolve, reject) => {
      const openRequest = indexedDB.open(this.dbName)
      
      openRequest.onerror = () => {
        reject(openRequest.error)
      }
      openRequest.onsuccess = () => {
        this.db = openRequest.result
        resolve(this.db)
      }
      openRequest.onupgradeneeded = () => {
        const db = openRequest.result
        if (!db.objectStoreNames.contains('default')) {
          db.createObjectStore('default')
        }
      }
    })
  }

  async set(x) {
    const { storeName = 'default', id, v } = x

    return new Promise((resolve, reject) => {
      const rq = this.db.transaction(storeName, 'readwrite').objectStore(storeName).put(v, id)
      rq.onsuccess = () => resolve(rq.result)
      rq.onerror = () => reject(rq.error)
    })
  }

  async get(x) {
    const { storeName = 'default', id } = x

    return new Promise((resolve, reject) => {
      const rq = this.db.transaction(storeName, 'readonly').objectStore(storeName).get(id)
      rq.onsuccess = () => resolve(rq.result)
      rq.onerror = () => reject(rq.error)
    })
  }

  async del(x) {
    const { storeName = 'default', id } = x

    return new Promise((resolve, reject) => {
      const rq = this.db.transaction(storeName, 'readwrite').objectStore(storeName).delete(id)
      rq.onsuccess = () => resolve(rq.result)
      rq.onerror = () => reject(rq.error)
    })
  }
}
