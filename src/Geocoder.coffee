request = require 'request'
{Point} = require './Point'

class Geocoder
  url: 'http://nominatim.openstreetmap.org/search'

  toPoint: (location, cb) ->
    request
      uri: @url
      qs:
        q: location.string
        countrycodes: location.country
        format: 'json'
    , (err, resp, body) ->
      return cb err, null if err
      results = JSON.parse body
      points = []
      for result in results
        points.push new Point parseFloat(result.lat), parseFloat(result.lon)
      cb null, points

root = exports ? window
root.Geocoder = Geocoder
