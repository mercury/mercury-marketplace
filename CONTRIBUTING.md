# Contributing

Thanks for helping improve Mercury's agent skills. This guide covers adding or changing a skill.

## Ground rules

- **Skills run on the hosted Mercury MCP server.** Write them against the MCP tool names (`listTransactions`, `getAccounts`, and so on), not the `mercury` CLI or raw API. Skills that need the CLI belong in [mercury-skills](https://github.com/MercuryTechnologies/mercury-skills).
- **Production is read-only.** Do not write skills that depend on write tools until the server exposes them in production. `scripts/validate.mjs` fails if a skill declares a tool the server does not expose.
- **Follow `mercury-mcp`.** Every skill inherits its rules: call `getCurrentDate` first, paginate `listTransactions` to completion, filter with `postedStart`/`postedEnd`, treat debits as negative, compute totals programmatically, mask account numbers.
- **Never fabricate financial data.** If a fetch is incomplete, the skill must say so rather than estimate.

## Adding a skill

1. Create `skills/<name>/SKILL.md`. The directory name must equal the `name` in frontmatter and start with `mercury-`.
2. Frontmatter, following the [Agent Skills specification](https://agentskills.io/specification):

   ```yaml
   ---
   name: mercury-example
   description: "What it does and when to use it, with the phrases a user would say."
   metadata:
     version: "1.0.0"
     category: agentic
     tools: [getCurrentDate, getAccounts, listTransactions]
     requires: [mercury-mcp]
   ---
   ```

   `metadata.tools` lists every MCP tool the skill calls. The validator checks it against the production tool list.
3. Structure the body as: overview, parameters table, execution strategy in numbered steps with the exact tool calls, presentation format, example output, tips. Keep the analysis logic in pseudocode the agent can turn into a script.
4. Add the skill path to the `skills` arrays in `.claude-plugin/plugin.json` and `.cursor-plugin/plugin.json`, and a row to the README table. The root `plugin.json` (Agent Plugins format) discovers `skills/` on its own.
5. Run the checks:

   ```bash
   node scripts/validate.mjs
   claude plugin validate --strict .
   claude plugin validate --strict ./skills
   ```

6. Try it: `claude --plugin-dir .` then ask a question the skill should trigger on. Run `/reload-plugins` after edits.

## Releasing

Bump `version` in `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `.codex-plugin/plugin.json`, `.cursor-plugin/plugin.json`, and the root `plugin.json` together; `scripts/validate.mjs` fails if they drift. Claude Code only offers users an update when the plugin version changes.
