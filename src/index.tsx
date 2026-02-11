#!/usr/bin/env bun
import { render } from "ink";
import App from "./App.js";

// Enter alternate screen buffer for fullscreen TUI
process.stdout.write("\x1b[?1049h");
process.stdout.write("\x1b[H");

const instance = render(<App />);

instance.waitUntilExit().then(() => {
  // Restore original screen buffer on exit
  process.stdout.write("\x1b[?1049l");
});
