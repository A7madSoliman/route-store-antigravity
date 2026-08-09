import { StorefrontIcon, type StorefrontIconName } from "@/components/icons/storefront-icons";

const benefits: ReadonlyArray<{ icon: StorefrontIconName; title: string; description: string }> = [
  { icon: "categories", title: "Browse categories", description: "Find a clear path into the catalog." },
  { icon: "store", title: "Explore brands", description: "Move through approved brand routes." },
  { icon: "search", title: "Discover products", description: "Review validated product information." },
  { icon: "devices", title: "Built for every screen", description: "Browse comfortably on phone, tablet, or desktop." },
];

export function HomeBenefitGrid() {
  return <section aria-labelledby="benefits-title" className="bg-surface-low py-12 md:py-16"><div className="mx-auto max-w-page-max px-gutter-mobile sm:px-gutter-tablet lg:px-gutter-desktop"><h2 className="text-heading-2 text-text-primary" id="benefits-title">A clearer way to browse</h2><ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{benefits.map((benefit) => <li className="rounded-xl bg-card p-6" key={benefit.title}><div aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-full bg-selection text-brand-primary"><StorefrontIcon name={benefit.icon} /></div><h3 className="mt-5 text-heading-4 text-text-primary">{benefit.title}</h3><p className="mt-2 text-body-small text-text-secondary">{benefit.description}</p></li>)}</ul></div></section>;
}
