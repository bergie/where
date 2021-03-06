require('isomorphic-fetch');
const qs = require('querystring');
const { Point } = require('./Point');
const where = require('../package.json');

class Geocoder {
  constructor() {
    this.url = 'http://nominatim.openstreetmap.org/search';
    this.revUrl = 'http://nominatim.openstreetmap.org/reverse';
  }

  toPoint(location) {
    const query = qs.stringify({
      q: location.display_name,
      countrycodes: location.country_code,
      format: 'json',
    });
    return fetch(`${this.url}?${query}`, {
      headers: {
        'User-Agent': `Where ${where.version}`,
      },
    })
      .then((res) => res.json())
      .then((res) => res.map((r) => new Point(parseFloat(r.lat), parseFloat(r.lon))));
  }

  fromPoint(point) {
    const query = qs.stringify({
      lat: point.lat,
      lon: point.lon,
      addressdetails: 1,
      format: 'json',
    });
    return fetch(`${this.revUrl}?${query}`, {
      headers: {
        'User-Agent': `Where ${where.version}`,
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error(`Nominatim failed with ${res.status}`);
        }
        return res.json();
      });
  }
}

exports.Geocoder = Geocoder;
