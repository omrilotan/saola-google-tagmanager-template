#!/usr/bin/env NODE_NO_WARNINGS=1 node --experimental-strip-types
/// <reference types="node" />

import { parseArgs } from "node:util";
import { build } from "./program/index.ts";

const args = process.argv.slice(2).filter((arg) => arg !== "--");
const {
  values: { verify }
} = parseArgs({
  args,
  options: {
    verify: {
      type: "boolean"
    }
  }
});
await build({ verify });
