'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import React from 'react';

function isActivePath(href: string, pathname: string): boolean {
  if (href === '/') {
    return pathname === href;
  }
  if (href === '/admin') {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(href + '/');
}

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export default function NavLink({ href, children, className }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = isActivePath(href, pathname);
  return (
    <Link
      href={href}
      className={className}
      // Dynamically set the aria-current attribute
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </Link>
  );
}
