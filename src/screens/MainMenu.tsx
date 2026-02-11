import { Box, Text, useApp } from "ink";
import SelectInput, { type Item } from "../components/SelectInput.js";

type Props = {
  navigate: (screen: string) => void;
};

type MenuAction = "search" | "list" | "help" | "exit";

const menuItems: Item<MenuAction>[] = [
  { label: "Search mods", value: "search" },
  { label: "List installed mods", value: "list" },
  { label: "Help", value: "help" },
  { label: "Exit", value: "exit" },
];

export default function MainMenu({ navigate }: Props) {
  const { exit } = useApp();

  function handleSelect(item: Item<MenuAction>) {
    switch (item.value) {
      case "search":
        navigate("search-mods");
        break;
      case "list":
        navigate("installed-mods");
        break;
      case "help":
        navigate("help");
        break;
      case "exit":
        exit();
        break;
    }
  }

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
      <SelectInput items={menuItems} onSelect={handleSelect} />
    </Box>
  );
}
