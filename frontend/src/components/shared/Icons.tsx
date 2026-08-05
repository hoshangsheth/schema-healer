/**
 * Inline SVG icons.
 *
 * Kept in one file so the whole set shares sizing and stroke conventions
 * and the app pulls in no icon dependency. All icons are decorative and
 * marked `aria-hidden`; meaning is always carried by adjacent text.
 */

interface IconProps {
  className?: string;
}

const base = "h-5 w-5";

function Svg({
  className,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className ?? base}
    >
      {children}
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m5 13 4 4L19 7" />
    </Svg>
  );
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5" />
    </Svg>
  );
}

export function AlertTriangleIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M10.3 3.9 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </Svg>
  );
}

export function XCircleIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15 9-6 6M9 9l6 6" />
    </Svg>
  );
}

export function SparklesIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3.5 13.6 8 18 9.6 13.6 11.2 12 15.7 10.4 11.2 6 9.6 10.4 8 12 3.5Z" />
      <path d="M18.5 15.5 19.2 17.4 21 18.1 19.2 18.8 18.5 20.7 17.8 18.8 16 18.1 17.8 17.4 18.5 15.5Z" />
    </Svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3 5 6v5.5c0 4.2 2.9 8.1 7 9.5 4.1-1.4 7-5.3 7-9.5V6l-7-3Z" />
      <path d="m9.5 12 1.8 1.8 3.4-3.6" />
    </Svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l2.75 1.75" />
    </Svg>
  );
}

export function WandIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m4 20 10-10" />
      <path d="m14.5 4.5 1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z" />
      <path d="m19 12 .7 1.4 1.4.6-1.4.6-.7 1.4-.7-1.4-1.4-.6 1.4-.6.7-1.4Z" />
    </Svg>
  );
}

export function EyeIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.75" />
    </Svg>
  );
}

export function UploadIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 16V4" />
      <path d="m7.5 8.5 4.5-4.5 4.5 4.5" />
      <path d="M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15" />
    </Svg>
  );
}

export function FileIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M13.5 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5L13.5 3Z" />
      <path d="M13.5 3v5.5H19" />
    </Svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4.5 12h15" />
      <path d="m13.5 6 6 6-6 6" />
    </Svg>
  );
}

export function ArrowDownIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 4.5v15" />
      <path d="m6 13.5 6 6 6-6" />
    </Svg>
  );
}

export function RefreshIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M20 11a8 8 0 0 0-13.7-5.2L4 8" />
      <path d="M4 4v4h4" />
      <path d="M4 13a8 8 0 0 0 13.7 5.2L20 16" />
      <path d="M20 20v-4h-4" />
    </Svg>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 4v12" />
      <path d="m7.5 11.5 4.5 4.5 4.5-4.5" />
      <path d="M4 18.5V19a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-.5" />
    </Svg>
  );
}

export function PlugIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M9 3v6" />
      <path d="M15 3v6" />
      <path d="M6 9h12v2a6 6 0 0 1-6 6 6 6 0 0 1-6-6V9Z" />
      <path d="M12 17v4" />
    </Svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m6 9.5 6 6 6-6" />
    </Svg>
  );
}

export function LogoMark({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect width="32" height="32" rx="9" fill="url(#schemahealer-logo)" />
      <path
        d="M10 11.5h5.5M10 16h12M16.5 20.5H22"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M19.5 11.5 22 9M12.5 20.5 10 23"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.65"
      />
      <defs>
        <linearGradient
          id="schemahealer-logo"
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#6d28d9" />
        </linearGradient>
      </defs>
    </svg>
  );
}
