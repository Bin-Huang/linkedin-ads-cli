#!/usr/bin/env node
import { Command } from "commander";
import { registerAccountCommands } from "./commands/accounts.js";
import { registerCampaignCommands } from "./commands/campaigns.js";
import { registerCreativeCommands } from "./commands/creatives.js";
import { registerAnalyticsCommands } from "./commands/analytics.js";
import { registerAudienceCommands } from "./commands/audiences.js";
import { registerOrganizationCommands } from "./commands/organizations.js";
import { registerLeadCommands } from "./commands/leads.js";
import { registerForecastCommands } from "./commands/forecasts.js";

const program = new Command();

program
  .name("linkedin-ads-cli")
  .description("LinkedIn Ads CLI for AI agents")
  .version("1.0.0")
  .option("--format <format>", "Output format", "json")
  .option("--credentials <path>", "Path to credentials JSON file")
  .addHelpText(
    "after",
    "\nDocs: https://github.com/Bin-Huang/linkedin-ads-cli"
  );

program.configureOutput({
  writeErr: (str: string) => {
    const msg = str.replace(/^error: /i, "").trim();
    if (msg) process.stderr.write(JSON.stringify({ error: msg }) + "\n");
  },
  writeOut: (str: string) => {
    process.stdout.write(str);
  },
});

program.showHelpAfterError(false);

program.hook("preAction", () => {
  const format = program.opts().format;
  if (format !== "json" && format !== "compact") {
    process.stderr.write(
      JSON.stringify({ error: "Format must be 'json' or 'compact'." }) + "\n"
    );
    process.exit(1);
  }
});

registerOrganizationCommands(program);
registerAccountCommands(program);
registerCampaignCommands(program);
registerCreativeCommands(program);
registerAudienceCommands(program);
registerAnalyticsCommands(program);
registerLeadCommands(program);
registerForecastCommands(program);

program.on("command:*", (operands) => {
  process.stderr.write(
    JSON.stringify({ error: `Unknown command: ${operands[0]}. Run --help for available commands.` }) + "\n"
  );
  process.exit(1);
});

if (process.argv.length <= 2) {
  program.outputHelp();
  process.exit(0);
}

program.parse();
