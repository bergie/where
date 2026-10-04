const chai = require('chai');

(chai.should)();

const { Point } = require('../index');

describe('Geographical point', () => {
  // We'll reuse these airports in various tests
  let efhf = null;
  let efhk = null;
  let fymg = null;
  let spaceport = null;

  it('should have coordinates', () => {
    // Helsinki-Malmi airport in Finland
    efhf = new Point(60.254558, 25.042828);
    efhf.lat.should.equal(60.254558);

    // Helsinki-Vantaa airport in Finland
    efhk = new Point(60.317222, 24.963333);
    efhk.lon.should.equal(24.963333);

    // Midgard airport in Namibia
    fymg = new Point(-22.083332, 17.366667);
    fymg.lat.should.equal(-22.083332);
    fymg.lon.should.equal(17.366667);

    // Spaceport America
    spaceport = new Point(32.990278, -106.969722);
    spaceport.lon.should.equal(-106.969722);
  });

  it('should only accept numbers', () => {
    (() => new Point()).should.throw('A pair of WGS-84 coordinates expected');
    (() => new Point('foo', 'bar')).should.throw('A pair of WGS-84 coordinates expected');
    (() => new Point(10, 'bar')).should.throw('A pair of WGS-84 coordinates expected');
    (() => new Point('foo', 10)).should.throw('A pair of WGS-84 coordinates expected');
  });

  it('should only allow sensible latitudes', () => {
    (() => new Point(-120, 12)).should.throw('WGS-84 latitude must be between 90 and -90 degrees');
    (() => new Point(120, 12)).should.throw('WGS-84 latitude must be between 90 and -90 degrees');
  });

  it('should only allow sensible longitudes', () => {
    (() => new Point(12, -300)).should.throw('WGS-84 longitude must be between 180 and -180 degrees');
    (() => new Point(12, 240)).should.throw('WGS-84 longitude must be between 180 and -180 degrees');
  });

  it('should convert to a pretty string', () => {
    `${efhf}`.should.equal('60°15′16″N 25°2′34″E');
    `${fymg}`.should.equal('22°4′59″S 17°22′0″E');
    `${spaceport}`.should.equal('32°59′25″N 106°58′10″W');
  });

  it('should be able to calculate distance to other points', () => {
    // There are 8.2 kilometers between the two Helsinki airports
    efhf.distanceTo(efhk).should.equal(8.231);

    // 8.2 kilometers is approximately 4.4 nautical miles
    // efhf.distanceTo(efhk, 'N').should.equal 4.4

    // There are 9181.6 kilometers from Helsinki to Midgard
    efhf.distanceTo(fymg).should.equal(9182.033);
    efhf.distanceTo(fymg, 'N').should.equal(4957.901);
  });
  it('should be able to calculate also very short distances', () => {
    const from = new Point(60.254558, 25.051917118289477);
    const to = new Point(60.254558, 25.05282240895576);
    from.distanceTo(to).should.equal(0.05);
  });

  it('should be able to calculate bearing to other points', () => {
    // Helsinki-Vantaa is in north of Helsinki-Malmi
    efhf.bearingTo(efhk).should.equal(328);

    // Helsinki-Malmi is in the south of Helsinki-Vantaa
    efhk.bearingTo(efhf).should.equal(148);

    // Midgard airport is way to the south
    efhf.bearingTo(fymg).should.equal(187);
  });

  it('should be able to calculate changes in direction', () => {
    // Started from Malmi towards Vantaa, then turned back
    efhf.bearingChange(efhf, efhk).should.equal(-180);

    // Started from Malmi, and stayed there
    efhf.bearingChange(efhf, efhf).should.equal(0);

    // Started from Vantaa towards Midgard, then turned to Malmi
    efhf.bearingChange(efhk, fymg).should.equal(177);

    // Started from Vantaa towards Malmi, then turned to Midgard
    fymg.bearingChange(efhk, efhf).should.equal(39);

    // Started from Malmi towards Vantaa, then turned to Midgard
    fymg.bearingChange(efhf, efhk).should.equal(-141);
  });

  it('should be able to tell direction to other points', () => {
    // Helsinki-Vantaa is in northwest of Helsinki-Malmi
    efhf.directionTo(efhk).should.equal('NW');

    // Helsinki-Malmi is in southeast of Helsinki-Vantaa
    efhk.directionTo(efhf).should.equal('SE');

    // Midgard is way south
    efhf.directionTo(fymg).should.equal('S');
  });

  describe('across the antimeridian', () => {
    // A point at 179.5E and a point at 179.5W on the equator
    // are 1 degree of longitude apart, not 359 degrees
    const eastSide = new Point(0, 179.5);
    const westSide = new Point(0, -179.5);

    it('should calculate short distances across the antimeridian', () => {
      // 1 degree at the equator is roughly 60 nautical miles
      eastSide.distanceTo(westSide, 'N').should.equal(60.04);
      eastSide.distanceTo(westSide).should.equal(111.195);

      // The distance is the same in both directions
      westSide.distanceTo(eastSide, 'N').should.equal(60.04);
    });

    it('should calculate very short distances across the antimeridian', () => {
      const from = new Point(0, 179.999);
      const to = new Point(0, -179.999);
      from.distanceTo(to).should.equal(0.222);
    });

    it('should calculate bearings across the antimeridian', () => {
      // Going east from 179.5E crosses the antimeridian to 179.5W
      eastSide.bearingTo(westSide).should.equal(90);
      eastSide.directionTo(westSide).should.equal('E');

      // Going west from 179.5W crosses the antimeridian to 179.5E,
      // so the 179.5E point is to the _west_ of the 179.5W point
      westSide.bearingTo(eastSide).should.equal(270);
      westSide.directionTo(eastSide).should.equal('W');
    });

    it('should calculate bearings across the antimeridian at other latitudes', () => {
      // From the 179.5W point the 179.5E point is due west, also off the equator
      const northWestSide = new Point(60, -179.5);
      const northEastSide = new Point(60, 179.5);
      northWestSide.bearingTo(northEastSide).should.equal(270);
      northEastSide.bearingTo(northWestSide).should.equal(90);
    });

    it('should calculate bearing changes across the antimeridian', () => {
      // Traveling east from 179.9E, and then continuing east past the antimeridian
      const start = new Point(0, 179.9);
      const halfway = new Point(0, 179.95);
      const past = new Point(0, -179.9);

      // Both legs are due east, so the heading never changes
      past.bearingChange(start, halfway).should.equal(0);
    });
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
