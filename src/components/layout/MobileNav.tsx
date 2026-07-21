import { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { X, Map, Truck, Route, Bell, Settings, LogOut, type LucideIcon } from 'lucide-react';
import { useSession } from '@/context/SessionContext';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface NavItemConfig {
  to: string;
  key: string;
  icon: LucideIcon;
}

/** Decluttered core nav — mirrors the bottom tab bar, plus Settings. */
const CORE_NAV: NavItemConfig[] = [
  { to: '/tracking', key: 'monitor', icon: Map },
  { to: '/devices', key: 'devices', icon: Truck },
  { to: '/reports/trips', key: 'trips', icon: Route },
  { to: '/alerts', key: 'alerts', icon: Bell },
  { to: '/settings', key: 'settings', icon: Settings },
];

function MobileNavItem({ item, onClose }: { item: NavItemConfig & { label: string }; onClose: () => void }) {
  return (
    <NavLink
      to={item.to}
      end={item.to === '/dashboard' || item.to === '/reports' || item.to === '/settings'}
      onClick={onClose}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
        )
      }
    >
      <item.icon className="h-4 w-4 shrink-0" />
      {item.label}
    </NavLink>
  );
}

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileNav({ open, onClose }: MobileNavProps) {
  const { t } = useT();
  const { logout } = useSession();
  const { pathname } = useLocation();
  const sheetRef = useRef<HTMLDivElement>(null);

  // Close on route change
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
      />
      {/* Drawer */}
      <div
        ref={sheetRef}
        className={`fixed inset-y-0 left-0 z-50 w-64 max-w-[80vw] bg-card border-r border-border shadow-xl transition-transform duration-300 lg:hidden ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <span className="text-sm font-semibold">Kevin GPS</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="overflow-y-auto p-3 space-y-0.5 h-[calc(100%-3.5rem)] flex flex-col">
          {CORE_NAV.map((item) => (
            <MobileNavItem key={item.to} item={{ ...item, label: t(item.key) }} onClose={onClose} />
          ))}

          <div className="mt-auto pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => { onClose(); logout(); }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              {t('signOut')}
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
