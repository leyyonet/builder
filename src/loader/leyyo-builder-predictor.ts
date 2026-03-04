import { definePredictor } from "@leyyo/common";
import { PCK } from "../internal.js";

// noinspection JSUnusedGlobalSymbols
export const leyyoBuilderPredictor = definePredictor(PCK)
  .dependency(() => import("@leyyo/common").then((m) => m.leyyoCommonPredictor))
  .end();
