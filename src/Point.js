toRadians = (degrees) -> degrees * Math.PI / 180
toDegrees = (radians) -> radians * 180 / Math.PI

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

  bearingTo: (to) ->
    distance = @distanceTo to
    return 0 if distance is 0

    deltaLon = toRadians to.lon - @lon
    lat1 = toRadians @lat
    lat2 = toRadians to.lat

    y = Math.sin(deltaLon) * Math.cos(lat2)
    x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon)
    res = toDegrees Math.atan2 y, x
    Math.round (res + 360) % 360

  bearingChange: (origin, to) ->
    previous = origin.bearingTo to
    current = to.bearingTo @
    difference = current - previous
    while difference < -180
      difference += 360
    while difference > 180
      difference -= 360
    difference

  directionTo: (to) ->
    bearing = @bearingTo to
    dirs = ['N', 'E', 'S', 'W']
    rounded = Math.round(bearing / 22.5) % 16

    return dirs[rounded / 4] if (rounded % 4) is 0
 
    dir = dirs[2 * Math.floor(((Math.floor(rounded / 4) + 1) % 4) / 2)]
    dir += dirs[1 + 2 * Math.floor(rounded / 8)]

  distanceTo: (to, unit = 'K') ->
    startLat = toRadians @lat
    startLon = toRadians @lon
    endLat = toRadians to.lat
    endLon = toRadians to.lon
    dLat = endLat - startLat
    dLon = endLon - startLon
    a = Math.pow(Math.sin(dLat / 2.0), 2) + Math.cos(startLat) * Math.cos(endLat) * Math.pow(Math.sin(dLon / 2.0), 2)
    c = 2.0 * Math.atan2 Math.sqrt(a), Math.sqrt(1.0 - a)
    res = Math.round((6371.0 * c) * 10) / 10
    return Math.round((res * 0.539956803) * 10) / 10 if unit is 'N'
    res

  getBBox: (distance) -> null

root = exports ? window
root.Point = Point
