"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Columns3,
  Gauge,
  ShieldQuestion,
  UserCheck,
} from "lucide-react";

import { cn } from "@/lib/cn";
import { riskFrom } from "@/lib/recovery-presentation";
import type { SchemaProcessingResponse } from "@/types/api";
import { Badge } from "@/components/shared/badge";
import { Card, CardHeader } from "@/components/shared/card";
import { CountUp, StatTile } from "@/components/shared/stat";
import { VerificationFindings } from "@/components/report/verification-findings";
import { pluralize } from "@/utils/format";

/**
 * The recovery report.
 *
 * Every figure is read from `healing_report` and `validation_result`. Nothing
 * is recalculated in the browser.
 */
export function HealingReportPanel({ response }: { response: SchemaProcessingResponse }) {
  const { healing_report: report, validation_result: validation } = response;
  const { recovery_summary: recovery, summary } = report;
  const risk = riskFrom(response);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        <StatTile
          label="Recovered"
          value={
            <CountUp
              value={recovery.recovery_rate}
              decimals={recovery.recovery_rate % 1 === 0 ? 0 : 2}
              suffix="%"
            />
          }
          hint={`${recovery.recovered_columns} of ${recovery.total_uploaded_columns} columns matched`}
          tone={recovery.unresolved_columns === 0 ? "success" : "warn"}
          icon={<Gauge className="size-4" aria-hidden />}
        />
        <StatTile
          label="Columns in file"
          value={<CountUp value={recovery.total_uploaded_columns} />}
          hint="Column names found in the upload"
          icon={<Columns3 className="size-4" aria-hidden />}
        />
        <StatTile
          label="Needs review"
          value={<CountUp value={recovery.unresolved_columns} />}
          hint={
            recovery.unresolved_columns === 0
              ? "Nothing left unmatched"
              : `${recovery.unresolved_columns} ${pluralize(recovery.unresolved_columns, "column")} kept its original name`
          }
          tone={recovery.unresolved_columns === 0 ? "success" : "warn"}
          icon={<ShieldQuestion className="size-4" aria-hidden />}
        />
        <StatTile
          label="Risk level"
          value={risk.level}
          hint={
            summary.requires_manual_intervention
              ? "Someone should look at this"
              : "Safe to use downstream"
          }
          tone={risk.tone}
          icon={<AlertTriangle className="size-4" aria-hidden />}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Summary"
            description="The outcome exactly as the recovery service reported it."
            icon={<CheckCircle2 className="size-4" aria-hidden />}
            action={<Badge tone={risk.tone}>{risk.level} risk</Badge>}
          />

          <div className="space-y-4 p-5 sm:p-6">
            <p className="text-sm leading-relaxed text-ink-600">{risk.summary}</p>

            <dl className="divide-y divide-line rounded-xl border border-line">
              <ReportRow
                label="Processing completed"
                value={summary.is_successful ? "Yes" : "No"}
                tone={summary.is_successful ? "success" : "danger"}
              />
              <ReportRow
                label="Needs a person to review"
                value={summary.requires_manual_intervention ? "Yes" : "No"}
                tone={summary.requires_manual_intervention ? "warn" : "success"}
              />
              <ReportRow
                label="Matches internally consistent"
                value={validation.is_valid ? "Yes" : "No"}
                tone={validation.is_valid ? "success" : "warn"}
              />
              <ReportRow
                label="Fields matched twice"
                value={
                  validation.duplicate_canonical_fields.length === 0
                    ? "None"
                    : validation.duplicate_canonical_fields.join(", ")
                }
                tone={
                  validation.duplicate_canonical_fields.length === 0
                    ? "success"
                    : "danger"
                }
              />
              <ReportRow
                label="Incomplete matches"
                value={
                  validation.invalid_mappings.length === 0
                    ? "None"
                    : validation.invalid_mappings.join(", ")
                }
                tone={validation.invalid_mappings.length === 0 ? "success" : "danger"}
              />
            </dl>

            {validation.unresolved_headers.length > 0 ? (
              <ManualReviewList headers={validation.unresolved_headers} />
            ) : null}
          </div>
        </Card>

        <VerificationFindings verification={report.verification_result} />
      </div>
    </div>
  );
}

function ReportRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "success" | "warn" | "danger";
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-2.5">
      <dt className="text-[0.8125rem] text-ink-500">{label}</dt>
      <dd
        className={cn(
          "text-right text-[0.8125rem] font-medium",
          tone === "success" && "text-success-600",
          tone === "warn" && "text-warn-600",
          tone === "danger" && "text-danger-600",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function ManualReviewList({ headers }: { headers: string[] }) {
  return (
    <div className="rounded-xl border border-warn-100 bg-warn-50/60 p-4">
      <div className="flex items-center gap-2">
        <UserCheck className="size-4 text-warn-600" aria-hidden />
        <p className="text-sm font-medium text-warn-700">
          {headers.length} {pluralize(headers.length, "column")} needs a decision
        </p>
      </div>
      <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-600">
        These columns kept their original names in the rebuilt file. Rename them in the
        source system, or add them to the known names list so the next file matches
        automatically.
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {headers.map((header) => (
          <span
            key={header}
            className="rounded-md bg-warn-100 px-2 py-1 font-mono text-[0.6875rem] text-warn-700"
          >
            {header}
          </span>
        ))}
      </div>
    </div>
  );
}
