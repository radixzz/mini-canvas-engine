import Vec2 from "./Vec2";

export default class Mouse {

  constructor({ domElement, onDrag }) {
    this.domElement = domElement;
    this.mouseDown = false;
    this.startPosition = new Vec2();
    this.onDrag = onDrag;
    this.bind();
  }

  bind() {
    this.domElement.addEventListener('mousedown', this.onDown.bind(this));
    document.addEventListener('mousemove', this.onMove.bind(this));
    document.addEventListener('mouseup', this.onUp.bind(this));
  }

  onDown(e) {
   this.mouseDown = true;
   this.startPosition.set(e.clientX, e.clientY);
  }

  onUp(e) {
    this.mouseDown = false;
  }

  onMove(e) {
    const { startPosition } = this;
    if (this.mouseDown) {
      const x = e.clientX - startPosition.x;
      const y = e.clientY - startPosition.y;
      this.onDrag(x, y);
      startPosition.set(e.clientX, e.clientY);
    }
  }
}