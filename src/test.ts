/// <reference lib="@types/node" />

import { deepEqual, equal, notDeepEqual, ok } from "node:assert/strict";
import { readdir } from "node:fs/promises";
import { basename, join } from "node:path";
import {
  afterEach,
  before,
  beforeEach,
  describe,
  snapshot,
  test
} from "node:test";
import { importTypescriptAsJavascriptString } from "../lib/index.ts";

let codeContent: string = "";
const mocks = {};
const globals = {};

// Create call tracking with a factory function
const createCallTracker = () => ({ called: false, calls: [] });
const calls = {
  gtmOnSuccess: createCallTracker(),
  gtmOnFailure: createCallTracker()
};

// Helper to create API method handlers
const createApiMethod = (name, implementation) => {
  return function (...args) {
    calls[name] = calls[name] || createCallTracker();
    calls[name].called = true;
    calls[name].calls.push(args);
    return typeof mocks[name] === "function"
      ? mocks[name](...args)
      : implementation.apply(this, args);
  };
};

// GTM API definitions
const gtmAPIDefinitions = {
  JSON,
  sendPixel: (url, onSuccess) => onSuccess(),
  injectScript: (url, onSuccess) => onSuccess(),
  getType: (value) => typeof value,
  generateRandom: (from, to) => Math.floor(Math.random() * (to - from) + from),
  makeNumber: (value) => Number(value),
  setInWindow: (key, value, overrideExisting = false) => {
    if (overrideExisting && globals[key]) return;
    globals[key] = value;
  },
  callInWindow: (key, ...args) => globals[key]?.(...args),
  copyFromWindow: (key) => globals[key]
};

// Create API handlers
const gtmAPI = Object.fromEntries(
  Object.entries(gtmAPIDefinitions).map(([name, value]) => [
    name,
    typeof value === "function" ? createApiMethod(name, value) : value
  ])
);

// Setup global test helpers
Object.assign(globalThis, {
  assertThat: (item) => ({
    isEqualTo: (value) => equal(item, value)
  }),
  assertApi: (name) => ({
    wasCalled: () => ok(calls[name]?.called, `${name} was not called`),
    wasNotCalled: () => ok(!calls[name]?.called, `${name} was called`),
    wasCalledWith: (...args) =>
      calls[name]?.called && deepEqual(calls[name].calls[0], args),
    wasNotCalledWith: (...args) =>
      calls[name]?.called && notDeepEqual(calls[name].calls[0], args)
  }),
  mock: (name, implementation) => {
    mocks[name] = implementation;
  },
  require: (name) => gtmAPI[name],
  runCode: (data = {}) => {
    Object.assign(
      data,
      ["gtmOnSuccess", "gtmOnFailure"].reduce(
        (acc, name) => ({
          ...acc,
          [name]: (...args) => {
            calls[name].called = true;
            calls[name].calls.push(args);
          }
        }),
        {}
      )
    );
    eval(codeContent);
  }
});

const baseDir = process.cwd();
const scenarios = (await readdir(join(baseDir, "src/tests/scenarios"))).filter(
  (file) => !file.startsWith(".")
);

describe(`${basename(baseDir)} template`, () => {
  before(async () => {
    codeContent = await importTypescriptAsJavascriptString(
      baseDir,
      "src/code/index.ts"
    );
    snapshot.setResolveSnapshotPath(() => join(baseDir, "test.ts.snapshot"));
  });

  beforeEach(async () => {
    await import(join(baseDir, "src/tests/setup/index.js"));
  });

  afterEach(() => {
    for (const key in globals) {
      delete globals[key];
    }
    delete globalThis.data;

    Object.keys(mocks).forEach((key) => delete mocks[key]);
    Object.keys(globals).forEach((key) => delete globals[key]);

    Object.values(calls).forEach((callObj) => {
      callObj.called = false;
      callObj.calls.length = 0;
    });
  });

  scenarios.forEach((scenario) => {
    test(scenario, async () => {
      await import(join(baseDir, "src/tests/scenarios", scenario));
    });
  });
});
