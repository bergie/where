/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const request = require('request');
const {Point} = require('./Point');
const where = require('../package.json');

class Geocoder {
  constructor () {
    this.url = 'http://nominatim.openstreetmap.org/search';
    this.revUrl = 'http://nominatim.openstreetmap.org/reverse';
  }

  toPoint (location) {
    return new Promise((resolve, reject) => {
      request({
        uri: this.url,
        qs: {
          q: location.display_name,
          countrycodes: location.country_code,
          format: 'json'
        },
        headers: {
          'User-Agent': `Where ${where.version}`
        }
      }, function (err, resp, body) {
        if (err) { return reject(err); }
        if (resp.statusCode !== 200) {
          return reject(new Error(`Nominatim failed with ${resp.statusCode}`));
        }
        const results = JSON.parse(body);
        const points = [];
        for (let result of Array.from(results)) {
          points.push(new Point(parseFloat(result.lat), parseFloat(result.lon)));
        }
        resolve(points);
      });
    });
  }

  fromPoint (point) {
    return new Promise((resolve, reject) => {
      request({
        uri: this.revUrl,
        qs: {
          lat: point.lat,
          lon: point.lon,
          addressdetails: 1,
          format: 'json'
        },
        headers: {
          'User-Agent': `Where ${where.version}`
        }
      }, function (err, resp, body) {
        if (err) { return reject(err); }
        if (resp.statusCode !== 200) {
          return reject(new Error(`Nominatim failed with ${resp.statusCode}`));
        }
        return resolve(JSON.parse(body));
      });
    });
  }
}

const root = typeof exports !== 'undefined' && exports !== null ? exports : window;
root.Geocoder = Geocoder;
