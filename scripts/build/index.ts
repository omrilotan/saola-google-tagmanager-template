#!/usr/bin/env node --experimental-strip-types

/// <reference lib="@types/node" />

import { build } from "./program/index.ts";

await build();
