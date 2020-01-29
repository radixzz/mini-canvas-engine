import Canvas from './Canvas';
import Vec3 from './Vec3';
import Vec2 from './Vec2';
import Light from './Light';
import Color from './Color';
import { clamp } from './Utils';

const C1_TEMP = new Color();
const C2_TEMP = new Color();

export default class Renderer {
  constructor({ elementId }) {
    this.canvas = new Canvas(elementId);
    this.canvas.resize(500, 500);
    this.clearColor = new Color();
    this.ambientLight = new Light();
    this.lights = [];
  }

  resize(width, height) {
    this.canvas.resize(width, height);
  }

  // Projects a 3D point to 2D by using
  // Weak Perspective Projection
  projectPoint(v, target) {
    const { width, height } = this.canvas;
    const focalLength = Math.min(width, height) / v.z;
    target.x = width / 2 + focalLength * v.x;
    target.y = height / 2 + focalLength * v.y;
  }

  computeFaceColor(face, normal) {
    const { lights, ambientLight } = this;
    const { ctx } = this.canvas;
    const finalColor = C1_TEMP.set(0);
    const ambientColor = C2_TEMP.copy(ambientLight.color);
    let totalIntensity = ambientLight.intensity;
    for (let i = 0; i < lights.length; i++) {
      const light = lights[i];
      // get dot product to handle intensity
      const n = normal.normalize().dot(light.direction.normalize());
      if (n > 0) {
        const intensity = clamp(n * light.intensity, 0, 1);
        finalColor.lerp(light.color, intensity);
        totalIntensity += intensity;
      }
    }
    finalColor.add(ambientColor.multiplyScalar(ambientLight.intensity));
    finalColor.lerp(face.color, clamp(totalIntensity, 0, 1));
    ctx.fillStyle = finalColor.toString();
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

  drawPoints(obj) {
    const { canvas } = this;
    const { points, matrix } = obj;
    const v3 = new Vec3();
    const v2 = new Vec2();
    for (let i = 0; i < points.length; i++) {
      v3.copy(points[i]).applyMatrix4(matrix);
      this.projectPoint(v3, v2);
      canvas.drawCircle(v2.x, v2.y);
    }
  }

  drawLine(line) {
    const { ctx } = this.canvas;
    const { points, matrix } = line;
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 4;
    const v2 = new Vec2();
    const v3 = new Vec3();
    v3.copy(points[0]).applyMatrix4(matrix);
    this.projectPoint(v3, v2);
    ctx.moveTo(v2.x, v2.y);
    for (let i = 1; i < points.length; i++) {
      v3.copy(points[i]).applyMatrix4(matrix);
      this.projectPoint(v3, v2);
      ctx.lineTo(v2.x, v2.y);
    }
    ctx.stroke();
    ctx.restore();
  }

  drawMesh(mesh) {
    const { faces, matrix } = mesh;
    const a = new Vec3();
    const b = new Vec3();
    const c = new Vec3();
    const p0 = new Vec2();
    const p1 = new Vec2();
    const p2 = new Vec2();
    const normal = new Vec3();
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
      this.computeFaceColor(face, normal);

      // draw triangle
      this.canvas.ctx.strokeStyle = this.canvas.ctx.fillStyle;
      this.canvas.drawTriangle(p0, p1, p2);
    }

  }

  render(objects) {
    this.canvas.clear(this.clearColor.toString());
    for (let i = 0; i < objects.length; i++) {
      const obj = objects[i];
      if (obj.points) {
        if (obj.isLine) {
          this.drawLine(obj);
        } else {
          this.drawPoints(obj);
        }
      } else {
        this.drawMesh(obj);
      }
    }
    
  }

}