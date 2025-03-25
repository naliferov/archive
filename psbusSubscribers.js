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