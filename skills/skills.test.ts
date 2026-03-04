/**
 * Community Skills Validation Tests
 * Validates all 21 community skill JSON files against the schema constraints.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';

const SKILLS_DIR = new URL('.', import.meta.url).pathname;

// Valid categories from schema
const VALID_CATEGORIES = [
  'development',
  'productivity',
  'security',
  'utilities',
  'design',
  'finance',
  'science',
  'general',
];

const VALID_AUTONOMY_LEVELS = ['L1', 'L2', 'L3', 'L4', 'L5'];
const VALID_ROUTING = ['fuzzy', 'explicit'];

// Discover all skill JSON files
function discoverSkills(): { path: string; category: string; filename: string }[] {
  const skills: { path: string; category: string; filename: string }[] = [];
  for (const category of readdirSync(SKILLS_DIR)) {
    const catDir = join(SKILLS_DIR, category);
    if (!statSync(catDir).isDirectory()) continue;
    for (const file of readdirSync(catDir)) {
      if (file.endsWith('.json')) {
        skills.push({ path: join(catDir, file), category, filename: file });
      }
    }
  }
  return skills;
}

const ALL_SKILLS = discoverSkills();

// Load and parse all skills
const LOADED_SKILLS = ALL_SKILLS.map(({ path, category, filename }) => {
  const raw = readFileSync(path, 'utf-8');
  const data = JSON.parse(raw);
  return { data, category, filename, path };
});

describe('Community Skills — Discovery', () => {
  it('finds at least 20 skill files', () => {
    expect(ALL_SKILLS.length).toBeGreaterThanOrEqual(20);
  });

  it('all files parse as valid JSON', () => {
    for (const { path } of ALL_SKILLS) {
      expect(() => JSON.parse(readFileSync(path, 'utf-8')), `${path} should parse`).not.toThrow();
    }
  });
});

describe('Community Skills — Required Fields', () => {
  for (const { data, filename } of LOADED_SKILLS) {
    describe(data.name || filename, () => {
      it('has name (string, 1-200 chars)', () => {
        expect(typeof data.name).toBe('string');
        expect(data.name.length).toBeGreaterThanOrEqual(1);
        expect(data.name.length).toBeLessThanOrEqual(200);
      });

      it('has instructions (string, 1-8000 chars)', () => {
        expect(typeof data.instructions).toBe('string');
        expect(data.instructions.length).toBeGreaterThanOrEqual(1);
        expect(data.instructions.length).toBeLessThanOrEqual(8000);
      });
    });
  }
});

describe('Community Skills — Optional Field Validation', () => {
  for (const { data, category, filename } of LOADED_SKILLS) {
    describe(data.name || filename, () => {
      it('has description (max 2000 chars)', () => {
        expect(data.description).toBeTruthy();
        expect(data.description.length).toBeLessThanOrEqual(2000);
      });

      it('has valid version format (YYYY.M.D or YYYY.M.D-N)', () => {
        expect(data.version).toBeDefined();
        expect(data.version).toMatch(/^\d{4}\.\d{1,2}\.\d{1,2}(-\d+)?$/);
      });

      it('has valid category matching directory', () => {
        expect(VALID_CATEGORIES).toContain(data.category);
        expect(data.category).toBe(category);
      });

      it('has author with name', () => {
        expect(data.author).toBeDefined();
        if (typeof data.author === 'string') {
          expect(data.author.length).toBeLessThanOrEqual(200);
        } else {
          expect(data.author.name).toBeTruthy();
          expect(data.author.name.length).toBeLessThanOrEqual(200);
        }
      });

      it('has tags array (max 20 items, each max 50 chars)', () => {
        expect(Array.isArray(data.tags)).toBe(true);
        expect(data.tags.length).toBeGreaterThan(0);
        expect(data.tags.length).toBeLessThanOrEqual(20);
        for (const tag of data.tags) {
          expect(typeof tag).toBe('string');
          expect(tag.length).toBeLessThanOrEqual(50);
        }
      });
    });
  }
});

describe('Community Skills — Routing Quality Fields', () => {
  for (const { data, filename } of LOADED_SKILLS) {
    describe(data.name || filename, () => {
      it('has triggerPatterns that compile as valid regex', () => {
        expect(Array.isArray(data.triggerPatterns)).toBe(true);
        expect(data.triggerPatterns.length).toBeGreaterThan(0);
        expect(data.triggerPatterns.length).toBeLessThanOrEqual(20);
        for (const pattern of data.triggerPatterns) {
          expect(typeof pattern).toBe('string');
          expect(pattern.length).toBeLessThanOrEqual(500);
          expect(() => new RegExp(pattern, 'i'), `Pattern "${pattern}" should compile`).not.toThrow();
        }
      });

      it('has useWhen (max 500 chars)', () => {
        expect(data.useWhen).toBeTruthy();
        expect(data.useWhen.length).toBeLessThanOrEqual(500);
      });

      it('has doNotUseWhen (max 500 chars)', () => {
        expect(data.doNotUseWhen).toBeTruthy();
        expect(data.doNotUseWhen.length).toBeLessThanOrEqual(500);
      });

      it('has successCriteria (max 300 chars)', () => {
        expect(data.successCriteria).toBeTruthy();
        expect(data.successCriteria.length).toBeLessThanOrEqual(300);
      });

      if (data.routing) {
        it('has valid routing value', () => {
          expect(VALID_ROUTING).toContain(data.routing);
        });
      }

      if (data.autonomyLevel) {
        it('has valid autonomy level', () => {
          expect(VALID_AUTONOMY_LEVELS).toContain(data.autonomyLevel);
        });
      }

      if (data.mcpToolsAllowed) {
        it('mcpToolsAllowed is string array', () => {
          expect(Array.isArray(data.mcpToolsAllowed)).toBe(true);
          for (const tool of data.mcpToolsAllowed) {
            expect(typeof tool).toBe('string');
          }
        });
      }
    });
  }
});

describe('Community Skills — Trigger Pattern Smoke Tests', () => {
  const TRIGGER_TESTS: Record<string, string[]> = {
    'Code Reviewer': ['review this code', 'code review please', 'check this PR'],
    'Meeting Summarizer': ['summarize the meeting', 'meeting summary', 'here is the transcript'],
    'Git Assistant': ['help with git rebase', 'git merge conflict', 'git cherry-pick this commit'],
    'SQL Expert': ['write a SQL query', 'optimize this query', 'database schema design'],
    'Email Composer': ['write an email', 'draft an email to the team', 'compose an email reply'],
    'Data Formatter': ['convert JSON to CSV', 'format this data', 'parse this JSON'],
    'Security Researcher': ['analyze this CVE', 'threat model assessment', 'OWASP review'],
    'Regex Builder': ['write a regex', 'build a regular expression', 'regex pattern for emails'],
    'Diagram Architect': ['create a diagram', 'draw a flowchart', 'architecture diagram'],
    'Research Synthesizer': ['synthesize research', 'literature review', 'compile findings from sources'],
    'Technical Writer': ['write docs for this API', 'create a runbook', 'document this API reference'],
    'Calendar Intelligence': ['schedule analysis', 'calendar review', 'meeting load assessment'],
    'Emoji Mood Detector': ['detect mood', 'what emoji fits', 'sentiment of this text'],
  };

  for (const [skillName, inputs] of Object.entries(TRIGGER_TESTS)) {
    const skill = LOADED_SKILLS.find((s) => s.data.name === skillName);
    if (!skill) continue;

    describe(skillName, () => {
      for (const input of inputs) {
        it(`matches "${input}"`, () => {
          const patterns = skill.data.triggerPatterns.map((p: string) => new RegExp(p, 'i'));
          const matched = patterns.some((rx: RegExp) => rx.test(input));
          expect(matched, `Expected "${input}" to match at least one trigger for ${skillName}`).toBe(
            true
          );
        });
      }
    });
  }
});

describe('Community Skills — Instruction Quality', () => {
  for (const { data, filename } of LOADED_SKILLS) {
    it(`${data.name || filename} instructions have at least 100 chars`, () => {
      expect(data.instructions.length).toBeGreaterThanOrEqual(100);
    });
  }
});

describe('Community Skills — No Duplicate Names', () => {
  it('all skill names are unique', () => {
    const names = LOADED_SKILLS.map((s) => s.data.name);
    const unique = new Set(names);
    expect(unique.size).toBe(names.length);
  });
});

describe('Community Skills — No Unknown Properties', () => {
  const ALLOWED_KEYS = new Set([
    '$schema',
    'name',
    'description',
    'version',
    'author',
    'category',
    'tags',
    'instructions',
    'tools',
    'triggerPatterns',
    'useWhen',
    'doNotUseWhen',
    'successCriteria',
    'mcpToolsAllowed',
    'routing',
    'autonomyLevel',
  ]);

  for (const { data, filename } of LOADED_SKILLS) {
    it(`${data.name || filename} has no unknown properties`, () => {
      const keys = Object.keys(data);
      const unknown = keys.filter((k) => !ALLOWED_KEYS.has(k));
      expect(unknown, `Unknown keys in ${filename}: ${unknown.join(', ')}`).toHaveLength(0);
    });
  }
});
