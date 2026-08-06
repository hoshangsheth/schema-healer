"use client";

import { CheckCircle2, ShieldAlert } from "lucide-react";

import { cn } from "@/lib/cn";
import {
  FINDING_TITLES,
  SEVERITY_PRESENTATION,
  findingsBySeverity,
} from "@/lib/recovery-presentation";
import { VerificationSeverity, type VerificationResult } from "@/types/api";
import { Badge } from "@/components/shared/badge";
import { Card, CardHeader } from "@/components/shared/card";
import { EmptyState } from "@/components/shared/feedback";

/**
 * Verification output, finding by finding.
 *
 * Severity, category, affected columns and the message all come from the
 * service. The interface adds titles and colour, nothing more.
 */
export function VerificationFindings({
  verification,
}: {
  verification: VerificationResult;
}) {
  const findings = findingsBySeverity(verification.findings);

  return (
    <Card>
      <CardHeader
        title="Checks"
        description="Run against the rebuilt file before it is released."
        icon={<ShieldAlert className="size-4" aria-hidden />}
        action={
          <Badge tone={verification.is_dataset_verified ? "success" : "danger"}>
            {verification.is_dataset_verified ? "Passed" : "Failed"}
          </Badge>
        }
      />

      {findings.length === 0 ? (
        <EmptyState
          icon={<CheckCircle2 className="size-5 text-success-500" aria-hidden />}
          title="Nothing to flag"
          description="Every recovered column is present, nothing was left unmatched, and no field was claimed twice."
        />
      ) : (
        <ul className="divide-y divide-line">
          {findings.map((finding, index) => {
            const severity = SEVERITY_PRESENTATION[finding.severity];
            return (
              <li
                key={`${finding.type}-${index}`}
                className="space-y-3 px-5 py-4 sm:px-6"
              >
                <div className="flex flex-wrap items-center gap-2.5">
                  <Badge tone={severity.tone}>{severity.label}</Badge>
                  <p className="text-sm font-medium text-ink-900">
                    {FINDING_TITLES[finding.type]}
                  </p>
                </div>

                <p className="text-[0.875rem] leading-relaxed text-ink-600">
                  {finding.message}
                </p>

                {finding.affected_columns && finding.affected_columns.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {finding.affected_columns.map((column) => (
                      <span
                        key={column}
                        className={cn(
                          "rounded-md px-2 py-1 font-mono text-[0.6875rem]",
                          finding.severity === VerificationSeverity.ERROR
                            ? "bg-danger-50 text-danger-700"
                            : "bg-surface-2 text-ink-600",
                        )}
                      >
                        {column}
                      </span>
                    ))}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
