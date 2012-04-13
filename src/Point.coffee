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

root = exports ? window
root.Point = Point
