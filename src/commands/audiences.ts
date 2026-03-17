import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerAudienceCommands(program: Command): void {
  program
    .command("audiences <account-id>")
    .description("List matched audiences (DMP segments) for an ad account")
    .option("--count <n>", "Number of results (default 100)", "100")
    .option("--start <n>", "Start index (default 0)", "0")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const account = accountId.startsWith("urn:") ? accountId : `urn:li:sponsoredAccount:${accountId}`;
        const params: Record<string, string> = {
          q: "account",
          account,
          count: opts.count,
          start: opts.start,
        };
        const data = await callApi({ creds, path: "dmpSegments", params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("conversion-rules <account-id>")
    .description("List conversion rules for an ad account")
    .option("--count <n>", "Number of results (default 100)", "100")
    .option("--start <n>", "Start index (default 0)", "0")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const account = accountId.startsWith("urn:") ? accountId : `urn:li:sponsoredAccount:${accountId}`;
        const params: Record<string, string> = {
          q: "account",
          account,
          count: opts.count,
          start: opts.start,
        };
        const data = await callApi({ creds, path: "conversions", params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("insight-tags <account-id>")
    .description("List LinkedIn Insight Tags for an ad account")
    .option("--count <n>", "Number of results (default 100)", "100")
    .option("--start <n>", "Start index (default 0)", "0")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const account = accountId.startsWith("urn:") ? accountId : `urn:li:sponsoredAccount:${accountId}`;
        const params: Record<string, string> = {
          q: "account",
          account,
          count: opts.count,
          start: opts.start,
        };
        const data = await callApi({ creds, path: "insightTags", params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
