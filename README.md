# Mercury Plugins and Skills

Agent skills and plugins for [Mercury](https://mercury.com) business banking. Install them so your coding agent can answer questions about your accounts, analyze spend, flag unusual activity, and prepare reconciliation workpapers, all through the hosted Mercury MCP server with OAuth sign-in.

Supports Claude Code, Codex CLI, Cursor, and any agent that reads [Agent Skills](https://agentskills.io/specification).

## Installation

### Claude Code (plugin marketplace)

Add the marketplace and install:

```
/plugin marketplace add MercuryTechnologies/mercury-marketplace
/plugin install mercury@mercury-marketplace
```

Or from a terminal:

```bash
claude plugin marketplace add MercuryTechnologies/mercury-marketplace
claude plugin install mercury@mercury-marketplace
```

The first time a Mercury tool runs, Claude Code opens Mercury's OAuth sign-in. No API keys are stored in the plugin. Skills are available as `/mercury:<skill>` and also trigger automatically when a request matches.

### Codex CLI

```bash
codex plugin marketplace add MercuryTechnologies/mercury-marketplace
```

Then run `/plugins` in Codex, select **Mercury**, and choose **Install Plugin**.

### Cursor

Add this repository as a plugin from Cursor's plugin settings. The manifest is `.cursor-plugin/plugin.json` and the MCP server is declared in `mcp.json`.

### Other agents (skills CLI)

```bash
npx skills add MercuryTechnologies/mercury-marketplace
```

Your agent will also need the Mercury MCP server connected: `https://mcp.mercury.com/mcp` (Streamable HTTP, OAuth).

## What's included

- **MCP server**: the hosted [Mercury MCP server](https://github.com/MercuryTechnologies/mercury-mcp). Accounts, transactions, categories, cards, statements, recipients, treasury, credit, invoices, and a server-side monthly cashflow summary. Read-only in production.
- **Skills**: finance workflows written against those tools.
- **Agent** (Claude Code): `mercury-analyst`, a read-only subagent for questions that need many pages of transactions, so the pagination stays out of your main context.

## Available skills

| Skill | Description |
|-------|-------------|
| [`mercury-mcp`](skills/mercury-mcp/SKILL.md) | Answer questions about Mercury accounts, balances, and transactions using the MCP tools correctly: pagination, date anchoring, `postedStart`/`postedEnd`, debit sign, masking. The other skills build on it. |
| [`mercury-analyze-spend`](skills/mercury-analyze-spend/SKILL.md) | Categorized spend breakdown with counterparty grouping and month-over-month comparison for a set of accounts and a date range. |
| [`mercury-detect-anomaly`](skills/mercury-detect-anomaly/SKILL.md) | Builds 90-day per-counterparty and per-category baselines and flags pattern breaks in a recent window. |
| [`mercury-cash-reconciliation`](skills/mercury-cash-reconciliation/SKILL.md) | Produces the Mercury side of a cash General Ledger reconciliation workpaper for an account and period. |

Every skill declares the MCP tools it depends on under `metadata.tools`; `scripts/validate.mjs` checks those against what the production server exposes.

## Examples

- "How did our software spend change last month?"
- "Anything unusual in the operating account this week?"
- "Prep the Mercury side of the April cash rec for the operating account."
- "What came in from customers this quarter, by month?"

## Skills that need more than the hosted server offers

Receipt matching and upload, auto-categorization, journal-entry prep with note write-back, and onboarding need writes or file uploads that the production MCP server does not expose yet. Those live in [mercury-skills](https://github.com/MercuryTechnologies/mercury-skills) for agents using the `mercury` CLI, and will move here as the server gains those tools.

## Repository layout

```
.claude-plugin/    marketplace.json (Claude Code marketplace) and plugin.json (the mercury plugin; repo root is the plugin)
.codex-plugin/     Codex plugin manifest
.cursor-plugin/    Cursor plugin manifest
.agents/plugins/   Codex marketplace manifest (repo root is the plugin)
.mcp.json          Hosted Mercury MCP server (Claude Code, Codex)
mcp.json           Same server, Cursor format
skills/            Canonical skill sources
agents/            Claude Code subagents
evals/             `claude plugin eval` cases with canned Mercury MCP mocks
scripts/           Repo validation
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
