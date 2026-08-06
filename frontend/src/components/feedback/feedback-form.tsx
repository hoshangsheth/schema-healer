"use client";

import { useId, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Loader2, Send } from "lucide-react";

import { cn } from "@/lib/cn";
import { EASE_OUT, springSoft } from "@/lib/motion";
import { DISCOVERY_OPTIONS } from "@/lib/site";
import { useFeedbackSubmission } from "@/hooks/use-feedback-submission";
import { Button } from "@/components/shared/button";

const FIELD_CLASS =
  "h-10 w-full rounded-lg border border-line bg-surface-2 px-3 text-sm text-ink-800 placeholder:text-ink-400 transition-colors focus:border-brand-300 focus:bg-surface disabled:opacity-60";

export function FeedbackForm() {
  const ids = useId();
  const { submit, reset, isSubmitting, isSubmitted, errorMessage } =
    useFeedbackSubmission();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [discovery, setDiscovery] = useState("");
  const [message, setMessage] = useState("");
  const [botTrap, setBotTrap] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    // The browser enforces `required`, but a message of only spaces passes it.
    if (!message.trim()) {
      setValidationError("Add a short note before sending.");
      return;
    }

    setValidationError(null);
    submit({ name, email, discovery, message, botTrap });
  };

  const startOver = () => {
    reset();
    setName("");
    setEmail("");
    setDiscovery("");
    setMessage("");
    setValidationError(null);
  };

  const problem = validationError ?? errorMessage;

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springSoft}
        role="status"
        className="flex h-full flex-col items-start justify-center gap-3 rounded-card border border-success-100 bg-success-50/60 p-6"
      >
        <span className="flex size-10 items-center justify-center rounded-xl bg-success-100 text-success-700">
          <CheckCircle2 className="size-5" aria-hidden />
        </span>
        <div className="space-y-1">
          <p className="text-[0.9375rem] font-semibold tracking-[-0.01em] text-success-700">
            Thanks, that came through.
          </p>
          <p className="text-sm leading-relaxed text-ink-600">
            Every note gets read. If you left an email address and it needs a reply,
            you will get one.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={startOver}>
          Send another
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate={false} className="space-y-3.5">
      <div className="grid gap-3.5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label
            htmlFor={`${ids}-name`}
            className="block text-xs font-medium text-ink-600"
          >
            Name <span className="text-ink-400">(optional)</span>
          </label>
          <input
            id={`${ids}-name`}
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={isSubmitting}
            placeholder="Your name"
            className={FIELD_CLASS}
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor={`${ids}-email`}
            className="block text-xs font-medium text-ink-600"
          >
            Email <span className="text-ink-400">(optional)</span>
          </label>
          <input
            id={`${ids}-email`}
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isSubmitting}
            placeholder="you@company.com"
            className={FIELD_CLASS}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor={`${ids}-discovery`}
          className="block text-xs font-medium text-ink-600"
        >
          How did you discover SchemaHealer?{" "}
          <span className="text-danger-500" aria-hidden>
            *
          </span>
        </label>
        <select
          id={`${ids}-discovery`}
          name="discovery"
          required
          value={discovery}
          onChange={(event) => setDiscovery(event.target.value)}
          disabled={isSubmitting}
          className={cn(FIELD_CLASS, discovery ? "text-ink-800" : "text-ink-400")}
        >
          <option value="" disabled>
            Select an option
          </option>
          {DISCOVERY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor={`${ids}-message`}
          className="block text-xs font-medium text-ink-600"
        >
          Your feedback{" "}
          <span className="text-danger-500" aria-hidden>
            *
          </span>
        </label>
        <textarea
          id={`${ids}-message`}
          name="message"
          required
          rows={4}
          value={message}
          aria-invalid={validationError ? true : undefined}
          onChange={(event) => {
            setMessage(event.target.value);
            if (validationError) setValidationError(null);
          }}
          disabled={isSubmitting}
          placeholder="What worked, what did not, or what you wish it did."
          className={cn(FIELD_CLASS, "h-auto resize-y py-2.5 leading-relaxed")}
        />
      </div>

      {/* Honeypot. Hidden from people, tempting to bots. */}
      <div aria-hidden className="hidden">
        <label htmlFor={`${ids}-website`}>Leave this field empty</label>
        <input
          id={`${ids}-website`}
          name="_gotcha"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={botTrap}
          onChange={(event) => setBotTrap(event.target.value)}
        />
      </div>

      <AnimatePresence>
        {problem ? (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
            role="alert"
            className="flex items-start gap-2 overflow-hidden text-[0.8125rem] leading-relaxed text-danger-600"
          >
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            {problem}
          </motion.p>
        ) : null}
      </AnimatePresence>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <Button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          leadingIcon={
            isSubmitting ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Send className="size-4" aria-hidden />
            )
          }
        >
          {isSubmitting ? "Sending" : "Send feedback"}
        </Button>
        <p className="text-xs text-ink-400">
          No account needed. Nothing is shared beyond this form.
        </p>
      </div>
    </form>
  );
}
