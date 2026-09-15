import Link from "next/link";
import { currentProfile, signOut } from "@/auth";
import { CATEGORIES, categoryName } from "@/lib/categories";
import { rankProducts } from "@/lib/rank";
import { getT } from "@/lib/lang";
import { SearchBox } from "./SearchBox";
import { NavMenus, type MenuLink } from "./NavMenus";
import { UserMenu } from "./UserMenu";

export async function Header() {
  const T = await getT();
  const [me, month, all] = await Promise.all([
    currentProfile(),
    rankProducts({ scope: "month", limit: 5 }).catch(() => []),
    rankProducts({ scope: "all" }).catch(() => []),
  ]);
  const trending: MenuLink[] = month.map((r) => ({ href: `/p/${r.slug}`, label: r.name, num: `${T("reviews_n")} ${r.reviews} · ${T("comments_n")} ${r.comments}` }));
  const categories: MenuLink[] = CATEGORIES.map((c) => ({ href: `/c/${c.slug}`, label: categoryName(c.slug, T.lang) }));
  const categoryTop: MenuLink[] = CATEGORIES.flatMap((c) => {
    const top = all.find((r) => r.categories.includes(c.slug));
    return top ? [{ href: `/p/${top.slug}`, label: `${categoryName(c.slug, T.lang)} · ${top.name}`, num: `${T("reviews_n")} ${top.reviews}` }] : [];
  });

  return (
    <header className="header">
      <div className="container header__row">
        <Link className="logo" href="/" aria-label={T("home")}>
          <img src="/logo.svg" alt="" width={28} height={28} />
          Sidex
        </Link>
        <NavMenus trending={trending} categories={categories} categoryTop={categoryTop} />
        <div className="header__right">
          <SearchBox />
          {me ? (
            <>
              <Link className="btn btn--cta" href="/submit">{T("submit")}</Link>
              <UserMenu
                me={{ handle: me.handle, displayName: me.displayName, avatarUrl: me.avatarUrl }}
                logout={
                  <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
                    <button className="btn btn--ghost btn--sm" type="submit">{T("logout")}</button>
                  </form>
                }
              />
            </>
          ) : (
            <>
              <Link className="btn btn--ghost" href="/login">{T("login")}</Link>
              <Link className="btn btn--cta" href="/submit">{T("submit")}</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
