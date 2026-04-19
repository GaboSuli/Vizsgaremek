import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppLayout from '../components/AppLayout.jsx';

// Mock minden alkomponens amely hálózatot vagy contextet igényelne
vi.mock('../components/Sidebar.jsx', () => ({
  default: () => <aside data-testid="sidebar">Sidebar</aside>,
}));
vi.mock('../components/BottomNav.jsx', () => ({
  default: () => <nav data-testid="bottom-nav">BottomNav</nav>,
}));
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, Outlet: () => <div data-testid="outlet">Oldal tartalma</div> };
});

describe('AppLayout', () => {
  beforeEach(() => vi.clearAllMocks());

  it('rendereli a Sidebar-t', () => {
    render(<MemoryRouter><AppLayout /></MemoryRouter>);
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('rendereli a BottomNav-ot', () => {
    render(<MemoryRouter><AppLayout /></MemoryRouter>);
    expect(screen.getByTestId('bottom-nav')).toBeInTheDocument();
  });

  it('rendereli az Outlet-et (oldal tartalmát)', () => {
    render(<MemoryRouter><AppLayout /></MemoryRouter>);
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('app-shell CSS osztály megjelenik a gyökér elemen', () => {
    const { container } = render(<MemoryRouter><AppLayout /></MemoryRouter>);
    expect(container.querySelector('.app-shell')).toBeInTheDocument();
  });
});
