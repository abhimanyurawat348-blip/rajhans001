// Security headers configuration
export const securityHeaders = {
  // Prevent browsers from incorrectly detecting non-scripts as scripts
  'X-Content-Type-Options': 'nosniff',
  
  // Basic Content Security Policy
  'Content-Security-Policy': "default-src 'self'; frame-ancestors 'self';",
  
  // Remove deprecated headers
  'X-Frame-Options': null, // Replaced by CSP frame-ancestors
  'X-XSS-Protection': null, // Deprecated and can cause issues
  'Pragma': null, // Deprecated
  'Expires': null, // Replaced by Cache-Control
  
  // Proper cache control
  'Cache-Control': 'public, max-age=31536000, immutable'
};

// Function to apply security headers to a response
export function applySecurityHeaders(headers: Record<string, string | null>): Record<string, string> {
  const result: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(headers)) {
    // Skip null values (headers to be removed)
    if (value !== null) {
      result[key] = value;
    }
  }
  
  return result;
}