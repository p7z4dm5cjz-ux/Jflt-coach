// JFLT Coach — schema dati "jflt-coach/v2" per le risposte del Tutor.
// Unica fonte: l'app valida con questo oggetto (vedi core.js) e
// schema/jflt-coach-v2.schema.json ne è la copia generata per la documentazione.

export const AREAS = [
  "tenses", "articles", "prepositions", "connectors", "conditionals", "word_order",
  "modals", "passive", "relatives", "reported_speech", "gerund_infinitive", "formal_register"
];
export const CAPABILITIES = ["A1", "A2", "A3", "A4", "A5", "B1", "B2", "B3", "B4"];
export const CRITERIA = ["comprehensibility", "task", "organisation", "grammar", "lexis_register"];
export const ITEM_TYPES = ["error_correction", "transformation", "completion"];
export const TEXT_TYPES = ["note", "report_letter", "essay"];
export const MODES = [
  "DIAG_ITEMS", "DIAG_EVAL", "GRAMMAR", "WRITE_PLAN", "WRITE_FEEDBACK",
  "WRITE_MODEL", "CHECK_TRANSFER", "WEEK_PLAN"
];
export const BOOKS = ["OXFORD", "CAMPAIGN", "MISSION", "TARGET"];

const str = { type: "string", minLength: 1 };
const id = { type: "string", pattern: "^[A-Za-z0-9_.-]{1,40}$" };

export const SCHEMA = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://jflt-coach.local/schema/jflt-coach-v2.schema.json",
  title: "Risposta del Tutor JFLT Coach (jflt-coach/v2)",
  type: "object",
  additionalProperties: false,
  required: ["schema", "mode", "request_id", "date", "payload", "card_candidates", "questions"],
  properties: {
    schema: { const: "jflt-coach/v2" },
    mode: { enum: MODES },
    request_id: { type: "string", pattern: "^r-[0-9]{8}-[a-z0-9]{4,12}$" },
    date: { type: "string", pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$" },
    payload: { type: "object" },
    card_candidates: { type: "array", maxItems: 6, items: { $ref: "#/$defs/Card" } },
    questions: { type: "array", maxItems: 5, items: str }
  },
  allOf: MODES.map((m) => ({
    if: { properties: { mode: { const: m } } },
    then: { properties: { payload: { $ref: `#/$defs/${m}` } } }
  })),
  $defs: {
    Card: {
      type: "object", additionalProperties: false,
      required: ["front", "back", "tag", "source_quote", "reason_it"],
      properties: { front: str, back: str, tag: { enum: [...AREAS, "lexis", "organisation", "register"] }, source_quote: str, reason_it: str }
    },
    BookRef: {
      type: "object", additionalProperties: false,
      required: ["ref_id", "book", "pages"],
      properties: { ref_id: id, book: { enum: BOOKS }, pages: str }
    },
    ScoreEvidence: {
      type: "object", additionalProperties: false, required: ["score", "evidence"],
      properties: { score: { type: "integer", minimum: 0, maximum: 4 }, evidence: str }
    },
    Rubric: {
      type: "object", additionalProperties: false, required: CRITERIA,
      properties: Object.fromEntries(CRITERIA.map((c) => [c, { $ref: "#/$defs/ScoreEvidence" }]))
    },
    ErrorEntry: {
      type: "object", additionalProperties: false,
      required: ["quote", "minimal_fix", "category", "tool", "rule_it", "systematic"],
      properties: {
        quote: str, minimal_fix: str,
        category: { enum: ["grammar", "lexis", "organisation", "task", "register", "spelling", "punctuation"] },
        tool: { anyOf: [{ enum: AREAS }, { type: "null" }] },
        rule_it: str, systematic: { type: "boolean" }
      }
    },
    Alternative: {
      type: "object", additionalProperties: false, required: ["quote", "option", "note_it"],
      properties: { quote: str, option: str, note_it: str }
    },
    StanagEstimate: {
      type: "object", additionalProperties: false, required: ["range", "confidence", "basis_it", "note"],
      properties: {
        range: { type: "string", pattern: "^(0\\+?|1\\+?|2\\+?|3\\+?|4)( / (0\\+?|1\\+?|2\\+?|3\\+?|4))?$" },
        confidence: { enum: ["low", "medium", "high"] },
        basis_it: str,
        note: { const: "stima orientativa, non ufficiale" }
      }
    },
    Occurrence: {
      type: "object", additionalProperties: false, required: ["quote", "correct", "note_it"],
      properties: { quote: str, correct: { type: "boolean" }, note_it: { type: "string" } }
    },
    Transfer: {
      type: "object", additionalProperties: false, required: ["tool", "occurrences"],
      properties: { tool: { enum: AREAS }, occurrences: { type: "array", maxItems: 20, items: { $ref: "#/$defs/Occurrence" } } }
    },
    DiagItem: {
      type: "object", additionalProperties: false,
      required: ["id", "area", "type", "instruction_it", "stem", "already_correct", "answer", "accept", "explanation_it"],
      properties: {
        id, area: { enum: AREAS }, type: { enum: ITEM_TYPES },
        instruction_it: str, stem: str,
        already_correct: { type: ["boolean", "null"] },
        answer: str, accept: { type: "array", minItems: 1, items: str }, explanation_it: str
      }
    },
    GrammarItem: {
      type: "object", additionalProperties: false,
      required: ["id", "type", "instruction_it", "stem", "answer", "accept", "explanation_it"],
      properties: {
        id, type: { enum: ITEM_TYPES }, instruction_it: str, stem: str,
        answer: str, accept: { type: "array", minItems: 1, items: str }, explanation_it: str
      }
    },
    Priority: {
      type: "object", additionalProperties: false,
      required: ["rank", "kind", "tool", "criterion", "issue_it", "why_it"],
      properties: {
        rank: { type: "integer", minimum: 1, maximum: 3 },
        kind: { enum: ["grammar_tool", "writing_criterion"] },
        tool: { anyOf: [{ enum: AREAS }, { type: "null" }] },
        criterion: { anyOf: [{ enum: CRITERIA }, { type: "null" }] },
        issue_it: str, why_it: str
      }
    },
    FeedbackPriority: {
      type: "object", additionalProperties: false, required: ["criterion", "issue_it", "why_it"],
      properties: { criterion: { enum: CRITERIA }, issue_it: str, why_it: str }
    },
    WritingTask: {
      type: "object", additionalProperties: false,
      required: ["id", "capability", "text_type", "prompt_en", "words", "content_points", "checklist_it", "draft_sessions"],
      properties: {
        id, capability: { enum: CAPABILITIES }, text_type: { enum: TEXT_TYPES }, prompt_en: str,
        words: { type: "array", minItems: 2, maxItems: 2, items: { type: "integer", minimum: 30, maximum: 600 } },
        content_points: { type: "array", minItems: 2, maxItems: 6, items: str },
        checklist_it: { type: "array", minItems: 2, maxItems: 8, items: str },
        draft_sessions: { type: "integer", minimum: 1, maximum: 2 }
      }
    },

    DIAG_ITEMS: {
      type: "object", additionalProperties: false, required: ["items"],
      properties: { items: { type: "array", minItems: 20, maxItems: 20, items: { $ref: "#/$defs/DiagItem" } } }
    },
    DIAG_EVAL: {
      type: "object", additionalProperties: false,
      required: ["texts", "item_rulings", "stanag_estimate", "priorities", "start_capability", "start_rationale_it"],
      properties: {
        texts: {
          type: "array", minItems: 2, maxItems: 2,
          items: {
            type: "object", additionalProperties: false, required: ["text_id", "rubric", "errors", "comment_it"],
            properties: {
              text_id: { enum: ["D3", "D4"] }, rubric: { $ref: "#/$defs/Rubric" },
              errors: { type: "array", maxItems: 30, items: { $ref: "#/$defs/ErrorEntry" } }, comment_it: str
            }
          }
        },
        item_rulings: {
          type: "array", maxItems: 40,
          items: {
            type: "object", additionalProperties: false, required: ["item_id", "correct", "note_it"],
            properties: { item_id: id, correct: { type: "boolean" }, note_it: str }
          }
        },
        stanag_estimate: { $ref: "#/$defs/StanagEstimate" },
        priorities: { type: "array", minItems: 2, maxItems: 3, items: { $ref: "#/$defs/Priority" } },
        start_capability: { enum: CAPABILITIES },
        start_rationale_it: str
      }
    },
    GRAMMAR: {
      type: "object", additionalProperties: false,
      required: ["tool", "capability", "purpose", "explanation_it", "book_ref", "items"],
      properties: {
        tool: { enum: AREAS }, capability: { enum: CAPABILITIES }, purpose: { enum: ["practice", "check"] },
        explanation_it: str,
        book_ref: { anyOf: [{ $ref: "#/$defs/BookRef" }, { type: "null" }] },
        items: { type: "array", minItems: 4, maxItems: 10, items: { $ref: "#/$defs/GrammarItem" } }
      }
    },
    WRITE_PLAN: {
      type: "object", additionalProperties: false,
      required: ["task", "model_excerpt_en", "observation_questions_it"],
      properties: {
        task: { $ref: "#/$defs/WritingTask" },
        model_excerpt_en: { type: "string", minLength: 1, maxLength: 1000 },
        observation_questions_it: { type: "array", minItems: 3, maxItems: 3, items: str }
      }
    },
    WRITE_FEEDBACK: {
      type: "object", additionalProperties: false,
      required: ["text_id", "version", "rubric", "priorities", "errors", "alternatives", "transfer", "rewrite_request_it", "stanag_estimate"],
      properties: {
        text_id: id, version: { enum: ["draft", "rewrite"] },
        rubric: { $ref: "#/$defs/Rubric" },
        priorities: { type: "array", minItems: 2, maxItems: 3, items: { $ref: "#/$defs/FeedbackPriority" } },
        errors: { type: "array", maxItems: 30, items: { $ref: "#/$defs/ErrorEntry" } },
        alternatives: { type: "array", maxItems: 10, items: { $ref: "#/$defs/Alternative" } },
        transfer: { anyOf: [{ $ref: "#/$defs/Transfer" }, { type: "null" }] },
        rewrite_request_it: str,
        stanag_estimate: { $ref: "#/$defs/StanagEstimate" }
      }
    },
    WRITE_MODEL: {
      type: "object", additionalProperties: false,
      required: ["text_id", "improvements_it", "still_open_it", "model_text_en"],
      properties: {
        text_id: id,
        improvements_it: { type: "array", maxItems: 6, items: str },
        still_open_it: { type: "array", maxItems: 6, items: str },
        model_text_en: str
      }
    },
    CHECK_TRANSFER: {
      type: "object", additionalProperties: false, required: ["text_id", "transfer"],
      properties: { text_id: id, transfer: { $ref: "#/$defs/Transfer" } }
    },
    WEEK_PLAN: {
      type: "object", additionalProperties: false, required: ["week_start", "capability", "sessions", "rationale_it"],
      properties: {
        week_start: { type: "string", pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$" },
        capability: { enum: CAPABILITIES },
        sessions: {
          type: "array", minItems: 6, maxItems: 6,
          items: {
            type: "object", additionalProperties: false, required: ["day", "kind", "focus_it", "tool"],
            properties: {
              day: { enum: ["mon", "tue", "wed", "thu", "fri", "sat"] },
              kind: { enum: ["grammar", "write_plan", "write_draft", "write_revise", "write_short"] },
              focus_it: str, tool: { anyOf: [{ enum: AREAS }, { type: "null" }] }
            }
          }
        },
        rationale_it: str
      }
    }
  }
};
