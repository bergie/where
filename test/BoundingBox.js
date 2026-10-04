import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BBox, Point } from "../index.js";

describe("Geographical bounding box", () => {
  it("should have corners", () => {
    const sw = new Point(60.254558, 24.963333);
    const ne = new Point(60.317222, 25.042828);
    const box = new BBox(sw, ne);

    // Corners actually set via constructor
    assert.strictEqual(box.sw, sw);
    assert.strictEqual(box.ne, ne);

    // Calculated corners
    assert.strictEqual(box.se.lat, sw.lat);
    assert.strictEqual(box.se.lon, ne.lon);
    assert.strictEqual(box.nw.lat, ne.lat);
    assert.strictEqual(box.nw.lon, sw.lon);
  });

  it("should not allow arguments in wrong order", () => {
    const sw = new Point(60.254558, 25.042828);
    const ne = new Point(60.317222, 24.963333);
    assert.throws(
      () => new BBox(sw, ne),
      /SW corner and NE corner have to be in correct order/,
    );
  });
});
