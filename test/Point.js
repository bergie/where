import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Point } from "../index.js";

// Helsinki-Malmi airport in Finland
const efhf = new Point(60.254558, 25.042828);
// Helsinki-Vantaa airport in Finland
const efhk = new Point(60.317222, 24.963333);
// Midgard airport in Namibia
const fymg = new Point(-22.083332, 17.366667);
// Spaceport America
const spaceport = new Point(32.990278, -106.969722);

describe("Geographical point", () => {
  it("should have coordinates", () => {
    assert.strictEqual(efhf.lat, 60.254558);
    assert.strictEqual(efhk.lon, 24.963333);
    assert.strictEqual(fymg.lat, -22.083332);
    assert.strictEqual(fymg.lon, 17.366667);
    assert.strictEqual(spaceport.lon, -106.969722);
  });

  it("should only accept numbers", () => {
    // @ts-expect-error testing invalid arguments on purpose
    assert.throws(() => new Point(), /A pair of WGS-84 coordinates expected/);
    assert.throws(
      // @ts-expect-error testing invalid arguments on purpose
      () => new Point("foo", "bar"),
      /A pair of WGS-84 coordinates expected/,
    );
    assert.throws(
      // @ts-expect-error testing invalid arguments on purpose
      () => new Point(10, "bar"),
      /A pair of WGS-84 coordinates expected/,
    );
    assert.throws(
      // @ts-expect-error testing invalid arguments on purpose
      () => new Point("foo", 10),
      /A pair of WGS-84 coordinates expected/,
    );
  });

  it("should only allow sensible latitudes", () => {
    assert.throws(
      () => new Point(-120, 12),
      /WGS-84 latitude must be between 90 and -90 degrees/,
    );
    assert.throws(
      () => new Point(120, 12),
      /WGS-84 latitude must be between 90 and -90 degrees/,
    );
  });

  it("should only allow sensible longitudes", () => {
    assert.throws(
      () => new Point(12, -300),
      /WGS-84 longitude must be between 180 and -180 degrees/,
    );
    assert.throws(
      () => new Point(12, 240),
      /WGS-84 longitude must be between 180 and -180 degrees/,
    );
  });

  it("should convert to a pretty string", () => {
    assert.strictEqual(`${efhf}`, "60°15′16″N 25°2′34″E");
    assert.strictEqual(`${fymg}`, "22°4′59″S 17°22′0″E");
    assert.strictEqual(`${spaceport}`, "32°59′25″N 106°58′10″W");
  });

  it("should be able to calculate distance to other points", () => {
    // There are 8.2 kilometers between the two Helsinki airports
    assert.strictEqual(efhf.distanceTo(efhk), 8.231);

    // There are 9181.6 kilometers from Helsinki to Midgard
    assert.strictEqual(efhf.distanceTo(fymg), 9182.033);
    assert.strictEqual(efhf.distanceTo(fymg, "N"), 4957.901);
  });

  it("should be able to calculate also very short distances", () => {
    const from = new Point(60.254558, 25.051917118289477);
    const to = new Point(60.254558, 25.05282240895576);
    assert.strictEqual(from.distanceTo(to), 0.05);
  });

  it("should be able to calculate bearing to other points", () => {
    // Helsinki-Vantaa is in north of Helsinki-Malmi
    assert.strictEqual(efhf.bearingTo(efhk), 328);

    // Helsinki-Malmi is in the south of Helsinki-Vantaa
    assert.strictEqual(efhk.bearingTo(efhf), 148);

    // Midgard airport is way to the south
    assert.strictEqual(efhf.bearingTo(fymg), 187);
  });

  it("should be able to calculate changes in direction", () => {
    // Started from Malmi towards Vantaa, then turned back
    assert.strictEqual(efhf.bearingChange(efhf, efhk), -180);

    // Started from Malmi, and stayed there
    assert.strictEqual(efhf.bearingChange(efhf, efhf), 0);

    // Started from Vantaa towards Midgard, then turned to Malmi
    assert.strictEqual(efhf.bearingChange(efhk, fymg), 177);

    // Started from Vantaa towards Malmi, then turned to Midgard
    assert.strictEqual(fymg.bearingChange(efhk, efhf), 39);

    // Started from Malmi towards Vantaa, then turned to Midgard
    assert.strictEqual(fymg.bearingChange(efhf, efhk), -141);
  });

  it("should be able to tell direction to other points", () => {
    // Helsinki-Vantaa is in northwest of Helsinki-Malmi
    assert.strictEqual(efhf.directionTo(efhk), "NW");

    // Helsinki-Malmi is in southeast of Helsinki-Vantaa
    assert.strictEqual(efhk.directionTo(efhf), "SE");

    // Midgard is way south
    assert.strictEqual(efhf.directionTo(fymg), "S");
  });

  describe("across the antimeridian", () => {
    // A point at 179.5E and a point at 179.5W on the equator
    // are 1 degree of longitude apart, not 359 degrees
    const eastSide = new Point(0, 179.5);
    const westSide = new Point(0, -179.5);

    it("should calculate short distances across the antimeridian", () => {
      // 1 degree at the equator is roughly 60 nautical miles
      assert.strictEqual(eastSide.distanceTo(westSide, "N"), 60.04);
      assert.strictEqual(eastSide.distanceTo(westSide), 111.195);

      // The distance is the same in both directions
      assert.strictEqual(westSide.distanceTo(eastSide, "N"), 60.04);
    });

    it("should calculate very short distances across the antimeridian", () => {
      const from = new Point(0, 179.999);
      const to = new Point(0, -179.999);
      assert.strictEqual(from.distanceTo(to), 0.222);
    });

    it("should calculate bearings across the antimeridian", () => {
      // Going east from 179.5E crosses the antimeridian to 179.5W
      assert.strictEqual(eastSide.bearingTo(westSide), 90);
      assert.strictEqual(eastSide.directionTo(westSide), "E");

      // Going west from 179.5W crosses the antimeridian to 179.5E,
      // so the 179.5E point is to the _west_ of the 179.5W point
      assert.strictEqual(westSide.bearingTo(eastSide), 270);
      assert.strictEqual(westSide.directionTo(eastSide), "W");
    });

    it("should calculate bearings across the antimeridian at other latitudes", () => {
      // From the 179.5W point the 179.5E point is due west, also off the equator
      const northWestSide = new Point(60, -179.5);
      const northEastSide = new Point(60, 179.5);
      assert.strictEqual(northWestSide.bearingTo(northEastSide), 270);
      assert.strictEqual(northEastSide.bearingTo(northWestSide), 90);
    });

    it("should calculate bearing changes across the antimeridian", () => {
      // Traveling east from 179.9E, and then continuing east past the antimeridian
      const start = new Point(0, 179.9);
      const halfway = new Point(0, 179.95);
      const past = new Point(0, -179.9);

      // Both legs are due east, so the heading never changes
      assert.strictEqual(past.bearingChange(start, halfway), 0);
    });
  });
});
