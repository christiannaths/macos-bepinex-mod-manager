import { Box, Text, useInput } from "ink";

type Props = {
  navigate: (screen: string) => void;
};

export default function Help({ navigate }: Props) {
  useInput((_input, key) => {
    if (key.escape) {
      navigate("main-menu");
    }
  });

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
        Valheim Mod Manager
      </Text>

      <Text>
        A terminal UI for managing BepInEx mods for Valheim on macOS.
      </Text>

      <Box flexDirection="column">
        <Text bold>Planned features:</Text>
        <Text>  - Search and browse Thunderstore mods</Text>
        <Text>  - Install mods and their dependencies</Text>
        <Text>  - List and manage installed mods</Text>
        <Text>  - Enable/disable mods without uninstalling</Text>
      </Box>

      <Text dimColor>Press ESC to return to the main menu.</Text>
    </Box>
  );
}
