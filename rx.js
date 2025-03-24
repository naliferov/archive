const create$ = (x) => {
  const events = []
  if (x) events.push(x)

  const f = (x) => {
    events.push(x)
    return f
  }
  f.run = (callback) => {
    let chain = Promise.resolve()
    let prevResult = null

    const createResult = (e) => {
      if (typeof e === 'function') {
        return e(prevResult)
      }
      if (e && typeof e.run === 'function') {
        return new Promise((resolve, reject) => {
          e.run(() => {})
        })
      }
      return e
    }

    for (const event of events) {
      chain = chain
        .then(() => {
          const result = createResult(event)
          return result instanceof Promise ? result : Promise.resolve(result)
        })
        .then((value) => {
          prevResult = value
          if (callback) callback(value)
          return value
        })
        .catch((err) => {
          if (callback) callback(err)
          return Promise.resolve()
        })
    }
  }

  return f
}
