import { PCK } from "../internal.js";
import { defineLazy } from "@leyyo/common";

// noinspection JSUnusedGlobalSymbols
export const leyyoBuilderLazy = defineLazy(PCK)
  .dependency(() => import("@leyyo/common").then((m) => m.leyyoCommonLazy))
  // classes
  .add(() => import("../items/builder.js").then((m) => m.Builder))
  .end();
