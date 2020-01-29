import "./styles.css";
import Renderer from "./Renderer";
import Mouse from './Mouse';
import Quat from './Quat';
import Euler from './Euler';
import Line from "./Line";
import Vec3 from "./Vec3";
import Light from "./Light";
import AxisMesh from './models/AxisMesh';
import ArrowMesh from './models/ArrowMesh';

// https://stackoverflow.com/questions/40454789/computing-face-normals-and-winding

const QUAT = new Quat();
const EULER = new Euler();

class CircleLine extends Line {
  constructor() {
    super();
    this.addPoints(1.5, 40);
    this.color.set(255, 0, 0);
  }

  addPoints(radius, segments) {
    const step = (Math.PI * 2) / segments;
    for (let i = -1; i < segments; i++) {
      const theta = i * step;
      const x = radius * Math.sin(theta);
      const y = radius * Math.cos(theta);
      this.points.push(new Vec3(x, y, 0));
    }
  }
}

class Demo {
  constructor() {
    this.renderer = new Renderer({ elementId: 'js-canvas' });
    this.renderer.resize(100, 100);
    this.renderer.clearColor.set(15, 15, 15);
    this.lastTime = 0;
    this.createLights();
    this.mesh = this.createMesh();
    this.circle = this.createCircle();
    this.render();
    this.mouse = new Mouse({
      domElement: this.renderer.canvas.el,
      onDrag: this.onMouseDrag.bind(this),
    });
  }

  createLights() {
    const { lights, ambientLight } = this.renderer;
    ambientLight.intensity = 0.1;
    ambientLight.color.set(255, 255, 255);
    const left = new Light();
    const bottom = new Light();
    left.direction.set(1, 0, 0);
    left.intensity = 1;
    left.color.set(255, 255, 255);
    bottom.direction.set(0, -1, 0);
    bottom.color.set(255, 255, 255);
    bottom.intensity = 3;
    lights.push(left, bottom);
  }

  createCircle() {
    const circle = new CircleLine();
    circle.position.z = 10;
    circle.position.y = -1;
    circle.rotation.y = Math.PI / 4;
    circle.updateMatrix();
    return circle;
  }

  createMesh() {
    const mesh = new ArrowMesh();
    mesh.rotation.x = Math.PI / 4;
    mesh.rotation.y = Math.PI / 4;
    mesh.position.z = 5;
    mesh.scale.set(0.7);
    mesh.updateMatrix();
    return mesh;
  }

  onMouseDrag(x, y) {
    const { mesh, circle } = this;   
    const xRad = x * (Math.PI / 180);
    const yRad = y * (Math.PI / 180);
    EULER.set(yRad, -xRad, 0);
    QUAT.fromEuler(EULER);
    mesh.quaternion.multiplyQuaternions(QUAT, mesh.quaternion);
    circle.updateMatrix();
    mesh.updateMatrix();
    this.render();
  }

  render() {
    const { mesh, circle } = this;
    this.renderer.render([mesh]);
  }
}

window.demo = new Demo();

