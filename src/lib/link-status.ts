// Link status checking utilities

export type LinkStatus = 'available' | 'unavailable' | 'checking' | 'unknown';

interface LinkCheckResult {
  url: string;
  status: LinkStatus;
  statusCode?: number;
  error?: string;
  checkedAt: Date;
}

// In-memory cache for link status
const linkStatusCache = new Map<string, LinkCheckResult>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Check if a URL is in cache and still valid
function getCachedStatus(url: string): LinkCheckResult | null {
  const cached = linkStatusCache.get(url);
  if (!cached) return null;
  
  const now = new Date();
  const cacheAge = now.getTime() - cached.checkedAt.getTime();
  
  if (cacheAge > CACHE_DURATION) {
    linkStatusCache.delete(url);
    return null;
  }
  
  return cached;
}

// Store link status in cache
function setCachedStatus(result: LinkCheckResult): void {
  linkStatusCache.set(result.url, result);
}

// Check link status using fetch (client-side only)
export async function checkLinkStatus(url: string): Promise<LinkCheckResult> {
  // Check cache first
  const cached = getCachedStatus(url);
  if (cached) {
    return cached;
  }

  const result: LinkCheckResult = {
    url,
    status: 'checking',
    checkedAt: new Date(),
  };

  try {
    // Use a HEAD request to check if the resource exists without downloading it
    const response = await fetch(url, {
      method: 'HEAD',
      mode: 'no-cors', // Handle CORS issues
      cache: 'no-cache',
    });

    if (response.ok) {
      result.status = 'available';
      result.statusCode = response.status;
    } else {
      result.status = 'unavailable';
      result.statusCode = response.status;
      result.error = `HTTP ${response.status}`;
    }
  } catch (error) {
    // Many external sites block HEAD requests or have CORS issues
    // In these cases, we'll assume the link is available unless we have specific error info
    if (error instanceof TypeError && error.message.includes('CORS')) {
      result.status = 'unknown'; // Can't verify due to CORS, assume available
    } else {
      result.status = 'unavailable';
      result.error = error instanceof Error ? error.message : 'Unknown error';
    }
  }

  setCachedStatus(result);
  return result;
}

// Batch check multiple links
export async function checkMultipleLinkStatus(urls: string[]): Promise<Map<string, LinkCheckResult>> {
  const results = new Map<string, LinkCheckResult>();
  
  // Check cache first
  const urlsToCheck: string[] = [];
  for (const url of urls) {
    const cached = getCachedStatus(url);
    if (cached) {
      results.set(url, cached);
    } else {
      urlsToCheck.push(url);
    }
  }

  // Check remaining URLs in parallel
  if (urlsToCheck.length > 0) {
    const promises = urlsToCheck.map(url => checkLinkStatus(url));
    const checkResults = await Promise.allSettled(promises);
    
    checkResults.forEach((result, index) => {
      const url = urlsToCheck[index];
      if (url && result.status === 'fulfilled') {
        results.set(url, result.value);
      } else if (url) {
        // Handle promise rejection
        const errorResult: LinkCheckResult = {
          url,
          status: 'unavailable',
          error: result.status === 'rejected' ? (result.reason?.message || 'Check failed') : 'Unknown error',
          checkedAt: new Date(),
        };
        setCachedStatus(errorResult);
        results.set(url, errorResult);
      }
    });
  }

  return results;
}

// Get fallback content suggestions for unavailable links
export function getFallbackContent(url: string, type?: string): string {
  const domain = extractDomain(url);
  
  if (type === 'slides' || url.includes('.pdf') || url.includes('slides')) {
    return `课件暂时无法访问，请联系讲师获取 ${domain} 的替代资源`;
  }
  
  if (type === 'code_repo' || url.includes('github.com') || url.includes('gitlab.com')) {
    return `代码仓库暂时无法访问，请尝试访问 ${domain} 或联系作者`;
  }
  
  if (type === 'recording' || url.includes('video') || url.includes('recording')) {
    return `录像暂时无法访问，请联系讲师获取 ${domain} 的替代链接`;
  }
  
  return `资源暂时无法访问，请稍后重试或联系管理员`;
}

// Extract domain from URL for display
function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return 'unknown';
  }
}

// Hook for React components to use link status checking
export function useLinkStatus(url: string) {
  const [status, setStatus] = useState<LinkStatus>('unknown');
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (!url) return;

    const cached = getCachedStatus(url);
    if (cached) {
      setStatus(cached.status);
      return;
    }

    setIsChecking(true);
    checkLinkStatus(url)
      .then(result => {
        setStatus(result.status);
      })
      .catch(() => {
        setStatus('unavailable');
      })
      .finally(() => {
        setIsChecking(false);
      });
  }, [url]);

  return { status, isChecking };
}

// React hook import (will be available when used in components)
import { useState, useEffect } from 'react';