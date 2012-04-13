Geographical utilities for Node.js
==================================

This library provides some basic utilities for building location-based applications.

## Some features

Given two points, the Helsinki-Malmi and Helsinki-Vantaa airports:

    var malmi = new Point(60.254558, 25.042828);
    var vantaa = new Point(60.317222, 24.963333);

Calculating distances between points:

    malmi.distanceTo(vantaa); // 8.2

Calculating bearing and direction from a point to another:

    malmi.bearingTo(vantaa);   // 329
    malmi.directionTo(vantaa); // NW

Creating bounding boxes for a given radius:

    // 20km bounding box
    var bbox = malmi.getBBox(20);
    malmi.directionTo(bbox.sw); // SW

Pretty printing to human-readable coordinates:

    malmi.toString(); // 60°15′16″N 25°2′34″E

## Installation

    $ npm install nogeo

## Running tests

    $ npm install --dev
    $ npm test

## Development

This library is provided under the MIT license. Contributions to the project are welcome on GitHub.

Initially this has been a Node.js port of my earlier [PHP library](http://github.com/bergie/midgardmvc_helper_location).
