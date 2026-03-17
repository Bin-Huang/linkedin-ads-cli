import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerAnalyticsCommands(program: Command): void {
  program
    .command("analytics <account-id>")
    .description("Get ad analytics for an account")
    .requiredOption("--start-date <date>", "Start date (YYYY-MM-DD)")
    .requiredOption("--end-date <date>", "End date (YYYY-MM-DD)")
    .option("--granularity <gran>", "Time granularity: DAILY, MONTHLY, ALL (default DAILY)", "DAILY")
    .option("--pivot <pivot>", "Pivot dimension: CAMPAIGN, CAMPAIGN_GROUP, CREATIVE, ACCOUNT (default CAMPAIGN)", "CAMPAIGN")
    .option("--campaign-ids <ids>", "Filter by campaign IDs (comma-separated)")
    .option("--campaign-group-ids <ids>", "Filter by campaign group IDs (comma-separated)")
    .option("--fields <fields>", "Metric fields (comma-separated, default common set)")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const account = accountId.startsWith("urn:") ? accountId : `urn:li:sponsoredAccount:${accountId}`;
        const [sy, sm, sd] = opts.startDate.split("-").map(Number);
        const [ey, em, ed] = opts.endDate.split("-").map(Number);
        const params: Record<string, string> = {
          q: "analytics",
          pivot: `(value:${opts.pivot})`,
          dateRange: `(start:(year:${sy},month:${sm},day:${sd}),end:(year:${ey},month:${em},day:${ed}))`,
          timeGranularity: `(value:${opts.granularity})`,
          "accounts[0]": account,
        };
        if (opts.fields) {
          params.fields = opts.fields;
        } else {
          params.fields = "impressions,clicks,costInLocalCurrency,costInUsd,externalWebsiteConversions,likes,comments,shares,follows,videoViews";
        }
        if (opts.campaignIds) {
          opts.campaignIds.split(",").forEach((id: string, i: number) => {
            const urn = id.trim().startsWith("urn:") ? id.trim() : `urn:li:sponsoredCampaign:${id.trim()}`;
            params[`campaigns[${i}]`] = urn;
          });
        }
        if (opts.campaignGroupIds) {
          opts.campaignGroupIds.split(",").forEach((id: string, i: number) => {
            const urn = id.trim().startsWith("urn:") ? id.trim() : `urn:li:sponsoredCampaignGroup:${id.trim()}`;
            params[`campaignGroups[${i}]`] = urn;
          });
        }
        const data = await callApi({ creds, path: "adAnalytics", params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
