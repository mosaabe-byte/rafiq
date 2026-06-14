import { NavLink, Outlet } from 'react-router-dom';
import {
  IconLayoutGrid,
  IconCirclePlus,
  IconRoute,
  IconVocabulary,
  IconUserCircle,
} from '@tabler/icons-react';
import './Layout.css';

const navItems = [
  { to: '/', label: 'مشاريعي', icon: IconLayoutGrid, end: true },
  { to: '/new', label: 'جديد', icon: IconCirclePlus },
  { to: '/roadmap', label: 'الطريق', icon: IconRoute },
  { to: '/glossary', label: 'المعجم', icon: IconVocabulary },
  { to: '/profile', label: 'ملفي', icon: IconUserCircle },
];

export default function Layout() {
  return (
    <div className="app-shell">
      <header className="app-topbar">
        <div className="app-logo">
          <div className="logo-mark">ر</div>
          <span>رفيق</span>
        </div>
        <div className="app-avatar">ع</div>
      </header>

      <main className="app-content">
        <Outlet />
      </main>

      <nav className="bottom-nav">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}
          >
            <Icon size={22} stroke={1.8} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}