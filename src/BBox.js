import { Point } from "./Point.js";

/**
 * A geographical bounding box, defined by its south-west and north-east corners.
 */
class BBox {
  /**
   * @param {Point} sw south-west corner
   * @param {Point} ne north-east corner
   */
  constructor(sw, ne) {
    this.sw = sw;
    this.ne = ne;
    if (!(this.sw.lat < this.ne.lat) || !(this.sw.lon < this.ne.lon)) {
      throw new Error("SW corner and NE corner have to be in correct order");
    }
  }

  /** South-east corner of the box. @returns {Point} */
  get se() {
    return new Point(this.sw.lat, this.ne.lon);
  }

  /** North-west corner of the box. @returns {Point} */
  get nw() {
    return new Point(this.ne.lat, this.sw.lon);
  }
}

export { BBox };
