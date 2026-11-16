#!/usr/bin/env node
import { register } from "tsx/esm/api";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

register();

const here = path.dirname(fileURLToPath(import.meta.url));
await import(pathToFileURL(path.join(here, "../src/main.ts")).href);
