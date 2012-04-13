toRadians = (degrees) -> degrees * Math.PI / 180

class Point
  lat: null
  lon: null

  constructor: (@lat, @lon) ->
    unless typeof @lat is 'number' and typeof @lon is 'number'
      throw new Error 'A pair of WGS-84 coordinates expected'
    if @lat > 90 or @lat < -90
      throw new Error 'WGS-84 latitude must be between 90 and -90 degrees'
    if @lon > 180 or @lon < -180
      throw new Error 'WGS-84 longitude must be between 180 and -180 degrees'

  toString: ->
    prettyPrint = (coord) ->
      degreesFloat = Math.abs coord
      degrees = Math.floor degreesFloat
      minutesFloat = 60 * (degreesFloat - degrees)
      minutes = Math.floor minutesFloat
      secondsFloat = 60 * (minutesFloat - minutes)
      seconds = Math.floor secondsFloat
      "#{degrees}°#{minutes}′#{seconds}″"

    ns = if @lat > 0 then 'N' else 'S'
    ew = if @lon > 0 then 'E' else 'W'

    "#{prettyPrint(@lat)}#{ns} #{prettyPrint(@lon)}#{ew}"

  bearingTo: (to) -> 0
  directionTo: (to) -> 'S'

  distanceTo: (to) ->
    startLat = toRadians @lat
    startLon = toRadians @lon
    endLat = toRadians to.lat
    endLon = toRadians to.lon
    dLat = endLat - startLat
    dLon = endLon - startLon
    a = Math.pow(Math.sin(dLat / 2.0), 2) + Math.cos(startLat) * Math.cos(endLat) * Math.pow(Math.sin(dLon / 2.0), 2)
    c = 2.0 * Math.atan2 Math.sqrt(a), Math.sqrt(1.0 - a)
    6371.0 * c

  getBBox: (distance) -> null

root = exports ? window
root.Point = Point
