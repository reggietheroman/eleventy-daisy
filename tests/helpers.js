import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseHTML } from "linkedom";

export function loadDist(relativePath) {
  const html = readFileSync(join("dist", relativePath), "utf8");
  return parseHTML(html);
}
