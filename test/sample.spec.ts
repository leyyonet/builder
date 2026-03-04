import { beforeAll, assert, describe, it } from "vitest";
import { CausedError, initTest } from "@leyyo/common";

beforeAll(() => initTest());

describe("http", () => {
  it("not symbol", () => {
    assert.throws(() => {
      throw new CausedError("invalid");
    });
  });
});
