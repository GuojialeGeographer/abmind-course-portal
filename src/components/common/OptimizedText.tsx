import React from 'react';
import { getTextClassName, optimizeTextForDisplay } from '@/lib/chinese-utils';
import { cn } from '@/lib/utils';

interface OptimizedTextProps {
  children: string;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  optimize?: boolean;
}

/**
 * Component that automatically optimizes text rendering for Chinese content
 */
export function OptimizedText({ 
  children, 
  className, 
  as: Component = 'span',
  optimize = true 
}: OptimizedTextProps) {
  const text = optimize ? optimizeTextForDisplay(children) : children;
  const textClassName = getTextClassName(text);
  
  return (
    <Component className={cn(textClassName, className)}>
      {text}
    </Component>
  );
}

interface OptimizedHeadingProps {
  children: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  optimize?: boolean;
}

/**
 * Optimized heading component for Chinese content
 */
export function OptimizedHeading({ 
  children, 
  level, 
  className, 
  optimize = true 
}: OptimizedHeadingProps) {
  const Component = `h${level}` as keyof React.JSX.IntrinsicElements;
  const text = optimize ? optimizeTextForDisplay(children) : children;
  const textClassName = getTextClassName(text);
  
  return (
    <Component className={cn(textClassName, className)}>
      {text}
    </Component>
  );
}

interface OptimizedParagraphProps {
  children: string;
  className?: string;
  optimize?: boolean;
}

/**
 * Optimized paragraph component for Chinese content
 */
export function OptimizedParagraph({ 
  children, 
  className, 
  optimize = true 
}: OptimizedParagraphProps) {
  const text = optimize ? optimizeTextForDisplay(children) : children;
  const textClassName = getTextClassName(text);
  
  return (
    <p className={cn(textClassName, 'leading-relaxed', className)}>
      {text}
    </p>
  );
}