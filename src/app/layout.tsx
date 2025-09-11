import type { Metadata } from 'next';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';
import { Orbitron, Inter } from 'next/font/google';

export const metadata: Metadata = {
  title: 'Виртуальное Хранилище - Ваш Рынок Цифровых Товаров',
  description: 'Лучшее место для покупки игровых ключей, программного обеспечения, аккаунтов и других цифровых продуктов.',
};

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-headline',
  weight: ['400', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased',
          orbitron.variable,
          inter.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="relative flex min-h-dvh flex-col">
              <Header />
              <main className="flex-1 container">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
