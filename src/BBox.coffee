require 'coffee-script'
{Point} = require './Point.coffee'

class BBox
  sw: null
  ne: null

  constructor: (@sw, @ne) ->

# Getters that create Point instances for the south-east and 
# north-west corners
Object.defineProperty BBox::, 'se',
  get: -> new Point @sw.lat, @ne.lon
Object.defineProperty BBox::, 'nw',
  get: -> new Point @ne.lat, @sw.lon

root = exports ? window
root.BBox = BBox
