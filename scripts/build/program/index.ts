/// <reference lib="@types/node" />

import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const indent = (string: string, indentation = "\t"): string =>
  string
    .split("\n")
    .map((line) => (line === "" ? line : `${indentation}${line}`))
    .join("\n");
const capitalize = (string: string): string =>
  string[0].toUpperCase() + string.slice(1);
const readFileContent = async (base: string, path: string): Promise<string> =>
  (await readFile(join(base, path), "utf-8")).trim();
const importIndexAsJSON = async (base: string, name: string): Promise<string> =>
  JSON.stringify((await import(join(base, name, "index.ts")))[name], null, 2);

/**
 * Build the tests section of the template.
 */
async function buildTests(base: string, directory: string): Promise<string> {
  const setup = await readFile(
    join(base, directory, "/setup/index.js"),
    "utf-8"
  );
  const scenariosFiles = await readdir(join(base, directory, "scenarios"));

  const scenarios = await Promise.all(
    scenariosFiles.map(async (scenario) => {
      const name = capitalize(scenario.replace(/\..*$/, ""));
      const code = await readFile(
        join(base, directory, "scenarios", scenario),
        "utf-8"
      );

      return [
        `- name: ${name}`,
        indent("code: |-", "  "),
        indent(code, "    ")
      ].join("\n");
    })
  );

  return ["scenarios:", ...scenarios, "setup: |-", indent(setup, "  ")].join(
    "\n"
  );
}

/**
 * Build the template.
 */
export async function build({
  root = process.cwd(),
  logger = console,
  verify = false
} = {}): Promise<void> {
  logger.debug("Parse data");
  const base = join(root, "src");

  // Define template sections and their sources
  const sections: Record<
    string,
    [string, (base: string, path: string) => Promise<string>]
  > = {
    ___TERMS_OF_SERVICE___: ["tos/tos.txt", readFileContent],
    ___INFO___: ["info", importIndexAsJSON],
    ___TEMPLATE_PARAMETERS___: ["variables", importIndexAsJSON],
    ___SANDBOXED_JS_FOR_WEB_TEMPLATE___: ["code/index.js", readFileContent],
    ___WEB_PERMISSIONS___: ["permissions", importIndexAsJSON],
    ___TESTS___: ["tests", buildTests],
    ___NOTES___: ["notes/notes.txt", readFileContent]
  };

  // Generate content for each section
  const data = await Object.entries(sections).reduce(
    async (acc, [key, [path, loader]]) => {
      const result = await acc;
      result[key] = await loader(base, path);
      return result;
    },
    Promise.resolve({})
  );

  logger.debug("Build template");
  // Filter out TOS (only for public templates) and format the output
  const output =
    Object.entries(data)
      .filter(([key]) => key !== "___TERMS_OF_SERVICE___")
      .map(([key, value]) => `${key}\n\n${value}`)
      .join("\n\n\n") + "\n\n";

  logger.debug("Check if template has changed");
  if (verify) {
    const current = await readFile(`${root}/template.tpl`, "utf-8");
    if (current !== output) {
      throw new Error("Template has changed. Please run build again.");
    } else {
      return;
    }
  }
  logger.debug("Write to file");
  await writeFile(`${root}/template.tpl`, output);
}
