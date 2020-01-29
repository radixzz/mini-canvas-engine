import Color from "../Color";
import Mesh from '../Mesh';
import axisModel from './axis.json';

export default class AxisMesh extends Mesh {
  constructor() {
    super();
    this.vertices = axisModel.vertices;
    this.indices = axisModel.indices;
    this.computeFaces();
    this.computeNormals();
    this.computeCentroids();
    this.setFaceColors();
  }

  setFaceColors() {
    const { faces: f } = this;
    const r = new Color(255, 50, 0);
    const g = new Color(100, 255, 0);
    const b = new Color(0, 95, 255);
    // const w = new Color(255, 255, 255);
    const colors = [
      b, b, b, b, b, r, b, r,
      g, g, r, r, r, r, g, g,
      g, g, r, r, r, r, g, g,
      g, g, b, b, b, b, r, b,
      b, b, b, b, b, b, r, r,
      r, r, r, r, g, g, g, g,
      g, g, g, b, r, b, r, g,
      g, r, r, r, r, g, g, g,
      g, b, b, b, b, r, b, b,
      b, b, b, b, b, r, r, r,
      r, r, r, g, g, g, g, g,
      g, g
    ]
    for (let i = 0; i < colors.length; i++) {
      f[i].color.copy(colors[i]);
    }
    
  }
}