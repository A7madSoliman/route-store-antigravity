import type { ReactNode } from "react";

type ProductGridProps = {
  children: ReactNode;
  layout?: "default" | "catalog";
};

export function ProductGrid({ children, layout = "default" }: ProductGridProps) {
  return <ul aria-label="Products" className={`grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:gap-x-6 ${layout === "catalog" ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>{children}</ul>;
}

export function ProductGridSkeleton({ layout = "default" }: { layout?: "default" | "catalog" }) {
  return (
    <ul aria-hidden="true" className={`grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:gap-x-6 ${layout === "catalog" ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
      {Array.from({ length: 8 }, (_, index) => (
        <li key={index}>
          <div className="aspect-[4/5] rounded-xl bg-surface-low" />
          <div className="mt-3 h-3 w-20 rounded bg-surface-high" />
          <div className="mt-2 h-5 w-4/5 rounded bg-surface-high" />
          <div className="mt-3 h-4 w-2/5 rounded bg-surface-high" />
        </li>
      ))}
    </ul>
  );
}
