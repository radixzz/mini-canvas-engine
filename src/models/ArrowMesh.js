import Color from "../Color";
import Mesh from '../Mesh';
import model from './arrow.json';

export default class ArrowMesh extends Mesh {
  constructor() {
    super();
    this.vertices = model.vertices;
    this.indices = model.indices;
    this.computeFaces();
    this.computeNormals();
    this.computeCentroids();
    this.setFaceColors();
  }

  setFaceColors() {
    const { faces: f } = this;
    const color = new Color(230, 220, 20);
    for (let i = 0; i < f.length; i++) {
      f[i].color.copy(color);
    }
    
  }
}