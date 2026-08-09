import Link from "next/link";

export function Breadcrumbs() {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-body-small text-text-secondary">
        <li><Link className="rounded-sm focus-visible:ring-2 focus-visible:ring-brand-primary" href="/">Home</Link></li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" className="text-text-primary">Products</li>
      </ol>
    </nav>
  );
}
