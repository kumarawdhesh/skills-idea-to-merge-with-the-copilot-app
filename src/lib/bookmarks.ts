export interface Bookmark {
  url: string;
  slug: string;
}

export const BOOKMARKS_STORAGE_KEY = 'mona-bookmarks';

const slugPattern = /^mona-[0-9A-Za-z]{4,10}$/;

export function normalizeUrl(input: string): string {
  const value = input.trim();
  if (!value) throw new Error('URL cannot be empty.');

  const scheme = /^([a-z][a-z\d+.-]*):/i.exec(value)?.[1];
  const hostWithPort = /^(?:\[[^\]]+\]|[^/:?#]+):\d+(?:[/?#]|$)/.test(value);
  if (scheme && !/^https?$/i.test(scheme) && !hostWithPort) {
    throw new Error('Only HTTP and HTTPS URLs are supported.');
  }

  const candidate = /^https?:/i.test(value) ? value : `https://${value}`;
  const url = new URL(candidate);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('Only HTTP and HTTPS URLs are supported.');
  }
  return url.href;
}

function parseBookmark(value: unknown): Bookmark | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;

  const candidate = value as Record<string, unknown>;
  if (typeof candidate.url !== 'string'
    || typeof candidate.slug !== 'string'
    || !slugPattern.test(candidate.slug)) {
    return null;
  }

  try {
    return {
      url: normalizeUrl(candidate.url),
      slug: candidate.slug,
    };
  } catch {
    return null;
  }
}

export function loadBookmarks(serialized: string | null): Bookmark[] {
  if (typeof serialized !== 'string' || serialized.trim() === '') return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(serialized);
  } catch {
    return [];
  }

  if (!Array.isArray(parsed)) return [];
  return parsed.flatMap((value): Bookmark[] => {
    const bookmark = parseBookmark(value);
    return bookmark ? [bookmark] : [];
  });
}

export function formatBookmark(bookmark: Bookmark): string {
  return `${bookmark.url} :: ${bookmark.slug}`;
}
