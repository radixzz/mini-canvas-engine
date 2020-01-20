import "./styles.css";
import Mesh from './Mesh';
import Renderer from "./Renderer";
import Mouse from './Mouse';
import Quat from './Quat';
import Euler from './Euler';
import model from './monkey.json';

// https://stackoverflow.com/questions/40454789/computing-face-normals-and-winding

const QUAT = new Quat();
const EULER = new Euler();

class ModelMesh extends Mesh {
  constructor(size) {
    super();
    this.vertices = model.vertices;
    this.indices = model.indices;
    this.computeFaces();
    this.computeNormals();
    this.computeCentroids();
  }
}

class Demo {
  constructor() {
    this.renderer = new Renderer({ elementId: 'js-canvas'});
    this.renderer.resize(500, 500);
    this.renderer.light.color.fromRgb(255, 255, 255);
    const { light } = this.renderer;
    light.position.set(0, 1, 0);
    this.lastTime = 0;
    this.mesh = this.createBox();
    this.render();
    this.mouse = new Mouse({
      domElement: this.renderer.canvas.el,
      onDrag: this.onMouseDrag.bind(this),
    });
  }

  createBox() {
    const mesh = new ModelMesh(10);
    mesh.rotation.x = Math.PI / 4;
    mesh.rotation.z = Math.PI / 4;
    mesh.position.z = 5;
    mesh.scale.set(0.5);
    mesh.quaternion.fromEuler(mesh.rotation);
    mesh.updateMatrix();
    return mesh;
  }

  onMouseDrag(x, y) {
    const { mesh } = this;   
    const xRad = x * (Math.PI / 180);
    const yRad = y * (Math.PI / 180);
    EULER.set(yRad, -xRad, 0);
    QUAT.fromEuler(EULER);
    mesh.quaternion.multiplyQuaternions(QUAT, mesh.quaternion);
    mesh.rotation.fromQuaternion(mesh.quaternion);
    mesh.updateMatrix();
    this.render();
  }

  render() {
    const { mesh } = this;
    this.renderer.render([mesh]);
  }
}

new Demo();

