import Link from "next/link";

export type BreadcrumbItem = Readonly<{
  label: string;
  href?: string;
}>;

export function Breadcrumbs({ items }: { items: readonly [BreadcrumbItem, ...BreadcrumbItem[]] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-body-small text-text-secondary">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li className="flex items-center gap-2" key={`${item.label}-${index}`}>
              {index > 0 && <span aria-hidden="true">/</span>}
              {isCurrent ? (
                <span aria-current="page" className="text-text-primary">{item.label}</span>
              ) : (
                <Link className="rounded-sm focus-visible:ring-2 focus-visible:ring-brand-primary" href={item.href ?? "/"}>{item.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
