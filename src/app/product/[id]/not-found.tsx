import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container py-12 md:py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Товар не найден</h1>
      <p className="text-muted-foreground mb-8">
        К сожалению, мы не смогли найти товар, который вы ищете.
      </p>
      <Button asChild>
        <Link href="/catalog">Вернуться в каталог</Link>
      </Button>
    </div>
  );
}
