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
          q: "account",
          account,
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
    .command("lead-form-responses <form-id>")
    .description("List responses (submissions) for a Lead Gen form")
    .option("--count <n>", "Number of results (default 100)", "100")
    .option("--start <n>", "Start index (default 0)", "0")
    .option("--start-time <time>", "Filter responses after this time (epoch ms)")
    .option("--end-time <time>", "Filter responses before this time (epoch ms)")
    .action(async (formId: string, opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const form = formId.startsWith("urn:") ? formId : `urn:li:leadForm:${formId}`;
        const params: Record<string, string> = {
          q: "form",
          form,
          count: opts.count,
          start: opts.start,
        };
        if (opts.startTime) params.submittedAtStart = opts.startTime;
        if (opts.endTime) params.submittedAtEnd = opts.endTime;
        const data = await callApi({ creds, path: "leadFormResponses", params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
