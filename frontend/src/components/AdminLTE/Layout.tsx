import { ReactNode, useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onLogout: () => void;
}

export default function Layout({ children, theme, onToggleTheme, onLogout }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = mobileOpen ? 'hidden' : '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen, isMobile]);

  return (
    <div className={`wrapper ${sidebarCollapsed && !isMobile ? 'sidebar-collapsed' : ''}`}>
      {isMobile && mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <Sidebar
        collapsed={!isMobile && sidebarCollapsed}
        onToggle={() => {
          if (isMobile) setMobileOpen(!mobileOpen);
          else setSidebarCollapsed(!sidebarCollapsed);
        }}
        onLogout={onLogout}
        isMobile={isMobile}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <Header
        theme={theme}
        onToggleTheme={onToggleTheme}
        onLogout={onLogout}
        onMenuToggle={() => setMobileOpen(!mobileOpen)}
        isMobile={isMobile}
      />

      <div className={`content-wrapper ${isMobile ? '' : sidebarCollapsed ? 'ml-[72px]' : 'ml-[260px]'}`}>
        <section className="content" style={{ padding: '1.5rem', paddingBottom: '3.5rem' }}>
          {children}
        </section>
        <Footer />
      </div>
    </div>
  );
}
