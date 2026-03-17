import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerForecastCommands(program: Command): void {
  program
    .command("audience-counts <account-id>")
    .description("Get estimated audience size for targeting criteria")
    .action(async (accountId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const account = accountId.startsWith("urn:") ? accountId : `urn:li:sponsoredAccount:${accountId}`;
        const params: Record<string, string> = {
          q: "account",
          account,
        };
        const data = await callApi({ creds, path: "adTargetingFacets", params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("budget-recommendations <campaign-id>")
    .description("Get budget recommendations for a campaign")
    .action(async (campaignId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const campaign = campaignId.startsWith("urn:") ? campaignId : `urn:li:sponsoredCampaign:${campaignId}`;
        const params: Record<string, string> = {
          q: "criteriaV2",
          campaign,
        };
        const data = await callApi({ creds, path: "adBudgetPricing", params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("ad-forecasts <account-id>")
    .description("Get ad delivery forecasts for an account")
    .action(async (accountId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const account = accountId.startsWith("urn:") ? accountId : `urn:li:sponsoredAccount:${accountId}`;
        const params: Record<string, string> = {
          q: "criteriaV2",
          account,
        };
        const data = await callApi({ creds, path: "adSupplyForecasts", params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("targeting-facets")
    .description("List available targeting facets")
    .action(async () => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({ creds, path: "adTargetingFacets" });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
