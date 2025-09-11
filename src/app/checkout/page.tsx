import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CheckoutPage() {
  return (
    <div className="container py-12 md:py-20">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Оформление заказа</h1>
      <Card>
        <CardHeader>
          <CardTitle>Безопасное оформление</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Страница оформления заказа в разработке.</p>
          <Button className="mt-4">Перейти к оплате</Button>
        </CardContent>
      </Card>
    </div>
  );
}
