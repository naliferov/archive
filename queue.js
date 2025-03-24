const queue = {
  calls: [],
  on: false,
  worker: false,
  async push(x) {
    this.calls.push(x);
    await this.process();
  },
  async process() {
    if (this.isOn) return;
    this.isOn = true;

    while (1) {
      const x = this.calls.shift();
      if (!x) {
        this.isOn = false;
        break;
      }
      await this.worker(x);
    }
    this.isOn = false;
  },
};