import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bulma/css/bulma.min.css';

interface NavLink {
  path: string;
  label: string;
}

const navLinks: NavLink[] = [
  { path: '/about', label: 'About' },
  { path: '/notation', label: 'Notation' },
  { path: '/intuitive', label: 'Intuitive' },
  { path: '/2lk', label: 'Beginner' },
  { path: '/f2l', label: 'F2L' },
  { path: '/oll', label: 'OLL' },
  { path: '/pll', label: 'PLL' },
];

export function CfopNavigation() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsMenuOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isMenuOpen]);

  return (
    <>
      {isMenuOpen && (
        <div
          className="cfop-nav-backdrop"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      <nav className="navbar is-light cfop-navbar" role="navigation" aria-label="CFOP method navigation">
        <div className="container">
          <div className="navbar-brand">
            <button
              className={`navbar-burger ${isMenuOpen ? 'is-active' : ''}`}
              aria-label="Toggle navigation"
              aria-expanded={isMenuOpen}
              aria-controls="cfop-navbar-menu"
              onClick={() => setIsMenuOpen(prev => !prev)}
              type="button"
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>
          </div>
          <div id="cfop-navbar-menu" className={`navbar-menu ${isMenuOpen ? 'is-active' : ''}`}>
            <div className="navbar-start">
              {navLinks.map(({ path, label }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    className={`navbar-item ${isActive ? 'is-active cfop-navbar-active' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
