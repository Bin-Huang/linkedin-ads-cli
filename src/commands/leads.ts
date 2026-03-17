import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerLeadCommands(program: Command): void {
  program
    .command("lead-gen-forms <account-id>")
    .description("List Lead Gen forms for an ad account")
    .option("--count <n>", "Number of results (default 100)", "100")
    .option("--start <n>", "Start index (default 0)", "0")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const account = accountId.startsWith("urn:") ? accountId : `urn:li:sponsoredAccount:${accountId}`;
        const params: Record<string, string> = {
          q: "owner",
          owner: account,
          count: opts.count,
          start: opts.start,
        };
        const data = await callApi({ creds, path: "leadForms", params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("lead-form-responses <account-id>")
    .description("List responses (submissions) for a Lead Gen form")
    .option("--count <n>", "Number of results (default 100)", "100")
    .option("--start <n>", "Start index (default 0)", "0")
    .option("--form <form-id>", "Filter by form ID")
    .option("--start-time <time>", "Filter responses after this time (epoch ms)")
    .option("--end-time <time>", "Filter responses before this time (epoch ms)")
    .action(async (accountId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const owner = accountId.startsWith("urn:") ? accountId : `urn:li:sponsoredAccount:${accountId}`;
        const params: Record<string, string> = {
          q: "owner",
          owner,
          count: opts.count,
          start: opts.start,
        };
        if (opts.form) {
          const form = opts.form.startsWith("urn:") ? opts.form : `urn:li:leadForm:${opts.form}`;
          params.form = form;
        }
        if (opts.startTime) params.submittedAtStart = opts.startTime;
        if (opts.endTime) params.submittedAtEnd = opts.endTime;
        const data = await callApi({ creds, path: "leadFormResponses", params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
