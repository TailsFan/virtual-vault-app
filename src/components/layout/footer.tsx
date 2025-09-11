import Link from 'next/link';
import { Logo } from '@/components/icons';
import { Github, Twitter, Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Logo className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Виртуальное Хранилище</span>
            </Link>
            <p className="text-sm text-muted-foreground">Ваш надежный источник цифровых товаров.</p>
            <div className="flex space-x-4">
              <Link href="#" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </Link>
              <Link href="#" aria-label="Facebook">
                <Facebook className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </Link>
              <Link href="#" aria-label="GitHub">
                <Github className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Магазин</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/catalog" className="text-muted-foreground hover:text-foreground">Каталог</Link></li>
              <li><Link href="/#deals" className="text-muted-foreground hover:text-foreground">Скидки</Link></li>
              <li><Link href="/#categories" className="text-muted-foreground hover:text-foreground">Категории</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Поддержка</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">FAQ</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Связаться с нами</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Политика конфиденциальности</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Условия обслуживания</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">О нас</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">О компании</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Карьера</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Пресса</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Виртуальное Хранилище. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
