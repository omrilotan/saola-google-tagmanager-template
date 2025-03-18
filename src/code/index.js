const copyFromWindow = require("copyFromWindow");
const injectScript = require("injectScript");
const setInWindow = require("setInWindow");

start(data);

function start(data) {
  if (!data.token) {
    return data.gtmOnFailure();
  }
  const existingSaolaParams = copyFromWindow("SaolaParams");
  const hasExistingSaolaParams =
    typeof existingSaolaParams === "object" && existingSaolaParams !== null;
  const saolaParams = hasExistingSaolaParams ? existingSaolaParams : {};
  saolaParams.token = data.token;
  setInWindow("SaolaParams", saolaParams, true);

  const version = data.version || "latest";
  const url = ["https://www.saola.ai/sdk/saola", version, "js"].join(".");
  injectScript(url, data.gtmOnSuccess, data.gtmOnFailure, url);
}
