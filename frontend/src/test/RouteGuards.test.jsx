import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminRoute from '../components/AdminRoute.jsx';
import ModeratorRoute from '../components/ModeratorRoute.jsx';
import PublicRoute from '../components/PublicRoute.jsx';

vi.mock('../context/useAuth.js', () => ({
  default: vi.fn(),
}));

import useAuth from '../context/useAuth.js';

const wrap = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('AdminRoute', () => {
  beforeEach(() => vi.clearAllMocks());

  it('megmutatja a tartalmat adminnak (jogosultsag_szint === 255)', () => {
    useAuth.mockReturnValue({ isAdmin: true, loading: false });
    wrap(<AdminRoute><div>Admin panel</div></AdminRoute>);
    expect(screen.getByText('Admin panel')).toBeInTheDocument();
  });

  it('átirányítja a sima felhasználót /dashboard-ra', () => {
    useAuth.mockReturnValue({ isAdmin: false, loading: false });
    wrap(<AdminRoute><div>Admin panel</div></AdminRoute>);
    expect(screen.queryByText('Admin panel')).not.toBeInTheDocument();
  });

  it('null-t render-el betöltés közben', () => {
    useAuth.mockReturnValue({ isAdmin: false, loading: true });
    const { container } = wrap(<AdminRoute><div>Admin panel</div></AdminRoute>);
    expect(container.firstChild).toBeNull();
  });
});

describe('ModeratorRoute', () => {
  beforeEach(() => vi.clearAllMocks());

  it('megmutatja a tartalmat moderátornak', () => {
    useAuth.mockReturnValue({ isModerator: true, loading: false });
    wrap(<ModeratorRoute><div>Mod panel</div></ModeratorRoute>);
    expect(screen.getByText('Mod panel')).toBeInTheDocument();
  });

  it('átirányítja a sima felhasználót', () => {
    useAuth.mockReturnValue({ isModerator: false, loading: false });
    wrap(<ModeratorRoute><div>Mod panel</div></ModeratorRoute>);
    expect(screen.queryByText('Mod panel')).not.toBeInTheDocument();
  });
});

describe('PublicRoute', () => {
  beforeEach(() => vi.clearAllMocks());

  it('megmutatja a tartalmat nem bejelentkezett látogatónak', () => {
    useAuth.mockReturnValue({ user: null, loading: false });
    wrap(<PublicRoute><div>Login form</div></PublicRoute>);
    expect(screen.getByText('Login form')).toBeInTheDocument();
  });

  it('átirányítja a bejelentkezett felhasználót /dashboard-ra', () => {
    useAuth.mockReturnValue({ user: { id: 1 }, loading: false });
    wrap(<PublicRoute><div>Login form</div></PublicRoute>);
    expect(screen.queryByText('Login form')).not.toBeInTheDocument();
  });

  it('megmutatja a tartalmat betöltés közben (optimisztikus)', () => {
    useAuth.mockReturnValue({ user: null, loading: true });
    wrap(<PublicRoute><div>Login form</div></PublicRoute>);
    expect(screen.getByText('Login form')).toBeInTheDocument();
  });
});
