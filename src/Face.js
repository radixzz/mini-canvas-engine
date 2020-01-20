import Vec3 from "./Vec3";

export default class Face3 {
  constructor() {
    this.a = new Vec3();
    this.b = new Vec3();
    this.c = new Vec3();
    this.color = new Vec3();
    this.centroid = new Vec3();
    this.normal = new Vec3();
  }
}