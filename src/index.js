import "./styles.css";
import Mesh from './Mesh';
import Renderer from "./Renderer";
import Mouse from './Mouse';
import Quat from './Quat';
import Euler from './Euler';

// https://stackoverflow.com/questions/40454789/computing-face-normals-and-winding

const QUAT = new Quat();
const EULER = new Euler();

class BoxMesh extends Mesh {
  constructor(size) {
    super();
    this.vertices = [
      -1,-1,-1,   +1,-1,-1,   +1,-1,+1,   -1,-1,+1,
      -1,+1,-1,   +1,+1,-1,   +1,+1,+1,   -1,+1,+1,
    ];
    this.indices = [
      // All faces are CW
      0, 1, 2,   2, 3, 0, // Up
      6, 5, 4,   4, 7, 6, // Down
      1, 4, 5,   0, 4, 1, // Front
      1, 5, 2,   2, 5, 6, // Right
      2, 6, 3,   6, 7, 3, // Back
      3, 7, 0,   7, 4, 0, // Left
    ];
    this.faces = this.generateFaces();
    this.normals = this.generateNormals();
  }
}

class Demo {
  constructor() {
    this.renderer = new Renderer({ elementId: 'js-canvas'});
    this.renderer.resize(500, 500);
    this.lastTime = 0;
    this.box = this.createBox();
    this.render();
    this.mouse = new Mouse({
      domElement: this.renderer.canvas.el,
      onDrag: this.onMouseDrag.bind(this),
    });
  }

  createBox() {
    const box = new BoxMesh(10);
    box.rotation.x = Math.PI / 4;
    box.rotation.z = Math.PI / 4;
    box.position.z = 5;
    box.quaternion.fromEuler(box.rotation);
    box.updateMatrix();
    return box;
  }

  onMouseDrag(x, y) {
    const { box } = this;   
    const xRad = x * (Math.PI / 180);
    const yRad = y * (Math.PI / 180);
    EULER.set(yRad, -xRad, 0);
    QUAT.fromEuler(EULER);
    box.quaternion.multiplyQuaternions(QUAT, box.quaternion);
    box.rotation.fromQuaternion(box.quaternion);
    box.updateMatrix();
    this.render();
  }

  render() {
    const { box } = this;
    this.renderer.render([box]);
  }
}

new Demo();

