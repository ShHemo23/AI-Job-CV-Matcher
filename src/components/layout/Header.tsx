
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X, Sun, Moon, LogIn, LogOut, User as UserIcon, Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Simplified navLinks as most pages are consolidated
const navLinks = [
  // { href: '/profile', label: 'Profile', icon: UserIcon },
  // { href: '/jobs', label: 'Discover Jobs', icon: Briefcase },
  // { href: '/match', label: 'AI Match', icon: Briefcase }, 
];


function ThemeToggle() {
    const { setTheme, theme } = useTheme()
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <Button variant="ghost" size="icon" disabled>
                <Sun className="h-[1.2rem] w-[1.2rem]" />
            </Button>
        );
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}


export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, login, logout } = useAuth();

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} />
            <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 flex justify-between items-center border-b">
      <Link href="/" className="flex items-center gap-2 text-xl sm:text-2xl font-bold gradient-text group">
        <Sparkles className="w-5 h-5 text-primary transition-transform group-hover:scale-110 animate-wiggle"/>
        FreelanceZen
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-2 sm:gap-4">
        {navLinks.map((link) => (
          <Button
            key={link.href}
            variant="ghost"
            asChild
            className={cn(
              "transition-colors",
              pathname === link.href ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Link href={link.href}>{link.label}</Link>
          </Button>
        ))}
        <ThemeToggle />
        {user ? <UserMenu /> : (
            <Button onClick={login}>
                <LogIn className="mr-2 h-4 w-4" /> Login
            </Button>
        )}
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center gap-2">
        <ThemeToggle />
         {user ? <UserMenu /> : (
            <Button onClick={login} size="sm">
                <LogIn className="mr-2 h-4 w-4" /> Login
            </Button>
        )}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-xs sm:max-w-sm">
            <div className="flex justify-between items-center mb-8">
              <Link href="/" className="flex items-center gap-2 text-2xl font-bold gradient-text" onClick={() => setIsMobileMenuOpen(false)}>
                 <Sparkles className="w-5 h-5 text-primary animate-wiggle"/>
                FreelanceZen
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-6 w-6" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Button
                  key={link.href}
                  variant={pathname === link.href ? "secondary" : "ghost"}
                  asChild
                  className={cn(
                    "justify-start text-lg py-3 px-4",
                     pathname === link.href ? "font-semibold" : ""
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              ))}
               {!user && (
                 <Button onClick={() => { login(); setIsMobileMenuOpen(false); }} className="justify-start text-lg py-3 px-4">
                    <LogIn className="mr-2 h-4 w-4" /> Login
                </Button>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
