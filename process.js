process.on('uncaughtException', (e, origin) => {
    if (e?.code === 'ECONNRESET') {
      console.error(e)
      return
    }
    if (e.stack) console.log('e.stack', e.stack)

    console.error('UNCAUGHT EXCEPTION', e, e.stack, origin)
    process.exit(1)
  })