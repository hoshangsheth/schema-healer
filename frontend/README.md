# SchemaHealer: Frontend

Marketing site and recovery workspace for the SchemaHealer service.

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4,
Framer Motion, TanStack Query and React Dropzone.

---

## Getting started

The frontend talks to the FastAPI service, so start the backend first. From
`schema-healer`:

```bash
python -m uvicorn backend.main:app --reload --port 8000
```

Then, from `schema-healer/frontend`:

```bash
npm install
```

```bash
cp .env.example .env.local
```

```bash
npm run dev
```

The app runs at `http://localhost:3000`. The landing page is at `/` and the
recovery workspace at `/app`.

### Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |

---

## Environment

All variables are documented in [`.env.example`](.env.example).

| Variable | Scope | Purpose |
| --- | --- | --- |
| `BACKEND_API_URL` | server | Base URL of the recovery service. Uploads are proxied here. |
| `BACKEND_TIMEOUT_MS` | server | Ceiling for a recovery request. The AI step can take a while, so keep this generous. |
| `NEXT_PUBLIC_MAX_UPLOAD_MB` | client | Upload size guard. |
| `NEXT_PUBLIC_SITE_URL` | client | Canonical URL used for page metadata. |
| `NEXT_PUBLIC_GITHUB_URL` | client | Optional. Renders a "GitHub" link when set. |
| `NEXT_PUBLIC_FEEDBACK_ENDPOINT` | client | Where the feedback form posts. Defaults to the project's Formspree form; set it blank to hide the section. |

Optional links render only when configured, so the shipped UI never contains a
dead placeholder link.

---

## Structure

```
src/
├── app/
│   ├── api/schema/validate/   POST proxy -> /schema/validate?output=json
│   ├── api/schema/export/     POST proxy -> /schema/validate?output=csv
│   ├── app/                   Recovery workspace
│   ├── layout.tsx             Fonts, metadata, providers, skip link
│   ├── providers.tsx          TanStack Query, MotionConfig, toasts
│   └── page.tsx               Landing page
├── components/
│   ├── landing/               Hero, comparison, features, steps, demo, about, FAQ
│   ├── feedback/              Help improve SchemaHealer form
│   ├── layout/                Site and app chrome
│   ├── upload/                Dropzone
│   ├── recovery/              Processing, status, timeline, mappings, comparison
│   ├── report/                Recovery report, verification findings
│   ├── preview/               Rebuilt file table and record cards
│   └── shared/                Buttons, cards, toasts, carousel, sticky bar
├── hooks/                     Recovery run, processing steps
├── lib/                       Motion vocabulary, API errors, presentation, server bridge
├── services/                  The only module that calls fetch
├── types/api.ts               Transport types mirroring the FastAPI contract
└── utils/                     CSV reader, file validation, formatting
```

---

## Backend integration

`src/types/api.ts` mirrors the FastAPI response contract exactly, including the
detail that `VerificationSeverity` is an `IntEnum` and therefore arrives as
`1 | 2 | 3` rather than a string. No field is invented, renamed or widened.

Components never call `fetch`. They use the TanStack Query hook in
`src/hooks/use-recovery-run.ts`, which calls `src/services/schema-healer.ts`,
which posts to the route handlers, which proxy to the backend.

### Design decisions

These are frontend changes only. The backend is untouched.

**1. Requests are proxied through route handlers.**
The service registers no CORS middleware, so a browser call from
`localhost:3000` to `localhost:8000` would be blocked, and fixing that would
mean changing the backend. Proxying through `src/app/api/schema` avoids the
problem, keeps the upstream address out of the client bundle, and gives one
place to normalise errors.

**2. A run makes two upstream requests, in parallel.**
`POST /schema/validate` returns either the JSON report or the rebuilt CSV,
selected by `?output=`. The results screen needs both: the report for the
summary and the mapping table, the CSV for the preview and the download. A
single user action therefore issues both requests concurrently, and the CSV is
held in memory and reused for the preview and the download, so the table shows
exactly the bytes the user saves and no extra export request is made.

The download blob is built from the raw response bytes rather than from decoded
text, so the saved file is byte for byte what the service produced.

If the backend later grows a flag that returns rows alongside the report, this
collapses to one request with no change to the components.

**3. Match strength is described, not scored.**
`SchemaMapping` exposes `recovery_method`, not a number. The similarity
threshold and the model's own confidence never reach the wire. Rather than
fabricate a percentage, the interface renders a three segment meter driven by
the method that resolved the column: known name, close match, or AI recovery.
See `src/lib/recovery-presentation.ts`.

**4. The processing view is honest about what it knows.**
There is no progress channel, so the step list advances on estimated timings,
waits on the final step while the request is still in flight, and only marks
steps complete once the response has arrived.

**5. Errors are normalised, never raw.**
Every failure becomes an `ApiErrorPayload` with a title and a next step
(`src/lib/api-error.ts`). Raw JSON, HTTP detail strings and stack traces are
never rendered. Covered cases: wrong file type, empty file, oversized file,
missing file, service unreachable, upstream timeout, upstream error, and
cancellation.

**6. Feedback posts directly to Formspree.**
The "Help improve SchemaHealer" form submits from the browser to the endpoint in
`NEXT_PUBLIC_FEEDBACK_ENDPOINT`, so feedback never passes through the recovery
service and no uploaded data is attached to it. Only the four form fields are
sent, plus a subject line and a honeypot field for spam. The section hides
itself when the endpoint is blank.

**7. The upload size limit is a frontend guard.**
The service imposes no limit. `NEXT_PUBLIC_MAX_UPLOAD_MB` (default 50) gives an
immediate, explainable rejection instead of a stalled request, and is enforced
again in the route handler.

---

## Touch and desktop layouts

Small screens get their own layout rather than a stacked copy of the desktop
one. Two mechanisms, chosen per surface:

- **Server rendered pages switch with CSS** (`lg:hidden` and its inverse), so
  the first paint is already correct and there is nothing to hydrate around.
- **The results screen switches with a media query** (`useIsDesktop`). It only
  exists after an upload, long after hydration, so it can pick one tree instead
  of rendering both.

What actually differs:

| Surface | Touch | Desktop |
| --- | --- | --- |
| Navigation | Slide out drawer, focus trapped, Escape to close | Inline links |
| Capabilities, comparison, testimonials, about | Swipe rails with position dots | Grids |
| How it works | One step open at a time | Timeline with a scroll linked rail |
| Results | Segmented control: Overview, Columns, Data | Single column, everything visible |
| Column mappings | One card per column, explanation on tap | Three column table with hover tooltips |
| Rebuilt file | Record cards, long fields behind a tap | Full table |
| Primary action | Pinned bar in the thumb zone | In place |

The swipe rails are CSS scroll snapping, not a drag library: momentum, rubber
banding and keyboard access come from the browser, and nothing runs on the main
thread while scrolling.

Tap targets are at least 44px on touch and tighten at `lg`. Form fields render
at 16px below the `md` breakpoint so iOS does not zoom on focus.

The desktop tooltip explaining how a column was matched depends on hover and
never opens on a touch screen, so the touch layout puts the same explanation
behind an info button on each card.

---

## Accessibility

- Skip link to `#main`, semantic landmarks, and one `h1` per view.
- Every interactive control is reachable and operable by keyboard. The dropzone
  exposes a real "Browse files" button rather than relying on drag alone.
- `aria-expanded` and `aria-controls` on the accordion and mobile menu,
  `role="tooltip"` with `aria-describedby`, `role="progressbar"` with value
  attributes, and a permanently mounted `aria-live` region for notifications.
- Reduced motion is honoured globally. `MotionConfig reducedMotion="user"`
  covers Framer Motion, and a `prefers-reduced-motion` block in `globals.css`
  stops the CSS background animations. Looping visuals settle on their final
  state instead of cycling.
- Focus outlines use the brand colour at a 2px offset on every focusable
  element.

---

## Performance notes

- Hover states, the condensed header and the match strength meters are CSS
  transitions rather than animated components, which keeps long result tables
  and the eight card feature grid cheap to render.
- Table rows are plain markup. Only entry level containers animate.
- The ambient background is CSS driven, so it costs nothing on the main thread
  and stops entirely under reduced motion.
- The preview keeps at most 5,000 rows in memory while still reporting the true
  row count, and says so when it is showing a subset.

---

## Known limitations

- The testimonial quotes in `src/components/landing/testimonials.tsx` are
  placeholder content. They are illustrative roles, not real customers, and no
  real person or company is named. Replace them with approved, attributed
  quotes before launch.
- A recovery run makes two upstream requests because one response cannot carry
  both the report and the rows. See design decision 2.
- There are no automated tests yet. Verification so far has been manual, run
  against the live service.
