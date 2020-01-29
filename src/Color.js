export default class Color {
  constructor(r, g, b) {
    this.set(r, g, b);
  }

  set(r = 0, g = 0, b = 0) {
    this.r = r;
    this.g = g;
    this.b = b;
    return this;
  }

  lerp(color, alpha) {
    this.r += (color.r - this.r) * alpha;
    this.g += (color.g - this.g) * alpha;
    this.b += (color.b - this.b) * alpha;
    return this;
  }

  multiplyScalar(scalar) {
    this.r *= scalar;
    this.g *= scalar;
    this.b *= scalar;
    return this;
  }

  add(color) {
    this.r += color.r;
    this.g += color.g;
    this.b += color.b;
    return this;
  }

  copy(color) {
    this.r = color.r;
    this.g = color.g;
    this.b = color.b;
    return this;
  }

  toString() {
    const { r, g, b } = this;
    return `rgb(${r}, ${g}, ${b})`;
  }
}