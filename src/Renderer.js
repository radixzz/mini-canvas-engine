import Canvas from './Canvas';
import Vec3 from './Vec3';
import Vec2 from './Vec2';
import Light from './Light';
import { clamp } from './Utils';

const V3_TEMP = new Vec3();

export default class Renderer {
  constructor({ elementId }) {
    this.canvas = new Canvas(elementId);
    this.canvas.resize(500, 500);
    this.light = new Light();
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
    const { color, position, target } = this.light;
    //ctx.fillStyle = this.light.color.toString();
    //const dir = position.clone().sub(target).normalize();
    V3_TEMP.copy(position).sub(target).normalize();
    const n = normal.normalize().dot(V3_TEMP);

    const intensity = clamp(n + 0.2, 0.05, 1);      
    ctx.fillStyle = `hsl(0, 0%, ${intensity * 100}%)`;
    //this.canvas.drawCircle(position.x * this.canvas.width, position.y, 10, 'white');
  }

  // This is very slow
  getZSortedFaces(faces, matrix) {
    const c1 = new Vec3();
    const c2 = new Vec3();
    return faces.sort((fa, fb) => {
      const c1z = c1.copy(fa.centroid).applyMatrix4(matrix).z;
      const c2z = c2.copy(fb.centroid).applyMatrix4(matrix).z;
      return c2z - c1z;
    });
  }

  draw(mesh) {
    const { faces, matrix } = mesh;
    const a = new Vec3();
    const b = new Vec3();
    const c = new Vec3();
    const p0 = new Vec2();
    const p1 = new Vec2();
    const p2 = new Vec2();
    const normal = new Vec3();
    const lightPos = new Vec3(-1, 0, 0.5);
    const sortedFaces = this.getZSortedFaces(faces, matrix);
    for (let i = 0; i < sortedFaces.length; i++) {
      const face = sortedFaces[i];
      // Apply rotation, position and scaling
      // transformations to face vertices
      a.copy(face.a).applyMatrix4(matrix);
      b.copy(face.b).applyMatrix4(matrix);
      c.copy(face.c).applyMatrix4(matrix);
      
      // Porject 3D positions to 2D
      this.projectPoint(a, p0);
      this.projectPoint(b, p1);
      this.projectPoint(c, p2);
      
      // Back face culling
      if ( ((p1.x - p0.x) * (p2.y - p0.y) - (p1.y - p0.y) * (p2.x - p0.x)) > 0 ) {
        continue;
      }
      
      // transform normal and calc ligth
      normal.copy(face.normal).applyMatrix4(matrix);
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