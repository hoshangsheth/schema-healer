import { LinkButton } from "@/components/shared/Button";
import { ArrowRightIcon, SparklesIcon } from "@/components/shared/Icons";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-ink-200/70"
    >
      {/* Soft brand wash behind the headline. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 h-[36rem] bg-[radial-gradient(60%_60%_at_50%_40%,var(--brand-100)_0%,transparent_70%)]"
      />

      <div className="relative mx-auto w-full max-w-4xl px-5 py-20 text-center sm:px-8 lg:py-28">
        <p className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-brand-700 shadow-sm ring-1 ring-inset ring-brand-200">
          <SparklesIcon className="h-4 w-4" />
          Rule, fuzzy, and semantic schema recovery
        </p>

        <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
          Your data pipeline shouldn&rsquo;t break because someone{" "}
          <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
            renamed a column
          </span>
          .
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-ink-500">
          When an incoming CSV stops matching your expected schema,
          SchemaHealer detects the drift and tries to map the renamed
          columns back to the fields your systems expect &mdash; before
          anything downstream fails.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <LinkButton href="#demo" size="lg">
            Try Free &mdash; Upload CSV
            <ArrowRightIcon className="h-4 w-4" />
          </LinkButton>
          <LinkButton href="#how-it-works" size="lg" variant="secondary">
            See How It Works
          </LinkButton>
        </div>

        <p className="mt-6 text-sm text-ink-400">
          Currently supports CSV files. Only column headers are analysed.
        </p>
      </div>
    </section>
  );
}
