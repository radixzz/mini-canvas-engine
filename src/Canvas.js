const TWO_PI = 2 * Math.PI;

export default class Canvas {
  constructor(elementId) {
    this.el = document.getElementById(elementId);
    this.ctx = this.el.getContext("2d");
    this.width = 0;
    this.height = 0;
  }

  resize(width, height) {
    const { el } = this;
    this.width = width;
    this.height = height;
    el.width = width;
    el.height = height;
  }

  clear(color) {
    const { ctx, width, height } = this;
    if (color) {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.clearRect(0, 0, width, height);
    }
  }

  drawCircle(x, y, radius, color) {
    const { ctx } = this;
    if (radius > 0) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, TWO_PI);
      ctx.fill();
    }
  }

  drawLine(p0, p1) {
    const { ctx } = this;
    ctx.moveTo(p0.x, p0.y);
    this.ctx.lineTo(p1.x, p1.y);
  }

  drawTriangle(p0, p1, p2) {
    const { ctx } = this;
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p0.x, p0.y);
    ctx.stroke();
    ctx.fill();
  }
}
