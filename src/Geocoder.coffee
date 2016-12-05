request = require 'request'
{Point} = require './Point'
where = require '../package.json'

class Geocoder
  url: 'http://nominatim.openstreetmap.org/search'
  revUrl: 'http://nominatim.openstreetmap.org/reverse'

  toPoint: (location, cb) ->
    request
      uri: @url
      qs:
        q: location.display_name
        countrycodes: location.country_code
        format: 'json'
      headers:
        'User-Agent': "Where #{where.version}"
    , (err, resp, body) ->
      return cb err, null if err
      results = JSON.parse body
      points = []
      for result in results
        points.push new Point parseFloat(result.lat), parseFloat(result.lon)
      cb null, points

  fromPoint: (point, cb) ->
    request
      uri: @revUrl
      qs:
        lat: point.lat
        lon: point.lon
        addressdetails: 1
        format: 'json'
      headers:
        'User-Agent': "Where #{where.version}"
    , (err, resp, body) ->
      return cb err, null if err
      cb null, JSON.parse body

root = exports ? window
root.Geocoder = Geocoder
