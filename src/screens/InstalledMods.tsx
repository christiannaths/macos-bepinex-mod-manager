import { useEffect, useState } from "react";
import { spawn } from "child_process";
import { Box, Text, useInput } from "ink";
import { getInstalledMods, toggleMod, PLUGINS_DIR, type InstalledMod } from "../lib/mods.js";

const VISIBLE_COUNT = 10;

type Props = {
  navigate: (screen: string) => void;
};

export default function InstalledMods({ navigate }: Props) {
  const [mods, setMods] = useState<InstalledMod[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [focusIndex, setFocusIndex] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [selectedMod, setSelectedMod] = useState<InstalledMod | null>(null);

  useEffect(() => {
    getInstalledMods().then(setMods).catch((err: Error) => setError(err.message));
  }, []);

  useInput((input, key) => {
    if (key.escape) {
      if (selectedMod) {
        setSelectedMod(null);
      } else {
        navigate("main-menu");
      }
      return;
    }

    if (selectedMod) {
      if (input === "y") {
        toggleMod(selectedMod).then(() =>
          getInstalledMods().then((updated) => {
            setMods(updated);
            setSelectedMod(null);
          }),
        );
      }
      return;
    }

    if (!mods || mods.length === 0) return;

    if (input === "o") {
      spawn("open", [PLUGINS_DIR], { detached: true, stdio: "ignore" });
      return;
    }

    if (key.return) {
      setSelectedMod(mods[focusIndex]!);
      return;
    }

    if (key.upArrow || input === "k") {
      setFocusIndex((i) => {
        const next = Math.max(0, i - 1);
        setScrollOffset((offset) => (next < offset ? next : offset));
        return next;
      });
    } else if (key.downArrow || input === "j") {
      setFocusIndex((i) => {
        const next = Math.min(mods.length - 1, i + 1);
        setScrollOffset((offset) =>
          next > offset + VISIBLE_COUNT - 1 ? next - VISIBLE_COUNT + 1 : offset,
        );
        return next;
      });
    }
  });

  const visibleMods = mods?.slice(scrollOffset, scrollOffset + VISIBLE_COUNT);
  const canScrollUp = scrollOffset > 0;
  const canScrollDown = mods ? scrollOffset + VISIBLE_COUNT < mods.length : false;

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
        Installed Mods
      </Text>

      {error ? (
        <Text color="red">Error: {error}</Text>
      ) : mods === null ? (
        <Text dimColor>Loading...</Text>
      ) : mods.length === 0 ? (
        <Text dimColor>No mods installed.</Text>
      ) : (
        <Box flexDirection="column">
          <Text dimColor>{canScrollUp ? "  ↑" : " "}</Text>
          {visibleMods!.map((mod, i) => {
            const isSelected = scrollOffset + i === focusIndex;
            return (
              <Box key={mod.fileName} gap={1}>
                <Text color="cyan">{isSelected ? ">" : " "}</Text>
                <Box width={10}>
                  <Text color={mod.enabled ? "green" : undefined} dimColor={!mod.enabled}>
                    ● {mod.enabled ? "ᴇɴᴀʙʟᴇᴅ" : "ᴅɪꜱᴀʙʟᴇᴅ"}
                  </Text>
                </Box>
                <Text dimColor={!mod.enabled} color={isSelected && mod.enabled ? "cyan" : undefined}>
                  {mod.name}
                </Text>
                {mod.version && (
                  <Text dimColor>v{mod.version}</Text>
                )}
              </Box>
            );
          })}
          <Text dimColor>{canScrollDown ? "  ↓" : " "}</Text>
        </Box>
      )}

      <Text dimColor>
        {selectedMod
          ? `${selectedMod.enabled ? "Disable" : "Enable"} "${selectedMod.name}"?  y: confirm  ESC: cancel`
          : `${mods ? `${mods.length} mod${mods.length === 1 ? "" : "s"} ` : ""}Enter: actions  o: open folder  ESC: return`}
      </Text>
    </Box>
  );
}
