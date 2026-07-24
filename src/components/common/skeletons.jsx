import { Skeleton } from "@/components/ui/skeleton";

/* ── Product card skeleton ── */
export function ProductTileSkeleton() {
  return (
    <div className="bg-white border border-[#e8e4de] flex flex-col">
      <Skeleton className="aspect-[3/4] w-full rounded-none bg-[#f0ede8]" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-16 rounded-none bg-[#f0ede8]" />
          <Skeleton className="h-3 w-12 rounded-none bg-[#f0ede8]" />
        </div>
        <Skeleton className="h-4 w-3/4 rounded-none bg-[#f0ede8]" />
        <Skeleton className="h-4 w-1/2 rounded-none bg-[#f0ede8]" />
        <Skeleton className="h-5 w-20 rounded-none bg-[#f0ede8]" />
        <Skeleton className="h-10 w-full rounded-none bg-[#f0ede8]" />
      </div>
    </div>
  );
}

/* ── Product grid skeleton (n cards) ── */
export function ProductGridSkeleton({ count = 8 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <ProductTileSkeleton key={i} />
      ))}
    </>
  );
}

/* ── Hero slider skeleton ── */
export function HeroSkeleton() {
  return (
    <div className="relative w-full h-[85vh] min-h-[500px] bg-[#1a1a1a] animate-pulse flex flex-col justify-center px-10 md:px-20">
      <Skeleton className="h-3 w-40 mb-4 rounded-none bg-white/10" />
      <Skeleton className="h-16 w-80 mb-3 rounded-none bg-white/10" />
      <Skeleton className="h-16 w-56 mb-6 rounded-none bg-white/10" />
      <Skeleton className="h-4 w-96 mb-2 rounded-none bg-white/10" />
      <Skeleton className="h-4 w-72 mb-8 rounded-none bg-white/10" />
      <div className="flex gap-4">
        <Skeleton className="h-12 w-36 rounded-none bg-white/10" />
        <Skeleton className="h-12 w-28 rounded-none bg-white/10" />
      </div>
    </div>
  );
}

/* ── Category card skeleton ── */
export function CategorySkeleton({ count = 5 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="aspect-[3/4] w-full rounded-none bg-[#f0ede8]" />
      ))}
    </>
  );
}

/* ── Brand card skeleton ── */
export function BrandSkeleton({ count = 6 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col items-center justify-center p-6 bg-white border border-[#e8e4de] gap-3">
          <Skeleton className="w-14 h-14 rounded-none bg-[#f0ede8]" />
          <Skeleton className="h-3 w-12 rounded-none bg-[#f0ede8]" />
        </div>
      ))}
    </>
  );
}

/* ── Order row skeleton ── */
export function OrderRowSkeleton({ count = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-5 border border-[#e8e4de] bg-[#faf9f7]">
          <div className="flex items-center gap-4">
            <Skeleton className="w-10 h-10 rounded-none bg-[#f0ede8]" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-24 rounded-none bg-[#f0ede8]" />
              <Skeleton className="h-4 w-32 rounded-none bg-[#f0ede8]" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Skeleton className="h-6 w-20 rounded-none bg-[#f0ede8]" />
            <Skeleton className="h-4 w-14 rounded-none bg-[#f0ede8]" />
            <Skeleton className="h-4 w-16 rounded-none bg-[#f0ede8]" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Address card skeleton ── */
export function AddressCardSkeleton({ count = 2 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-5 border border-[#e8e4de] space-y-3">
          <div className="flex gap-3">
            <Skeleton className="w-4 h-4 rounded-none bg-[#f0ede8] mt-0.5 flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4 rounded-none bg-[#f0ede8]" />
              <Skeleton className="h-3 w-1/2 rounded-none bg-[#f0ede8]" />
              <Skeleton className="h-3 w-1/3 rounded-none bg-[#f0ede8]" />
            </div>
          </div>
          <div className="flex gap-3 pt-2 border-t border-[#e8e4de]">
            <Skeleton className="h-3 w-10 rounded-none bg-[#f0ede8]" />
            <Skeleton className="h-3 w-14 rounded-none bg-[#f0ede8]" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Cart item skeleton ── */
export function CartItemSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-3 border-b border-[#f0ede8]">
          <Skeleton className="w-16 h-16 rounded-none bg-[#f0ede8] flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4 rounded-none bg-[#f0ede8]" />
            <Skeleton className="h-3 w-1/3 rounded-none bg-[#f0ede8]" />
            <Skeleton className="h-6 w-20 rounded-none bg-[#f0ede8]" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <Skeleton className="h-4 w-12 rounded-none bg-[#f0ede8]" />
            <Skeleton className="h-4 w-4 rounded-none bg-[#f0ede8]" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Product details dialog skeleton ── */
export function ProductDetailsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <Skeleton className="aspect-square w-full rounded-none bg-[#f0ede8]" />
      <div className="p-8 space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-20 rounded-none bg-[#f0ede8]" />
          <Skeleton className="h-3 w-16 rounded-none bg-[#f0ede8]" />
        </div>
        <Skeleton className="h-8 w-3/4 rounded-none bg-[#f0ede8]" />
        <Skeleton className="h-4 w-32 rounded-none bg-[#f0ede8]" />
        <Skeleton className="h-4 w-full rounded-none bg-[#f0ede8]" />
        <Skeleton className="h-4 w-5/6 rounded-none bg-[#f0ede8]" />
        <Skeleton className="h-10 w-28 rounded-none bg-[#f0ede8]" />
        <Skeleton className="h-12 w-full rounded-none bg-[#f0ede8]" />
      </div>
    </div>
  );
}
