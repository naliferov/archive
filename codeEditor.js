const codeEditor = {
  
  async createStyle(x) {
    const css = `
.container {
  font-family: 'Roboto', sans-serif;
  font-size: 1em;
  color: rgb(55, 53, 47);
  background: rgb(80 80 80);
}
.inline { display: inline; }
.hidden { display: none; }
.header {
    font-weight: bold;
    font-size: 1.2em;
    margin-bottom: 8px;
}
.menu {
    position: absolute;
    background: lightgray;
    min-width: 100px;
}
.menuBtn {
    cursor: pointer;
    padding: 1px 7px;
    white-space: nowrap;
}
.menuBtn:hover {
    background: #ababab;
}
div[contenteditable="true"] {
    outline: none;
}
.row {
    margin-left: 16px;
}
.key {
    cursor: pointer;
    border: 1px solid transparent;
    display: inline;
    font-weight: bold;
}
.val {
    cursor: pointer;
    border: 1px solid transparent;
}
.val > img {
    max-width: 100px;
}
.key.mark,
.val.mark {
    background: lightblue;
}
.key[contenteditable="true"],
.val[contenteditable="true"]
 {
    cursor: inherit;
    border: 1px solid rgb(148 148 148);
}
.openClose {
  font-family: monospace;
  font-size: 1.1em;
  cursor: pointer;
  margin-right: 5px;
}
`;
    return await x.p('docMkElement', { tag: 'style', txt: css })
  },

  async addSymbol() {
    const opentype = await import('https://cdn.jsdelivr.net/npm/opentype.js/dist/opentype.module.js');  
    const font = await opentype.load('https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf');

    const addSymbol = (symbol, x, y, fontSize) => {
      ctx.beginPath()

      const glyph = font.charToGlyph(symbol)
      const path = glyph.getPath(x, y, fontSize)
      path.commands.forEach(cmd => {
        if (cmd.type === 'M') ctx.moveTo(cmd.x, cmd.y)
        if (cmd.type === 'L') ctx.lineTo(cmd.x, cmd.y)
        if (cmd.type === 'C') ctx.bezierCurveTo(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y)
        if (cmd.type === 'Q') ctx.quadraticCurveTo(cmd.x1, cmd.y1, cmd.x, cmd.y)
        if (cmd.type === 'Z') ctx.closePath()
      })
      ctx.fillStyle = 'white'
      ctx.fill()
    }

    const addTxt = (txt) => {
      const ascender = font.ascender;
      const ascenderPx = (ascender / font.unitsPerEm) * fontSize;

      const x = 0;

      for (let i = 0; i < txt.length; i++) {
        addSymbol(txt[i], x, ascenderPx, fontSize)
      }
    }

    addTxt('S')
  },

  async init(x, code) {
    this.o = await x.p('docMkElement', { class: 'codeEditor' })
    this.oShadow = this.o.attachShadow({ mode: 'open' })
    this.oShadow.append(await this.createStyle(x))

    //this.oShadow.addEventListener('contextmenu', (e) => this.handleContextmenu(e));
    //this.oShadow.addEventListener('pointerdown', (e) => this.click(e));

    const container = await x.p('docMkElement', { class: 'container' })
    this.oShadow.append(container)
    this.container = container

    const canvas = await x.p('docMkElement', { tag: 'canvas' })
    container.append(canvas)

    const width = 400
    const height = 250
    const dpr = window.devicePixelRatio || 1

    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = true
    ctx.scale(dpr, dpr)

    ctx.strokeStyle = '#8afd8a'
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(200, 0)
    ctx.stroke()

    ctx.font = `14px 'JetBrains Mono', monospace`
    ctx.fillStyle = '#8afd8a'

    const txt = 'await await g H i = 0'
    const txt2 = 'ititi await Ä H i = 0'
    const txt3 = 'op922 await g H i = 0'
    const txt4 = 'await await Ä H i = 0'

    const metrics = ctx.measureText(txt); console.log(metrics.fontBoundingBoxAscent, metrics)
    const lineHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent
    const firstBaseLineY = metrics.fontBoundingBoxAscent

    const addTxt = (txt, line) => {

      let y = firstBaseLineY

      if (line === 2) {
        y += lineHeight
      } else if (line > 2) {
        y += (lineHeight * (line - 1))
      }

      ctx.fillText(txt, 0, y)
    }
    addTxt(txt, 1)
    addTxt(txt2, 2)
    addTxt(txt3, 3)
    addTxt(txt4, 4)


    //addTxt(txt, 3)




    // const lineNum = 1
    // const cursorWidth = 1
    // const cursorX = 0
    // const cursorY = metrics.fontBoundingBoxAscent

    // ctx.fillStyle = 'white'
    // ctx.fillRect(cursorX, cursorY, cursorWidth, lineHeight);

    window.onkeydown = (e) => {
      if (e.key === 'ArrowRight') {
        console.log('add cursor')
      }
    }




    //addLine(txt, 1)
    //addLine(txt, 2)

    
    // const k = this.root;
    // const root = await this.mkRow({
    //   k,
    //   v: { m: {}, o: [], i: { id: k, t: 'm' } },
    //   id: k,
    // });
    // container.append(root);

    // const openedIds = await this.getOpenedIds();
    // const v = await p('x', {
    //   get: { id: k, subIds: [...openedIds], getMeta: true },
    // });

    //console.log(v);
    //await this.rend(v, root);
    //const v = await p('x', { get: { path: 'settings', subIds: [...openedIds], getMeta: true } });
    //apply setting from

    return this.o
  },

  async rend(v, parentRow) {

    const getVId = (v) => {
      if (v.i) return v.i.id
    }
    const id = getVId(v)
    if (!id) {
      console.log('Unknown VAR', v)
      return
    }

    if (v.m) {
      if (!v.o) {
        console.error('No order array for map', id, v);
        return;
      }

      let mod;

      for (let k of v.o) {
        if (!v.m[k]) {
          console.error(`Warning key [${k}] not found in map`, v.o, v.m);
          return;
        }

        const curV = v.m[k];
        const curVId = getVId(curV);
        if (!curVId) {
          console.log('id not found', v);
          return;
        }

        const row = await this.mkRow({ k, v: curV, parentId: id, id: curVId });
        this.rowInterface(parentRow).val.append(row);

        if (k === '__mod') {
          mod = curV;
          this.setDomIdToMod(mod, this.rowInterface(row).getDomId());
        }

        await this.rend(curV, row);
      }

      if (mod && !mod.i.modApplied) {
        await this.applyMod(mod.i.domId);
        mod.i.modApplied = true;
      }
    } else if (v.l) {
      for (let curV of v.l) {
        const curVId = getVId(curV);
        if (!curVId) {
          console.log('2: Unknown type of VAR', curV, v.l);
          return;
        }

        const row = await this.mkRow({ v: curV, parentId: id, id: curVId });
        this.rowInterface(parentRow).val.append(row);
        await this.rend(curV, row);
      }
    } else if (v.i || v.v) {
    } else console.log('Unknown type of var', v);
  },
}

export const codeEditorFactory = () => Object.create(codeEditor)