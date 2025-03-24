x.s('getUUID', () => {
    if (!window.crypto?.randomUUID) {
      const replaceFunc = (c) => {
        const uuid = (Math.random() * 16) | 0,
          v = c == 'x' ? uuid : (uuid & 0x3) | 0x8
        return uuid.toString(16)
      }
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        replaceFunc
      )
    }
    return crypto.randomUUID()
  })