'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/shadcn/ui/sheet';
import { GiHamburgerMenu } from 'react-icons/gi';
import { Button } from '@/shared/shadcn/ui/button';
import { ROUTES } from '@/shared/config';
import { useMemo } from 'react';

interface MenuItem {
  href: string;
  label: string;
  variant?: 'default' | 'primary' | 'ghost';
}

export const DashboardMenu = () => {
  const pathname = usePathname();
  
  const businessIdMatch = pathname?.match(/\/dashboard\/business\/([^/]+)/);
  const businessId = businessIdMatch ? businessIdMatch[1] : null;

  const menuItems = useMemo<MenuItem[]>(() => {
    const items: MenuItem[] = [];

    if (businessId) {
      items.push(
        { href: ROUTES.DASHBOARD, label: 'Все боты' },
        { href: ROUTES.DASHBOARD_BUSINESS(businessId), label: 'Меню' },
        { href: ROUTES.DASHBOARD_BUSINESS_TABLES(businessId), label: 'Столики' },
      );
    } else {
      items.push(
        { href: ROUTES.DASHBOARD, label: 'Мои боты' },
      );
    }

    items.push(
      { href: '/me', label: 'Мой аккаунт' },
      { href: '/settings', label: 'Настройки' },
    );

    return items;
  }, [businessId]);

  const actionButtons = useMemo(() => [
    { 
      href: ROUTES.DASHBOARD_CREATE, 
      label: 'Создать бота', 
      variant: 'primary' as const 
    },
    { 
      href: '/logout', 
      label: 'Выйти из аккаунта', 
      variant: 'ghost' as const 
    },
  ], []);

  return (
    <Sheet>
      <SheetTrigger className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-forest-200 hover:bg-forest-300">
        <GiHamburgerMenu />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Меню</SheetTitle>
          <SheetDescription>Выберите опцию</SheetDescription>
        </SheetHeader>
        <div className="px-4 flex flex-col gap-3 mt-4">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div 
                className={`rounded-xl px-4 py-2 font-medium text-black transition-colors ${
                  pathname === item.href || pathname?.startsWith(item.href + '/')
                    ? 'bg-forest-200'
                    : 'bg-forest-100 hover:bg-forest-150'
                }`}
              >
                {item.label}
              </div>
            </Link>
          ))}

          <div className="border-t border-forest-200 my-2" />

          {actionButtons.map((button) => (
            <Link key={button.href} href={button.href} className="w-full">
              <Button
                className={
                  button.variant === 'primary'
                    ? 'bg-emerald-950 w-full rounded-full px-4 py-2 font-semibold text-white hover:bg-emerald-900'
                    : 'w-full rounded-full px-4 py-2 font-semibold text-black'
                }
                variant={button.variant === 'ghost' ? 'ghost' : 'default'}
              >
                {button.label}
              </Button>
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
