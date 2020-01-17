import Vec3 from './Vec3';
import Mat4 from './Mat4';
import Quat from './Quat';
import Euler from './Euler';

export default class Mesh {
  constructor() {
    this.matrix = new Mat4();
    this.quaternion = new Quat();
    this.color = new Vec3();
    this.position = new Vec3();
    this.rotation = new Euler();
    this.scale = new Vec3(1);
    this.vertices = [];
    this.indices = [];
    this.faces = [];
  }

  updateMatrix() {
    const { matrix, scale, position, quaternion, rotation } = this;
    //quaternion.fromEuler(rotation);
    matrix.compose(position, quaternion, scale);
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
