await b.s('state.import', async (x) => {
    //await b.p('sh', { cmd: 'unzip state.zip state' });
  })
  await b.s('state.export', async (x) => {
    //await b.p('sh', { cmd: 'zip -vr state.zip state' });
  })
  await b.s('state.validate', async (x) => {
    const list = await fs.readdir('./state')
    const fSet = new Set()
    for (let i of list) {
      if (i === '.gitignore' || i === 'root' || i === 'sys') continue
      fSet.add(i)
    }
    const v = await b.x({ get: { id: 'root', useRepo: true } })
    const varIds = await getVarIds({ b, v })

    for (let i of varIds) fSet.delete(i)
    console.log('files that not exists in varIds', fSet)
  })