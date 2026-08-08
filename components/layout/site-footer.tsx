import Link from "next/link";
import { PageContainer } from "./page-container";
import { footerNavigation } from "./navigation";

export function SiteFooter() {
  return (
    <footer
      className="border-t border-outline-subtle bg-surface-low pb-[calc(var(--spacing-bottom-nav)+env(safe-area-inset-bottom))] md:pb-0"
      role="contentinfo"
    >
      <PageContainer className="py-10 md:py-12">
        <div className="hidden gap-12 md:grid md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link className="text-heading-4 font-semibold text-brand-primary" href="/">
              Nexa Store
            </Link>
            <p className="mt-3 max-w-xs text-body-small text-text-secondary">
              A clear, accessible storefront foundation.
            </p>
          </div>
          {footerNavigation.map((group) => (
            <div key={group.label}>
              <h2 className="text-body-small font-semibold text-text-primary">{group.label}</h2>
              <ul className="mt-3 space-y-2">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <Link className="inline-flex min-h-11 items-center text-body-small text-text-secondary hover:text-brand-primary" href={item.href}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="md:hidden">
          {footerNavigation.map((group) => (
            <details key={group.label} className="border-b border-outline-subtle last:border-b-0">
              <summary className="flex min-h-11 cursor-pointer items-center justify-between py-3 text-body-small font-semibold text-text-primary">
                {group.label}
                <span aria-hidden="true">+</span>
              </summary>
              <ul className="space-y-1 pb-3">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <Link className="inline-flex min-h-11 items-center text-body-small text-text-secondary" href={item.href}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>

        <p className="mt-8 border-t border-outline-subtle pt-5 text-caption text-text-muted">
          © Nexa Store
        </p>
      </PageContainer>
    </footer>
  );
}
