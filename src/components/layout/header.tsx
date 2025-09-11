"use client";

import Link from "next/link";
import {
  Menu,
  Search,
  ShoppingCart,
  User,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/user-nav";
import { Logo } from "@/components/icons";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "../ui/separator";

export function Header() {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">
              Виртуальное Хранилище
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/catalog"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Каталог
            </Link>
            <Link
              href="/#deals"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Скидки
            </Link>
            <Link
              href="/#categories"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Категории
            </Link>
          </nav>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Открыть меню</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0 sm:max-w-xs">
             <SheetHeader className="p-6 pb-2">
                <SheetTitle>
                    <Link href="/" className="flex items-center space-x-2">
                        <Logo className="h-8 w-8 text-primary" />
                        <span className="font-bold">Виртуальное Хранилище</span>
                    </Link>
                </SheetTitle>
            </SheetHeader>
            <nav className="grid gap-4 text-lg font-medium p-6 pt-4">
                <Link
                href="/catalog"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                Каталог
                </Link>
                <Link
                href="/#deals"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                Скидки
                </Link>
                <Link
                href="/#categories"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                Категории
                </Link>
                {!loading && !user && (
                  <>
                    <Separator className="my-2" />
                     <Link
                      href="/login"
                      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <LogIn className="h-5 w-5" />
                      Войти
                    </Link>
                     <Link
                      href="/register"
                      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <User className="h-5 w-5" />
                      Регистрация
                    </Link>
                  </>
                )}
            </nav>
          </SheetContent>
        </Sheet>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Поиск продуктов..."
                  className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                />
              </div>
            </form>
          </div>
          <nav className="flex items-center">
            <Button variant="ghost" size="icon" className="relative" asChild>
                <Link href="/cart">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="sr-only">Корзина</span>
                </Link>
            </Button>
            <ThemeToggle />
            { !loading && (user ? <UserNav /> : <div className="hidden md:block"><Link href="/login"><Button variant="ghost">Войти</Button></Link><Link href="/register"><Button>Регистрация</Button></Link></div>) }
          </nav>
        </div>
      </div>
    </header>
  );
}
