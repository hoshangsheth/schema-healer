import type { NextRequest } from "next/server";

import {
  errorResponse,
  forwardToBackend,
  readUploadedFile,
} from "@/lib/server/backend";

/**
 * `POST /api/schema/export`
 *
 * Proxies an uploaded CSV to the backend's `POST /schema/validate?output=csv`
 * and streams the recovered dataset straight back.
 *
 * The bytes are produced entirely by the backend's `RecoveredCsvExporter`; the
 * front end never assembles a CSV of its own. The same body is reused for the
 * on-screen dataset preview and for the download, so what the user sees is
 * exactly what they save.
 */
export async function POST(request: NextRequest): Promise<Response> {
  try {
    const file = await readUploadedFile(request);
    const upstream = await forwardToBackend(file, "csv", request.signal);

    return new Response(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": upstream.headers.get("content-type") ?? "text/csv",
        "Content-Disposition":
          upstream.headers.get("content-disposition") ??
          'attachment; filename="recovered_dataset.csv"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
