import { Section } from "@/components/shared/Section";
import {
  ArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@/components/shared/Icons";

const WITHOUT_STEPS = [
  "A vendor changes a column name",
  "The incoming file no longer matches the expected schema",
  "The pipeline run fails",
  "An engineer stops what they are doing to investigate",
  "Reports and downstream jobs are delayed",
] as const;

const WITH_STEPS = [
  "Schema drift is detected on upload",
  "Recovery strategies run in order: rule, fuzzy, semantic",
  "Recoverable columns are mapped to canonical fields",
  "Every mapping is reported with the strategy that produced it",
  "The pipeline can continue when recovery succeeds",
] as const;

interface FlowCardProps {
  tone: "danger" | "success";
  title: string;
  caption: string;
  steps: readonly string[];
}

function FlowCard({ tone, title, caption, steps }: FlowCardProps) {
  const isDanger = tone === "danger";

  const shell = isDanger
    ? "border-danger-200 bg-danger-50/45"
    : "border-success-200 bg-success-50/45";

  const accent = isDanger ? "text-danger-700" : "text-success-700";

  const marker = isDanger
    ? "bg-white text-danger-600 ring-danger-200"
    : "bg-white text-success-600 ring-success-200";

  return (
    <div className={`rounded-2xl border p-6 sm:p-8 ${shell}`}>
      <div className="flex items-center gap-2.5">
        <span
          className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ring-1 ring-inset ${marker}`}
        >
          {isDanger ? (
            <XCircleIcon className="h-5 w-5" />
          ) : (
            <CheckCircleIcon className="h-5 w-5" />
          )}
        </span>
        <div>
          <h3 className={`text-lg font-semibold ${accent}`}>{title}</h3>
          <p className="text-sm text-ink-500">{caption}</p>
        </div>
      </div>

      <ol className="mt-6 space-y-1">
        {steps.map((step, index) => (
          <li key={step}>
            <div className="rounded-xl bg-white/80 px-4 py-3 text-sm leading-6 text-ink-700 ring-1 ring-inset ring-white">
              {step}
            </div>
            {index < steps.length - 1 && (
              <div className="flex justify-center py-1" aria-hidden="true">
                <ArrowDownIcon
                  className={`h-4 w-4 ${isDanger ? "text-danger-200" : "text-success-200"}`}
                />
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function BeforeAfter() {
  return (
    <Section
      id="product"
      eyebrow="The problem"
      heading="One renamed column, one broken pipeline"
      description="Schema drift is rarely dramatic. A vendor renames a field, an export tool changes its casing, a CRM migration ships slightly different headers — and the run that worked yesterday stops working today."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <FlowCard
          tone="danger"
          title="Without SchemaHealer"
          caption="The drift becomes an incident"
          steps={WITHOUT_STEPS}
        />
        <FlowCard
          tone="success"
          title="With SchemaHealer"
          caption="The drift becomes a mapping decision"
          steps={WITH_STEPS}
        />
      </div>
    </Section>
  );
}
