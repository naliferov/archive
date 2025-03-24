export const txtEditor = {
  setB(b) {
    this.b = b;
  },
  //set_(_) { this._ = _; },
  async init() {
    const p = async (event, data) => await this.b.p(event, data);
    this.o = await p('doc.mk', { class: 'txtEditor' });
    this.oShadow = this.o.attachShadow({ mode: 'open' });
    //this.oShadow.append(await this.createStyle());
    //this.oShadow.addEventListener('contextmenu', (e) => this.handleContextmenu(e));
    //this.oShadow.addEventListener('pointerdown', (e) => this.click(e));

    this.container = await p('doc.mk', { class: 'container' });
    this.oShadow.append(this.container);

    const someTxt = await p('doc.mk', { type: 'pre', txt: 'alert(10)' });
    this.container.append(someTxt);
  },
};