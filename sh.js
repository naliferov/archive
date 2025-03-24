await b.s('sh', async (x) => {
  const { spawn, exec } = await import('node:child_process')

  exec(x.cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec err: ${error}`)
      return
    }
    console.log(`stdout: ${stdout}`)
    console.error(`stderr: ${stderr}`)
  })
  // const cmd = x.cmd.split(' ');
  // const ls = spawn(cmd[0], cmd.slice(1));
  // ls.stdout.on('data', (data) => console.log(`stdout: ${data}`));
  // ls.stderr.on('data', (data) => console.error(`stderr: ${data}`));
  // ls.on('close', (code) => console.log(`exit code ${code}`));
})