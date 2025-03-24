const frame = {
  setB(b) {
    this.b = b
  },
  async createStyle() {
    const css = `
    .shadow {
        box-shadow: 0 2px 4px 0 rgba(0,0,0,0.2);
    }
    .frame {
        position: absolute;
        overflow: hidden;
    }
    /* this create small glitches when after start and drag window */
    .frame.drag {
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none;   /* Chrome/Safari/Opera */
        -khtml-user-select: none;    /* Konqueror */
        -moz-user-select: none;      /* Firefox */
        -ms-user-select: none;       /* Internet Explorer/Edge*/
        user-select: none;
    }
    .frame.drag .topBar {
        cursor: move;
    }
    .frameTitle {
        font-family: 'Roboto', sans-serif;
        font-weight: bold;
        white-space: nowrap;
        padding: 2px 0 2px 5px;
        background: #ededed;
    }
    .resizer {
        position: absolute;
        min-width: 0.8em;
        min-height: 0.8em;
    }
    .resizeTop {
      left: .5em;
      right: .5em;
      top: -.5em;
      cursor: ns-resize;
    }
    .resizeBottom {
        left: 0.5em;
        right: 0.5em;
        bottom: -0.5em;
        cursor: ns-resize;
    }
    .resizeLeft {
      top: .5em;
      bottom: .5em;
      left: -.5em;
      cursor: ew-resize;
    }
    .resizeRight {
      top: .5em;
      bottom: .5em;
      right: -.5em;
      cursor: ew-resize;
    }
    .resizeTopLeft {
      cursor: nwse-resize;
      left: -.5em;
      top: -.5em;
    }
    .resizeTopRight {
      cursor: nesw-resize;
      right: -.5em;
      top: -.5em;
    }
    .resizeBottomLeft {
      cursor: nesw-resize;
      left: -.5em;
      bottom: -.5em;
    }
    .resizeBottomRight {
      cursor: nwse-resize;
      right: -.5em;
      bottom: -.5em;
    }
    .frameContainer {
      padding: 0 5px;
    }
        `
    return await this.b.p('doc.mk', { type: 'style', txt: css })
  },

  async init() {
    const p = async (event, data) => await this.b.p(event, data)

    this.o = await p('doc.mk', {
      mkApi: true,
      class: ['frame'],
      css: {
        position: 'absolute',
        minWidth: '100px',
        minHeight: '100px',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
        transition: '0.3s',
        overflow: 'hidden',
      },
    })
    this.oShadow = this.o.attachShadow({ mode: 'open' })
    this.oShadow.append(await this.createStyle())

    const topBar = await p('doc.mk', { class: ['topBar'] })
    this.oShadow.append(topBar)

    this.frameTitle = await p('doc.mk', { class: ['frameTitle'], txt: '' })
    topBar.append(this.frameTitle)

    const frameContainer = await p('doc.mk', { class: ['frameContainer'] })
    this.oShadow.append(frameContainer)

    const slot = await p('doc.mk', { type: 'slot' })
    slot.setAttribute('name', 'content')
    frameContainer.append(slot)

    topBar.addEventListener('pointerdown', (e) => this.dragAndDrop(e))

    const resizeTop = await p('doc.mk', {
      mkApi: true,
      class: ['resizer', 'resizeTop'],
    })
    this.oShadow.append(resizeTop.getDOM())
    resizeTop.on('pointerdown', (e) => this.resizeTop(e, resizeTop))

    const resizeBottom = await p('doc.mk', {
      mkApi: true,
      class: ['resizer', 'resizeBottom'],
    })
    this.oShadow.append(resizeBottom.getDOM())
    resizeBottom.on('pointerdown', (e) => this.resizeBottom(e, resizeTop))

    const resizeLeft = await p('doc.mk', {
      mkApi: true,
      class: ['resizer', 'resizeLeft'],
    })
    this.oShadow.append(resizeLeft.getDOM())
    resizeLeft.on('pointerdown', (e) => this.resizeLeft(e))

    const resizeRight = await p('doc.mk', {
      mkApi: true,
      class: ['resizer', 'resizeRight'],
    })
    this.oShadow.append(resizeRight.getDOM())
    resizeRight.on('pointerdown', (e) => this.resizeRight(e))

    const resizeTopLeft = await p('doc.mk', {
      mkApi: true,
      class: ['resizer', 'resizeTopLeft'],
    })
    this.oShadow.append(resizeTopLeft.getDOM())
    resizeTopLeft.on('pointerdown', (e) => this.resizeTopLeft(e))

    const resizeTopRight = await p('doc.mk', {
      mkApi: true,
      class: ['resizer', 'resizeTopRight'],
    })
    this.oShadow.append(resizeTopRight.getDOM())
    resizeTopRight.on('pointerdown', (e) => this.resizeTopRight(e))

    const resizeBottomLeft = await p('doc.mk', {
      mkApi: true,
      class: ['resizer', 'resizeBottomLeft'],
    })
    this.oShadow.append(resizeBottomLeft.getDOM())
    resizeBottomLeft.on('pointerdown', (e) => this.resizeBottomLeft(e))

    const resizeBottomRight = await p('doc.mk', {
      mkApi: true,
      class: ['resizer', 'resizeBottomRight'],
    })
    this.oShadow.append(resizeBottomRight.getDOM())
    resizeBottomRight.on('pointerdown', (e) => this.resizeBottomRight(e))
  },
  setStyle(o) {
    this.o.setStyle(o)
  },
  setTitle(title) {
    this.frameTitle.innerText = title
  },
  setContent(content) {
    content.setAttribute('slot', 'content')
    this.o.append(content)
  },
  setEventHandler(cb) {
    this.q.worker = cb
  },
  setOnPointerup() {
    window.onpointerup = () => {
      window.onpointermove = null
      this.o.removeClass('noselect')
      window.onpointerup = null
    }
  },
  dragAndDrop(e) {
    const viewSizes = this.o.getSizes()
    const shift = { x: e.clientX - viewSizes.x, y: e.clientY - viewSizes.y }
    this.o.addClass('noselect')

    window.onpointermove = (e) => {
      const left = e.clientX - shift.x
      const top = e.clientY - shift.y
      this.o.setStyle({
        left: left + 'px',
        top: top + 'px',
      })
      this.q.push({ left })
      this.q.push({ top })
    }
    window.onpointerup = (e) => {
      window.onpointermove = null
      this.o.removeClass('noselect')
      window.onpointerup = null
    }
  },
  resizeTop(e) {
    const sizes = this.o.getSizes()
    this.o.addClass('noselect')

    window.onpointermove = (e) => {
      const top = e.clientY
      const height = sizes.bottom - e.clientY
      this.o.setStyle({
        top: top + 'px',
        height: height + 'px',
      })
      this.q.push({ top })
      this.q.push({ height })
    }
    this.setOnPointerup()
  },
  resizeBottom(e) {
    const sizes = this.o.getSizes()
    this.o.addClass('noselect')

    window.onpointermove = (e) => {
      const height = e.clientY - sizes.top
      this.o.setStyle({ height: height + 'px' })
      this.q.push({ height })
    }
    this.setOnPointerup()
  },
  resizeLeft(e) {
    const sizes = this.o.getSizes()
    this.o.addClass('noselect')

    window.onpointermove = (e) => {
      const left = e.clientX
      const width = sizes.right - e.clientX
      this.o.setStyle({
        left: left + 'px',
        width: width + 'px',
      })
      this.q.push({ left })
      this.q.push({ width })
    }
    this.setOnPointerup()
  },
  resizeRight(e) {
    const sizes = this.o.getSizes()
    this.o.addClass('noselect')

    window.onpointermove = (e) => {
      const width = e.clientX - sizes.left
      this.o.setStyle({ width: width + 'px' })
      this.q.push({ width })
    }
    this.setOnPointerup()
  },
  resizeTopLeft(e) {
    const sizes = this.o.getSizes()
    this.o.addClass('noselect')

    window.onpointermove = (e) => {
      const left = e.clientX
      const width = sizes.right - e.clientX

      const top = e.clientY
      const height = sizes.bottom - e.clientY

      this.o.setStyle({
        left: left + 'px',
        top: top + 'px',
        width: width + 'px',
        height: height + 'px',
      })
      this.q.push({ left })
      this.q.push({ top })
      this.q.push({ width })
      this.q.push({ height })
    }
    this.setOnPointerup()
  },
  resizeTopRight(e) {
    const sizes = this.o.getSizes()
    this.o.addClass('noselect')

    window.onpointermove = (e) => {
      const width = e.clientX - sizes.left
      const top = e.clientY
      const height = sizes.bottom - e.clientY

      this.o.setStyle({
        top: top + 'px',
        width: width + 'px',
        height: height + 'px',
      })
      this.q.push({ top })
      this.q.push({ width })
      this.q.push({ height })
    }
    this.setOnPointerup()
  },
  resizeBottomLeft(e) {
    const sizes = this.o.getSizes()
    this.o.addClass('noselect')

    window.onpointermove = (e) => {
      const left = e.clientX
      const width = sizes.right - e.clientX
      const height = e.clientY - sizes.top
      this.o.setStyle({
        left: left + 'px',
        width: width + 'px',
        height: height + 'px',
      })
      this.q.push({ left })
      this.q.push({ width })
      this.q.push({ height })
    }
    this.setOnPointerup()
  },
  resizeBottomRight(e) {
    const sizes = this.o.getSizes()
    this.o.addClass('noselect')

    window.onpointermove = (e) => {
      const width = e.clientX - sizes.left
      const height = e.clientY - sizes.top
      this.o.setStyle({
        width: width + 'px',
        height: height + 'px',
      })
      this.q.push({ width })
      this.q.push({ height })
    }
    this.setOnPointerup()
  },
}