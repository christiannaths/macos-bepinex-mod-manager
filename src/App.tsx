import { useState } from "react";
import { Box, useStdout } from "ink";
import MainMenu from "./screens/MainMenu.js";
import Help from "./screens/Help.js";
import InstalledMods from "./screens/InstalledMods.js";
import SearchMods from "./screens/SearchMods.js";

type Screen = "main-menu" | "help" | "installed-mods" | "search-mods";

export default function App() {
  const [screen, setScreen] = useState<Screen>("main-menu");
  const { stdout } = useStdout();

  let content: React.ReactNode;
  switch (screen) {
    case "main-menu":
      content = <MainMenu navigate={(s) => setScreen(s as Screen)} />;
      break;
    case "help":
      content = <Help navigate={(s) => setScreen(s as Screen)} />;
      break;
    case "installed-mods":
      content = <InstalledMods navigate={(s) => setScreen(s as Screen)} />;
      break;
    case "search-mods":
      content = <SearchMods navigate={(s) => setScreen(s as Screen)} />;
      break;
  }

  return (
    <Box
      width="100%"
      height={stdout.rows}
      alignItems="center"
      justifyContent="center"
    >
      {content}
    </Box>
  );
}
