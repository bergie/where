/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const chai = require('chai');
(chai.should)();

const {Point, BBox} = require('../index');

describe('Geographical bounding box', function() {
  it('should have corners', function() {
    const sw = new Point(60.254558, 24.963333);
    const ne = new Point(60.317222, 25.042828);
    const box = new BBox(sw, ne);

    // Corners actually set via constructor
    box.sw.should.equal(sw);
    box.ne.should.equal(ne);

    // Calculated corners
    box.se.lat.should.equal(sw.lat);
    box.se.lon.should.equal(ne.lon);
    box.nw.lat.should.equal(ne.lat);
    return box.nw.lon.should.equal(sw.lon);
  });

  return it('should not allow arguments in wrong order', function() {
    const sw = new Point(60.254558, 25.042828);
    const ne = new Point(60.317222, 24.963333);
    return (() => new BBox(sw, ne)).should.throw('SW corner and NE corner have to be in correct order');
  });
});
