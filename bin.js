const bType = {
  BIN: 1,
  BOOL: 2,
  INT: 3,
  STR: 4,
  MAP: 6,
  LIST: 7,

  STYLE: 10,

  LINK: 40,

  DELETED_BLOCK: 100,
  DELETED_LINK: 101,
};

const bUtil = {
  intToUint8Array: (int) => {

    if (int < 0 || int > 0xFFFFFFFF) {
      throw new RangeError("Number is either negative or too large to be represented in 4 bytes");
    }
    let arr;

    if (int <= 0xFF) {
      //1 bytes
      arr = new Uint8Array(1);
      arr[0] = int;
    } else if (int <= 0xFFFF) {
      //2 bytes
      arr = new Uint8Array(2);
      arr[0] = int & 0xFF;
      arr[1] = (int >> 8) & 0xFF;
    } else if (int <= 0xFFFFFF) {
      // 3 bytes
      arr = new Uint8Array(3);
      arr[0] = int & 0xFF;
      arr[1] = (int >> 8) & 0xFF;
      arr[2] = (int >> 16) & 0xFF;
    } else {
      // 4 bytes
      arr = new Uint8Array(4);
      arr[0] = int & 0xFF;
      arr[1] = (int >> 8) & 0xFF;
      arr[2] = (int >> 16) & 0xFF;
      arr[3] = (int >> 24) & 0xFF;
    }

    return arr;
  },
  uint8ArrayToInt: (uint8Array) => {

    if (uint8Array instanceof Uint8Array === false) {
      throw new TypeError('Expected Uint8Array');
    }

    let int = 0;
    const length = uint8Array.length;

    for (let i = 0; i < length; i++) {
      int |= uint8Array[i] << (8 * i);
    }

    return int;
  },

  dataToUint8Array: (v) => {
    if (typeof v === 'string') {
      return new TextEncoder().encode(v);
    }
    if (typeof v === 'number') {
      return bUtil.intToUint8Array(v);
    }
    throw new Error(`dataToUint8Array invalid type [${typeof v}]`);
  },

  uint8ArrayToData: (type, arr) => {
    if (bType.INT === type) {
      return bUtil.uint8ArrayToInt(arr);
    }
    if (bType.STR === type) {
      return new TextDecoder().decode(arr);
    }
    throw new Error(`uint8ArrayToData invalid type [${type}]`);
  },
}

const bBlock = {
  read: async (bin, pos) => {

    console.log('read block pos', pos);

    const type = await bin.readByte(pos);
    if (!type) throw new Error('type not found at pos 0');

    if (type === bType.LINK) {
      return await bLink.read(bin, pos);
    }
    //if (!bType[]) throw new Error(`unknown type: [${type}]`);

    const bytesCountOfSizePos = pos + 1;
    const bytesCountOfSize = await bin.readByte(bytesCountOfSizePos);

    const sizePos = bytesCountOfSizePos + 1;
    const sizeBin = await bin.read(bytesCountOfSize, sizePos);
    if (!sizeBin) throw new Error(`size not found at pos ${sizePos}`);

    const bodySizeInt = bUtil.uint8ArrayToInt(sizeBin);

    const bodyPos = sizePos + sizeBin.length;
    const bodyBin = await bin.read(bodySizeInt, bodyPos);

    return {
      pos,
      type,
      size: 2 + sizeBin.length + bodySizeInt,
      body: {
        sizeByteCount: bytesCountOfSize,
        sizeBin,
        size: bodySizeInt,
        bin: bodyBin,
        data: bUtil.uint8ArrayToData(type, bodyBin),
      },
    };
  },

  write: async (bin, data, position) => {

    let type;

    if (typeof data === 'number') {
      type = bType.INT;
    } else if (typeof data === 'string') {
      type = bType.STR;
    } else {
      throw new Error(`invalid type of data [${typeof data}]`);
    }

    const bodyBin = bUtil.dataToUint8Array(data);
    //write type
    await bin.writeByte(type, position);

    const bodySizeBytesPos = position + 1;
    const bodySizeArr = bUtil.intToUint8Array(bodyBin.length);

    //write size of BodySize int
    await bin.writeByte(bodySizeArr.length, bodySizeBytesPos);

    //write BodySize int
    const bodySizePosition = bodySizeBytesPos + 1;
    await bin.write(bodySizeArr, bodySizePosition);

    //write Body
    const bodyPos = bodySizePosition + bodySizeArr.length;
    await bin.write(bodyBin, bodyPos);

    return {
      type,
      bodyBin,
    };
  }
}

const bLink = {
  read: async (bin, pos) => {
    console.log('read link pos', pos);

    const type = await bin.readByte(pos);
    if (type !== bType.LINK) throw new Error(`bLink.read wrong type [${type}]`);

    const sizeOfPos1 = await bin.readByte(pos + 1);
    let posCursor = pos + 2;
    const pos1Arr = await bin.read(sizeOfPos1, posCursor);

    posCursor += pos1Arr.length;
    const sizeOfPos2 = await bin.readByte(posCursor);
    const pos2Arr = await bin.read(sizeOfPos2, posCursor + 1);

    return {
      pos,
      type: bType.LINK,
      size: 3 + pos1Arr.length + pos2Arr.length, //3 bytes for type and size of pos1, and size of pos2
      pos1: bUtil.uint8ArrayToInt(pos1Arr),
      pos2: bUtil.uint8ArrayToInt(pos2Arr),
    }
  },
  write: async (bin, pos, posA, posB) => {
    await bin.writeByte(bType.LINK, pos);

    let posArr = bUtil.intToUint8Array(posA);
    await bin.writeByte(posArr.length, pos + 1);
    await bin.write(posArr, pos + 2);

    const nextPos = pos + 2 + posArr.length;

    posArr = bUtil.intToUint8Array(posB);
    await bin.writeByte(posArr.length, nextPos);
    await bin.write(posArr, nextPos + 1);
  },
}

export class bFile {
  async init(fName) {
    const fs = await import('node:fs/promises');
    this.fd = await fs.open(fName, 'a+');
  }
  async read(size, position = 0) {
    const arr = new Uint8Array(size);
    await this.fd.read(arr, 0, size, position);
    return arr;
  }
  async write(arr, position = 0, offset = 0) {
    await this.fd.write(arr, offset, arr.length, position);
    return arr;
  }
  async writeByte(int, position = 0) {
    const arr = new Uint8Array([int]);
    await this.fd.write(arr, 0, arr.length, position);
    return arr;
  }
  async readByte(position = 0) {
    const arr = new Uint8Array(1);
    await this.fd.read(arr, 0, 1, position);
    return arr[0];
  }
  async truncate(length) {
    if (!length) {
      throw new Error('length cannot be empty');
    }
    await this.fd.truncate(length);
  }
  async getSize() {
    return (await this.fd.stat()).size;
  }
  async close() {
    await this.fd.close();
  }
}

class bArr {
  async init(arr) {
    this.arr = arr;
  }
  async read(size, position = 0) {
    return this.arr.slice(position, position + size);
  }
  async write(arr, position = 0, offset = 0) { }
  async writeByte(int, position = 0) { }
  async readByte(position = 0) {
    const arr = this.arr.slice(position, position + 1);
    if (arr.length === 0) {
      return;
    }
    return arr[0];
  }
  async getSize() {
    return this.arr.length;
  }
}

const binEditor = {
  async init() {
    this.o = document.createElement('div');
    this.oShadow = this.o.attachShadow({ mode: 'open' });

    const container = document.createElement('div');
    container.className = 'container';
    this.oShadow.append(container);
    this.container = container;

    const buffer = await (await fetch('/data/data')).arrayBuffer();
    const bin = new bArr();
    await bin.init(new Uint8Array(buffer));

    const links = {};
    //container.append(document.createElement('input'));

    const renderBlock = async (block) => {
      const css = { display: 'inline' };

      const blockDom = new Dom;
      if (block.type === bType.LINK) {
        blockDom.ins(new Dom({ txt: 'L', css }));
      } else {
        const linkBtn = new Dom({ txt: '+ ', css });
        linkBtn.on('click', () => {

        });

        blockDom.ins(linkBtn);
        blockDom.ins(new Dom({ txt: 'D', css }));
      }

      blockDom.ins(new Dom({ txt: ': ', css }));

      if (block.type == bType.LINK) {
        const txt = block.pos1 + ' - ' + block.pos2;
        blockDom.ins(new Dom({ txt, css }));

        links[block.pos1] = block.pos2;
        links[block.pos2] = block.pos1;
      } else {
        blockDom.ins(new Dom({ txt: block.body.data, css }));
      }

      blockDom.ins(new Dom({ type: 'br' }));
      container.append(blockDom.getDOM());
    }
    await iterateBinBlocks(bin, async (block) => await renderBlock(block));

    console.log(links);
  }
};

export const iterateBinBlocks = async (bin, fn) => {

  const size = await bin.getSize();
  let byteCount = 0;

  while (byteCount < size) {
    const block = await bBlock.read(bin, byteCount);
    byteCount += block.size;

    if (fn) await fn(block);
  }
}

// const { bFile, iterateBinBlocks } = await import('./mod/bin.js');
// const bin = new bFile();
// await bin.init('./data/data');
// //await bin.truncate(30);

// let lastPos = 0;
// await iterateBinBlocks(bin, async (block) => {
//   if (block.size) {
//     lastPos += block.size;
//   }
//   console.log(block);
// });
// console.log('lastPos', lastPos);

// await bin.close();


//const binEditorI = Object.create(binEditor);
  //await binEditor.init();
  //const frameI = Object.create(frame);
  //await frameI.init();
  //frameI.setTitle('Data editor');
  //frameI.setContent(binEditorI.o);
  //app.ins(frameI.o);
  //window.onkeydown = (e) => dataEditor.keydown(e);