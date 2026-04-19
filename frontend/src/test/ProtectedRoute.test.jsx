import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute.jsx';

// Mock useAuth hook
vi.mock('../context/useAuth.js', () => ({
  default: vi.fn(),
}));

import useAuth from '../context/useAuth.js';

const renderWithRouter = (ui, { initialEntries = ['/dashboard'] } = {}) =>
  render(<MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>);

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('megjelenik a tartalom ha a felhasználó be van jelentkezve', () => {
    useAuth.mockReturnValue({ user: { id: 1, nev: 'Teszt' }, loading: false });

    renderWithRouter(
      <ProtectedRoute>
        <div>Védett tartalom</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Védett tartalom')).toBeInTheDocument();
  });

  it('átirányít /login-ra ha nincs bejelentkezett felhasználó', () => {
    useAuth.mockReturnValue({ user: null, loading: false });

    renderWithRouter(
      <ProtectedRoute>
        <div>Védett tartalom</div>
      </ProtectedRoute>
    );

    // Átirányítás után a tartalom nem látható
    expect(screen.queryByText('Védett tartalom')).not.toBeInTheDocument();
  });

  it('spinner jelenik meg betöltés közben (nincs cached user)', () => {
    useAuth.mockReturnValue({ user: null, loading: true });

    renderWithRouter(
      <ProtectedRoute>
        <div>Védett tartalom</div>
      </ProtectedRoute>
    );

    expect(screen.queryByText('Védett tartalom')).not.toBeInTheDocument();
  });

  it('tartalom megjelenik betöltés közben ha van cached user', () => {
    useAuth.mockReturnValue({ user: { id: 1, nev: 'Teszt' }, loading: true });

    renderWithRouter(
      <ProtectedRoute>
        <div>Cached tartalom</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Cached tartalom')).toBeInTheDocument();
  });
});
