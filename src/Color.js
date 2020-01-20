export default class Color {
  constructor() {
    this.h = 0;
    this.s = 0;
    this.l = 0;
  }

  fromRgb(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const avg = (max + min) / 2;
    let [h, s, l] = [avg, avg, avg];
    if (max === min) {
      h = 0;
      s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min): d / (max + min)
      switch(max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0; break;
      }
      h /= 6;
    }
    this.h = h;
    this.s = s;
    this.l = l;
  }

  toString() {
    const { h, s, l } = this;
    return `hsl(${h * 360}, ${s * 100}%, ${l * 100}%)`;
  }
}