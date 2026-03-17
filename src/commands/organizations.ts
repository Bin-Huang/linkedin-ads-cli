import { Command } from "commander";
import { loadCredentials } from "../auth.js";
import { callApi } from "../api.js";
import { output, fatal } from "../utils.js";

export function registerOrganizationCommands(program: Command): void {
  program
    .command("me")
    .description("Get the authenticated user profile")
    .action(async () => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({ creds, path: "me" });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("organization <org-id>")
    .description("Get an organization (company page) by ID")
    .action(async (orgId: string) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const data = await callApi({ creds, path: `organizations/${orgId}` });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });

  program
    .command("organization-acls")
    .description("List organizations the authenticated user administers")
    .option("--count <n>", "Number of results (default 100)", "100")
    .option("--start <n>", "Start index (default 0)", "0")
    .option("--role <role>", "Filter by role: ADMINISTRATOR, DIRECT_SPONSORED_CONTENT_POSTER, etc.")
    .action(async (opts) => {
      try {
        const creds = loadCredentials(program.opts().credentials);
        const params: Record<string, string> = {
          q: "roleAssignee",
          count: opts.count,
          start: opts.start,
        };
        if (opts.role) params.role = opts.role;
        const data = await callApi({ creds, path: "organizationAcls", params });
        output(data, program.opts().format);
      } catch (err) {
        fatal((err as Error).message);
      }
    });
}
