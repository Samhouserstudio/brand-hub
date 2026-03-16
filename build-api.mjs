import { build } from "esbuild";

// Bundle the API into a single .mjs file that Vercel can serve directly.
// Using ESM format avoids CJS interop issues with the export.
await build({
  entryPoints: ["api/_source.ts"],
  bundle: true,
  platform: "node",
  target: "node18",
  format: "esm",
  outfile: "api/index.mjs",
  banner: {
    // Create a require() function for CJS dependencies inside ESM
    js: 'import { createRequire } from "module"; const require = createRequire(import.meta.url);',
  },
  // Keep @anthropic-ai/sdk external — it's dynamically imported at runtime
  external: ["@anthropic-ai/sdk"],
});

console.log("API bundle built → api/index.mjs");
