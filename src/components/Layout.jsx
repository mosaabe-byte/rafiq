import { NavLink, Outlet } from 'react-router-dom';
import {
  IconLayoutGrid,
  IconCirclePlus,
  IconRoute,
  IconVocabulary,
  IconUserCircle,
  IconMessageCircle,
} from '@tabler/icons-react';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSwitcher from '../i18n/LanguageSwitcher';
import './Layout.css';

export default function Layout() {
  const { t } = useLanguage();

  const navItems = [
    { to: '/', label: t('nav.projects'), icon: IconLayoutGrid, end: true },
    { to: '/new', label: t('nav.newProject'), icon: IconCirclePlus },
    { to: '/roadmap', label: t('nav.roadmap'), icon: IconRoute },
    { to: '/glossary', label: t('nav.glossary'), icon: IconVocabulary },
    { to: '/chat', label: t('nav.chat'), icon: IconMessageCircle },
    { to: '/profile', label: t('nav.profile'), icon: IconUserCircle },
  ];

  return (
    <div className="app-shell">
      <header className="app-topbar">
        <div className="app-logo">
          <div className="logo-mark">ر</div>
          <span>رفيق</span>
        </div>
        <LanguageSwitcher />
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