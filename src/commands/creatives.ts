import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerCreativeCommands(program: Command): void {
  program
    .command("creatives <account-id>")
    .description("List creatives for an ad account")
    .option("--page-size <n>", "Page size (default 100)", "100")
    .option("--page-token <token>", "Page token for pagination")
    .option("--campaign <campaign-id>", "Filter by campaign ID")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const adAccountId = accountId.startsWith("urn:") ? accountId : `urn:li:sponsoredAccount:${accountId}`;
        const params: Record<string, string> = {
          q: "search",
          pageSize: opts.pageSize,
        };
        if (opts.pageToken) params.pageToken = opts.pageToken;
        if (opts.campaign) {
          const campaign = opts.campaign.startsWith("urn:") ? opts.campaign : `urn:li:sponsoredCampaign:${opts.campaign}`;
          params["search.campaigns.values[0]"] = campaign;
        }
        const data = await callApi({ creds, path: `adAccounts/${encodeURIComponent(adAccountId)}/creatives`, params });
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
        const data = await callApi({ creds, path: `creatives/${encodeURIComponent(urn)}` });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
