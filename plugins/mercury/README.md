# Mercury plugin for Claude Code

Connects Claude to your Mercury account through the hosted [Mercury MCP server](https://github.com/MercuryTechnologies/mercury-mcp) and adds finance skills that run on it.

## Install

```bash
claude plugin marketplace add MercuryTechnologies/mercury-marketplace
claude plugin install mercury@mercury-marketplace
```

The first time a Mercury tool is used, Claude Code opens Mercury's OAuth sign-in. No API keys are stored in the plugin.

## What you get

**Tools** from the Mercury MCP server: accounts, transactions, categories, cards, statements, recipients, treasury, credit, invoices, and a server-side monthly cashflow summary. The production server is read-only.

**Skills**, invoked as `/mercury:<skill>` or automatically when the request matches:

| Skill | What it does |
|-------|--------------|
| `mercury-analyze-spend` | Categorized spend breakdown with counterparty grouping and month-over-month comparison for an account set and date range |
| `mercury-detect-anomaly` | Builds 90-day per-counterparty and per-category baselines and flags pattern breaks in a recent window |
| `mercury-cash-reconciliation` | Produces the Mercury side of a cash General Ledger reconciliation workpaper for an account and period |
| `mercury-shared` | Rules the other skills follow: pagination, date anchoring, `postedStart`/`postedEnd`, debit sign, masking |

Each skill's frontmatter lists the MCP tools it depends on under `metadata.tools`.

## Examples

- "How did our software spend change last month?"
- "Anything unusual in the operating account this week?"
- "Prep the Mercury side of the April cash rec for the operating account."

## Skills that need more than the hosted server offers

Receipt matching, auto-categorization, journal-entry prep with note write-back, and onboarding need writes or file uploads that the production MCP server does not expose yet. They live in [mercury-skills](https://github.com/MercuryTechnologies/mercury-skills) for agents using the `mercury` CLI, and will move here as the server gains those tools.
