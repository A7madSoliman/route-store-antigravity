"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import { StorefrontIcon } from "@/components/icons/storefront-icons";

type ProductGalleryProps = {
  title: string;
  media: readonly string[];
};

export function ProductGallery({ title, media }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const controlRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const hasMultiple = media.length > 1;
  const selectedMedia = media[selectedIndex] ?? null;

  function select(index: number, focus = false) {
    const nextIndex = Math.max(0, Math.min(index, media.length - 1));
    setSelectedIndex(nextIndex);
    if (focus) controlRefs.current[nextIndex]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (!hasMultiple) return;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      select((selectedIndex + 1) % media.length, true);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      select((selectedIndex - 1 + media.length) % media.length, true);
    } else if (event.key === "Home") {
      event.preventDefault();
      select(0, true);
    } else if (event.key === "End") {
      event.preventDefault();
      select(media.length - 1, true);
    }
  }

  return (
    <div className="md:flex md:gap-4">
      {hasMultiple && (
        <div aria-label={`${title} image selection`} className="order-2 mt-3 flex justify-center gap-2 md:order-1 md:mt-0 md:w-20 md:flex-col" role="group">
          {media.map((source, index) => (
            <button
              aria-label={`Show image ${index + 1} of ${media.length} for ${title}`}
              aria-pressed={selectedIndex === index}
              className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-outline-subtle p-0 focus-visible:ring-2 focus-visible:ring-brand-primary md:rounded-md md:p-1"
              key={source}
              onClick={() => select(index)}
              onKeyDown={handleKeyDown}
              ref={(element) => { controlRefs.current[index] = element; }}
              type="button"
            >
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-current md:hidden" />
              <Image alt="" className="hidden h-9 w-9 rounded object-cover md:block md:h-16 md:w-16" height={64} src={source} width={64} />
            </button>
          ))}
        </div>
      )}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-surface-muted md:order-2 md:flex-1">
        {selectedMedia ? (
          <Image alt={title} className="object-cover" fill priority sizes="(max-width: 767px) 100vw, (max-width: 1279px) 58vw, 60vw" src={selectedMedia} />
        ) : (
          <div aria-hidden="true" className="flex h-full items-center justify-center text-text-secondary"><StorefrontIcon name="store" size={48} /></div>
        )}
      </div>
    </div>
  );
}
