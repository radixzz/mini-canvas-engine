import Vec3 from "./Vec3";
import Quat from "./Quat";
import Mat4 from "./Mat4";
import Euler from './Euler';
import { onChange } from './Utils';

export default class Transform {
  constructor() {
    this.matrix = new Mat4();
    this.position = new Vec3();
    this.quaternion = new Quat();
    this.rotation = new Euler();
    this.scale = new Vec3(1);
    this.bindRotationChanges();
  }

  bindRotationChanges() {
    const { rotation, quaternion } = this;
    const updateEuler = () => this.rotation.fromQuaternion(this.quaternion);
    const updateQuaternion = () => this.quaternion.fromEuler(this.rotation);
    onChange(rotation, quaternion, updateEuler, updateQuaternion);
  }

  updateMatrix() {
    const { matrix, scale, position, quaternion } = this;
    matrix.compose(position, quaternion, scale);
  }
}