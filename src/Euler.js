import Mat4 from './Mat4';

const M4_TEMP = new Mat4();

export default class Euler {
  constructor(x, y, z) {
    this.set(x, y, z);
  }

  set(x = 0, y = x, z = x) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  fromQuaternion(q) {
    M4_TEMP.fromQuaternion(q);
    return this.fromRotationMatrix(M4_TEMP);
  }

  fromRotationMatrix(m) {
    const { elements: e } = m;
    // assumes XYZ order
    this.y = Math.asin(Math.min(Math.max(e[8], -1), 1));
    if (Math.abs(e[8]) < 0.99999) {
      this.x = Math.atan2(-e[9], e[10]);
      this.z = Math.atan2(-e[4], e[0]);
    } else {
      this.x = Math.atan2(m[6], m[5]);
      this.z = 0;
    }

    return this;
  }


}