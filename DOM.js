const docGetSizes = (o) => {
  let sizes = o.getBoundingClientRect();
  let scrollX = window.scrollX;
  let scrollY = window.scrollY;

  return {
    height: sizes.height,
    width: sizes.width,

    top: sizes.top + scrollY,
    bottom: sizes.bottom + scrollY,
    left: sizes.left + scrollX,
    right: sizes.right + scrollX,
    x: sizes.x + scrollX,
    y: sizes.y + scrollY,
  };
};

export class DOM {
  constructor(data) {
    this.data = data || {};

    const { id, type, txt, events, css, addShadowDOM } = this.data;

    const o = document.createElement(type || 'div');
    this.dom = o;

    if (txt) o.innerText = txt;

    const classD = this.data['class'];
    if (classD) {
      o.className = Array.isArray(classD) ? classD.join(' ') : classD;
    }
    if (events) for (let k in events) o.addEventListener(k, events[k]);
    if (css) for (let k in css) o.style[k] = css[k];
  }

  setDOM(dom) {
    this.dom = dom;
  }
  getDOM() {
    return this.dom;
  }
  getId() {
    return this.dom.id;
  }

  on(eventName, callback) {
    this.getDOM().addEventListener(eventName, callback);
  }
  off(eventName, callback) {
    this.getDOM().removeEventListener(eventName, callback);
  }

  setTxt(txt) {
    this.getDOM().innerText = txt;
  }
  getTxt() {
    return this.getDOM().innerText;
  }
  setHtml(txt) {
    this.getDOM().innerHTML = txt;
  }

  setVal(val) {
    this.getDOM().value = val;
  }
  getVal() {
    return this.getDOM().value;
  }

  setAttr(k, v) {
    this.getDOM().setAttribute(k, v);
    return this;
  }
  setCss(x) {
    const o = this.getDOM();
    for (let p in x) {
      o.style[p] = x[p];
    }
  }
  getSizes() {
    //return docGetSizes(this.getDOM());
  }
  addClass(className) {
    this.getDOM().classList.add(className);
  }
  removeClass(className) {
    this.getDOM().classList.remove(className);
  }
  attachCSS() {
    //const css = new Dom({ type: 'style', txt: this.css });
    //this.ins(css);
  }
  attachShadow() {
    this.shadow = this.getDOM().attachShadow({ mode: 'open' });
    return this.shadow;
  }

  ins(DOM) {
    if (this.shadow) {
      this.shadow.appendChild(DOM.getDOM());
      return;
    }
    this.dom.appendChild(DOM.getDOM());
  }
  append(DOM) {
    this.getDOM().append(DOM);
  }
}