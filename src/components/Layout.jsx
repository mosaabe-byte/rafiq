import { useAuth } from '../auth/AuthContext';
import CompleteProfile from './CompleteProfile';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  IconLayoutGrid,
  IconCirclePlus,
  IconRoute,
  IconVocabulary,
  IconUserCircle,
  IconMessageCircle,
  IconBooks,
} from '@tabler/icons-react';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSwitcher from '../i18n/LanguageSwitcher';
import './Layout.css';

const WIDTHS = {
  '/': 'grid',
  '/roadmap': 'grid',
  '/library': 'grid',
  '/glossary': 'grid',
  '/profile': 'grid',
  '/chat': 'work',
};

function widthFor(pathname) {
  return WIDTHS[pathname] || 'read';
}

export default function Layout() {
  const { t } = useLanguage();
  const { profile, loading } = useAuth();
  const location = useLocation();
  const width = widthFor(location.pathname);

  // شاشة إكمال الملفّ: تظهر إن كان المستخدم مسجّلاً لكن لم يحدّد بلده بعد.
  // ننتظر تحميل profile أولاً (لتفادي الوميض)، ثم نفحص country.
  if (!loading && profile && !profile.country) {
    return <CompleteProfile />;
  }

  const navItems = [
    { to: '/', label: t('nav.projects'), icon: IconLayoutGrid, end: true },
    { to: '/new', label: t('nav.newProject'), icon: IconCirclePlus },
    { to: '/roadmap', label: t('nav.roadmap'), icon: IconRoute },
    { to: '/glossary', label: t('nav.glossary'), icon: IconVocabulary },
    { to: '/chat', label: t('nav.chat'), icon: IconMessageCircle },
    { to: '/library', label: t('nav.library'), icon: IconBooks },
    { to: '/profile', label: t('nav.profile'), icon: IconUserCircle },
  ];

  return (
    <div className="app-shell" data-w={width}>
      <header className="app-topbar">
        <div className="app-logo">
          <div className="logo-mark">ر</div>
          <span>{t('appName')}</span>
        </div>
        <LanguageSwitcher />
        <div className="app-avatar">ع</div>
      </header>

      <main className="app-content">
        <Outlet />
      </main>

            <nav className="app-nav">
        <div className="nav-brand">
          <div className="logo-mark">ر</div>
          <span>{t('appName')}</span>
        </div>

        <div className="nav-links">
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
        </div>

        <div className="nav-foot">
          <LanguageSwitcher />
          <div className="app-avatar">ع</div>
        </div>
      </nav>
    </div>
  );
}