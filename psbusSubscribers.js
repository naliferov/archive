x.s('set', async (x) => {
    const { project = 'std', id, data } = x
    const path = `project/${project}/${id}`

    await x.p('state', { path, set: { data } })
    return { id, data }
  })
  x.s('get', async (x) => {
    let { project = 'std', get, getAll } = x
    const path = `project/${project}`

    if (getAll) return await x.p('state', { path, getAll })
    if (get) return await x.p('state', { path, get })
  })
  x.s('state', async (x) => {
    const { path } = x
    const statePath = `state/${path}`

    if (x.set) return await x.p('fs', { set: { path: statePath, data: x.set.data } })
    if (x.get) {
      const { id } = x.get
      const path = `${statePath}/${id}`
      const object = await x.p('fs', { get: { path } })
      if (object) return { object : object.toString() } //in case id.bin don't make toString
    }
    if (x.getAll) {
      const list = await x.p('fs', { readdir: { path: statePath } })
      const r = []
      for (let i of list) {
        const str = await x.p('fs', { get: { path: `${statePath}/${i}` } })
        r.push(str.toString())
      }
      return r
    }
    if (x.del) {
      //const { id } = x.del
      //const path = `${statePath}/${id}`
      //return x.p('fs', { del: { path } })
    }
  })


//frontend

x.s('server.send', async (x) => {
  const bin = x?.data?.bin
  const headers = { 'content-type': 'application/json' }
  if (bin) {
    headers['content-type'] = 'application/octet-stream'
    headers['bin-meta'] = JSON.stringify(x.data.binMeta)
  }
  const r = await fetch('/', {
    method: 'POST',
    headers,
    body: bin || JSON.stringify(x),
  })
  return r.json()
})
x.s('set', async (x) => {
    if (x.repo === 'idb') return await idb.set(x)
    return await x.p('server.send', { event: 'set', data: x })
})
x.s('get', async (x) => {
    if (x.repo === 'idb') return await idb.get(x)
    return await x.p('server.send', { event: 'get', data: x })
})