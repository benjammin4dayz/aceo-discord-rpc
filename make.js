import esbuild from "esbuild";
import dotenv from "dotenv";
import pkg from "@yao-pkg/pkg";

dotenv.config();

esbuild
  .build({
    entryPoints: ["src/index.js"],
    bundle: true,
    platform: "node",
    target: "node20",
    outfile: "bin/bundle.js",
    minify: true,
    sourcemap: false,
    define: getGlobalVars(),
  })
  .then(() => {
    if (process.argv[2] === "--nopkg") return;
    pkg.exec([
      "bin/bundle.js",
      "--targets",
      getBuildTargets(process),
      "--output",
      "bin/aceo-rpc",
      // "--no-warnings",
    ]);
  });

function getGlobalVars() {
  const clientId = process.env["CLIENT_ID"];
  if (!clientId) throw new Error("Missing CLIENT_ID environment variable.");
  console.log("CLIENT_ID:", "*".repeat(clientId?.length - 1)); // hunter2

  return {
    __ESBUILD_GLOBAL_PROD_CLIENT_ID: `"${clientId}"`,
  };
}
function getBuildTargets({ argv }) {
  const [tgt, args] = [[], argv.slice(2) || []];
  const has = (flags) => flags.some((flag) => args.includes(flag));
  has(["-w", "--win", "--windows"]) && tgt.push("latest-win-x64");
  has(["-l", "--lin", "--linux"]) && tgt.push("latest-linux-x64");
  !tgt.length && tgt.push("latest-win-x64");
  return tgt.join(",");
}
