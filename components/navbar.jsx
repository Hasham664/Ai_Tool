'use client';

import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Brain,
  LogOut,
  User,
  Home,
  FileText,
  MessageSquare,
  Menu,
  X,
  Mic,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navigationItems = [
    { href: '/cover-letter', label: 'Cover Letters', icon: FileText },
    { href: '/resume-analyzer', label: 'Resume Analysis', icon: MessageSquare },
    { href: '/mock-interview', label: 'Mock Interview', icon: Mic },
    { href: '/tutor', label: 'AI Tutor', icon: Home },
  ];

  const isActivePage = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className='border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <Link href='/' className='flex items-center space-x-2 cursor-pointer'>
            <Brain className='h-8 w-8 text-primary' />
            <span className='text-xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent'>
              AI Career Pro
            </span>
          </Link>

          {/* Desktop Navigation */}
          {session && (
            <div className='hidden lg:flex items-center space-x-1'>
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = isActivePage(item.href);
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      size='sm'
                      className='flex items-center space-x-1 cursor-pointer'
                    >
                      <IconComponent className='h-4 w-4' />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right side */}
          <div className='flex items-center space-x-4'>
            <ThemeToggle />

            {session ? (
              <div className='flex items-center space-x-3'>
                {/* Desktop user info */}
                <div className='hidden md:flex items-center space-x-2'>
                  <User className='h-4 w-4' />
                  <span className='text-sm font-medium'>
                    {session.user?.name}
                  </span>
                </div>

                {/* Desktop sign out */}
                <div className='hidden md:block'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => signOut()}
                    className='flex items-center space-x-2 cursor-pointer'
                  >
                    <LogOut className='h-4 w-4' />
                    <span>Sign Out</span>
                  </Button>
                </div>

                {/* Mobile menu toggle with animation */}
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={toggleMobileMenu}
                  className='lg:hidden '
                  aria-label='Toggle menu'
                >
                  <motion.div
                    key={isMobileMenuOpen ? 'close' : 'menu'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className=''
                  >
                    {isMobileMenuOpen ? (
                      <X className='h-7 w-7' />
                    ) : (
                      <Menu className='h-7 w-7' />
                    )}
                  </motion.div>
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => signIn('google')}
                className='bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90 cursor-pointer'
              >
                <span className='hidden sm:inline'>Sign In with Google</span>
                <span className='sm:hidden'>Sign In</span>
              </Button>
            )}
          </div>
        </div>

        {/* Absolute-positioned Mobile Menu */}
        <AnimatePresence>
          {session && isMobileMenuOpen && (
            <motion.div
              key='mobile-menu'
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className='absolute top-16 left-0 w-full bg-card border-t border-border z-[60] shadow-lg'
            >
              <div className='py-5 space-y-3 px-3'>
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = isActivePage(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobileMenu}
                    >
                      <Button
                        variant={isActive ? 'default' : 'ghost'}
                        size='sm'
                        className='w-full justify-start flex items-center space-x-2'
                      >
                        <IconComponent className='h-4 w-4' />
                        <span>{item.label}</span>
                      </Button>
                    </Link>
                  );
                })}

                {/* Mobile user info and sign out */}
                <div className='pt-2 mt-2 border-t border-border space-y-2'>
                  <div className='flex items-center space-x-2 px-3 py-2 text-sm'>
                    <User className='h-4 w-4' />
                    <span className='font-medium'>{session.user?.name}</span>
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      signOut();
                      closeMobileMenu();
                    }}
                    className='w-full justify-start flex items-center space-x-2 cursor-pointer'
                  >
                    <LogOut className='h-4 w-4' />
                    <span>Sign Out</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
