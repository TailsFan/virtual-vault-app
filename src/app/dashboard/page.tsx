
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !userProfile) {
    return (
        <div className="container py-12 md:py-20">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Моя панель</h1>
             <Card>
                <CardHeader>
                    <CardTitle>Загрузка...</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Загружаем данные вашего профиля...</p>
                </CardContent>
            </Card>
        </div>
    );
  }


  return (
    <div className="container py-12 md:py-20">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Моя панель</h1>
      <Card>
        <CardHeader>
          <CardTitle>С возвращением, {userProfile.displayName}!</CardTitle>
          <CardDescription>Это ваша личная панель управления.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Информация о профиле</h3>
            <p className="text-muted-foreground">Email: {userProfile.email}</p>
            <p className="text-muted-foreground">Роль: {userProfile.role}</p>
            {userProfile.createdAt && (
                <p className="text-muted-foreground">
                    Аккаунт создан: {new Date(userProfile.createdAt).toLocaleDateString('ru-RU')}
                </p>
            )}
          </div>
           <div>
            <h3 className="font-semibold">История заказов</h3>
            <p className="text-muted-foreground">У вас пока нет заказов.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
