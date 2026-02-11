import { useEffect, useState } from "react";
import { Box, Text, useInput } from "ink";
import TextInput from "ink-text-input";
import {
  fetchPackages,
  searchPackages,
  type CachedPackage,
} from "../lib/thunderstore.js";
import { installMod } from "../lib/install.js";

const VISIBLE_COUNT = 10;

type FocusMode = "input" | "results" | "detail";

type Props = {
  navigate: (screen: string) => void;
};

function formatDownloads(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max - 1) + "…";
}

export default function SearchMods({ navigate }: Props) {
  const [query, setQuery] = useState("");
  const [focusMode, setFocusMode] = useState<FocusMode>("input");
  const [results, setResults] = useState<CachedPackage[]>([]);
  const [focusIndex, setFocusIndex] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState<CachedPackage | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [dbReady, setDbReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [installStatus, setInstallStatus] = useState<
    "idle" | "installing" | "installed" | "error"
  >("idle");
  const [installMessage, setInstallMessage] = useState("");

  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetchPackages()
      .then(() => setDbReady(true))
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [retryCount]);

  function handleSubmit(value: string) {
    const trimmed = value.trim();
    if (!trimmed || !dbReady) return;

    setSubmittedQuery(trimmed);
    const found = searchPackages(trimmed);
    setResults(found);
    setFocusIndex(0);
    setScrollOffset(0);
    setSelectedPackage(null);

    if (found.length > 0) {
      setFocusMode("results");
    }
  }

  useInput((input, key) => {
    if (key.escape) {
      if (focusMode === "detail") {
        setSelectedPackage(null);
        setInstallStatus("idle");
        setInstallMessage("");
        setFocusMode("results");
      } else if (focusMode === "results") {
        setFocusMode("input");
      } else {
        navigate("main-menu");
      }
      return;
    }

    if (error && input === "r") {
      setRetryCount((c) => c + 1);
      return;
    }

    if (focusMode === "input") return;

    if (focusMode === "results") {
      if (results.length === 0) return;

      if (key.upArrow || input === "k") {
        setFocusIndex((i) => {
          const next = Math.max(0, i - 1);
          setScrollOffset((offset) => (next < offset ? next : offset));
          return next;
        });
      } else if (key.downArrow || input === "j") {
        setFocusIndex((i) => {
          const next = Math.min(results.length - 1, i + 1);
          setScrollOffset((offset) =>
            next > offset + VISIBLE_COUNT - 1
              ? next - VISIBLE_COUNT + 1
              : offset,
          );
          return next;
        });
      } else if (key.return) {
        setSelectedPackage(results[focusIndex]!);
        setInstallStatus("idle");
        setInstallMessage("");
        setFocusMode("detail");
      }
      return;
    }

    // focusMode === "detail"
    if (input === "i" && selectedPackage && installStatus !== "installing") {
      setInstallStatus("installing");
      setInstallMessage("");
      installMod(selectedPackage)
        .then((files) => {
          setInstallStatus("installed");
          setInstallMessage(files.join(", "));
        })
        .catch((err: Error) => {
          setInstallStatus("error");
          setInstallMessage(err.message);
        });
    }
  });

  const visibleResults = results.slice(
    scrollOffset,
    scrollOffset + VISIBLE_COUNT,
  );
  const canScrollUp = scrollOffset > 0;
  const canScrollDown = scrollOffset + VISIBLE_COUNT < results.length;

  return (
    <Box
      flexDirection="column"
      gap={1}
      borderStyle="round"
      borderColor="cyan"
      paddingX={3}
      paddingY={1}
    >
      <Text bold color="cyan">
        Search Thunderstore Mods
      </Text>

      <Box>
        <Text>Query: </Text>
        <TextInput
          value={query}
          onChange={setQuery}
          onSubmit={handleSubmit}
          focus={focusMode === "input"}
          placeholder="type keywords and press Enter"
        />
      </Box>

      {error ? (
        <Box flexDirection="column">
          <Text color="red">Error: {error}</Text>
          <Text dimColor>r: retry  ESC: back to menu</Text>
        </Box>
      ) : isLoading ? (
        <Text dimColor>Loading mod database…</Text>
      ) : focusMode === "detail" && selectedPackage ? (
        <Box flexDirection="column" gap={1}>
          <Box flexDirection="column">
            <Text bold color="cyan">
              {selectedPackage.name}
            </Text>
            <Text dimColor>
              by {selectedPackage.owner}
            </Text>
          </Box>
          <Box flexDirection="column">
            <Text>
              Version: {selectedPackage.latestVersion}
            </Text>
            <Text>
              Downloads: {formatDownloads(selectedPackage.downloadCount)}
            </Text>
          </Box>
          <Box flexDirection="column">
            <Text bold>Description</Text>
            <Text wrap="wrap">{selectedPackage.description || "No description provided."}</Text>
          </Box>
          {selectedPackage.dependencies.length > 0 && (
            <Box flexDirection="column">
              <Text bold>Dependencies</Text>
              {selectedPackage.dependencies.map((dep) => (
                <Text key={dep} dimColor>
                  • {dep}
                </Text>
              ))}
            </Box>
          )}
          {installStatus === "installing" && (
            <Text dimColor>Installing…</Text>
          )}
          {installStatus === "installed" && (
            <Text color="green">Installed! ({installMessage})</Text>
          )}
          {installStatus === "error" && (
            <Text color="red">Install failed: {installMessage}</Text>
          )}
        </Box>
      ) : results.length > 0 ? (
        <Box flexDirection="column">
          <Text dimColor>{canScrollUp ? "  ↑" : " "}</Text>
          {visibleResults.map((pkg, i) => {
            const isSelected = scrollOffset + i === focusIndex;
            return (
              <Box key={pkg.fullName} gap={1}>
                <Text color="cyan">{isSelected ? ">" : " "}</Text>
                <Text color={isSelected ? "cyan" : undefined}>
                  {truncate(pkg.name, 30)}
                </Text>
                <Text dimColor>
                  {pkg.owner}
                </Text>
                <Text dimColor>
                  ↓{formatDownloads(pkg.downloadCount)}
                </Text>
              </Box>
            );
          })}
          <Text dimColor>{canScrollDown ? "  ↓" : " "}</Text>
        </Box>
      ) : submittedQuery ? (
        <Text dimColor>No mods found for "{submittedQuery}"</Text>
      ) : dbReady ? (
        <Text dimColor>Enter a search query above</Text>
      ) : null}

      {!error && (
        <Text dimColor>
          {focusMode === "detail"
            ? "i: install  ESC: back to results"
            : focusMode === "results"
              ? `${results.length} result${results.length === 1 ? "" : "s"}  j/k: navigate  Enter: details  ESC: back to search`
              : dbReady
                ? "Enter: search  ESC: back to menu"
                : ""}
        </Text>
      )}

    </Box>
  );
}
