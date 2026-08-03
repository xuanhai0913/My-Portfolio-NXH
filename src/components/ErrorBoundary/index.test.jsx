import { canRetryChunkReload, isChunkLoadError } from './index';

describe('ErrorBoundary chunk recovery helpers', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  test.each([
    { name: 'ChunkLoadError', message: 'Loading chunk 42 failed.' },
    { name: 'ChunkLoadError', message: 'Loading CSS chunk 42 failed.' },
    { name: 'TypeError', message: 'Failed to fetch dynamically imported module' },
  ])('recognizes stale bundle error: $message', (error) => {
    expect(isChunkLoadError(error)).toBe(true);
  });

  test('does not classify an ordinary component error as a stale bundle error', () => {
    expect(isChunkLoadError(new Error('Cannot read properties of undefined'))).toBe(false);
  });

  test('only permits one automatic reload in a browser tab', () => {
    expect(canRetryChunkReload()).toBe(true);
    expect(canRetryChunkReload()).toBe(false);
  });
});
