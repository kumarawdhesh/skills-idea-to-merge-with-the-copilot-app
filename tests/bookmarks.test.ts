import assert from 'node:assert/strict';
import test from 'node:test';
import {
  formatBookmark,
  loadBookmarks,
  normalizeUrl,
} from '../src/lib/bookmarks.ts';

test('normalizes URLs with and without https:// to the same value', () => {
  assert.equal(normalizeUrl('www.example.com'), normalizeUrl('https://www.example.com'));
  assert.equal(normalizeUrl('www.example.com'), 'https://www.example.com/');
});

test('recovers gracefully from empty, corrupted, legacy, and non-array storage', () => {
  assert.deepEqual(loadBookmarks(null), []);
  assert.deepEqual(loadBookmarks(''), []);
  assert.deepEqual(loadBookmarks('{corrupted'), []);
  assert.deepEqual(loadBookmarks('{"url":"https://example.com"}'), []);

  const legacy = JSON.stringify([
    { url: 'example.com', slug: 'mona-7fk2ab' },
    { url: 'javascript:alert(1)', slug: 'mona-bad1' },
    { url: 'https://example.com', slug: 'not-a-mona-slug' },
    null,
  ]);
  assert.deepEqual(loadBookmarks(legacy), [
    { url: 'https://example.com/', slug: 'mona-7fk2ab' },
  ]);
});

test('formats a bookmark with the exact visible separator', () => {
  assert.equal(
    formatBookmark({ url: 'https://www.example.com', slug: 'mona-7fk2' }),
    'https://www.example.com :: mona-7fk2',
  );
});
