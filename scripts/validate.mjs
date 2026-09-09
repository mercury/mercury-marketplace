#!/usr/bin/env node
// Repo-level checks that `claude plugin validate` does not cover:
//  - every skills/<dir>/SKILL.md has name (== dir) and description frontmatter
//  - every skill listed in the Claude/Cursor manifests exists, and every skill dir is listed
//  - every MCP tool a skill declares in metadata.tools is one the production server exposes
//  - the plugins/mercury mirror resolves
import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();
const errors = [];
const err = (m) => errors.push(m);

// Tools exposed by the production Mercury MCP server (https://mcp.mercury.com/mcp).
// Read tools come from the public OpenAPI operationIds plus two custom tools; the
// server enables no write tools in production. Keep in sync with mercury-mcp.
const PRODUCTION_TOOLS = new Set([
  "getCurrentDate", "getCashflowSummary",
  "getAccounts", "getAccount", "getAccountCards", "getAccountStatements",
  "listTransactions", "getTransaction", "getTransactionById",
  "listCategories", "listCards", "getCard", "listMerchants",
  "getRecipients", "getRecipient", "listRecipientInvites", "getRecipientInvite", "listRecipientsAttachments",
  "getTreasury", "getTreasuryTransactions", "listCredit", "getInvest", "getInvestActivity",
  "getOrganization", "getUsers", "getUser",
  "listInvoices", "getInvoice", "listInvoiceAttachments", "getAttachment", "listCustomers", "getCustomer",
  "listBudgets", "getBudget", "getBudgetMembers", "getBudgetExpenditures",
  "listReceipts", "getReceipt", "listReimbursements", "getReimbursement",
  "getSafeRequests", "getSafeRequest", "getWebhooks", "getWebhook",
  "listSendMoneyApprovalRequests", "listTransferMoneyApprovalRequests", "getTransferMoneyApprovalRequest",
]);

const readJson = async (p) => JSON.parse(await fs.readFile(path.join(root, p), "utf8"));

function frontmatter(md) {
  const m = md.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return null;
  const fm = {};
  let inTools = false;
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(name|description):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].replace(/^"(.*)"$/, "$1");
    const tools = line.match(/^\s+tools:\s*\[(.*)\]\s*$/);
    if (tools) fm.tools = tools[1].split(",").map((t) => t.trim()).filter(Boolean);
  }
  return fm;
}

const skillDirs = (await fs.readdir(path.join(root, "skills"), { withFileTypes: true }))
  .filter((d) => d.isDirectory() && !d.name.startsWith("_") && !d.name.startsWith("."))
  .map((d) => d.name);

for (const dir of skillDirs) {
  const file = path.join(root, "skills", dir, "SKILL.md");
  let md;
  try { md = await fs.readFile(file, "utf8"); } catch { err(`skills/${dir} has no SKILL.md`); continue; }
  const fm = frontmatter(md);
  if (!fm) { err(`skills/${dir}/SKILL.md has no frontmatter`); continue; }
  if (fm.name !== dir) err(`skills/${dir}/SKILL.md name "${fm.name}" does not match directory`);
  if (!fm.description) err(`skills/${dir}/SKILL.md has no description`);
  for (const t of fm.tools ?? []) {
    if (!PRODUCTION_TOOLS.has(t)) err(`skills/${dir} depends on "${t}", which the production Mercury MCP server does not expose`);
  }
}

for (const manifest of [".claude-plugin/plugin.json", ".cursor-plugin/plugin.json"]) {
  const listed = (await readJson(manifest)).skills.map((s) => s.replace(/^\.\/skills\//, "").replace(/\/$/, ""));
  for (const s of listed) if (!skillDirs.includes(s)) err(`${manifest} lists ./skills/${s}/ which does not exist`);
  for (const d of skillDirs) if (!listed.includes(d)) err(`${manifest} does not list ./skills/${d}/`);
}

const mp = await readJson(".claude-plugin/marketplace.json");
for (const p of mp.plugins) {
  try { await fs.access(path.join(root, p.source, ".claude-plugin", "plugin.json")); }
  catch { err(`marketplace plugin "${p.name}" source ${p.source} has no .claude-plugin/plugin.json`); }
}

for (const link of ["plugins/mercury/skills", "plugins/mercury/.codex-plugin", "plugins/mercury/.mcp.json"]) {
  try { await fs.stat(path.join(root, link)); } catch { err(`${link} does not resolve`); }
}

const mcp = await readJson(".mcp.json");
if (mcp.mercpServers) err(".mcp.json: typo in mcpServers");
if (!mcp.mcpServers?.mercury?.url?.startsWith("https://mcp.mercury.com/")) err(".mcp.json does not point at https://mcp.mercury.com/");

if (errors.length) {
  console.error(`✖ ${errors.length} problem(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`✔ ${skillDirs.length} skills, manifests, mirror, and tool dependencies check out`);
