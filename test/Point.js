/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const chai = require('chai');
(chai.should)();

const {Point} = require('../index');

describe('Geographical point', function() {
  // We'll reuse these airports in various tests
  let efhf = null;
  let efhk = null;
  let fymg = null;

  it('should have coordinates', function() {
    // Helsinki-Malmi airport in Finland
    efhf = new Point(60.254558, 25.042828);
    efhf.lat.should.equal(60.254558);

    // Helsinki-Vantaa airport in Finland
    efhk = new Point(60.317222, 24.963333);
    efhk.lon.should.equal(24.963333);

    // Midgard airport in Namibia
    fymg = new Point(-22.083332, 17.366667);
    fymg.lat.should.equal(-22.083332);
    return fymg.lon.should.equal(17.366667);
  });

  it('should only accept numbers', function() {
    (() => new Point).should.throw('A pair of WGS-84 coordinates expected');
    return (() => new Point('foo', 'bar')).should.throw('A pair of WGS-84 coordinates expected');
  });

  it('should only allow sensible latitudes', function() {
    (() => new Point(-120, 12)).should.throw('WGS-84 latitude must be between 90 and -90 degrees');
    return (() => new Point(120, 12)).should.throw('WGS-84 latitude must be between 90 and -90 degrees');
  });

  it('should only allow sensible longitudes', function() {
    (() => new Point(12, -300)).should.throw('WGS-84 longitude must be between 180 and -180 degrees');
    return (() => new Point(12, 240)).should.throw('WGS-84 longitude must be between 180 and -180 degrees');
  });

  it('should convert to a pretty string', function() {
    `${efhf}`.should.equal('60°15′16″N 25°2′34″E');
    return `${fymg}`.should.equal('22°4′59″S 17°22′0″E');
  });

  it('should be able to calculate distance to other points', function() {
    // There are 8.2 kilometers between the two Helsinki airports
    efhf.distanceTo(efhk).should.equal(8.2);

    // 8.2 kilometers is approximately 4.4 nautical miles
    // efhf.distanceTo(efhk, 'N').should.equal 4.4

    // There are 9181.6 kilometers from Helsinki to Midgard
    efhf.distanceTo(fymg).should.equal(9182);
    return efhf.distanceTo(fymg, 'N').should.equal(4957.9);
  });

  it('should be able to calculate bearing to other points', function() {
    // Helsinki-Vantaa is in north of Helsinki-Malmi
    efhf.bearingTo(efhk).should.equal(328);

    // Helsinki-Malmi is in the south of Helsinki-Vantaa
    efhk.bearingTo(efhf).should.equal(148);

    // Midgard airport is way to the south
    return efhf.bearingTo(fymg).should.equal(187);
  });

  it('should be able to calculate changes in direction', function() {
    // Started from Malmi towards Vantaa, then turned back
    efhf.bearingChange(efhf, efhk).should.equal(-180);

    // Started from Malmi, and stayed there
    efhf.bearingChange(efhf, efhf).should.equal(0);

    // Started from Vantaa towards Midgard, then turned to Malmi
    efhf.bearingChange(efhk, fymg).should.equal(177);

    // Started from Vantaa towards Malmi, then turned to Midgard
    fymg.bearingChange(efhk, efhf).should.equal(39);

    // Started from Malmi towards Vantaa, then turned to Midgard
    return fymg.bearingChange(efhf, efhk).should.equal(-141);
  });

  return it('should be able to tell direction to other points', function() {
    // Helsinki-Vantaa is in northwest of Helsinki-Malmi
    efhf.directionTo(efhk).should.equal('NW');

    // Helsinki-Malmi is in southeast of Helsinki-Vantaa 
    efhk.directionTo(efhf).should.equal('SE');

    // Midgard is way south
    return efhf.directionTo(fymg).should.equal('S');
  });

  /*
  it 'should be able to produce a bounding box for a desired radius', ->
    * Get 20km bounding box
    bbox = efhf.getBBox 20

    * Ensure the box corners are in right directions
    efhf.directionTo(bbox.sw).should.equal 'SW'
    efhf.directionTo(bbox.ne).should.equal 'NE'

    * Check that the distance to a corner is correct
    * Note: using 2d trigonometry on a 3D globe, so numbers are not exact.
    distance = bbox.ne.distanceTo efhf
    Math.round(distance).should.equal Math.round Math.sqrt Math.pow(20, 2) + Math.pow(20, 2)
  */
});
