import type { ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
  className?: string;
};

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-page-max px-gutter-mobile sm:px-gutter-tablet lg:px-gutter-desktop ${className}`}>
      {children}
    </div>
  );
}
