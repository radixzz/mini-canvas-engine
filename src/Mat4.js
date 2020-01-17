// lightweight version of
// https://github.com/mrdoob/three.js/blob/dev/src/math/Matrix4.js
import Vec3 from './Vec3';

const V3_ZERO = new Vec3();
const V3_ONE = new Vec3(1);

export default class Mat4 {
  constructor() {
    this.elements = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ];
  }

  setPosition(v) {
    const { elements: e } = this;
    e[12] = v.x;
    e[13] = v.y;
    e[14] = v.z;
  }

  fromQuaternion(q) {
    return this.compose(V3_ZERO, q, V3_ONE);
  }

  compose(position, quaternion, scale) {
    const { elements: e } = this;
    const { x: sx, y: sy, z: sz } = scale;
    const { x, y, z, w } = quaternion;
    const [x2, y2, z2] = [x + x, y + y, z + z];
    const [xx, xy, xz] = [x * x2, x * y2, x * z2];
    const [yy, yz, zz] = [y * y2, y * z2, z * z2];
    const [wx, wy, wz] = [w * x2, w * y2, w * z2];

    e[0] = (1 - (yy + zz)) * sx;
    e[1] = (xy + wz) * sx;
    e[2] = (xz - wy) * sx;
    e[3] = 0;

    e[4] = (xy - wz) * sy;
    e[5] = (1 - (xx + zz)) * sy;
    e[6] = (yz + wx) * sy;
    e[7] = 0;

    e[8] = (xz + wy) * sz;
    e[9] = (yz - wx) * sz;
    e[10] = (1 - (xx + yy)) * sz;
    e[11] = 0;

    e[12] = position.x;
    e[13] = position.y;
    e[14] = position.z;
    e[15] = 1;

    return this;
  }
}