# linkedin-ads-cli

LinkedIn Ads CLI for AI agents (and humans). Pull campaign analytics with pivot breakdowns, forecast ad delivery and budgets, explore targeting facets, retrieve lead form responses, and more.

**Works with:** OpenClaw, Claude Code, Cursor, Codex, and any agent that can run shell commands.

## Installation

```bash
npm install -g linkedin-ads-cli
```

Or run directly with npx:

```bash
npx linkedin-ads-cli --help
```

## How it works

Built on the official [LinkedIn Marketing API](https://learn.microsoft.com/en-us/linkedin/marketing/), this CLI authenticates via an OAuth2 Bearer token (set as an environment variable, credentials file, or per-command flag) and provides read-only access to LinkedIn's advertising platform.

Core endpoints covered:

- **Organizations & accounts** -- authenticated user profile, organizations, ad accounts, and account users
- **Campaign groups & campaigns** -- browse the campaign hierarchy with status filtering
- **Creatives** -- list and inspect ad creatives with campaign filtering
- **Analytics & reporting** -- pull performance metrics with date ranges, granularity (daily/monthly), and pivot dimensions
- **Audiences & targeting** -- matched audiences, audience counts, and available targeting facets
- **Conversions & tracking** -- conversion rules and Insight Tags
- **Lead gen** -- lead gen forms and form responses with time-range filtering
- **Forecasting** -- budget recommendations and ad delivery forecasts

## Setup

### Option 1: Environment variable

```bash
export LINKEDIN_ADS_ACCESS_TOKEN="your_access_token"
```

### Option 2: Credentials file

Create `~/.config/linkedin-ads-cli/credentials.json`:

```json
{
  "access_token": "your_access_token"
}
```

### Option 3: Per-command credentials

```bash
linkedin-ads-cli accounts --credentials /path/to/creds.json
```

### Getting an access token

LinkedIn requires OAuth2 authentication. You need a [LinkedIn Developer Application](https://www.linkedin.com/developers/) with Marketing API access. Use the OAuth2 flow to get an access token with the required scopes:
- `r_ads` - Read ad accounts
- `r_ads_reporting` - Read ad analytics
- `r_organization_social` - Read organization data

## Entity hierarchy

LinkedIn Ads uses this hierarchy:

```
Organization (Company Page)
 └── Ad Account
      └── Campaign Group
           └── Campaign
                └── Creative
```

Most list commands require the parent entity ID. Start with `me` to get your profile, then `organization-acls` to find organizations you manage, then `accounts` to find ad accounts.

## Usage

All commands output pretty-printed JSON by default. Use `--format compact` for single-line JSON.

LinkedIn uses URN format for IDs (e.g., `urn:li:sponsoredAccount:123456`). This CLI accepts both full URNs and plain numeric IDs.

### me

Get the authenticated user profile.

```bash
linkedin-ads-cli me
```

### organization

Get an organization (company page) by ID.

```bash
linkedin-ads-cli organization 12345678
```

### organization-acls

List organizations the authenticated user administers.

```bash
linkedin-ads-cli organization-acls
linkedin-ads-cli organization-acls --role ADMINISTRATOR
```

Options:
- `--count <n>` -- results per page (default 100)
- `--start <n>` -- start index (default 0)
- `--role <role>` -- filter by role: ADMINISTRATOR, DIRECT_SPONSORED_CONTENT_POSTER, etc.

### accounts

List ad accounts the authenticated user has access to.

```bash
linkedin-ads-cli accounts
linkedin-ads-cli accounts --search "My Company"
```

Options:
- `--page-size <n>` -- results per page (default 100)
- `--page-token <token>` -- page token for pagination
- `--search <query>` -- search by account name or ID

### account

Get a specific ad account.

```bash
linkedin-ads-cli account 123456789
linkedin-ads-cli account urn:li:sponsoredAccount:123456789
```

### account-users

List users with access to an ad account.

```bash
linkedin-ads-cli account-users 123456789
```

Options:
- `--count <n>` -- results per page (default 100)
- `--start <n>` -- start index (default 0)

### campaign-groups

List campaign groups for an ad account.

```bash
linkedin-ads-cli campaign-groups 123456789
```

Options:
- `--page-size <n>` -- results per page (default 100)
- `--page-token <token>` -- page token for pagination

### campaign-group

Get a specific campaign group.

```bash
linkedin-ads-cli campaign-group 987654321
```

### campaigns

List campaigns for an ad account.

```bash
linkedin-ads-cli campaigns 123456789
linkedin-ads-cli campaigns 123456789 --status ACTIVE
```

Options:
- `--page-size <n>` -- results per page (default 100)
- `--page-token <token>` -- page token for pagination
- `--status <status>` -- filter by status: ACTIVE, PAUSED, ARCHIVED, COMPLETED, CANCELED, DRAFT
- `--campaign-group <id>` -- filter by campaign group ID

### campaign

Get a specific campaign.

```bash
linkedin-ads-cli campaign 111222333
```

### creatives

List creatives for an ad account.

```bash
linkedin-ads-cli creatives 111222333
```

Options:
- `--page-size <n>` -- results per page (default 100)
- `--page-token <token>` -- page token for pagination
- `--campaign <campaign-id>` -- filter by campaign ID

### creative

Get a specific creative.

```bash
linkedin-ads-cli creative 444555666
```

### audiences

List matched audiences (DMP segments) for an ad account.

```bash
linkedin-ads-cli audiences 123456789
```

Options:
- `--count <n>` -- results per page (default 100)
- `--start <n>` -- start index (default 0)

### conversion-rules

List conversion rules for an ad account.

```bash
linkedin-ads-cli conversion-rules 123456789
```

Options:
- `--count <n>` -- results per page (default 100)
- `--start <n>` -- start index (default 0)

### insight-tags

List LinkedIn Insight Tags for an ad account.

```bash
linkedin-ads-cli insight-tags 123456789
```

Options:
- `--count <n>` -- results per page (default 100)
- `--start <n>` -- start index (default 0)

### analytics

Get ad analytics for an account.

```bash
linkedin-ads-cli analytics 123456789 --start-date 2026-01-01 --end-date 2026-01-31
linkedin-ads-cli analytics 123456789 --start-date 2026-01-01 --end-date 2026-01-31 --granularity DAILY --pivot CAMPAIGN
```

Options:
- `--start-date <date>` -- start date (YYYY-MM-DD) **required**
- `--end-date <date>` -- end date (YYYY-MM-DD) **required**
- `--granularity <gran>` -- time granularity: DAILY, MONTHLY, ALL (default DAILY)
- `--pivot <pivot>` -- pivot dimension: CAMPAIGN, CAMPAIGN_GROUP, CREATIVE, ACCOUNT (default CAMPAIGN)
- `--campaign-ids <ids>` -- filter by campaign IDs (comma-separated)
- `--campaign-group-ids <ids>` -- filter by campaign group IDs (comma-separated)
- `--fields <fields>` -- metric fields (comma-separated)

Default metrics: impressions, clicks, costInLocalCurrency, costInUsd, externalWebsiteConversions, likes, comments, shares, follows, videoViews

### lead-gen-forms

List Lead Gen forms for an ad account.

```bash
linkedin-ads-cli lead-gen-forms 123456789
```

Options:
- `--count <n>` -- results per page (default 100)
- `--start <n>` -- start index (default 0)

### lead-form-responses

List responses (submissions) for a Lead Gen form.

```bash
linkedin-ads-cli lead-form-responses 777888999
linkedin-ads-cli lead-form-responses 777888999 --start-time 1709251200000 --end-time 1711929600000
```

Options:
- `--count <n>` -- results per page (default 100)
- `--start <n>` -- start index (default 0)
- `--form <form-id>` -- filter by form ID
- `--start-time <time>` -- filter responses after this time (epoch ms)
- `--end-time <time>` -- filter responses before this time (epoch ms)

### audience-counts

Get estimated audience size for targeting criteria.

```bash
linkedin-ads-cli audience-counts 123456789
```

### budget-recommendations

Get budget recommendations for a campaign.

```bash
linkedin-ads-cli budget-recommendations 111222333
```

### ad-forecasts

Get ad delivery forecasts for an account.

```bash
linkedin-ads-cli ad-forecasts 123456789
```

### targeting-facets

List available targeting facets (industries, job titles, locations, etc.).

```bash
linkedin-ads-cli targeting-facets
```

## Error output

All errors are JSON to stderr:

```json
{"error": "No credentials found. Set LINKEDIN_ADS_ACCESS_TOKEN env var..."}
```

## API Reference

- [LinkedIn Marketing API Overview](https://learn.microsoft.com/en-us/linkedin/marketing/)
- [Ad Accounts API](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/ads/account-structure/create-and-manage-accounts)
- [Analytics API](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/ads-reporting/ads-reporting)

## Related

- [tiktok-ads-cli](https://github.com/Bin-Huang/tiktok-ads-cli) -- TikTok Ads CLI
- [x-ads-cli](https://github.com/Bin-Huang/x-ads-cli) -- X (Twitter) Ads CLI
- [snapchat-ads-cli](https://github.com/Bin-Huang/snapchat-ads-cli) -- Snapchat Ads CLI
- [pinterest-ads-cli](https://github.com/Bin-Huang/pinterest-ads-cli) -- Pinterest Ads CLI
- [reddit-ads-cli](https://github.com/Bin-Huang/reddit-ads-cli) -- Reddit Ads CLI

## License

Apache-2.0
