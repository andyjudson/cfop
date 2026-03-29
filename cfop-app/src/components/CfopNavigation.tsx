import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdAnimation, MdTimer, MdInfo, MdPsychology, MdLanguage, MdSchool, MdDarkMode, MdLightMode } from 'react-icons/md';
import 'bulma/css/bulma.min.css';
import { VisualizerModal } from './VisualizerModal';
import { PracticeSessionModal } from './PracticeSessionModal';
import { useTheme } from '../hooks/useTheme';

interface NavLink {
  path: string;
  label: string;
  icon?: React.ComponentType<{ size?: number }>;
  img?: string;
}

const BASE = import.meta.env.BASE_URL;

const navLinksPrimer: NavLink[] = [
  { path: '/about',     label: 'About',     icon: MdInfo },
  { path: '/notation',  label: 'Notation',  icon: MdLanguage },
  { path: '/intuitive', label: 'Intuitive', icon: MdPsychology },
  { path: '/2lk',       label: 'Beginner',  icon: MdSchool },
];

const navLinksAdvanced: NavLink[] = [
  { path: '/f2l', label: 'F2L', img: `${BASE}assets/cfop_f2l.png` },
  { path: '/oll', label: 'OLL', img: `${BASE}assets/cfop_oll.png` },
  { path: '/pll', label: 'PLL', img: `${BASE}assets/cfop_pll.png` },
];

export function CfopNavigation() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [showPractice, setShowPractice] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsMenuOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isMenuOpen]);

  const openVisualizer = () => {
    setShowPractice(false);
    setShowVisualizer(true);
    setIsMenuOpen(false);
  };

  const openPractice = () => {
    setShowVisualizer(false);
    setShowPractice(true);
    setIsMenuOpen(false);
  };

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
              className="cfop-theme-toggle"
              type="button"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              onClick={toggleTheme}
            >
              {theme === 'light' ? <MdDarkMode size={20} /> : <MdLightMode size={20} />}
            </button>
            <button
              className="cfop-theme-toggle"
              type="button"
              aria-label="Open algorithm visualizer"
              onClick={openVisualizer}
            >
              <MdAnimation size={20} />
            </button>
            <button
              className="cfop-theme-toggle"
              type="button"
              aria-label="Open practice timer"
              onClick={openPractice}
            >
              <MdTimer size={20} />
            </button>
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
              {navLinksPrimer.map(({ path, label, icon: Icon, img }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    className={`navbar-item cfop-navbar-link ${isActive ? 'is-active cfop-navbar-active' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {Icon && <Icon size={16} />}
                    {img && <img src={img} alt="" className="cfop-navbar-img-icon" />}
                    <span>{label}</span>
                  </Link>
                );
              })}
              <hr className="cfop-navbar-divider" />
              {navLinksAdvanced.map(({ path, label, icon: Icon, img }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    className={`navbar-item cfop-navbar-link ${isActive ? 'is-active cfop-navbar-active' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {Icon && <Icon size={16} />}
                    {img && <img src={img} alt="" className="cfop-navbar-img-icon" />}
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {showVisualizer && (
        <VisualizerModal onClose={() => setShowVisualizer(false)} />
      )}
      <PracticeSessionModal
        isOpen={showPractice}
        onClose={() => setShowPractice(false)}
      />
    </>
  );
}
