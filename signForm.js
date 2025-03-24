const signForm = () => {
  const act = path === '/sign/in' ? 'Sign In' : 'Sign Up';

  const signForm = new Dom({ class: 'signForm' });
  app.ins(signForm);

  const signHeader = new Dom({ class: 'header', txt: act });
  signForm.ins(signHeader);

  const email = new Dom({ type: 'input', class: 'email', txt: '' });
  signForm.ins(email);

  signForm.ins(new Dom({ type: 'br' }));

  const password = new Dom({ type: 'input', class: 'password', txt: '' });
  signForm.ins(password);

  signForm.ins(new Dom({ type: 'br' }));

  const btn = new Dom({ type: 'button', class: 'btn', txt: act });
  signForm.ins(btn);

  btn.on('pointerdown', async (e) => {
    if (act === 'Sign Up') {
      // const r = await b.p('x', {
      //   signUp: {
      //     email: email.getVal(),
      //     password: password.getVal(),
      //   }
      // });
      // console.log(r);
    }
  });
}