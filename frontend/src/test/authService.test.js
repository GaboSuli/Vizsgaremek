import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, value) => { store[key] = String(value); }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    _store: store,
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// ── getStoredUserInfo ──────────────────────────────────────
describe('getStoredUserInfo (authService)', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.resetModules();
  });

  it('null-t ad vissza ha nincs tárolt user', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    const { getStoredUserInfo } = await import('../services/authService.js');
    expect(getStoredUserInfo()).toBeNull();
  });

  it('visszaadja a JSON-ként tárolt usert', async () => {
    const user = { id: 1, nev: 'Teszt Elek' };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(user));
    const { getStoredUserInfo } = await import('../services/authService.js');
    expect(getStoredUserInfo()).toEqual(user);
  });

  it('null-t ad vissza sérült JSON esetén', async () => {
    localStorageMock.getItem.mockReturnValue('{invalid json}');
    const { getStoredUserInfo } = await import('../services/authService.js');
    expect(getStoredUserInfo()).toBeNull();
  });
});

// ── isAuthenticated ────────────────────────────────────────
describe('isAuthenticated (authService)', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.resetModules();
  });

  it('false-t ad vissza ha nincs token', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    const { isAuthenticated } = await import('../services/authService.js');
    expect(isAuthenticated()).toBe(false);
  });

  it('true-t ad vissza ha van token', async () => {
    localStorageMock.getItem.mockReturnValue('valami-token');
    const { isAuthenticated } = await import('../services/authService.js');
    expect(isAuthenticated()).toBe(true);
  });
});
