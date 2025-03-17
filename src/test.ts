/// <reference lib="@types/node" />

import { deepEqual, equal, notDeepEqual, ok } from "node:assert/strict";
import { access, readdir, readFile, rm } from "node:fs/promises";
import { basename, join } from "node:path";
import {
  afterEach,
  before,
  beforeEach,
  describe,
  snapshot,
  test
} from "node:test";

let codeContent: string = "";
const mocks = {};
globalThis.globals = {};

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
    if (overrideExisting && globalThis.globals[key]) return;
    globalThis.globals[key] = value;
  },
  callInWindow: (key, ...args) => globalThis.globals[key]?.(...args),
  copyFromWindow: (key) => globalThis.globals[key]
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

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

const baseDir = process.cwd();
const scenarios = (await readdir(join(baseDir, "src/tests/scenarios"))).filter(
  (file) => !file.startsWith(".")
);

describe(`${basename(baseDir)} template`, () => {
  before(async () => {
    codeContent = await readFile(join(baseDir, "src/code/index.js"), "utf-8");
    snapshot.setResolveSnapshotPath(() => join(baseDir, "test.ts.snapshot"));
  });

  beforeEach(async () => {
    await import(join(baseDir, "src/tests/setup/index.js"));
  });

  afterEach(() => {
    globalThis.globals = {};
    delete globalThis.data;

    Object.keys(mocks).forEach((key) => delete mocks[key]);
    Object.keys(globalThis.globals).forEach(
      (key) => delete globalThis.globals[key]
    );

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

describe("Build", () => {
  test("template", async () => {
    const templatePath = join(baseDir, "template.tpl");
    if (await exists(templatePath)) {
      await rm(templatePath);
    }
    const { build } = await import(
      join(baseDir, "scripts/build/program/index.ts")
    );
    await build({ root: baseDir });
    const template = await readFile(templatePath, "utf-8");
  });
});
