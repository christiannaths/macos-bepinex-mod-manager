import { useState } from "react";
import { Box, Text, useInput } from "ink";

export type Item<V> = {
  label: string;
  value: V;
  disabled?: boolean;
};

type Props<V> = {
  items: Item<V>[];
  onSelect: (item: Item<V>) => void;
  indicatorComponent?: React.FC<{ isSelected: boolean }>;
  itemComponent?: React.FC<{ isSelected: boolean; label: string; disabled?: boolean }>;
};

function findNextEnabledIndex(items: Item<unknown>[], current: number, direction: 1 | -1): number {
  const len = items.length;
  let next = (current + direction + len) % len;
  const start = next;
  while (items[next]!.disabled) {
    next = (next + direction + len) % len;
    if (next === start) return current; // all disabled, stay put
  }
  return next;
}

function findFirstEnabledIndex(items: Item<unknown>[]): number {
  const idx = items.findIndex((item) => !item.disabled);
  return idx === -1 ? 0 : idx;
}

function DefaultIndicator({ isSelected }: { isSelected: boolean }) {
  return <Text color="cyan">{isSelected ? "> " : "  "}</Text>;
}

function DefaultItem({ isSelected, label, disabled }: { isSelected: boolean; label: string; disabled?: boolean }) {
  return (
    <Text dimColor={disabled} color={isSelected && !disabled ? "cyan" : undefined}>
      {label}
    </Text>
  );
}

export default function SelectInput<V>({
  items,
  onSelect,
  indicatorComponent: Indicator = DefaultIndicator,
  itemComponent: ItemComponent = DefaultItem,
}: Props<V>) {
  const [focusIndex, setFocusIndex] = useState(() => findFirstEnabledIndex(items));

  useInput((input, key) => {
    if (key.upArrow || input === "k") {
      setFocusIndex((i) => findNextEnabledIndex(items, i, -1));
    } else if (key.downArrow || input === "j") {
      setFocusIndex((i) => findNextEnabledIndex(items, i, 1));
    } else if (key.return) {
      const item = items[focusIndex];
      if (item && !item.disabled) {
        onSelect(item);
      }
    }
  });

  return (
    <Box flexDirection="column">
      {items.map((item, index) => {
        const isSelected = index === focusIndex;
        return (
          <Box key={`${index}-${String(item.value)}`}>
            {item.disabled ? (
              <Text>  </Text>
            ) : (
              <Indicator isSelected={isSelected} />
            )}
            <ItemComponent isSelected={isSelected} label={item.label} disabled={item.disabled} />
          </Box>
        );
      })}
    </Box>
  );
}
