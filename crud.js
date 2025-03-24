//CHANGE ORDER
//   if (id && ok && typeof ok === 'object') {
//     const vById = await getFromRepo(id)
//     if (!vById) return { ok: 0, msg: 'v not found' }

//     const { from, to } = ok

//     if (vById.m) {
//       if (!vById.o) return { ok: 0, msg: 'v.o not found' }

//       const i = vById.o.splice(from, 1)[0]
//       vById.o.splice(to, 0, i)
//     }
//     if (vById.l) {
//       const i = vById.l.splice(from, 1)[0]
//       vById.l.splice(to, 0, i)
//     }
//     await b.p('repo', { set: { id, v: vById } })

//     return { id, ok }
//   }

  //SET key and value to id of (MAP) or add value (LIST)
//   if (type && id && v) {
//     const vById = await getFromRepo(id)
//     if (!vById) return { msg: 'v not found' }

//     let newId = await b.p('getUniqId')
//     if (id.includes('/')) newId = id.split('/')[0] + '/' + newId

//     if (type === 'm' && vById.m) {
//       if (vById.m[k]) return { msg: `k [${k}] already exists in vById` }
//       if (!vById.o) return { msg: `v.o is not found by [${id}]` }
//       if (ok === undefined) return { msg: `ok is empty` }

//       vById.m[k] = newId
//       vById.o.splice(ok, 0, k)

//       await b.p('repo', { set: { id: newId, v } })
//       await b.p('repo', { set: { id, v: vById } })

//       return { type, id, k, v, newId }
//     }
//     if (type === 'l' && vById.l) {
//       vById.l.push(newId)

//       await b.p('repo', { set: { id: newId, v } })
//       await b.p('repo', { set: { id, v: vById } })

//       return { type, id, v, newId }
//     }

//     return { msg: 'Not found logic for change vById', vById }
//   }


//SET binary file and save it's ID to specific varID
//   {
//     const { id, bin, binName } = set
//     if (id && bin && binName) {
//       const vById = await getFromRepo(id)
//       if (!vById) return { msg: 'v not found by id', id }
//       //todo clear previous binary file;

//       let ex = binName.split('.').at(-1)
//       let t = ''
//       if (
//         ex === 'jpg' ||
//         ex === 'jpeg' ||
//         ex === 'png' ||
//         ex === 'gif' ||
//         ex === 'webp'
//       ) {
//         t = 'i'
//       }

//       const newId = await b.p('getUniqId')
//       const v = { b: { id: newId, t } }

//       await b.p('repo', { set: { id: newId, v: bin, format: 'raw' } })
//       await b.p('repo', { set: { id, v } })

//       return { id }
//     }
//   }


  //COPY or MOVE MAP key from one ID to another ID
//   {
//     const { oldId, newId, key } = set

//     if (oldId && newId && oldId !== newId && key) {
//       const oldV = await getFromRepo(oldId)
//       const newV = await getFromRepo(newId)

//       if (!oldV || !newV) return { msg: 'oldV or oldV not found' }
//       if (!oldV.m || !newV.m) return { msg: 'oldV.m or newV.m not found' }
//       if (!oldV.o || !newV.o) return { msg: 'oldV.o or newV.o not found' }

//       if (!oldV.m[key]) return { msg: `key [${key}] not found in oldV.m` }
//       if (newV.m[key]) return { msg: `newV.m already have key [${key}]` }

//       newV.m[key] = oldV.m[key]
//       delete oldV.m[key]

//       const index = oldV.o.indexOf(key)
//       if (index !== -1) oldV.o.splice(index, 1)
//       newV.o.push(key)

//       await b({ set: { id: oldId, v: prepareForTransfer(oldV) } })
//       await b({ set: { id: newId, v: prepareForTransfer(newV) } })
//       return { oldId, newId, key }
//     }
//   }

//   //RENAME of key
//   {
//     const { id, oldK, newK } = set
//     if (id && oldK && newK) {
//       const v = await getFromRepo(id)
//       if (!v.m || !v.m[oldK]) {
//         return { msg: 'v.m or v.m[oldK] not found' }
//       }

//       v.m[newK] = v.m[oldK]
//       delete v.m[oldK]

//       if (!v.o) return { msg: 'o not found in map' }
//       const ok = v.o.indexOf(oldK)
//       if (ok === -1) return { msg: `order key for key [${oldK}] not found` }
//       v.o[ok] = newK

//       await b({ set: { id, v } })
//       return { id, oldK, newK }
//     }
//   }

//   //SET BY PATH
//   {
//     const { path, type, v } = set

//     if (path) {
//       const setPath = await createSet({ _, b, path, type })
//       if (!set) return

//       let data = v

//       for (let i = 0; i < setPath.length; i++) {
//         const v = setPath[i]
//         const isLast = i === setPath.length - 1

//         if (isLast) {
//           if (v.l) {
//             // const newId = await b.p('getUniqId');
//             // const newV = { _: { id: newId }, v: data };
//             // await b({ set: { id: newId, v: newV } });
//             // v.l.push(newId);
//           } else if (v.v) {
//             v.v = data
//           }

//           if (!v[_].new) v[_].updated = true
//         }

//         if (v[_].new || v[_].updated) {
//           await b({ set: { id: v[_].id, v } })
//         }
//       }

//       return setPath.at(-1)
//     }
//   }



//GET

// if (id) {
//     return await fillVar({ x, id, subIds: new Set(subIds), depth, getMeta })
//   }

//   if (path) {
//     const _ = await b.p('get_')

//     if (!Array.isArray(path) && typeof path === 'string') {
//       path = path.split('.')
//     }

//     const pathSet = await createSet({
//       x,
//       path,
//       getMeta,
//       repoName,
//       isNeedStopIfVarNotFound: true,
//     })
//     if (!pathSet) return

//     const v = pathSet.at(-1)
//     if (!v) return

//     if (useRepo) return v

//     return await fillVar({ x, v, depth, getMeta })
//   }





//DEL

//DELETE KEY IN MAP with subVars

//   if (id && k) {
//     const v = await x({ get: { id, useRepo: true } })
//     if (!v) return { msg: 'v not found' }
//     if (!v.m && !v.l) return { msg: 'v is not map and not list' }

//     const isMap = Boolean(v.m)
//     const isList = Boolean(v.l)

//     const targetId = isMap ? v.m[k] : k
//     if (!targetId) return { msg: `targetId not found by [${k}]` }

//     const targetV = await b.x({ get: { id: targetId, useRepo: true } })
//     if (!targetV) return { msg: `targetV not found by [${targetId}]` }
//     targetV[_] = { id: targetId }

//     if (isMap) {
//       if (ok === undefined) return { msg: `oKey is empty` }
//       if (!v.o) return { msg: `v.o is not found by [${id}]` }
//       if (!v.o[ok]) return { msg: `v.o[oKey] is not found by key [${ok}]` }
//     }

//     const isDelWithSubVars = await delWithSubVars({ _, b, v: targetV })
//     if (isDelWithSubVars || true) {
//       if (isMap) {
//         delete v.m[k]
//         v.o = v.o.filter((currentK) => currentK !== k)
//       } else if (isList) {
//         v.l = v.l.filter((currentK) => currentK !== k)
//       }

//       await x({ set: { id, v } })
//     }

//     return { id, k }
//   }



const delWithSubVars = async (x) => {
  const { _, b, v } = x
  const varIds = await getVarIds({ b, v })

  const len = Object.keys(varIds).length
  if (len > 50) {
    await b.p('log', { msg: `Try to delete ${len} keys at once` })
    return
  }

  for (let id of varIds) await b({ del: { id } })
  await b({ del: { id: v[_].id } })

  varIds.push(v[_].id)
  console.log('varIds for del', varIds)

  return true
}

const createSet = async (x) => {
  const { _, b, path, isNeedStopIfVarNotFound } = x
  const pathArr = [...path]
  const type = x.type || 'v'

  let v1 = await b.p('repo', { get: { id: 'root' } })
  v1[_] = { id: 'root', name: 'root' }
  if (pathArr[0] === 'root') pathArr.shift()

  let set = [v1]

  for (let i = 0; i < pathArr.length; i++) {
    const name = pathArr[i]
    if (!name) return

    const v1 = set.at(-1)
    let v2

    if (!v1.m && !v1.l) {
      console.log(`v1 hasn't m or l prop for getting name [${name}]`)
      return
    }

    let id = v1.m[name]

    if (id) {
      v2 = await b.p('repo', { get: { id } })
      if (v2) v2[_] = { id }
    }

    if (!v2) {
      if (isNeedStopIfVarNotFound) return

      const vType = i === pathArr.length - 1 ? type : 'm'
      v2 = await mkvar(b, vType, _)

      v1.m[name] = v2[_].id
      if (!v1.o) v1.o = []
      v1.o.push(name)

      if (!v1[_].new) v1[_].updated = true
    }

    v2[_].name = name

    set.push(v2)
  }

  return set
}

const mkvar = async (b, type) => {
  const _ = await b.p('get_')
  const id = await b.p('getUniqId')
  let v = {
    [_]: { id, new: true },
  }

  if (type === 'b') v.b = {}
  else if (type === 'v') v.v = true
  else if (type === 'm') {
    v.m = {}
    v.o = []
  } else if (type === 'l') v.l = []
  else if (type === 'f') v.f = {}
  else if (type === 'x') v.x = {}
  else throw new Error(`Unknown type [${type}]`)

  return v
}

const it = async (v, cb) => {
  if (v.l) {
    for (let k = 0; k < v.l.length; k++) {
      await cb({ parent: v.l, k, v: v.l[k] })
    }
    return
  }
  if (v.m) {
    for (let k in v.m) {
      await cb({ parent: v.m, k, v: v.m[k] })
    }
  }
}

const fillVar = async (x) => {
  const { b, id, subIds, getMeta, depth = 0 } = x
  let { v } = x

  if (!v && id) {
    v = await b.p('repo', { get: { id } })
    if (!v) {
      console.error(`v not found by id [${id}]`)
      return
    }
  }
  if (getMeta) v.i = { id, t: getType(v) }

  const isNeedGetVar = Boolean(subIds && v.i && subIds.has(v.i.id))
  if (!isNeedGetVar && depth <= 0) {
    let vMeta = {}
    if (v.m || v.l) {
      if (v.i) {
        vMeta.i = v.i
        vMeta.i.openable = true
      }
    } else {
      vMeta = v
    }
    return vMeta
  }

  if (v.l || v.m) {
    await it(v, async ({ parent, k, v }) => {
      parent[k] = await fillVar({
        b,
        id: v,
        subIds,
        getMeta,
        depth: depth - 1,
      })
    })
  }

  return v
}

const getVarIds = async (x) => {
  const { b, v } = x

  const ids = []
  if (!v.b && !v.m && !v.l) return ids

  const getIds = async (v) => {
    if (v.b) {
      if (v.b.id) ids.push(v.b.id)
    } else if (v.m) {
      for (let k in v.m) {
        const id = v.m[k]
        ids.push(id)
        await getIds(await b({ get: { id, useRepo: true } }))
      }
    } else if (v.l) {
      for (let id of v.l) {
        ids.push(id)
        await getIds(await b({ get: { id, useRepo: true } }))
      }
    }
  }

  await getIds(v)

  return ids
}

export const getType = (v) => {
  if (v.b) return 'b'
  if (v.m) return 'm'
  if (v.l) return 'l'
  if (v.v) return 'v'
  return 'unknown'
}

export const prepareForTransfer = (v) => {
  const d = {}

  if (v.b) d.b = v.b
  if (v.v) d.v = v.v
  if (v.m) d.m = v.m
  if (v.l) d.l = v.l
  if (v.o) d.o = v.o
  if (v.f) d.f = v.f
  if (v.x) d.x = v.x

  return d
}

// const del = async (x) => {
//   const { id } = x.del
//   if (id) return await x.p('repo', { del: { id } })
// }

// if (x.repo === 'idb') {
//     if (x.set) await idb.set(x.set)
//     if (x.get) return await idb.get(x.get)
//     return
//   }