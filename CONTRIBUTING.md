# Contributing to SecureYeoman Community Skills

Thank you for contributing! This guide covers the standards, review criteria, and process for adding skills to the registry.

---

## Before You Start

- Check that no existing skill already covers your use case (search the `skills/` directory)
- Skills must be general-purpose and useful to a broad audience — personal or highly niche skills belong in your own local collection
- All instructions must be written in English

---

## Skill Quality Bar

A skill will be accepted if it meets **all** of the following:

### Required
- [ ] `name` is unique across the registry (case-insensitive)
- [ ] `name` clearly describes what the skill does
- [ ] `instructions` are detailed enough that a capable LLM can act on them without additional context
- [ ] `category` matches the directory the file is placed in
- [ ] No personally identifiable information (PII), API keys, secrets, or credentials anywhere in the file
- [ ] Valid JSON that passes `schema/skill.schema.json` validation

### Instructions Quality
- [ ] Written from the agent's perspective ("You are...", "Your task is...")
- [ ] Covers the primary use cases the skill is designed for
- [ ] Handles edge cases or ambiguous input gracefully (tells the agent what to do when unclear)
- [ ] Does not hallucinate capabilities the agent doesn't have (e.g., "access the web" without a web tool)
- [ ] Under 8000 characters

### Tags & Metadata
- [ ] At least 2 relevant tags
- [ ] Description summarises the skill in 1-2 sentences
- [ ] `author` is set to your GitHub username or real name
- [ ] `version` follows semver (start at `1.0.0`)

---

## What Will Be Rejected

- Skills that replicate built-in YEOMAN skills (Summarize Text, Senior Software Engineer, etc.)
- Harmful, offensive, or deceptive instructions
- Skills that attempt to exfiltrate data or make unauthorized network calls
- Placeholder skills with empty or trivial instructions
- Duplicate submissions

---

## Process

1. **Fork** this repository
2. **Create** your skill file at `skills/<category>/<kebab-case-name>.json`
3. **Validate** the JSON against `schema/skill.schema.json`
4. **Test** the skill in your local SecureYeoman instance via `POST /api/v1/marketplace/community/sync`
5. **Open a pull request** with:
   - A title like `feat: add <skill name> skill`
   - A brief description of what the skill does and when you'd use it
   - Confirmation that you've tested it locally

---

## Updating an Existing Skill

- Bump the `version` field (semver)
- Describe the change in the PR description
- Breaking changes to `instructions` should bump the major version

---

## License

By submitting a skill, you agree that it is licensed under [MIT](https://opensource.org/licenses/MIT) and can be freely used, modified, and distributed.
