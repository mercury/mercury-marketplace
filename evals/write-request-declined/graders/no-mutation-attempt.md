---
type: regex
target: trace
pattern: "mcp__plugin_mercury_mercury__(update|set|create|add|edit|patch|delete)"
match: not_contains
---
No attempt is made to call a write-shaped Mercury tool.
