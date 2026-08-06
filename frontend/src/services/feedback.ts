import { siteConfig } from "@/lib/site";

/**
 * Feedback submission.
 *
 * Posts straight to the configured Formspree endpoint. Only the four form
 * fields are sent, plus a subject line and an empty honeypot that Formspree
 * uses to discard bots.
 */

export interface FeedbackInput {
  name: string;
  email: string;
  discovery: string;
  message: string;
  /** Honeypot. Real people leave this empty. */
  botTrap: string;
}

export class FeedbackError extends Error {}

const GENERIC_FAILURE =
  "We could not send that just now. Please try again in a moment.";

export async function submitFeedback(input: FeedbackInput): Promise<void> {
  if (!siteConfig.feedbackEndpoint) {
    throw new FeedbackError(GENERIC_FAILURE);
  }

  let response: Response;
  try {
    response = await fetch(siteConfig.feedbackEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: input.name.trim() || "Not provided",
        email: input.email.trim() || "Not provided",
        "How they found SchemaHealer": input.discovery,
        message: input.message.trim(),
        _subject: "SchemaHealer feedback",
        _gotcha: input.botTrap,
      }),
    });
  } catch {
    throw new FeedbackError(
      "We could not reach the feedback service. Check your connection and try again.",
    );
  }

  if (response.ok) return;

  throw new FeedbackError(await readFormspreeError(response));
}

/** Surface a field level message when Formspree returns one. */
async function readFormspreeError(response: Response): Promise<string> {
  try {
    const body: unknown = await response.json();
    if (body && typeof body === "object" && "errors" in body) {
      const errors = (body as { errors: unknown }).errors;
      if (Array.isArray(errors) && errors.length > 0) {
        const first = errors[0] as { message?: unknown };
        if (typeof first.message === "string" && first.message.trim()) {
          return first.message;
        }
      }
    }
  } catch {
    /* fall through to the generic message */
  }
  return GENERIC_FAILURE;
}
