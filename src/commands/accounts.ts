import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerAccountCommands(program: Command): void {
  program
    .command("accounts")
    .description("List ad accounts the authenticated user has access to")
    .option("--count <n>", "Number of results (default 100)", "100")
    .option("--start <n>", "Start index for pagination (default 0)", "0")
    .option("--search <query>", "Search by account name or ID")
    .action(async (opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = {
          q: "search",
          count: opts.count,
          start: opts.start,
        };
        if (opts.search) params["search.name.values[0]"] = opts.search;
        const data = await callApi({ creds, path: "adAccounts", params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("account <account-id>")
    .description("Get a specific ad account (format: urn:li:sponsoredAccount:ID or just ID)")
    .action(async (accountId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const urn = accountId.startsWith("urn:") ? accountId : `urn:li:sponsoredAccount:${accountId}`;
        const encoded = encodeURIComponent(urn);
        const data = await callApi({ creds, path: `adAccounts/${encoded}` });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("account-users <account-id>")
    .description("List users with access to an ad account")
    .option("--count <n>", "Number of results (default 100)", "100")
    .option("--start <n>", "Start index (default 0)", "0")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = {
          q: "account",
          account: accountId.startsWith("urn:") ? accountId : `urn:li:sponsoredAccount:${accountId}`,
          count: opts.count,
          start: opts.start,
        };
        const data = await callApi({ creds, path: "adAccountUsers", params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
