import Vec3 from './Vec3';
import Color from './Color';

// Simple Directional Light
export default class Light {
  constructor() {
    this.intensity = 0;
    this.position = new Vec3();
    this.target = new Vec3();
    this.color = new Color();
  }
}