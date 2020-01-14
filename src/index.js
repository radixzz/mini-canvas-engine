import "./styles.css";
import * as Canvas from "./canvas";
import Vec3 from './Vec3';
import Vec2 from './Vec2';
// https://stackoverflow.com/questions/40454789/computing-face-normals-and-winding

class Mesh {
  constructor() {
    this.color = new Vec3();
    this.position = new Vec3();
    this.rotation = new Vec3();
    this.vertices = [];
    this.indices = [];
    this.faces = [];
  }
  
  generateFaces() {
    const { indices: idx, vertices: vert } = this;
    const faces = [];
    for (let i = 0; i < idx.length; i+= 3) {
      const i0 = idx[i + 0] * 3;
      const i1 = idx[i + 1] * 3;
      const i2 = idx[i + 2] * 3;
      faces.push([
        new Vec3(vert[i0], vert[i0 + 1], vert[i0 + 2]),
        new Vec3(vert[i1], vert[i1 + 1], vert[i1 + 2]),
        new Vec3(vert[i2], vert[i2 + 1], vert[i2 + 2]),
      ]);
    }
    return faces;
  }

  generateNormals() {
    const { faces } = this;
    const normals = [];
    const u = new Vec3();
    const v = new Vec3();
    for (let i = 0; i < faces.length; i++) {
      const [a, b, c] = faces[i];
      v.copy(c).sub(b);
      u.copy(a).sub(b);
      v.cross(u).normalize();
      normals.push(v.clone());
    }
    return normals;
  }
}

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

function transform(v, m, target) {
  target.x = m[0] * v.x + m[1] * v.y + m[2] * v.z + m[3];
  target.y = m[4] * v.x + m[5] * v.y + m[6] * v.z + m[7];
  target.z = m[8] * v.x + m[9] * v.y + m[10] * v.z + m[11];
}

class Engine {
  constructor() {
    this.canvas = Canvas.create("js-canvas");
    Canvas.resize(this.canvas, 500, 500);
    this.box = new BoxMesh(10);
    console.log(this.box);
    this.theta = 0;
    this.render();
  }

  drawTriangle(p0, p1, p2) {
    const { ctx } = this.canvas;
    ctx.strokeStyle = ctx.fillStyle;
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p0.x, p0.y);
    ctx.stroke();
    ctx.fill();
  }

  projectPoint(v, target) {
    const { w, h } = this.canvas;
    const dist = 100;
    target.x = w / 2 + dist * v.x / v.z;
    target.y = h / 2 + dist * v.y / v.z;
  }

  calculateLight(lightPosition, normal) {
    const { ctx } = this.canvas;
    ctx.fillStyle = 'hsl(42, 100%, 10%)';
    const n = normal.dot(lightPosition);
    if (n <= 0) return;
    ctx.fillStyle = `hsl(42, 100%, ${n * 6 + 10}%)`;
  }

  draw(mesh, matrix) {
    const { faces, normals } = mesh;
    const a = new Vec3();
    const b = new Vec3();
    const c = new Vec3();
    const p0 = new Vec2();
    const p1 = new Vec2();
    const p2 = new Vec2();
    const normal = new Vec3();
    const lightPos = new Vec3(-1, 0, 1);
    for (let i = 0; i < faces.length; i++) {

      transform(faces[i][0], matrix, a);
      transform(faces[i][1], matrix, b);
      transform(faces[i][2], matrix, c);
      
      this.projectPoint(a, p0);
      this.projectPoint(b, p1);
      this.projectPoint(c, p2);
      
      // Back face culling
      if ( ((p1.x - p0.x) * (p2.y - p0.y) - (p1.y - p0.y) * (p2.x - p0.x)) > 0 ) {
        continue;
      }
      
      // transform normal and calc ligth
      transform(normals[i], matrix, normal);
      this.calculateLight(lightPos, normal);

      // draw triangle
      this.drawTriangle(p0, p1, p2);
    }
  }

  render() {
    const { canvas, box } = this;
    Canvas.clear(canvas, 'black');
    this.theta -= 0.015;
    const s = Math.sin(this.theta);
    const c = Math.cos(this.theta);
    const m = [
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 4,
    ];
    this.draw(box, m);
    window.requestAnimationFrame(this.render.bind(this));
  }
}

new Engine();

