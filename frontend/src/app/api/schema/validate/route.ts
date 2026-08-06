import type { NextRequest } from "next/server";

import {
  errorResponse,
  forwardToBackend,
  readUploadedFile,
} from "@/lib/server/backend";

/**
 * `POST /api/schema/validate`
 *
 * Proxies an uploaded CSV to the backend's `POST /schema/validate?output=json`
 * and returns the `SchemaProcessingResponse` untouched.
 */
export async function POST(request: NextRequest): Promise<Response> {
  try {
    const file = await readUploadedFile(request);
    const upstream = await forwardToBackend(file, "json", request.signal);
    const payload: unknown = await upstream.json();

    return Response.json(payload, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
