import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BottomNav from '../components/BottomNav.jsx';

vi.mock('../context/useAuth.js', () => ({
  default: vi.fn(),
}));

import useAuth from '../context/useAuth.js';

// CSS import mock
vi.mock('../components/BottomNav.css', () => ({}));

const renderNav = () =>
  render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <BottomNav />
    </MemoryRouter>
  );

describe('BottomNav — sima felhasználó', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ isAdmin: false, isModerator: false });
  });

  it('5 navigációs elemet jelenít meg', () => {
    renderNav();
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(5);
  });

  it('tartalmazza a Főoldal, Csoportok, Listák, Kuponok, Profil elemeket', () => {
    renderNav();
    expect(screen.getByText('Főoldal')).toBeInTheDocument();
    expect(screen.getByText('Csoportok')).toBeInTheDocument();
    expect(screen.getByText('Listák')).toBeInTheDocument();
    expect(screen.getByText('Kuponok')).toBeInTheDocument();
    expect(screen.getByText('Profil')).toBeInTheDocument();
  });

  it('a linkek helyes útvonalakra mutatnak', () => {
    renderNav();
    const links = screen.getAllByRole('link');
    const hrefs = links.map((l) => l.getAttribute('href'));
    expect(hrefs).toContain('/dashboard');
    expect(hrefs).toContain('/groups');
    expect(hrefs).toContain('/shopping');
    expect(hrefs).toContain('/kupon');
    expect(hrefs).toContain('/user');
  });

  it('nincs admin osztály a nav elemen', () => {
    renderNav();
    const nav = screen.getByRole('navigation');
    expect(nav.className).not.toContain('bottom-nav--admin');
  });
});

describe('BottomNav — admin felhasználó', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ isAdmin: true, isModerator: false });
  });

  it('admin elemeket tartalmaz (Admin, Statisztika)', () => {
    renderNav();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Statisztika')).toBeInTheDocument();
  });

  it('admin osztály jelenik meg a nav elemen', () => {
    renderNav();
    const nav = screen.getByRole('navigation');
    expect(nav.className).toContain('bottom-nav--admin');
  });

  it('az admin linke a /admin útvonalra mutat', () => {
    renderNav();
    const links = screen.getAllByRole('link');
    const hrefs = links.map((l) => l.getAttribute('href'));
    expect(hrefs).toContain('/admin');
  });

  it('Profil link mindig megjelenik adminnak is', () => {
    renderNav();
    expect(screen.getByText('Profil')).toBeInTheDocument();
  });
});

describe('BottomNav — moderátor felhasználó', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ isAdmin: false, isModerator: true });
  });

  it('moderátor kupon link megjelenik', () => {
    renderNav();
    expect(screen.getByText('Mod')).toBeInTheDocument();
  });

  it('pontosan 5 elemet jelenít meg (cap at 5)', () => {
    renderNav();
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(5);
  });
});
