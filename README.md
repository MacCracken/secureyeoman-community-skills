# SecureYeoman Community Skills

A community-maintained registry of skills for the [SecureYeoman](https://github.com/MacCracken/secureyeoman) agent platform.

---

## What is a Skill?

A **skill** is a portable JSON file that defines a specialized agent capability — its name, description, instructions, category, and optional tools. Skills are loaded into SecureYeoman's Brain and become available to any personality that installs them.

---

## Skill Format

Each skill is a JSON file conforming to the following structure:

```json
{
  "name": "My Skill",
  "description": "What this skill does (max 2000 chars)",
  "version": "1.0.0",
  "author": { "name": "Your Name", "github": "your-github-username", "website": "https://example.com" },
  "category": "development",
  "tags": ["tag1", "tag2"],
  "instructions": "Detailed instructions for the agent..."
}
```

The `author` field accepts either a structured object (recommended) or a plain string for backward compatibility:

```json
"author": { "name": "Your Name", "github": "your-username", "website": "https://example.com" }
```

```json
"author": "your-github-username"
```

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Unique, human-readable skill name (max 200 chars) |
| `instructions` | string | Full agent instructions (max 8000 chars) |

### Optional Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `description` | string | `""` | Short description shown in the marketplace (max 2000 chars) |
| `version` | string | `"1.0.0"` | Semantic version |
| `author` | string \| object | `""` | Your name/username (string) or structured object with `name`, `github`, `website`, `license` |
| `category` | string | `"general"` | See categories below |
| `tags` | string[] | `[]` | Searchable tags (max 50 chars each) |
| `tools` | Tool[] | `[]` | MCP tool definitions (advanced) |
| `triggerPatterns` | string[] | `[]` | Regex patterns (case-insensitive) that gate instruction injection — see below |
| `useWhen` | string | `""` | Plain-language activation conditions — injected into the skill catalog in system prompts |
| `doNotUseWhen` | string | `""` | Plain-language anti-conditions — prevents false positive activations |
| `successCriteria` | string | `""` | How the model knows the skill is complete — appended after skill instructions |
| `mcpToolsAllowed` | string[] | `[]` | When non-empty, only these MCP tool names are available while this skill is active |
| `routing` | `"fuzzy"` \| `"explicit"` | `"fuzzy"` | `"explicit"` appends deterministic routing text for SOPs and compliance workflows |

---

## Workflows

A **workflow** is a directed JSON graph of steps (agent calls, transforms, conditions, webhooks, resource actions) that can be triggered manually or on a schedule. Community workflows are imported into SecureYeoman's workflow engine and can be customised after installation.

### Workflow Format

```json
{
  "$schema": "../schema/workflow.schema.json",
  "name": "My Workflow",
  "description": "What this workflow does.",
  "version": "1.0.0",
  "author": "your-github-username",
  "category": "automation",
  "tags": ["tag1"],
  "autonomyLevel": "L2",
  "steps": [
    { "id": "step-1", "type": "agent", "label": "Do Something", "config": { "prompt": "..." } }
  ],
  "edges": [{ "from": "step-1", "to": "step-2" }],
  "triggers": [{ "type": "manual", "config": {} }],
  "requires": { "integrations": ["gmail"], "tools": [] }
}
```

### `requires` — Compatibility Manifest

The `requires` field lists the external dependencies a workflow needs:

| Field | Description |
|-------|-------------|
| `integrations` | Integration names (e.g. `gmail`, `github`, `slack`) |
| `tools` | MCP tool names (e.g. `github_list_issues`) |

When a user imports a workflow, SecureYeoman checks their connected integrations and installed tools against `requires` and shows a compatibility warning if any are missing.

### Workflow Categories

`automation`, `research`, `security`, `development`, `productivity`, `general`

### Workflow Step Types

| Type | Description |
|------|-------------|
| `agent` | Runs an LLM agent call |
| `transform` | Applies a JS expression to reshape data |
| `condition` | Branches the graph based on a boolean expression |
| `webhook` | Sends an HTTP request to an external URL |
| `resource` | Reads or writes a platform resource (knowledge base, memory, etc.) |

---

## Swarm Templates

A **swarm template** defines a multi-agent team that tackles a task cooperatively. Community templates describe the roles and execution strategy — users map roles to their existing agent profiles when importing.

### Swarm Template Format

```json
{
  "$schema": "../schema/swarm-template.schema.json",
  "name": "My Swarm",
  "description": "What this swarm does.",
  "version": "1.0.0",
  "author": "your-github-username",
  "strategy": "sequential",
  "roles": [
    { "role": "analyst",  "profileName": "analyst",  "description": "Analyses requirements" },
    { "role": "coder",    "profileName": "coder",    "description": "Implements the solution" }
  ],
  "requires": { "profileRoles": ["analyst", "coder"] }
}
```

### Strategies

| Strategy | Description |
|----------|-------------|
| `sequential` | Roles run in order; each receives the previous role's output |
| `parallel` | Roles run concurrently; a coordinator synthesises results |
| `dynamic` | A coordinator agent decides which roles to invoke and in what order |

---

## Routing Quality Fields (Phase 44)

These fields improve skill routing accuracy from ~73% to ~85% by giving the agent explicit activation boundaries and success signals.

### `useWhen` and `doNotUseWhen`

Plain-language descriptions of when the skill should and shouldn't activate. Injected into the skill catalog so the model can self-select correctly.

```json
"useWhen": "user asks to review a PR, diff, file, or function",
"doNotUseWhen": "writing new code from scratch, debugging a runtime error"
```

**Best practices:**
- Be specific about the *trigger object* (a PR, a diff, a file — not just "code")
- Mirror `doNotUseWhen` to the most common false-positive scenarios
- Both fields max 500 chars

### `successCriteria`

How the model knows the skill is complete. Appended after the skill's full instructions block.

```json
"successCriteria": "Review complete with: summary, critical issues, suggestions, and at least one positive observation."
```

Use concrete, checkable outputs. Max 300 chars.

### `routing`

```json
"routing": "explicit"
```

When `"explicit"`, appends to the catalog: *"To perform [Skill Name] tasks, use the [Skill Name] skill."* Use for SOPs and compliance workflows where the model must not deviate to judgment. Default is `"fuzzy"`.

### `mcpToolsAllowed`

```json
"mcpToolsAllowed": ["read_file", "list_directory"]
```

When non-empty, only these MCP tool names are available while the skill is active. Note: community skills are already sandboxed to read-only tools — this field provides additional per-skill scoping.

---

## `triggerPatterns` — Instruction-Injection Gate

`triggerPatterns` is an array of up to 20 case-insensitive JavaScript regex strings. When a user message matches **any** pattern, SecureYeoman's `isSkillInContext()` injects the skill's instructions into the system prompt for that turn. When the array is empty, the engine falls back to a loose substring match on the skill name — functional but coarser.

```json
"triggerPatterns": [
  "review.*code|code.*review",
  "\\bpr\\b|pull.?request",
  "\\bdiff\\b",
  "audit.*code|code.*audit",
  "check.*code|look.*code"
]
```

**Writing good patterns:**

- **Prefer `word.*word` over bare keywords** — `review.*code` matches "review my code" and "code review" in one pattern.
- **Anchor noisy words with `\b`** — `\bpr\b` matches "the PR" but not "sprint" or "improve".
- **5 patterns per skill is the sweet spot** — enough to cover common phrasings, few enough to avoid false positives.
- **No leading/trailing `^`/`$`** — patterns match anywhere in the message.
- **Escape backslashes in JSON** — `\b` becomes `\\b` in the JSON string.

All skills in this repository ship with 5 trigger patterns. New contributions must include 5 patterns (validated by the schema `maxItems: 5` guideline).

---

## Categories

| Category | Description |
|----------|-------------|
| `development` | Code review, debugging, architecture, documentation |
| `productivity` | Meeting summaries, task management, writing assistance |
| `security` | Security research, vulnerability analysis, threat modeling |
| `utilities` | Data formatting, conversion, general-purpose helpers |
| `design` | UI/UX review, design critique, accessibility checks |
| `finance` | Financial analysis, budgeting, investment research |
| `science` | Research assistance, data analysis, literature review |
| `general` | Skills that don't fit neatly into another category |

---

## Directory Structure

```
skills/
  development/
    code-reviewer.json
    sql-expert.json
  productivity/
    meeting-summarizer.json
  security/
    security-researcher.json
  utilities/
    data-formatter.json
workflows/
  daily-morning-brief.json
  content-review-gate.json
  research-report-pipeline.json
swarms/
  security-audit-team.json
  full-stack-dev-crew.json
```

Skills **must** live under `skills/<category>/<skill-name>.json`. The category in the path and the `category` field in the JSON should match.

Workflows live under `workflows/<name>.json` and swarm templates under `swarms/<name>.json`.

---

## JSON Schemas

Formal JSON Schemas for validation live in the `schema/` directory:

| File | Validates |
|------|-----------|
| [`schema/skill.schema.json`](schema/skill.schema.json) | Skills |
| [`schema/workflow.schema.json`](schema/workflow.schema.json) | Workflows |
| [`schema/swarm-template.schema.json`](schema/swarm-template.schema.json) | Swarm templates |

Reference a schema in your editor for inline validation:

```json
{
  "$schema": "../schema/skill.schema.json"
}
```

---

## Installation

### Option 1: Git URL fetch (recommended)

Enable the policy toggle once, then sync directly — no manual clone needed:

```bash
# Enable git fetch (one-time setup)
secureyeoman policy set allowCommunityGitFetch true

# Sync from the official community repo
POST /api/v1/marketplace/community/sync

# Or sync from a custom URL
POST /api/v1/marketplace/community/sync
{ "repoUrl": "https://github.com/MacCracken/secureyeoman-community-skills" }
```

Only `https://` and `file://` URLs are accepted. The policy is **off by default** for security.

### Option 2: Clone locally and sync

```bash
# Clone alongside your secureyeoman install
git clone https://github.com/MacCracken/secureyeoman-community-skills.git ../secureyeoman-community-skills

# Sync skills into SecureYeoman
POST /api/v1/marketplace/community/sync
```

### Option 3: Point to any local path

SecureYeoman's community sync accepts **any local directory** that follows the `skills/<category>/<name>.json` structure — not just this repo. Fork it, maintain your own collection, or mix both.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full contribution guide.

The short version:
1. Fork this repo
2. Add your skill under `skills/<category>/<name>.json`
3. Validate against `schema/skill.schema.json`
4. Open a pull request

---

## Security — Skill Trust Tiers

Community skills (`source: 'community'`) operate in a **read-only tool sandbox**. When a community skill is active, SecureYeoman automatically removes any write, shell, or HTTP tools from the tool list passed to the model — regardless of what the skill's `tools` array declares.

**Permitted tool name prefixes (read-only tier):**

`get_`, `list_`, `read_`, `search_`, `query_`, `fetch_`, `retrieve_`, `find_`, `lookup_`, `check_`, `inspect_`, `describe_`, `show_`, `view_`, `summarise_`, `summarize_`, `analyze_`, `analyse_`, `extract_`, `count_`, `stat_`, `stats_`, `info_`, `status_`, `ping_`, `health_`

**Not permitted for community skills:** `write_`, `delete_`, `execute_`, `create_`, `update_`, `send_`, `run_`, `insert_`, `patch_`, `remove_`, or any tool name not beginning with an allow-listed prefix.

Skill *instructions* (the `instructions` field) are injected into the system prompt normally — the restriction only applies to the tool list. A community skill may still describe tasks in plain language; it simply cannot directly invoke privileged tools.

This is enforced at the SecureYeoman server level (`applySkillTrustFilter` in `soul/skill-trust.ts`) and cannot be overridden from within a skill JSON file.

---

## Disclaimer

Community skills are contributed by independent authors and are **not reviewed, endorsed, or warranted** by the SecureYeoman project or its maintainers.

**Liability rests entirely with the user.** By installing and using community skills you accept full responsibility for:
- The actions the agent takes while operating under a skill's instructions
- Any security, legal, or operational consequences of using the skill
- Verifying that skill instructions are appropriate for your environment before deploying them in production

Security-oriented skills (e.g., `security-researcher`) are intended for **authorized defensive use only**. Using them against systems you do not own or have explicit written permission to test may violate local laws. The SecureYeoman project and skill authors bear no liability for unauthorized or illegal use.

**Always review skill instructions before installing them.**

---

## Revisiting the Marketplace Approach

The sync model supports both direct git URL fetch (policy-gated, off by default) and local-path sync. The community's real-world usage will guide what comes next — see the [SecureYeoman roadmap](https://github.com/MacCracken/secureyeoman/blob/main/docs/development/roadmap.md) for planned evolutions (hosted discovery, cryptographic signing, etc.).
