import { PageContainer } from "@/components/layout/page-container";

export default function CheckoutLoading() {
  return (
    <PageContainer className="py-8 pb-[calc(var(--spacing-bottom-nav)+var(--spacing-16))] md:py-12 md:pb-16 animate-pulse">
      <div className="flex items-center gap-2 mb-6 md:mb-8">
        <div className="h-4 w-16 bg-slate-200 rounded" />
        <span className="text-slate-300">/</span>
        <div className="h-4 w-16 bg-slate-200 rounded" />
        <span className="text-slate-300">/</span>
        <div className="h-4 w-20 bg-slate-200 rounded" />
      </div>

      <div className="h-10 w-48 bg-slate-200 rounded mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="h-48 w-full bg-slate-200 rounded-xl" />
          <div className="h-48 w-full bg-slate-200 rounded-xl" />
        </div>
        <div className="lg:col-span-4">
          <div className="h-96 w-full bg-slate-200 rounded-xl" />
        </div>
      </div>
    </PageContainer>
  );
}
