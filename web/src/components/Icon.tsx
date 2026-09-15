/* One icon set for the whole site: 1.6px strokes on a 20px grid, currentColor. Brand marks (X, Threads) are their own paths. */
const PATHS: Record<string, React.ReactNode> = {
  link: <path d="M8.5 11.5a3.5 3.5 0 0 0 5 0l2.5-2.5a3.5 3.5 0 0 0-5-5l-1 1M11.5 8.5a3.5 3.5 0 0 0-5 0L4 11a3.5 3.5 0 0 0 5 5l1-1" />,
  check: <path d="M4 10.5l4 4 8-9" />,
  external: <path d="M8 4H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3M12 4h4v4M16 4l-7 7" />,
  arrowLeft: <path d="M12.5 4.5 7 10l5.5 5.5" />,
  arrowRight: <path d="M7.5 4.5 13 10l-5.5 5.5" />,
  chat: <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h7A2.5 2.5 0 0 1 16 5.5v6a2.5 2.5 0 0 1-2.5 2.5H8l-3.2 2.6c-.4.3-.8 0-.8-.5V5.5Z" />,
  close: <path d="M5 5l10 10M15 5 5 15" />,
  search: <path d="M9 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm7.5 2.5L13.3 13.3" />,
  x: <path fill="currentColor" stroke="none" d="M11.6 8.7 17.4 2h-1.4l-5 5.8L7 2H2.4l6.1 8.8L2.4 18h1.4l5.3-6.2L13.4 18H18l-6.4-9.3Zm-1.9 2.2-.6-.9L4.3 3h2.1l4 5.7.6.9 5.2 7.4h-2.1l-4.4-6.1Z" />,
  threads: <path fill="currentColor" stroke="none" d="M13.4 9.4a5 5 0 0 0-.2-.1c-.1-2.2-1.3-3.5-3.4-3.5-1.2 0-2.3.5-2.9 1.5l1.2.8c.4-.6 1-.8 1.7-.8 1 0 1.7.6 1.9 1.7-.6-.1-1.2-.2-1.9-.2-1.9.1-3.1 1.2-3.1 2.7.1 1.5 1.3 2.6 3 2.5 1.3-.1 2.5-.7 3-2.1.3-.9.3-1.6.3-2 .6.4 1 .9 1.2 1.5.4 1 .4 2.8-.9 4.1-1.2 1.1-2.6 1.6-4.6 1.6-2.3 0-4-.7-5.1-2.1-1-1.3-1.6-3.2-1.6-5.6 0-2.4.6-4.3 1.6-5.6C4.7 3.4 6.4 2.7 8.7 2.7c2.3 0 4.1.7 5.2 2.1.5.7.9 1.5 1.2 2.5l1.4-.4c-.3-1.2-.8-2.2-1.5-3.1C13.6 2.1 11.4 1.2 8.7 1.2c-2.7 0-4.9.9-6.3 2.7C1.1 5.4.4 7.6.4 10s.7 4.6 2 6.1c1.4 1.8 3.6 2.7 6.3 2.7 2.4 0 4.2-.7 5.6-2 1.8-1.8 1.8-4.1 1.2-5.5-.4-1-1.2-1.8-2.1-2.3Zm-3.7 3.5c-.9.1-1.7-.3-1.8-1 0-.6.4-1.2 1.8-1.3h.3c.6 0 1.1.1 1.6.2-.2 1.6-1 2-1.9 2.1Z" />,
};

export function Icon({ name, size = 16, className }: { name: keyof typeof PATHS; size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}
