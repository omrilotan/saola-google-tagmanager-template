/// <reference types="node" />

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import ts from "typescript";

export const indent = (string: string, indentation = "\t"): string =>
  string
    .split("\n")
    .map((line) => (line === "" ? line : `${indentation}${line}`))
    .join("\n");
export const capitalize = (string: string): string =>
  string[0].toUpperCase() + string.slice(1);

export const readFileContent = async (
  base: string,
  path: string
): Promise<string> => (await readFile(join(base, path), "utf-8")).trim();

export const importTypescriptAsJavascriptString = async (
  base: string,
  path: string
): Promise<string> => {
  const tsCode = await readFileContent(base, path);
  const compilerOptions: ts.CompilerOptions = {
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.None,
    removeComments: true
  };
  const code = ts
    .transpileModule(tsCode, { compilerOptions })
    .outputText.trim();
  // replace indentation from 4 spaces to 2 spaces
  const code2 = code.replace(/    /g, "  ");
  return code2;
};

export const importIndexAsJSON = async (
  base: string,
  name: string
): Promise<string> =>
  JSON.stringify((await import(join(base, name, "index.ts")))[name], null, 2);
