import { createRequire } from "node:module";
import { Point } from "./Point.js";

const pkg = createRequire(import.meta.url)("../package.json");

/**
 * A place to geocode, typically obtained via reverse geocoding.
 *
 * @typedef {Object} NominatimLocation
 * @property {string} display_name human-readable name of the place
 * @property {string} country_code ISO 3166-1 alpha-2 country code
 */

/**
 * A place returned by reverse geocoding.
 *
 * @typedef {Object} NominatimPlace
 * @property {string} display_name human-readable name of the place
 * @property {{[key: string]: string}} address address parts of the place
 */

/**
 * Geocoding powered by [OpenStreetMap Nominatim](https://wiki.openstreetmap.org/wiki/Nominatim).
 */
class Geocoder {
  constructor() {
    this.url = "https://nominatim.openstreetmap.org/search";
    this.revUrl = "https://nominatim.openstreetmap.org/reverse";
  }

  /**
   * Converts a place name and country to coordinates.
   *
   * @param {NominatimLocation} location
   * @returns {Promise<Point[]>} matching points, closest matches first
   */
  async toPoint(location) {
    const query = new URLSearchParams({
      q: location.display_name,
      countrycodes: location.country_code,
      format: "json",
    });
    const res = await fetch(`${this.url}?${query}`, {
      headers: {
        "User-Agent": `where/${pkg.version}`,
      },
    });
    const results = /** @type {Array<{lat: string, lon: string}>} */ (
      await res.json()
    );
    return results.map(
      (r) => new Point(Number.parseFloat(r.lat), Number.parseFloat(r.lon)),
    );
  }

  /**
   * Converts coordinates to a human-readable place.
   *
   * @param {Point} point
   * @returns {Promise<NominatimPlace>}
   */
  async fromPoint(point) {
    const query = new URLSearchParams({
      lat: String(point.lat),
      lon: String(point.lon),
      addressdetails: "1",
      format: "json",
    });
    const res = await fetch(`${this.revUrl}?${query}`, {
      headers: {
        "User-Agent": `where/${pkg.version}`,
      },
    });
    if (res.status !== 200) {
      throw new Error(`Nominatim failed with ${res.status}`);
    }
    return /** @type {Promise<NominatimPlace>} */ (res.json());
  }
}

export { Geocoder };
