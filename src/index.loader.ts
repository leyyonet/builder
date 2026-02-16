import {FQN} from "./internal.js";
import {defineLoader} from "@leyyo/common";


// noinspection JSUnusedGlobalSymbols
export const loader_leyyoBuilder = defineLoader(FQN,
    // classes
    () => import('./builder.js').then(m => m.Builder),
);
