import { defaultExtensions } from "./editor-extensions";
import { slashCommand } from "./slash-command";

export const extensions = [...defaultExtensions, slashCommand];
