Geographical utilities for Node.js [![Build Status](https://secure.travis-ci.org/bergie/where.png?branch=master)](http://travis-ci.org/bergie/where)
==================================

This library provides some basic utilities for building location-based applications.

## Some features

Start by importing _where_:

```javascript
var where = require('where');
```

Given two points, the Helsinki-Malmi and Helsinki-Vantaa airports:

```javascript
var malmi = new where.Point(60.254558, 25.042828);
var vantaa = new where.Point(60.317222, 24.963333);
```

Calculating distances between points (in kilometers):

```javascript
malmi.distanceTo(vantaa); // 8.2
```

Calculating bearing and direction from a point to another:

```javascript
malmi.bearingTo(vantaa);   // 329
malmi.directionTo(vantaa); // NW
```

Pretty printing to human-readable coordinates:

```javascript
malmi.toString(); // 60°15′16″N 25°2′34″E
```

Converting human-readable addresses to coordinates (geocoding, powered by [OpenStreetMap Nominatim](http://wiki.openstreetmap.org/wiki/Nominatim)):

```javascript
var geocoder = new where.Geocoder;
geocoder.toPoint({
  display_name: 'Helsinki',
  country: 'fi'
}, function (err, points) {
  points[0].lat; // 60.1666277
  points[0].lon; // 24.9435079 
});
```

Converting coordinates to human-readable addresses (reverse geocoding, powered by [OpenStreetMap Nominatim](http://wiki.openstreetmap.org/wiki/Nominatim)):

```javascript
geocoder.fromPoint(malmi, function (err, location) {
  location.address.road; // Malminkaari
  location.address.city; // Helsinki
});
```

Creating bounding boxes for a given radius (coming soon):

```javascript
// 20km bounding box
var bbox = malmi.getBBox(20);
malmi.directionTo(bbox.sw); // SW
```

## Installation

    $ npm install where

## Running tests

    $ npm install --dev
    $ npm test

## Development

This library is provided under the MIT license. Contributions to the project are welcome on GitHub.

Initially this has been a Node.js port of my earlier [PHP library](http://github.com/bergie/midgardmvc_helper_location).
