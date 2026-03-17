import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerCreativeCommands(program: Command): void {
  program
    .command("creatives <campaign-id>")
    .description("List creatives for a campaign")
    .option("--count <n>", "Number of results (default 100)", "100")
    .option("--start <n>", "Start index (default 0)", "0")
    .action(async (campaignId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const campaign = campaignId.startsWith("urn:") ? campaignId : `urn:li:sponsoredCampaign:${campaignId}`;
        const params: Record<string, string> = {
          q: "search",
          "search.campaign.values[0]": campaign,
          count: opts.count,
          start: opts.start,
        };
        const data = await callApi({ creds, path: "adCreatives", params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("creative <creative-id>")
    .description("Get a specific creative")
    .action(async (id: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const urn = id.startsWith("urn:") ? id : `urn:li:sponsoredCreative:${id}`;
        const data = await callApi({ creds, path: `adCreatives/${encodeURIComponent(urn)}` });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
