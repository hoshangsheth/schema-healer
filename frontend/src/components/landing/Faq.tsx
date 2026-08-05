import { Section } from "@/components/shared/Section";
import { ChevronDownIcon } from "@/components/shared/Icons";

interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Answers describe the pipeline as currently implemented in the backend.
 * They must be revisited whenever the recovery pipeline changes.
 */
const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What kind of files does SchemaHealer currently support?",
    answer:
      "CSV files. The upload is rejected unless the filename ends in .csv, and it is rejected again if the file turns out to contain no header row. The delimiter is detected automatically — comma, semicolon, tab and pipe are all recognised, falling back to comma-separated when detection is inconclusive.",
  },
  {
    question: "How does schema recovery work?",
    answer:
      "Only the header row is read. Each header is normalized — trimmed, lowercased, spaces turned into underscores — and then passed through three strategies in order. Rule matching looks the header up in a curated alias dictionary. Fuzzy matching scores the remaining headers against those aliases and accepts a match above a similarity threshold. Semantic matching sends whatever is still unresolved to Gemini, which selects a canonical field or declines. The pipeline stops early once every column is resolved.",
  },
  {
    question: "What happens when SchemaHealer cannot recover a column?",
    answer:
      "The column stays unresolved rather than being guessed at. It is reported by name in the result, and the overall validation is marked invalid. The same applies when two incoming columns are mapped onto the same canonical field — that conflict is surfaced instead of being silently resolved.",
  },
  {
    question:
      "Does SchemaHealer send CSV row data to the semantic model?",
    answer:
      "No. Only normalized column headers are included in the prompt, alongside the canonical schema field names. Row values are never read for matching and never leave your file.",
  },
  {
    question: "Why use multiple recovery strategies?",
    answer:
      "Most drift is boring — a known alias or a typo — and does not need a language model to resolve. Running deterministic rules first, then fuzzy similarity, means the model is only consulted for the genuinely ambiguous columns. That keeps results reproducible where they can be, and reserves the expensive step for cases that need judgement.",
  },
  {
    question: "Is a recovered file returned?",
    answer:
      "Not in the current build. SchemaHealer returns the column mappings and the validation outcome. Producing a rewritten CSV, along with a healing report and post-recovery verification, is planned work.",
  },
];

export function Faq() {
  return (
    <Section
      id="about"
      eyebrow="FAQ"
      heading="How SchemaHealer actually behaves"
      description="Answers reflect the current build, not a roadmap."
    >
      <div className="mx-auto max-w-3xl divide-y divide-ink-200 rounded-2xl border border-ink-200 bg-white">
        {FAQ_ITEMS.map((item) => (
          <details key={item.question} className="group px-5 py-4 sm:px-6">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left text-[15px] font-medium text-ink-900 [&::-webkit-details-marker]:hidden">
              {item.question}
              <ChevronDownIcon className="mt-0.5 h-5 w-5 shrink-0 text-ink-400 transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-3 text-sm leading-7 text-ink-500">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </Section>
  );
}
