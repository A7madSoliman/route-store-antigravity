import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
  footer?: ReactNode;
  headerAction?: ReactNode;
};

export function AuthShell({ children, footer, headerAction }: AuthShellProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <a className="sr-only absolute left-4 top-4 z-50 rounded-sm bg-card px-4 py-3 text-body-small font-semibold text-brand-primary focus:not-sr-only" href="#main-content">
        Skip to content
      </a>
      <header className="flex h-header-compact items-center justify-between border-b border-outline-subtle bg-card px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop" role="banner">
        <Link href="/" className="hover:opacity-80 cursor-pointer transition-opacity">
          <div className="text-heading-4 font-semibold tracking-tight text-brand-primary">Nexa Store</div>
        </Link>
        {headerAction ? <div className="flex items-center">{headerAction}</div> : null}
      </header>
      <main className="flex flex-1 items-start justify-center px-gutter-mobile py-8 md:items-center md:px-gutter-tablet md:py-12 lg:px-gutter-desktop" id="main-content">
        <section className="w-full max-w-[540px] rounded-none bg-transparent p-0 md:rounded-lg md:bg-card md:p-8 md:shadow-subtle lg:p-10">
          {children}
        </section>
      </main>
      {footer ? <footer className="px-gutter-mobile pb-8 text-center text-body-small text-text-muted md:px-gutter-tablet lg:px-gutter-desktop">{footer}</footer> : null}
    </div>
  );
}
