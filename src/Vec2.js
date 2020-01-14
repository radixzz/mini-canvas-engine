export default  class Vec2 {
  constructor(x, y) {
    this.set(x, y);
  }

  set(x, y = x) {
    this.x = x;
    this.y = y;
  }
}