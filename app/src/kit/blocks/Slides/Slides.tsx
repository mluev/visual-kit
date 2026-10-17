import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import type { BlockProps } from '@/kit/types';
import { Block } from '@/kit/Block';
import { cn } from '@/kit/lib/utils';
import { BlockCard, Meter } from '@/kit/primitives/BlockCard';
import { Button } from '@/kit/primitives/Button';

const LAYOUT: Record<BlockProps<'Slides'>['slides'][number]['layout'], string> = {
  center: 'mx-auto w-full max-w-[720px] justify-center',
  stack: 'mx-auto w-full max-w-[860px]',
  columns: 'grid-cols-1 @3xl:grid-cols-2',
  'columns-3': 'grid-cols-1 @3xl:grid-cols-3',
};

export function Slides({ title, description, startLabel, slides }: BlockProps<'Slides'>) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const startRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const last = index === slides.length - 1;
  const slide = slides[index];
  const columns = slide.layout === 'columns' || slide.layout === 'columns-3';

  const close = () => {
    setOpen(false);
    startRef.current?.focus();
  };
  const go = (to: number) => setIndex(Math.max(0, Math.min(slides.length - 1, to)));

  useEffect(() => {
    if (!open) return;
    dialogRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    // Let nested inputs keep their own arrow keys
    const typing = (e.target as HTMLElement).closest('input, textarea, select, [contenteditable="true"]');
    if (e.key === 'Escape') close();
    else if (!typing && e.key === 'ArrowRight') go(index + 1);
    else if (!typing && e.key === 'ArrowLeft') go(index - 1);
  };

  return (
    <BlockCard tone="violet" pill="Slides" title={title} aside={<span className="text-sm font-bold text-ink-3">{slides.length} {slides.length === 1 ? 'slide' : 'slides'}</span>} showReview={false}>
      {description && <p className="m-0 text-base leading-normal text-ink-2">{description}</p>}
      <div>
        <Button ref={startRef} onClick={() => setOpen(true)}>
          {index > 0 ? 'Resume' : startLabel}
        </Button>
      </div>
      {open &&
        createPortal(
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            onKeyDown={onKeyDown}
            data-tone="violet"
            className="@container fixed inset-0 z-50 flex flex-col bg-page text-ink outline-none animate-in fade-in"
          >
            <header className="flex items-center justify-between gap-3 bg-surface px-6 py-4 shadow-[0_1px_2px_rgba(20,22,30,.06)]">
              <h2 className="m-0 min-w-0 truncate font-display text-xl font-bold tracking-[-.01em]">{title}</h2>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-sm font-bold text-ink-3">{index + 1} / {slides.length}</span>
                <Button variant="plain" size="sm" onClick={close} aria-label="Close slides">✕</Button>
              </div>
            </header>
            <Meter value={(index + 1) / slides.length} className="rounded-none" />
            <main key={index} className="flex-1 overflow-y-auto px-6 py-8 animate-in fade-in">
              <div className="mx-auto flex min-h-full w-full max-w-[1200px] flex-col gap-6">
                {slide.title && <h3 className="m-0 text-center font-display text-3xl leading-tight font-bold tracking-[-.02em] text-balance">{slide.title}</h3>}
                <div className={cn('flex flex-1 flex-col gap-4', columns && 'grid content-start', LAYOUT[slide.layout])}>
                  {slide.blocks.map((b, i) => (
                    <Block key={b.id ?? i} type={b.type} id={b.id} props={b.props} />
                  ))}
                </div>
              </div>
            </main>
            <footer className="flex items-center justify-between gap-3 bg-surface px-6 py-4">
              <Button variant="soft" onClick={() => go(index - 1)} disabled={index === 0}>← Back</Button>
              <Button variant="ink" onClick={() => {
                if (!last) return go(index + 1);
                setIndex(0);
                close();
              }}>{last ? 'Done' : 'Next →'}</Button>
            </footer>
          </div>,
          document.body,
        )}
    </BlockCard>
  );
}
