export default class Quat {
  constructor(x, y, z, w) {
    this.set(x, y, z, w);
  }

  set(x = 0, y = 0, z = 0, w = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }

  multiplyQuaternions(a, b) {
    const { x: ax, y: ay, z: az, w: aw } = a;
    const { x: bx, y: by, z: bz, w: bw } = b;

    this.x = ax * bw + aw * bx + ay * bz - az * by;
		this.y = ay * bw + aw * by + az * bx - ax * bz;
		this.z = az * bw + aw * bz + ax * by - ay * bx;
    this.w = aw * bw - ax * bx - ay * by - az * bz;
    
    return this;
  }

  fromEuler(rotation) {
    const { x, y, z } = rotation;
    // Assumes XYZ order
    const [sx, cx] = [Math.sin(x * 0.5), Math.cos(x * 0.5)];
    const [sy, cy] = [Math.sin(y * 0.5), Math.cos(y * 0.5)];
    const [sz, cz] = [Math.sin(z * 0.5), Math.cos(z * 0.5)];
    this.x = sx * cy * cz + cx * sy * sz;
    this.y = cx * sy * cz - sx * cy * sz;
    this.z = cx * cy * sz + sx * sy * cz;
    this.w = cx * cy * cz - sx * sy * sz;

    return this;
  }
}