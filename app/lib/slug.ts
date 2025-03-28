/**
 * Generates a URL-friendly slug from a video title and upload date
 */
export function generateVideoSlug(title: string, uploadedAt: string | Date): string {
  // Convert date to year
  const year = new Date(uploadedAt).getFullYear();

  // Get first 3 words from title
  const words = title
    .toLowerCase()
    // Replace special characters with spaces
    .replace(/[^\w\s-]/g, ' ')
    // Replace multiple spaces with single space
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .slice(0, 3);

  // Join words with hyphens and append year
  return `${words.join('-')}-${year}`;
}