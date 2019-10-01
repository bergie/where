Geographical utilities for Node.js [![Build Status](https://github.com/bergie/where/workflows/Node%20CI/badge.svg)](https://github.com/bergie/where/actions) [![Greenkeeper badge](https://badges.greenkeeper.io/bergie/where.svg)](https://greenkeeper.io/) [![Coverage Status](https://coveralls.io/repos/github/bergie/where/badge.svg)](https://coveralls.io/github/bergie/where)
==================================

This library provides some basic utilities for building location-based applications.

## Some features

Start by importing _where_:

```javascript
const where = require('where');
```

Given two points, the Helsinki-Malmi and Helsinki-Vantaa airports:

```javascript
const malmi = new where.Point(60.254558, 25.042828);
const vantaa = new where.Point(60.317222, 24.963333);
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
const geocoder = new where.Geocoder;
geocoder.toPoint({
  display_name: 'Helsinki',
  country: 'fi'
})
  .then((points) => {
    points[0].lat; // 60.1666277
    points[0].lon; // 24.9435079
  });
```

Converting coordinates to human-readable addresses (reverse geocoding, powered by [OpenStreetMap Nominatim](http://wiki.openstreetmap.org/wiki/Nominatim)):

```javascript
geocoder.fromPoint(malmi)
  .then((location) => {
    location.address.road; // Malminkaari
    location.address.city; // Helsinki
  });
```

Creating bounding boxes for a given radius (coming soon):

```javascript
// 20km bounding box
const bbox = malmi.getBBox(20);
malmi.directionTo(bbox.sw); // SW
```

## Installation

    $ npm install where --save

## Running tests

    $ npm install --dev
    $ npm test

## Development

This library is provided under the MIT license. Contributions to the project are welcome on GitHub.

Initially this has been a Node.js port of my earlier [PHP library](http://github.com/bergie/midgardmvc_helper_location).

## Changes

* 0.3.2 (October 01 2019)
  - Also available on GitHub Package Registry
* 0.3.1 (November 03 2018)
  - Switched from request to the fetch library for browser compat
* 0.3.0 (October 16 2017)
  - Switched asynchronous geocoding methods to return a promise instead of using a callback
