/* Profile picture. Without an uploaded picture the default mark is shown, the same blue figure
   every member starts with. */
export function Avatar({ profile, size }: { profile: { displayName: string; avatarUrl: string } | null; size?: "lg" | "xl" }) {
  const cls = "avatar" + (size ? ` avatar--${size}` : "");
  const name = profile?.displayName || "회원";
  if (profile?.avatarUrl) return <img className={cls} src={profile.avatarUrl} alt={name} referrerPolicy="no-referrer" />;
  return (
    <span className={cls + " avatar--default"} role="img" aria-label={name}>
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#aecbfa" />
        <circle cx="20" cy="15.5" r="6.5" fill="#4d8be6" />
        <path d="M8 33.5c1.6-6.4 6.3-9.5 12-9.5s10.4 3.1 12 9.5A20 20 0 0 1 8 33.5z" fill="#4d8be6" />
      </svg>
    </span>
  );
}
