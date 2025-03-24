const signUp = async (x) => {
  const { email, password } = x.signUp
  const { b } = x[x._]
  const _ = await b.p('get_')

  let users = await b({ get: { path: 'users', useRepo: true } })
  if (!users) {
    const root = await b({ get: { id: 'root', useRepo: true } })
    users = await mkvar(b, 'm')

    if (users[_].id) {
      root.m.users = users[_].id
      root.o.push('users')

      await b({ set: { id: users[_].id, v: users } })
      await b({ set: { id: 'root', v: root } })
    }
  }

  const user = await mkvar(b, 'm')
  user.m.password = password
  user.o.push('password')

  if (users.m[email]) return { msg: 'user with this email already exists' }

  users.m[email] = user[_].id

  await b({ set: { id: user[_].id, v: user } })
  await b({ set: { id: users[_].id, v: users } })

  return { email, password }
}