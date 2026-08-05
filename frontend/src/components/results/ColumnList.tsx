interface ColumnListProps {
  title: string;
  description: string;
  columns: string[];
  tone?: "danger" | "warning";
}

const TONE_CLASSES = {
  danger: {
    shell: "border-danger-200 bg-danger-50/60",
    title: "text-danger-700",
    chip: "bg-white text-danger-700 ring-danger-200",
  },
  warning: {
    shell: "border-warning-200 bg-warning-50/70",
    title: "text-warning-700",
    chip: "bg-white text-warning-700 ring-warning-200",
  },
} as const;

/**
 * Named list of problem columns — unresolved headers, duplicated
 * canonical fields, or inconsistent mappings reported by the backend
 * validator.
 */
export function ColumnList({
  title,
  description,
  columns,
  tone = "danger",
}: ColumnListProps) {
  if (columns.length === 0) {
    return null;
  }

  const classes = TONE_CLASSES[tone];

  return (
    <div className={`rounded-2xl border p-4 ${classes.shell}`}>
      <h4 className={`text-sm font-semibold ${classes.title}`}>
        {title}
        <span className="ml-1.5 font-normal tabular-nums">
          ({columns.length})
        </span>
      </h4>
      <p className="mt-1 text-xs leading-5 text-ink-500">{description}</p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {columns.map((column) => (
          <li key={column}>
            <span
              className={`inline-block rounded-lg px-2.5 py-1 font-mono text-[12px] ring-1 ring-inset ${classes.chip}`}
            >
              {column}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
