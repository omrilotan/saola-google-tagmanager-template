const copyFromWindow = require("copyFromWindow");
const injectScript = require("injectScript");
const setInWindow = require("setInWindow");
const encodeUriComponent = require("encodeUriComponent");

declare const data: Global["data"];

start(data as Global["data"]);

function start(data: Global["data"]): void {
  if (!data.token) {
    return data.gtmOnFailure();
  }
  const existingSaolaParams = copyFromWindow(
    "SaolaParams"
  ) as Global["SaolaParams"];
  const hasExistingSaolaParams =
    typeof existingSaolaParams === "object" && existingSaolaParams !== null;
  const saolaParams = hasExistingSaolaParams ? existingSaolaParams : {};
  saolaParams.token = data.token;
  setInWindow("SaolaParams", saolaParams, true);
  const version = data.version || "latest";
  const url = [
    "https://www.saola.ai/sdk/saola",
    encodeUriComponent(version),
    "js"
  ].join(".");
  injectScript(url, data.gtmOnSuccess, data.gtmOnFailure, url);
}
