/**
 * Converts degrees to radians.
 *
 * @param {number} degrees
 * @returns {number} radians
 */
const toRadians = (degrees) => (degrees * Math.PI) / 180;

/**
 * Converts radians to degrees.
 *
 * @param {number} radians
 * @returns {number} degrees
 */
const toDegrees = (radians) => (radians * 180) / Math.PI;

/**
 * A point on the WGS-84 geoid, defined by latitude and longitude.
 */
class Point {
  /**
   * @param {number} lat WGS-84 latitude between 90 and -90 degrees
   * @param {number} lon WGS-84 longitude between 180 and -180 degrees
   */
  constructor(lat, lon) {
    this.lat = lat;
    this.lon = lon;
    if (typeof this.lat !== "number" || typeof this.lon !== "number") {
      throw new Error("A pair of WGS-84 coordinates expected");
    }
    if (this.lat > 90 || this.lat < -90) {
      throw new Error("WGS-84 latitude must be between 90 and -90 degrees");
    }
    if (this.lon > 180 || this.lon < -180) {
      throw new Error("WGS-84 longitude must be between 180 and -180 degrees");
    }
  }

  /**
   * Pretty-prints the coordinates in degrees, minutes and seconds.
   *
   * @returns {string} coordinates like `60°15′16″N 25°2′34″E`
   */
  toString() {
    /**
     * @param {number} coord
     * @returns {string}
     */
    const prettyPrint = (coord) => {
      const degreesFloat = Math.abs(coord);
      const degrees = Math.floor(degreesFloat);
      const minutesFloat = 60 * (degreesFloat - degrees);
      const minutes = Math.floor(minutesFloat);
      const secondsFloat = 60 * (minutesFloat - minutes);
      const seconds = Math.floor(secondsFloat);
      return `${degrees}°${minutes}′${seconds}″`;
    };

    const ns = this.lat > 0 ? "N" : "S";
    const ew = this.lon > 0 ? "E" : "W";

    return `${prettyPrint(this.lat)}${ns} ${prettyPrint(this.lon)}${ew}`;
  }

  /**
   * Calculates the bearing from this point to another.
   *
   * @param {Point} to
   * @returns {number} bearing in degrees, rounded to the closest degree
   */
  bearingTo(to) {
    const distance = this.distanceTo(to);
    if (distance === 0) {
      return 0;
    }

    // Normalize the longitude difference to the -180..180 range
    // so that routes across the antimeridian measure correctly
    let deltaLonDegrees = to.lon - this.lon;
    if (deltaLonDegrees > 180) {
      deltaLonDegrees -= 360;
    }
    if (deltaLonDegrees < -180) {
      deltaLonDegrees += 360;
    }
    const deltaLon = toRadians(deltaLonDegrees);
    const lat1 = toRadians(this.lat);
    const lat2 = toRadians(to.lat);

    const y = Math.sin(deltaLon) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);
    const res = toDegrees(Math.atan2(y, x));
    return Math.round((res + 360) % 360);
  }

  /**
   * Calculates the change in bearing during a journey from `origin`
   * via this point to `to`.
   *
   * @param {Point} origin point where the journey started
   * @param {Point} to point the journey continues to
   * @returns {number} bearing change in degrees between -180 and 180
   */
  bearingChange(origin, to) {
    const previous = origin.bearingTo(to);
    const current = to.bearingTo(this);
    let difference = current - previous;
    while (difference < -180) {
      difference += 360;
    }
    while (difference > 180) {
      difference -= 360;
    }
    return difference;
  }

  /**
   * Tells the compass direction from this point to another.
   *
   * @param {Point} to
   * @returns {string} one of N, NE, E, SE, S, SW, W, NW
   */
  directionTo(to) {
    const bearing = this.bearingTo(to);
    const dirs = ["N", "E", "S", "W"];
    const rounded = Math.round(bearing / 22.5) % 16;

    if (rounded % 4 === 0) {
      return dirs[rounded / 4];
    }

    let dir = dirs[2 * Math.floor(((Math.floor(rounded / 4) + 1) % 4) / 2)];
    dir += dirs[1 + 2 * Math.floor(rounded / 8)];
    return dir;
  }

  /**
   * Calculates the great-circle distance to another point.
   *
   * @param {Point} to
   * @param {'K'|'N'} [unit='K'] unit of the result: `K` for kilometers, `N` for nautical miles
   * @returns {number} distance rounded to one meter (or 0.001 nautical miles) accuracy
   */
  distanceTo(to, unit = "K") {
    const startLat = toRadians(this.lat);
    const startLon = toRadians(this.lon);
    const endLat = toRadians(to.lat);
    const endLon = toRadians(to.lon);
    const dLat = endLat - startLat;
    const dLon = endLon - startLon;
    const a =
      Math.sin(dLat / 2.0) ** 2 +
      Math.cos(startLat) * Math.cos(endLat) * Math.sin(dLon / 2.0) ** 2;
    const c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a));
    const res = Math.round(6371.0 * c * 1000) / 1000;
    if (unit === "N") {
      return Math.round(res * 0.539956803 * 1000) / 1000;
    }
    return res;
  }
}

export { Point };
