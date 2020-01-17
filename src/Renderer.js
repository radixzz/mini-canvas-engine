import Canvas from "./Canvas";
import Vec3 from './Vec3';
import Vec2 from './Vec2';

export default class Renderer {
  constructor({ elementId }) {
    this.canvas = new Canvas(elementId);
    this.canvas.resize(500, 500);
  }

  resize(width, height) {
    this.canvas.resize(width, height);
  }

  projectPoint(v, target) {
    const { width, height } = this.canvas;
    const dist = 500;
    target.x = width / 2 + dist * v.x / v.z;
    target.y = height / 2 + dist * v.y / v.z;
  }

  calculateLight(lightPosition, normal) {
    const { ctx } = this.canvas;
    ctx.fillStyle = 'hsl(42, 100%, 10%)';
    const n = normal.dot(lightPosition);
    if (n <= 0) return;
    ctx.fillStyle = `hsl(42, 100%, ${n * 6 + 10}%)`;
  }

  draw(mesh) {
    const { faces, normals, matrix } = mesh;
    const a = new Vec3();
    const b = new Vec3();
    const c = new Vec3();
    const p0 = new Vec2();
    const p1 = new Vec2();
    const p2 = new Vec2();
    const normal = new Vec3();
    const lightPos = new Vec3(-1, 0, 0.5);
    for (let i = 0; i < faces.length; i++) {

      // Apply rotation, position and scaling
      // transformations to face vertices
      a.copy(faces[i][0]).applyMatrix4(matrix);
      b.copy(faces[i][1]).applyMatrix4(matrix);
      c.copy(faces[i][2]).applyMatrix4(matrix);
      
      // Porject 3D positions to 2D
      this.projectPoint(a, p0);
      this.projectPoint(b, p1);
      this.projectPoint(c, p2);
      
      // Back face culling
      if ( ((p1.x - p0.x) * (p2.y - p0.y) - (p1.y - p0.y) * (p2.x - p0.x)) > 0 ) {
        continue;
      }
      
      // transform normal and calc ligth
      normal.copy(normals[i]).applyMatrix4(matrix);
      this.calculateLight(lightPos, normal);

      // draw triangle
      this.canvas.ctx.strokeStyle = this.canvas.ctx.fillStyle;
      this.canvas.drawTriangle(p0, p1, p2);
    }
  }

  render(objects) {
    this.canvas.clear('black');
    for (let i = 0; i < objects.length; i++) {
      this.draw(objects[i]);
    }
    
  }

}