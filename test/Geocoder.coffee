chai = require 'chai'
do chai.should

{Geocoder, Point} = require '../index'

describe 'Geocoder', ->
  geocoder = new Geocoder
  it 'should be able to convert city and country to coordinates', (done) ->
    geocoder.toPoint
      display_name: 'Helsinki'
      country_code: 'fi'
    , (err, points) ->
      Math.round(points[0].lat).should.equal 60
      Math.round(points[0].lon).should.equal 25
      done()

  it 'should be able to convert coordinates to a place', (done) ->
    # Helsinki-Malmi airport in Finland
    efhf = new Point 60.254558, 25.042828
    geocoder.fromPoint efhf, (err, location) ->
      location.display_name.indexOf('Malmin lento').should.not.equal -1
      location.address.neighbourhood.should.equal 'Malmin lentokenttä'
      location.address.city.should.equal 'Helsinki'
      location.address.country_code.should.equal 'fi'
      done()
