import { readdir, readFile, rename } from "fs/promises";
import { join, basename } from "path";
import { homedir } from "os";

const VALHEIM_DIR = join(
  homedir(),
  "Library/Application Support/Steam/steamapps/common/Valheim",
);
export const PLUGINS_DIR = join(VALHEIM_DIR, "BepInEx/plugins");
const LOG_FILE = join(VALHEIM_DIR, "BepInEx/LogOutput.log");

export type InstalledMod = {
  fileName: string;
  name: string;
  version: string | null;
  enabled: boolean;
};

type LogEntry = { name: string; version: string };

const LOADING_RE = /\[Info\s+:\s+BepInEx\]\s+Loading\s+\[(.+?)\s+([\d.]+)\]/;

async function parseLogEntries(): Promise<LogEntry[]> {
  try {
    const log = await readFile(LOG_FILE, "utf-8");
    const entries: LogEntry[] = [];
    for (const line of log.split("\n")) {
      const match = LOADING_RE.exec(line);
      if (match) {
        entries.push({ name: match[1]!, version: match[2]! });
      }
    }
    return entries;
  } catch {
    return [];
  }
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function stripModExtension(fileName: string): string {
  return fileName.replace(/\.dll(\.disabled)?$/, "");
}

function matchLogEntry(
  fileName: string,
  logEntries: LogEntry[],
): LogEntry | undefined {
  const stem = normalize(stripModExtension(fileName));

  // Try exact normalized match first, then substring containment
  return (
    logEntries.find((e) => normalize(e.name) === stem) ??
    logEntries.find(
      (e) => stem.includes(normalize(e.name)) || normalize(e.name).includes(stem),
    )
  );
}

function displayNameFromFileName(fileName: string): string {
  return stripModExtension(fileName)
    .replace(/^Advize_/, "")
    .replace(/_/g, " ");
}

export async function getInstalledMods(): Promise<InstalledMod[]> {
  const files = await readdir(PLUGINS_DIR);
  const modFiles = files
    .filter((f) => f.endsWith(".dll") || f.endsWith(".dll.disabled"))
    .sort((a, b) => stripModExtension(a).localeCompare(stripModExtension(b)));
  const logEntries = await parseLogEntries();

  return modFiles.map((fileName) => {
    const enabled = !fileName.endsWith(".disabled");
    const entry = matchLogEntry(fileName, logEntries);
    return {
      fileName,
      name: entry?.name ?? displayNameFromFileName(fileName),
      version: entry?.version ?? null,
      enabled,
    };
  });
}

export async function toggleMod(mod: InstalledMod): Promise<InstalledMod> {
  const newFileName = mod.enabled
    ? `${mod.fileName}.disabled`
    : mod.fileName.replace(/\.disabled$/, "");

  await rename(join(PLUGINS_DIR, mod.fileName), join(PLUGINS_DIR, newFileName));

  return {
    ...mod,
    fileName: newFileName,
    enabled: !mod.enabled,
  };
}
