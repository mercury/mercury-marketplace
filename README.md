# Mercury Marketplace

Claude Code plugins from [Mercury](https://mercury.com). Add the marketplace, then install a plugin:

```bash
claude plugin marketplace add MercuryTechnologies/mercury-marketplace
claude plugin install mercury@mercury-marketplace
```

## Plugins

| Plugin | What it does |
|--------|--------------|
| [`mercury`](plugins/mercury) | Connects the hosted Mercury MCP server (`https://mcp.mercury.com/mcp`, OAuth) and adds finance skills that run on it: spend analysis, anomaly detection, and cash reconciliation. |

## Related

- **[mercury-skills](https://github.com/MercuryTechnologies/mercury-skills)**: the same family of skills for agents that use the `mercury` CLI. That set covers operations the hosted MCP server does not expose today, such as receipt upload, statement PDF download, and transaction updates.
- **[mercury-mcp](https://github.com/MercuryTechnologies/mercury-mcp)**: the MCP server these plugins connect to.

## Development

```bash
git clone https://github.com/MercuryTechnologies/mercury-marketplace.git
cd mercury-marketplace
claude plugin validate .                    # marketplace manifest
claude plugin validate ./plugins/mercury    # plugin manifest
claude --plugin-dir ./plugins/mercury       # load the plugin for a session
```

Run `/reload-plugins` inside Claude Code after editing a skill.
