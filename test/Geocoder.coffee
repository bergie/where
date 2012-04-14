chai = require 'chai'
do chai.should

{Geocoder} = require '../index'

describe 'Geocoder', ->
  geocoder = new Geocoder
  it 'should be able to convert city and country to coordinates', (done) ->
    geocoder.toPoint
      string: 'Helsinki'
      country: 'FI'
    , (err, points) ->
      Math.round(points[0].lat).should.equal 60
      Math.round(points[0].lon).should.equal 25
      done()
