import { useState, type ImgHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

/**
 * Lazy image with a placeholder background, so layout does not jump and
 * nothing is downloaded until it is near the screen.
 */
export function Img({ className, wrapperClassName, ratio, alt, ...rest }: ImgHTMLAttributes<HTMLImageElement> & {
  wrapperClassName?: string; ratio?: string; alt: string;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={cn('relative overflow-hidden bg-board-2/10', wrapperClassName)} style={ratio ? { aspectRatio: ratio } : undefined}>
      <img loading="lazy" decoding="async" alt={alt} onLoad={() => setLoaded(true)}
        className={cn('h-full w-full object-cover transition-opacity duration-300', loaded ? 'opacity-100' : 'opacity-0', className)} {...rest} />
    </div>
  );
}
