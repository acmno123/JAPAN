import { useFurigana } from '@/context/FuriganaContext';

interface RubySegment {
  base: string;
  reading: string;
}

interface FuriganaTextProps {
  segments: RubySegment[];
  className?: string;
}

export function FuriganaText({ segments, className = '' }: FuriganaTextProps) {
  const { show } = useFurigana();
  return (
    <span className={className}>
      {segments.map((seg, i) => (
        <ruby key={i} className="ruby-furi">
          {seg.base}
          <rt
            className={`font-sans text-[0.42em] font-normal leading-none tracking-tight transition-all duration-200 ${
              show ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {seg.reading}
          </rt>
        </ruby>
      ))}
    </span>
  );
}
