import {FQN} from "./internal.js";
import {defineLoader, loader_leyyoCommon} from "@leyyo/common";


// noinspection JSUnusedGlobalSymbols
export const loader_leyyoBuilder = defineLoader(FQN,
    // dependencies
    ...loader_leyyoCommon,

    // classes
    () => import('./builder.js').then(m => m.Builder),
);
