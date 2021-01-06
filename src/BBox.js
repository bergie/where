const { Point } = require('./Point');

class BBox {
  constructor(sw, ne) {
    this.sw = sw;
    this.ne = ne;
    if (!(this.sw.lat < this.ne.lat) || !(this.sw.lon < this.ne.lon)) {
      throw new Error('SW corner and NE corner have to be in correct order');
    }
  }
}

// Getters that create Point instances for the south-east and
// north-west corners
Object.defineProperty(BBox.prototype, 'se',
  {
    get() {
      return new Point(this.sw.lat, this.ne.lon);
    },
  });
Object.defineProperty(BBox.prototype, 'nw',
  {
    get() {
      return new Point(this.ne.lat, this.sw.lon);
    },
  });

exports.BBox = BBox;
