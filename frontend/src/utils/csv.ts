/**
 * Minimal RFC 4180 CSV reader, used to preview the rebuilt file the service
 * returns. It only ever reads bytes the service produced. The browser never
 * builds a CSV of its own.
 */

/** Rows retained in memory for the preview table. */
export const PREVIEW_ROW_LIMIT = 5000;

export interface ParsedCsv {
  headers: string[];
  /** Retained rows, capped at {@link PREVIEW_ROW_LIMIT}. */
  rows: string[][];
  /** Total data rows in the file, including any beyond the retained cap. */
  totalRows: number;
  truncated: boolean;
}

export function parseCsv(text: string, rowLimit = PREVIEW_ROW_LIMIT): ParsedCsv {
  const records = readRecords(text, rowLimit + 1);
  const [headerRow, ...dataRows] = records.retained;

  const headers = headerRow ?? [];
  const totalRows = Math.max(records.total - 1, 0);
  const rows = dataRows.slice(0, rowLimit);

  return {
    headers,
    rows,
    totalRows,
    truncated: totalRows > rows.length,
  };
}

/**
 * Single-pass reader. Every record is counted so the preview can report an
 * accurate total, but only the first `retainLimit` records are kept.
 */
function readRecords(
  text: string,
  retainLimit: number,
): { retained: string[][]; total: number } {
  const retained: string[][] = [];
  let total = 0;

  let field = "";
  let record: string[] = [];
  let inQuotes = false;
  let hasContent = false;

  const pushField = () => {
    record.push(field);
    field = "";
  };

  const pushRecord = () => {
    pushField();
    // Ignore the trailing empty line most CSV writers emit.
    if (!hasContent && record.length === 1 && record[0] === "") {
      record = [];
      return;
    }
    total += 1;
    if (retained.length < retainLimit) retained.push(record);
    record = [];
    hasContent = false;
  };

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];

    if (inQuotes) {
      if (char === '"') {
        if (text[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      hasContent = true;
      continue;
    }

    switch (char) {
      case '"':
        inQuotes = true;
        hasContent = true;
        break;
      case ",":
        pushField();
        hasContent = true;
        break;
      case "\r":
        break;
      case "\n":
        pushRecord();
        break;
      default:
        field += char;
        hasContent = true;
    }
  }

  if (field !== "" || record.length > 0 || hasContent) {
    pushRecord();
  }

  return { retained, total };
}

/** Strip a UTF-8 BOM, which Excel exports routinely include. */
export function stripBom(text: string): string {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}
