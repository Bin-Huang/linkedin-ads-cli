import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerCampaignCommands(program: Command): void {
  program
    .command("campaign-groups <account-id>")
    .description("List campaign groups for an ad account")
    .option("--page-size <n>", "Page size (default 100)", "100")
    .option("--page-token <token>", "Page token for pagination")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const account = accountId.startsWith("urn:") ? accountId : `urn:li:sponsoredAccount:${accountId}`;
        const params: Record<string, string> = {
          q: "search",
          "search.account.values[0]": account,
          pageSize: opts.pageSize,
        };
        if (opts.pageToken) params.pageToken = opts.pageToken;
        const data = await callApi({ creds, path: "adCampaignGroups", params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("campaign-group <campaign-group-id>")
    .description("Get a specific campaign group")
    .action(async (id: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const urn = id.startsWith("urn:") ? id : `urn:li:sponsoredCampaignGroup:${id}`;
        const data = await callApi({ creds, path: `adCampaignGroups/${encodeURIComponent(urn)}` });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("campaigns <account-id>")
    .description("List campaigns for an ad account")
    .option("--page-size <n>", "Page size (default 100)", "100")
    .option("--page-token <token>", "Page token for pagination")
    .option("--status <status>", "Filter by status: ACTIVE, PAUSED, ARCHIVED, COMPLETED, CANCELED, DRAFT")
    .option("--campaign-group <id>", "Filter by campaign group ID")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const account = accountId.startsWith("urn:") ? accountId : `urn:li:sponsoredAccount:${accountId}`;
        const params: Record<string, string> = {
          q: "search",
          "search.account.values[0]": account,
          pageSize: opts.pageSize,
        };
        if (opts.pageToken) params.pageToken = opts.pageToken;
        if (opts.status) params["search.status.values[0]"] = opts.status;
        if (opts.campaignGroup) {
          const cg = opts.campaignGroup.startsWith("urn:") ? opts.campaignGroup : `urn:li:sponsoredCampaignGroup:${opts.campaignGroup}`;
          params["search.campaignGroup.values[0]"] = cg;
        }
        const data = await callApi({ creds, path: "adCampaigns", params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("campaign <campaign-id>")
    .description("Get a specific campaign")
    .action(async (id: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const urn = id.startsWith("urn:") ? id : `urn:li:sponsoredCampaign:${id}`;
        const data = await callApi({ creds, path: `adCampaigns/${encodeURIComponent(urn)}` });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
