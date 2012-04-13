chai = require 'chai'
do chai.should

{Point, BBox} = require '../index'

describe 'Geographical bounding box', ->
  it 'should have corners', ->
    sw = new Point 60.254558, 24.963333
    ne = new Point 60.317222, 25.042828

    box = new BBox sw, ne
    box.sw.should.equal sw
    box.ne.should.equal ne
    box.se.lat.should.equal sw.lat
    box.se.lon.should.equal ne.lon
    box.nw.lat.should.equal ne.lat
    box.nw.lon.should.equal sw.lon
