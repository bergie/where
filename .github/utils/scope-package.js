import { readFileSync, writeFileSync } from "node:fs";

const pkgUrl = new URL("../../package.json", import.meta.url);
const pkg = JSON.parse(readFileSync(pkgUrl, "utf-8"));
pkg.name = "@bergie/where";
writeFileSync(pkgUrl, JSON.stringify(pkg, null, 2), "utf-8");
