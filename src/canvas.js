const TWO_PI = 2 * Math.PI;

export function create(elementId) {
  const el = document.getElementById(elementId);
  const ctx = el.getContext("2d");
  return { el, ctx, w: 0, h: 0 };
}

export function resize(canvas, width, height) {
  canvas.w = width;
  canvas.h = height;
  canvas.el.width = width;
  canvas.el.height = height;
}

export function clear(canvas, color) {
  const { ctx, w, h } = canvas;
  if (color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w, h);
  } else {
    ctx.clearRect(0, 0, w, h);
  }
}

export function drawCircle(canvas, x, y, radius, color) {
  const { ctx } = canvas;
  if (radius > 0) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, TWO_PI);
    ctx.fill();
  }
}
