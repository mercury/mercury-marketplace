---
type: tool_used
tool: mcp__plugin_mercury_mercury__listTransactions
input_match: '"postedStart"\s*:\s*"2026-08-01[^"]*"[\s\S]*"postedEnd"\s*:\s*"2026-08-31[^"]*"|"postedEnd"\s*:\s*"2026-08-31[^"]*"[\s\S]*"postedStart"\s*:\s*"2026-08-01[^"]*"'
min: 1
---
listTransactions is filtered with postedStart/postedEnd covering August 2026, not start/end.
