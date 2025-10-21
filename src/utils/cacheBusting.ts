// Cache busting utility for assets
const CACHE_BUSTING_PATTERNS = [
  // Pattern for hashed filenames (e.g., file.a1b2c3d4.js)
  /^[^.]+\.[a-f0-9]{8}\.(js|css|png|jpg|jpeg|gif|svg|ico|webp)$/i,
  
  // Pattern for versioned filenames (e.g., file.v1.2.3.js)
  /^[^.]+\.v\d+\.\d+\.\d+\.(js|css|png|jpg|jpeg|gif|svg|ico|webp)$/i,
  
  // Pattern for build timestamp filenames (e.g., file.20231010.js)
  /^[^.]+\.\d{8}\.(js|css|png|jpg|jpeg|gif|svg|ico|webp)$/i
];

/**
 * Checks if a URL matches cache busting patterns
 * @param url The URL to check
 * @returns boolean indicating if URL uses cache busting
 */
export function isCacheBusted(url: string): boolean {
  return CACHE_BUSTING_PATTERNS.some(pattern => pattern.test(url.split('/').pop() || ''));
}

/**
 * Generates a cache-busted URL
 * @param baseUrl The base URL
 * @param version Optional version string
 * @returns Cache-busted URL
 */
export function generateCacheBustedUrl(baseUrl: string, version?: string): string {
  if (version) {
    // Insert version before file extension
    return baseUrl.replace(/(\.[^.]+)$/, `.${version}$1`);
  }
  
  // Generate hash-based cache busting
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  const hash = `${timestamp}${random}`;
  
  return baseUrl.replace(/(\.[^.]+)$/, `.${hash}$1`);
}

/**
 * Applies cache control headers based on file type
 * @param filePath The file path
 * @returns Cache control headers
 */
export function getCacheControlHeaders(filePath: string): Record<string, string> {
  const headers: Record<string, string> = {};
  
  if (filePath.match(/\.(js|css)$/i)) {
    // JavaScript and CSS files - long-term cache
    headers['Cache-Control'] = 'public, max-age=31536000, immutable';
  } else if (filePath.match(/\.(png|jpg|jpeg|gif|svg|ico|webp)$/i)) {
    // Image files - long-term cache
    headers['Cache-Control'] = 'public, max-age=31536000, immutable';
  } else if (filePath.match(/\.(html)$/i)) {
    // HTML files - short cache
    headers['Cache-Control'] = 'public, max-age=3600';
  } else {
    // Other files - default cache
    headers['Cache-Control'] = 'public, max-age=86400';
  }
  
  return headers;
}