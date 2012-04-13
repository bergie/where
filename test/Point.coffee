chai = require 'chai'
do chai.should

{Point} = require '../index'

describe 'Geographical point', ->
  # We'll reuse these airports in various tests
  efhf = null
  efhk = null
  fymg = null

  it 'should have coordinates', ->
    # Helsinki-Malmi airport in Finland
    efhf = new Point 60.254558, 25.042828
    efhf.lat.should.equal 60.254558

    # Helsinki-Vantaa airport in Finland
    efhk = new Point 60.317222, 24.963333
    efhk.lon.should.equal 24.963333

    # Midgard airport in Namibia
    fymg = new Point -22.083332, 17.366667
    fymg.lat.should.equal -22.083332
    fymg.lon.should.equal 17.366667

  it 'should only accept numbers', ->
    (-> new Point).should.throw 'A pair of WGS-84 coordinates expected'
    (-> new Point('foo', 'bar')).should.throw 'A pair of WGS-84 coordinates expected'

  it 'should only allow sensible latitudes', ->
    (-> new Point(-120, 12)).should.throw 'WGS-84 latitude must be between 90 and -90 degrees'
    (-> new Point(120, 12)).should.throw 'WGS-84 latitude must be between 90 and -90 degrees'

  it 'should only allow sensible longitudes', ->
    (-> new Point(12, -300)).should.throw 'WGS-84 longitude must be between 180 and -180 degrees'
    (-> new Point(12, 240)).should.throw 'WGS-84 longitude must be between 180 and -180 degrees'

  it 'should convert to a pretty string', ->
    "#{efhf}".should.equal '60°15′16″N 25°2′34″E'
    "#{fymg}".should.equal '22°4′59″S 17°22′0″E'

  it 'should be able to calculate distance to other points', ->
    # There are 8.2 kilometers between the two Helsinki airports
    efhf.distanceTo(efhk).should.equal 8.2

    # 8.2 kilometers is approximately 4.4 nautical miles
    efhf.distanceTo(efhk, 'N').should.equal 4.4

    # There are 9181.6 kilometers from Helsinki to Midgard
    efhf.distanceTo(fymg).should.equal 9181.6
    efhf.distanceTo(fymg, 'N').should.equal 4954.4

  it 'should be able to calculate bearing to other points', ->
    # Helsinki-Vantaa is in north of Helsinki-Malmi
    efhf.bearingTo(efhk).should.equal 329

    # Helsinki-Malmi is in the south of Helsinki-Vantaa
    efhk.bearingTo(efhf).should.equal 149

    # Midgard airport is way to the south
    efhf.bearingTo(fymg).should.equal 187
