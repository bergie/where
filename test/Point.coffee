chai = require 'chai'
do chai.should

{Point} = require '../index'

describe 'Geographical point', ->
  it 'should have coordinates', ->
    point = new Point -22.083332, 17.366667
    point.lat.should.equal -22.083332
    point.lon.should.equal 17.366667

  it 'should only accept numbers', ->
    (-> new Point('foo', 'bar')).should.throw 'A pair of WGS-84 coordinates expected'

  it 'should only allow sensible latitudes', ->
    (-> new Point(-120, 12)).should.throw 'WGS-84 latitude must be between 90 and -90 degrees'
    (-> new Point(120, 12)).should.throw 'WGS-84 latitude must be between 90 and -90 degrees'

  it 'should only allow sensible longitudes', ->
    (-> new Point(12, -300)).should.throw 'WGS-84 longitude must be between 180 and -180 degrees'
    (-> new Point(12, 240)).should.throw 'WGS-84 longitude must be between 180 and -180 degrees'

  it 'should convert to a pretty string', ->
    # Helsinki-Malmi airport in Finland
    efhf = new Point 60.254558, 25.042828
    "#{efhf}".should.equal '60°15′16″N 25°2′34″E'

    # Midgard airport in Namibia
    fymg = new Point -22.083332, 17.366667 
    "#{fymg}".should.equal '22°4′59″S 17°22′0″E'
