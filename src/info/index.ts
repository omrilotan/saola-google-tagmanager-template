import { readFileSync } from "node:fs";
import { join } from "node:path";

const __dirname = new URL(".", import.meta.url).pathname;
const thumbnailFile = join(__dirname, "thumbnail.png");
const thumbnailBase64 = readFileSync(thumbnailFile, "base64");

export const info = {
  type: "TAG",
  id: "cvt_temp_public_id",
  version: 1,
  securityGroups: [],
  displayName: "Saola Recorder",
  brand: {
    id: "SaolaAI",
    displayName: "SaolaAI",
    thumbnail: `data:image/png;base64,${thumbnailBase64}`
  },
  description: "Add Saola\u0027s browser SDK with a script loader",
  containerContexts: ["WEB"]
};
