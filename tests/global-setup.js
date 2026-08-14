import { execSync } from "node:child_process";

export default function globalSetup() {
  execSync("pnpm build", { stdio: "inherit" });
}
