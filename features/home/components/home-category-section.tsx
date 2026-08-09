import Image from "next/image";
import Link from "next/link";
import { StorefrontIcon } from "@/components/icons/storefront-icons";
import type { Category } from "@/types/category";
import { HomeSectionStateView, type HomeSectionState } from "./home-section-state";

export function HomeCategorySection({ state }: { state: HomeSectionState<Category> }) {
  if (state.status !== "ready") return <HomeSectionStateView state={state} title="Categories">{null}</HomeSectionStateView>;

  return (
    <>
      <section aria-labelledby="categories-title" className="py-12 md:py-16">
        <div className="mx-auto max-w-page-max px-gutter-mobile sm:px-gutter-tablet lg:px-gutter-desktop">
          <div className="flex items-end justify-between gap-4">
            <div><p className="text-caption font-medium uppercase tracking-[0.08em] text-text-muted">Discover</p><h2 className="mt-2 text-heading-2 text-text-primary" id="categories-title">Categories</h2></div>
            <Link className="min-h-11 inline-flex items-center text-button text-brand-primary" href="/categories">View all</Link>
          </div>
          <ul className="mt-6 flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:grid-rows-2 md:overflow-visible">
            {state.items.slice(0, 6).map((category, index) => (
              <li className={`min-w-[68vw] snap-start md:min-w-0 ${index >= 4 ? "md:hidden" : ""} ${index === 0 ? "md:col-span-2 md:row-span-2" : ""}`} key={category.id}>
                <Link className="group relative block min-h-52 overflow-hidden rounded-xl bg-surface-low focus-visible:ring-2 focus-visible:ring-brand-primary md:h-full" href={`/categories/${encodeURIComponent(category.id)}`}>
                  {category.imageUrl ? <Image alt={category.name} className="object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100" fill sizes="(max-width: 767px) 68vw, (max-width: 1023px) 24vw, 23vw" src={category.imageUrl} /> : <div aria-hidden="true" className="flex h-full min-h-52 items-center justify-center text-brand-primary"><StorefrontIcon name="categories" size={44} /></div>}
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-5 pt-12 text-heading-4 text-white">{category.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
