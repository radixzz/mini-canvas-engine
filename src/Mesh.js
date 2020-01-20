import Vec3 from './Vec3';
import Mat4 from './Mat4';
import Quat from './Quat';
import Euler from './Euler';
import Face3 from './Face';

export default class Mesh {
  constructor() {
    this.matrix = new Mat4();
    this.quaternion = new Quat();
    this.position = new Vec3();
    this.rotation = new Euler();
    this.scale = new Vec3(1);
    this.vertices = [];
    this.indices = [];
    this.faces = [];
  }

  updateMatrix() {
    const { matrix, scale, position, quaternion } = this;
    //quaternion.fromEuler(rotation);
    matrix.compose(position, quaternion, scale);
  }

  computeCentroids() {
    const { faces } = this;
    for (let i = 0; i < faces.length; i++) {
      const f = faces[i];
      f.centroid.copy(f.a).add(f.b).add(f.c).multiplyScalar(1/3);
    }
  }
  
  computeFaces() {
    const { indices: idx, vertices: vert } = this;
    this.faces = [];
    for (let i = 0; i < idx.length; i+= 3) {
      const i0 = idx[i + 0] * 3;
      const i1 = idx[i + 1] * 3;
      const i2 = idx[i + 2] * 3;
      const face = new Face3();
      face.a.set(vert[i0], vert[i0 + 1], vert[i0 + 2]);
      face.b.set(vert[i1], vert[i1 + 1], vert[i1 + 2]);
      face.c.set(vert[i2], vert[i2 + 1], vert[i2 + 2]);
      this.faces.push(face);
    }
  }

  computeNormals() {
    const { faces } = this;
    const u = new Vec3();
    const v = new Vec3();
    for (let i = 0; i < faces.length; i++) {
      const f = faces[i];
      v.copy(f.c).sub(f.b);
      u.copy(f.a).sub(f.b);
      v.cross(u).normalize();
      f.normal.copy(v);
    }
  }
}
