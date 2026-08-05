import { Badge } from "@/components/shared/Badge";
import { Section } from "@/components/shared/Section";
import { ArrowRightIcon } from "@/components/shared/Icons";

interface Step {
  title: string;
  body: string;
  detail?: React.ReactNode;
}

const STEPS: Step[] = [
  {
    title: "Upload CSV",
    body: "Drop in an incoming CSV. SchemaHealer reads its header row to find the columns the file actually contains.",
  },
  {
    title: "Detect schema drift",
    body: "Each incoming column is normalized and compared against the expected canonical schema to see what no longer lines up.",
  },
  {
    title: "Recover",
    body: "Unresolved columns move through the recovery pipeline in order. Each stage only sees what the previous one could not resolve.",
    detail: (
      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <Badge tone="brand">Rule</Badge>
        <ArrowRightIcon className="h-3.5 w-3.5 text-ink-400" />
        <Badge tone="brand">Fuzzy</Badge>
        <ArrowRightIcon className="h-3.5 w-3.5 text-ink-400" />
        <Badge tone="brand">Semantic</Badge>
      </div>
    ),
  },
  {
    title: "Return result",
    body: "The result shows whether the schema passed as-is, was recovered, or failed — with the mapping for every column that changed.",
  },
];

export function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      eyebrow="How it works"
      heading="Four steps from upload to answer"
      description="Cheap, deterministic strategies run first. The language model is only consulted for the columns nothing else could resolve."
    >
      <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, index) => (
          <li
            key={step.title}
            className="relative flex flex-col rounded-2xl border border-ink-200 bg-white p-6 shadow-sm"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-sm font-semibold text-white">
              {index + 1}
            </span>
            <h3 className="mt-5 text-base font-semibold text-ink-900">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-ink-500">{step.body}</p>
            {step.detail}
          </li>
        ))}
      </ol>
    </Section>
  );
}
