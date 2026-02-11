import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { execFile } from "child_process";
import { promisify } from "util";
import { PLUGINS_DIR } from "./mods.js";
import type { CachedPackage } from "./thunderstore.js";

const execFileAsync = promisify(execFile);

export async function installMod(pkg: CachedPackage): Promise<string[]> {
  const tmpZip = join(tmpdir(), `thunderstore-${pkg.fullName}-${Date.now()}.zip`);

  try {
    const response = await fetch(pkg.downloadUrl);
    if (!response.ok) {
      throw new Error(`Download failed: ${response.status} ${response.statusText}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    await writeFile(tmpZip, buffer);

    const { stdout: listOutput } = await execFileAsync("unzip", ["-l", tmpZip]);
    const dllEntries = listOutput
      .split("\n")
      .map((line) => line.trim().split(/\s+/).pop() ?? "")
      .filter((entry) => entry.toLowerCase().endsWith(".dll"));

    if (dllEntries.length === 0) {
      throw new Error("No .dll files found in package");
    }

    await execFileAsync("unzip", ["-j", "-o", tmpZip, ...dllEntries, "-d", PLUGINS_DIR]);

    return dllEntries.map((entry) => entry.split("/").pop() ?? entry);
  } finally {
    await unlink(tmpZip).catch(() => {});
  }
}
