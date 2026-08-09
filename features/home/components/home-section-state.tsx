import type { ReactNode } from "react";

export type HomeSectionState<T> =
  | Readonly<{ status: "ready"; items: readonly T[] }>
  | Readonly<{ status: "empty"; items: readonly [] }>
  | Readonly<{ status: "error" }>;

type HomeSectionStateProps = {
  title: string;
  state: HomeSectionState<unknown>;
  children: ReactNode;
};

export function HomeSectionStateView({ title, state, children }: HomeSectionStateProps) {
  if (state.status === "ready") return children;

  return (
    <section aria-labelledby={`${title.toLowerCase().replaceAll(" ", "-")}-title`} className="py-12 md:py-16">
      <div className="mx-auto max-w-page-max px-gutter-mobile sm:px-gutter-tablet lg:px-gutter-desktop">
        <h2 className="text-heading-2 text-text-primary" id={`${title.toLowerCase().replaceAll(" ", "-")}-title`}>
          {title}
        </h2>
        <div
          aria-live="polite"
          className="mt-6 rounded-xl border border-outline-subtle bg-card px-6 py-8 text-center text-body-small text-text-secondary"
          role={state.status === "error" ? "alert" : "status"}
        >
          {state.status === "error"
            ? `We couldn't load ${title.toLowerCase()} right now.`
            : `No ${title.toLowerCase()} are available right now.`}
        </div>
      </div>
    </section>
  );
}

export function HomeSectionSkeleton({ label }: { label: string }) {
  return (
    <section aria-label={`Loading ${label}`} className="py-12 md:py-16" role="status">
      <div className="mx-auto max-w-page-max px-gutter-mobile sm:px-gutter-tablet lg:px-gutter-desktop">
        <div className="h-8 w-44 rounded-md bg-surface-high" />
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div className="h-44 rounded-xl bg-surface-low" key={index} />
          ))}
        </div>
        <span className="sr-only">Loading {label}</span>
      </div>
    </section>
  );
}
