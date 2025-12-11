/**
 * Utilities for Chinese text processing and optimization
 */

// Chinese character ranges
const CHINESE_CHAR_RANGES = [
  [0x4e00, 0x9fff], // CJK Unified Ideographs
  [0x3400, 0x4dbf], // CJK Extension A
  [0x20000, 0x2a6df], // CJK Extension B
  [0x2a700, 0x2b73f], // CJK Extension C
  [0x2b740, 0x2b81f], // CJK Extension D
  [0x2b820, 0x2ceaf], // CJK Extension E
  [0x2ceb0, 0x2ebef], // CJK Extension F
  [0x30000, 0x3134f], // CJK Extension G
];

const PUNCTUATION_RANGES = [
  [0x3000, 0x303f], // CJK Symbols and Punctuation
  [0xff00, 0xffef], // Halfwidth and Fullwidth Forms
];

/**
 * Check if a character is Chinese
 */
export function isChineseChar(char: string): boolean {
  const code = char.codePointAt(0);
  if (!code) return false;
  
  return CHINESE_CHAR_RANGES.some(([start, end]) => start !== undefined && end !== undefined && code >= start && code <= end);
}

/**
 * Check if a character is Chinese punctuation
 */
export function isChinesePunctuation(char: string): boolean {
  const code = char.codePointAt(0);
  if (!code) return false;
  
  return PUNCTUATION_RANGES.some(([start, end]) => start !== undefined && end !== undefined && code >= start && code <= end);
}

/**
 * Calculate the percentage of Chinese characters in text
 */
export function getChineseRatio(text: string): number {
  if (!text) return 0;
  
  const chars = Array.from(text);
  const chineseChars = chars.filter(char => isChineseChar(char));
  
  return chineseChars.length / chars.length;
}

/**
 * Determine if text is primarily Chinese
 */
export function isPrimarilyChinese(text: string, threshold = 0.3): boolean {
  return getChineseRatio(text) >= threshold;
}

/**
 * Add proper spacing around English words in Chinese text
 */
export function addSpacingToMixedText(text: string): string {
  // Add space between Chinese and English characters
  return text
    .replace(/([\u4e00-\u9fff])([a-zA-Z0-9])/g, '$1 $2')
    .replace(/([a-zA-Z0-9])([\u4e00-\u9fff])/g, '$1 $2')
    // Clean up multiple spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Optimize text for better readability
 */
export function optimizeTextForDisplay(text: string): string {
  if (!text) return text;
  
  let optimized = text;
  
  // Add spacing for mixed content
  if (getChineseRatio(text) > 0.1 && getChineseRatio(text) < 0.9) {
    optimized = addSpacingToMixedText(optimized);
  }
  
  // Normalize punctuation
  optimized = optimized
    .replace(/，\s+/g, '，')
    .replace(/。\s+/g, '。')
    .replace(/；\s+/g, '；')
    .replace(/：\s+/g, '：')
    .replace(/？\s+/g, '？')
    .replace(/！\s+/g, '！');
  
  return optimized;
}

/**
 * Get appropriate CSS class for text content
 */
export function getTextClassName(text: string): string {
  const chineseRatio = getChineseRatio(text);
  
  if (chineseRatio >= 0.8) {
    return 'chinese-text';
  } else if (chineseRatio >= 0.1) {
    return 'mixed-content';
  }
  
  return '';
}

/**
 * Truncate text while preserving Chinese characters properly
 */
export function truncateText(text: string, maxLength: number, suffix = '...'): string {
  if (!text) return text;
  
  const chars = Array.from(text);
  if (chars.length <= maxLength) return text;
  
  // Find a good breaking point (prefer after punctuation or spaces)
  let breakPoint = maxLength;
  for (let i = maxLength - 1; i >= Math.max(0, maxLength - 10); i--) {
    const char = chars[i];
    if (char && (char === ' ' || isChinesePunctuation(char) || char === ',' || char === '.')) {
      breakPoint = i + 1;
      break;
    }
  }
  
  return chars.slice(0, breakPoint).join('') + suffix;
}

/**
 * Count display width of text (Chinese chars count as 2, others as 1)
 */
export function getDisplayWidth(text: string): number {
  if (!text) return 0;
  
  return Array.from(text).reduce((width, char) => {
    return width + (isChineseChar(char) ? 2 : 1);
  }, 0);
}

/**
 * Generate SEO-friendly slug from Chinese text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Replace Chinese punctuation with hyphens
    .replace(/[\u3000-\u303f\uff00-\uffef]/g, '-')
    // Replace spaces and other punctuation with hyphens
    .replace(/[\s\W]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Collapse multiple hyphens
    .replace(/-+/g, '-');
}

/**
 * Extract keywords from Chinese text for SEO
 */
export function extractChineseKeywords(text: string, maxKeywords = 10): string[] {
  if (!text) return [];
  
  // Simple keyword extraction - in a real app, you might use a proper Chinese NLP library
  const words = text
    .replace(/[^\u4e00-\u9fff\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length >= 2)
    .filter(word => getChineseRatio(word) > 0.5);
  
  // Count frequency
  const frequency: Record<string, number> = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  // Sort by frequency and return top keywords
  return Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word);
}

/**
 * Format Chinese date for display
 */
export function formatChineseDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format Chinese time for display
 */
export function formatChineseDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}