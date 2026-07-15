'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Grid } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/search', icon: Search, label: 'Search' },
    { href: '/genre', icon: Grid, label: 'Genre' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-neutral-950 border-t border-neutral-800 flex items-center justify-around py-2 px-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
              active
                ? 'text-blue-500'
                : 'text-neutral-400 hover:text-neutral-100'
            }`}
          >
            <Icon size={24} />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
