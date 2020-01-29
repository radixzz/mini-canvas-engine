import "./styles.css";
import Mesh from './Mesh';
import Renderer from "./Renderer";
import Mouse from './Mouse';
import Quat from './Quat';
import Euler from './Euler';
import Line from "./Line";
import Vec3 from "./Vec3";
import Light from "./Light";
import axisModel from './models/axis.json';
import Color from "./Color";

// https://stackoverflow.com/questions/40454789/computing-face-normals-and-winding

const QUAT = new Quat();
const EULER = new Euler();

class ModelMesh extends Mesh {
  constructor() {
    super();
    this.vertices = axisModel.vertices;
    this.indices = axisModel.indices;
    
    this.computeFaces();
    
    this.computeNormals();
    this.computeCentroids();
    this.setFaceColors();
  }

  setFaceColors() {
    const { faces: f } = this;
    const r = new Color(250, 60, 0);
    const g = new Color(0, 255, 0);
    const b = new Color(0, 0, 255);
    // const w = new Color(255, 255, 255);
    const colors = [
      b, b, b, b, b, r, b, r,
      g, g, r, r, r, r, g, g,
      g, g, r, r, r, r, g, g,
      g, g, b, b, b, b, r, b,
      b, b, b, b, b, b, r, r,
      r, r, r, r, g, g, g, g,
      g, g, g, b, r, b, r, g,
      g, r, r, r, r, g, g, g,
      g, b, b, b, b, r, b, b,
      b, b, b, b, b, r, r, r,
      r, r, r, g, g, g, g, g,
      g, g
    ]
    for (let i = 0; i < colors.length; i++) {
      f[i].color.copy(colors[i]);
    }
    
  }
}

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
    this.renderer.resize(250, 250);
    this.renderer.clearColor.set(15, 15, 15);
    this.lastTime = 0;
    this.createLights();
    this.mesh = this.createBox();
    this.circle = this.createCircle();
    this.render();
    this.mouse = new Mouse({
      domElement: this.renderer.canvas.el,
      onDrag: this.onMouseDrag.bind(this),
    });
  }

  createLights() {
    const { lights, ambientLight } = this.renderer;
    ambientLight.intensity = 0.25;
    ambientLight.color.set(255, 255, 255);
    const left = new Light();
    const bottom = new Light();
    left.direction.set(1, 0, 0);
    left.intensity = 1;
    left.color.set(255, 255, 255);
    bottom.direction.set(0, -1, 0);
    bottom.color.set(255, 255, 255);
    bottom.intensity = 2;
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

  createBox() {
    const mesh = new ModelMesh(10);
    //mesh.rotation.x = Math.PI / 4;
    //mesh.rotation.z = Math.PI / 4;
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

