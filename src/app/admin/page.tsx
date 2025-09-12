
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UserManagement } from '@/components/admin/user-management';
import { ProductManagement } from '@/components/admin/product-management';

export default function AdminPage() {
  const { userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!userProfile || (userProfile.role !== 'admin' && userProfile.role !== 'manager')) {
        router.push('/dashboard');
      }
    }
  }, [userProfile, loading, router]);

  if (loading || !userProfile || (userProfile.role !== 'admin' && userProfile.role !== 'manager')) {
    return (
        <div className="container py-12 md:py-20">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Панель администратора</h1>
            <p>Загрузка...</p>
        </div>
    );
  }

  return (
    <div className="container py-12 md:py-20">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Панель администратора</h1>
      <Card>
        <CardHeader>
          <CardTitle>Управление</CardTitle>
           <CardDescription>
            Добро пожаловать, {userProfile.displayName}. Ваша роль: {userProfile.role}.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue={userProfile.role === 'admin' ? 'users' : 'products'}>
                <TabsList>
                    {userProfile.role === 'admin' && <TabsTrigger value="users">Пользователи</TabsTrigger>}
                    {(userProfile.role === 'admin' || userProfile.role === 'manager') && <TabsTrigger value="products">Товары</TabsTrigger>}
                </TabsList>
                {userProfile.role === 'admin' && (
                    <TabsContent value="users">
                        <UserManagement />
                    </TabsContent>
                )}
                {(userProfile.role === 'admin' || userProfile.role === 'manager') && (
                    <TabsContent value="products">
                        <ProductManagement />
                    </TabsContent>
                )}
            </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
