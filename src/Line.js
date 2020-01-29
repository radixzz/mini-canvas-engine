import Color from "./Color";
import Transform from "./Transform";

export default class Line extends Transform {
  constructor() {
    super();
    this.isLine = true;
    this.points = [];
    this.color = new Color();
  }
}