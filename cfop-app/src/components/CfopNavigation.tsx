import { Link, useLocation } from 'react-router-dom';
import 'bulma/css/bulma.min.css';

interface NavLink {
  path: string;
  label: string;
}

const navLinks: NavLink[] = [
  { path: '/2lk', label: '2LK' },
  { path: '/f2l', label: 'F2L' },
  { path: '/oll', label: 'OLL' },
  { path: '/pll', label: 'PLL' },
];

export function CfopNavigation() {
  const location = useLocation();

  return (
    <nav className="navbar is-light" role="navigation" aria-label="CFOP method navigation">
      <div className="container">
        <div className="navbar-menu is-active">
          <div className="navbar-start">
            {navLinks.map(({ path, label }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`navbar-item ${isActive ? 'is-active has-background-link has-text-white' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
