const createDataProxy = (data, x) =>
    new Proxy(() => {}, {
      get(t, prop) {
        if (prop === 'p') return (...args) => x.p(...args)
        if (prop === 's') {
          return (...args) => {
            x.s(...args)
            return x
          }
        }
        if (prop === 'toJSON') return () => data

        return data[prop]
      },
      set(t, prop, value) {
        data[prop] = value
        return true
      },
  })

export const psbus = () => {
    const x = {
      events: {}, //for possible events in future
      func: {},
      
      async p(event, data = {}) {
        const dataObject = typeof data === 'function' ? data : createDataProxy(data, x)

        const func = this.func[event]
        if (!func) {
          const events = this.events
          if (!events[event]) events[event] = []

          const { promise, resolve } = Promise.withResolvers()
          events[event].push({ data, resolve })

          console.log(`deffered event [${event}]`)
          return promise
        }

        if (typeof func !== 'function') console.log(event, func)
        return func(dataObject)
      },
      async s(event, func) {
        this.func[event] = func

        const events = this.events[event]
        if (!events) return this

        console.log(`executed deffered event > [${event}]`)
        for (const { data, resolve } of events) {
          const response = await this.p(event, data)
          resolve(response)
        }
        delete this.events[event]
        return this
      },
    }

    return x
  }