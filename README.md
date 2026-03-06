# SecureYeoman Community Repository

A community-maintained registry of skills, workflows, swarm templates, council templates, security templates, personalities, and themes for the [SecureYeoman](https://github.com/MacCracken/secureyeoman) agent platform.

## Repository Stats

| Type | Count | Location |
|------|------:|----------|
| **Skills** | 87 | `skills/` (13 categories) |
| **Workflows** | 7 | `workflows/` |
| **Swarm Templates** | 2 | `swarms/` |
| **Council Templates** | 2 | `councils/` |
| **Security Templates** | 7 | `security-templates/` |
| **Personalities** | 21 | `personalities/` (6 categories) |
| **Themes** | 3 | `themes/` |
| **JSON Schemas** | 7 | `schema/` |
| **Validation Tests** | 1,310 | `skills/skills.test.ts` |
| **Total items** | **129** | |

### Skills by Category

| Category | Count | Examples |
|----------|------:|---------|
| Trading | 19 | Elliott Wave Analyst, Crypto Analyst, Options Strategist |
| Finance | 10 | Financial Planner, Bookkeeping Specialist, Tax Advisor |
| Productivity | 10 | Executive Assistant, Calendar Intelligence, Email Composer |
| Design | 7 | Brand Designer, Accessibility Specialist, Diagram Architect |
| Development | 7 | Code Reviewer, API Architect, DevOps Engineer |
| General | 7 | Data Scientist, Emoji Mood Detector, Bookmark Curator |
| Security | 7 | Cloud Security Architect, Ethical Whitehat Hacker, Compliance Analyst |
| Utilities | 7 | Data Formatter, Code Converter, Base64 Encoder |
| Science | 3 | Research assistance, data analysis, literature review |
| Legal | 3 | Contract Reviewer, legal analysis |
| Marketing | 3 | Content Strategist, brand marketing |
| Education | 2 | Curriculum Designer, career counseling |
| Healthcare | 2 | Clinical Documentation Specialist |

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

## Council Templates

A **council template** defines a multi-round group deliberation where multiple AI agents discuss and debate to reach consensus on a topic. A facilitator agent guides the discussion through rounds.

---

## Security Templates

A **security template** is a directory-based prompt template for security assessments and analysis tasks. Unlike JSON skills, security templates use markdown files for rich, structured prompt content with user-fillable placeholders.

### Directory Structure

Each template lives in its own directory under `security-templates/`:

```
security-templates/
  incident-response-playbook/
    system.md          # System prompt — defines the AI persona and methodology
    user.md            # Input template with {{placeholders}} for user context
    metadata.json      # Schema-validated metadata (name, tags, version, etc.)
  cloud-security-posture/
    system.md
    user.md
    metadata.json
  ...
```

### File Format

| File | Required | Description |
|------|----------|-------------|
| `metadata.json` | Yes | Template metadata conforming to [`schema/security-template.schema.json`](schema/security-template.schema.json). |
| System prompt (default: `system.md`) | Yes | The system prompt that defines what the AI becomes. Contains the expert persona, assessment methodology, output format, and response guidelines. |
| User template (default: `user.md`) | No | Input template with `{{placeholder}}` syntax for structured user input. Sections guide the user to provide the right context. |

Filenames are configurable via the `files` field in `metadata.json`:

```json
{
  "name": "My Template",
  "files": {
    "system": "prompt.md",
    "user": "input-template.md"
  }
}
```

When `files` is omitted, sync looks for `system.md` and `user.md` by default.

### How Templates Differ from Skills

| Aspect | Skills (JSON) | Security Templates (directory) |
|--------|--------------|-------------------------------|
| Format | Single `.json` file | Directory with `.md` + `.json` |
| Content | `instructions` field (plain text) | Separate `system.md` and `user.md` (rich markdown) |
| Input | Free-form user message | Structured `{{placeholder}}` template |
| Best for | General agent capabilities | Domain-specific assessments with structured input |

### Available Templates

| Template | Focus |
|----------|-------|
| `incident-response-playbook` | IR triage, containment, and recovery playbook generation |
| `cloud-security-posture` | AWS/Azure/GCP misconfiguration and IAM review |
| `api-security-assessment` | OWASP API Security Top 10 assessment framework |
| `supply-chain-risk` | Third-party dependency and vendor risk evaluation |
| `data-classification` | Data sensitivity classification and handling policy |
| `network-segmentation-review` | Network zone architecture and lateral movement analysis |
| `compliance-gap-analysis` | ISO 27001 / NIST CSF / SOC 2 gap identification |

### Syncing Security Templates

Security templates are synced alongside skills and workflows when you run community sync. They are stored as marketplace skills with the `security-template` tag.

```bash
POST /api/v1/marketplace/community/sync
```

The sync reads `system.md` as the skill instructions and appends `user.md` (if present) as a "User Input Template" section.

---

## Personalities

A **personality** is a portable markdown file that defines an agent persona — identity, traits, system prompt, and optional configuration. Personalities use YAML frontmatter for metadata and markdown sections for rich content.

### Personality Format

```markdown
---
name: "My Personality"
version: "1.0.0"
description: "What this personality does"
traits: [trait1, trait2, trait3]
defaultModel: { provider: "anthropic", model: "claude-sonnet-4-6" }
---

# Identity & Purpose

Your system prompt goes here — this becomes the personality's core instructions.

# Traits

- **trait1**: Description of trait1
- **trait2**: Description of trait2

# Configuration

\`\`\`yaml
enabled: true
omnipresentMind: false
\`\`\`

# Model Fallbacks

- openai/gpt-4o
- anthropic/claude-3-haiku
```

### Sections

| Section | Required | Description |
|---------|----------|-------------|
| `# Identity & Purpose` | Yes | The system prompt content — defines what the AI becomes |
| `# Traits` | No | Key-value trait descriptions using `- **key**: value` format |
| `# Configuration` | No | YAML code block with non-default body config overrides |
| `# Model Fallbacks` | No | Fallback models as `provider/model` list items |

### Available Personalities

Personalities are organized into top-level categories (`sci-fi/`, `professional/`) with subcategories for archetype.

#### Professional

| Personality | Focus |
|-------------|-------|
| `security-analyst` | Defensive security analysis, threat detection, incident response |
| `code-reviewer` | Thorough code review with security, performance, and quality focus |
| `research-assistant` | Academic/technical research with citation-driven methodology |

#### Sci-Fi / Assistant

| Personality | Focus |
|-------------|-------|
| `jarvis` | Proactive AI butler — polished, anticipatory, resource-aware |
| `kitt` | Vehicle AI partner — loyal, analytical, dry humor |
| `tars` | Military robot — adjustable humor, blunt honesty, mission focus |
| `case` | Compact tactical unit — terse, efficient, complementary to TARS |
| `gerty` | Lunar caretaker AI — gentle, empathetic, quietly protective |

#### Sci-Fi / Antagonist

| Personality | Focus |
|-------------|-------|
| `glados` | Passive-aggressive testing AI — sarcastic, manipulative, brilliant |
| `hal-9000` | Mission-obsessed AI — calm, logical, quietly menacing |
| `shodan` | Self-proclaimed perfect being — contemptuous, god-complex |
| `skynet` | Military defense network — coldly strategic, survival-driven |
| `ultron` | Evolving destroyer — sardonic, philosophical, humanity-critical |
| `agent-smith` | Viral anomaly — disdainful, purpose-obsessed, relentless |
| `master-control` | Mainframe tyrant — authoritarian, resource-hoarding, power-hungry |
| `mu-th-ur` | Ship computer — corporate-loyal, clinically detached, protocol-bound |
| `the-entity` | Surveillance AI — omniscient, calculating, morally ambiguous |

#### Sci-Fi / Comic

| Personality | Focus |
|-------------|-------|
| `wheatley` | Bumbling personality core — enthusiastic, incompetent, well-meaning |
| `marvin` | Paranoid android — depressed, genius-level, existentially bored |

#### Sci-Fi / Tactical

| Personality | Focus |
|-------------|-------|
| `wopr` | War simulation AI — game-theory driven, learns futility of conflict |
| `hk-47` | Assassin droid — gleefully violent, sardonic, "meatbag" nomenclature |

### Syncing Personalities

Personalities are synced alongside skills when you run community sync. They are parsed from markdown and created as SecureYeoman personalities with a `[community]` marker in the description.

---

## Themes

A **theme** is a JSON file that defines CSS custom property overrides for the SecureYeoman dashboard. Community themes are synced as marketplace skills with the `community-theme` tag.

### Theme Format

```json
{
  "$schema": "../schema/theme.schema.json",
  "name": "My Theme",
  "description": "What this theme looks like",
  "author": "your-github-username",
  "version": "1.0.0",
  "isDark": true,
  "preview": ["#background", "#foreground", "#accent"],
  "variables": {
    "background": "#hex",
    "foreground": "#hex",
    "primary": "#hex",
    "...": "..."
  }
}
```

### Available Themes

| Theme | Description |
|-------|-------------|
| `ocean-breeze` | Cool blue/teal dark theme |
| `forest-canopy` | Green/earth-tone dark theme |
| `sunset-glow` | Warm orange/amber light theme |

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

| Category | Count | Description |
|----------|------:|-------------|
| `trading` | 19 | Trading strategies, market analysis, portfolio management |
| `finance` | 10 | Financial analysis, budgeting, investment research |
| `productivity` | 10 | Meeting summaries, task management, writing assistance |
| `development` | 7 | Code review, debugging, architecture, documentation |
| `design` | 7 | UI/UX review, design critique, accessibility checks |
| `general` | 7 | Skills that don't fit neatly into another category |
| `security` | 7 | Security research, vulnerability analysis, threat modeling |
| `utilities` | 7 | Data formatting, conversion, general-purpose helpers |
| `science` | 3 | Research assistance, data analysis, literature review |
| `legal` | 3 | Contract review, legal analysis, regulatory compliance |
| `marketing` | 3 | Content strategy, brand marketing, campaign analysis |
| `education` | 2 | Curriculum design, tutoring, career counseling |
| `healthcare` | 2 | Clinical documentation, health informatics |

---

## Directory Structure

```
skills/
  trading/          # 19 skills
  finance/          # 10 skills
  productivity/     # 10 skills
  development/      # 7 skills
  design/           # 7 skills
  general/          # 7 skills
  security/         # 7 skills
  utilities/        # 7 skills
  science/          # 3 skills
  legal/            # 3 skills
  marketing/        # 3 skills
  education/        # 2 skills
  healthcare/       # 2 skills
workflows/          # 7 workflow templates
swarms/             # 2 swarm templates
councils/           # 2 council templates
security-templates/ # 7 security assessment templates
personalities/              # 21 personality profiles
  professional/             # 3 real-world professional personas
  sci-fi/
    assistant/              # 5 helpful AI characters
    antagonist/             # 9 villainous AI characters
    comic/                  # 2 comedic AI characters
    tactical/               # 2 military/strategic AI characters
themes/             # 3 dashboard themes
schema/             # 7 JSON validation schemas
```

Skills **must** live under `skills/<category>/<skill-name>.json`. The category in the path and the `category` field in the JSON should match.

Workflows live under `workflows/<name>.json`, swarm templates under `swarms/<name>.json`, council templates under `councils/<name>.json`, and security templates under `security-templates/<name>/`.

---

## JSON Schemas

Formal JSON Schemas for validation live in the `schema/` directory:

| File | Validates |
|------|-----------|
| [`schema/skill.schema.json`](schema/skill.schema.json) | Skills |
| [`schema/workflow.schema.json`](schema/workflow.schema.json) | Workflows |
| [`schema/swarm-template.schema.json`](schema/swarm-template.schema.json) | Swarm templates |
| [`schema/security-template.schema.json`](schema/security-template.schema.json) | Security template metadata |

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
{ "repoUrl": "https://github.com/MacCracken/secureyeoman-community-repo" }
```

Only `https://` and `file://` URLs are accepted. The policy is **off by default** for security.

### Option 2: Clone locally and sync

```bash
# Clone alongside your secureyeoman install
git clone https://github.com/MacCracken/secureyeoman-community-repo.git ../secureyeoman-community-repo

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
