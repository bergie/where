import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Geocoder, Point } from "../index.js";

describe("Geocoder", () => {
  const geocoder = new Geocoder();

  it("should be able to convert city and country to coordinates", {
    timeout: 4000,
  }, async () => {
    const points = await geocoder.toPoint({
      display_name: "Helsinki",
      country_code: "fi",
    });
    assert.strictEqual(Math.round(points[0].lat), 60);
    assert.strictEqual(Math.round(points[0].lon), 25);
  });

  it("should be able to convert coordinates to a place", {
    timeout: 4000,
  }, async () => {
    // Helsinki-Malmi airport in Finland
    const efhf = new Point(60.254558, 25.042828);
    const location = await geocoder.fromPoint(efhf);
    assert.notStrictEqual(location.display_name.indexOf("Malmin lento"), -1);
    assert.strictEqual(location.address.suburb, "Malmi");
    assert.strictEqual(location.address.city, "Helsinki");
    assert.strictEqual(location.address.country_code, "fi");
  });
});
