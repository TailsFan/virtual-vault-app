
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import type { Cart, CartItem, Product } from '@/lib/types';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';

export default function CartPage() {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartItemsDetails, setCartItemsDetails] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCart = async () => {
    if (user) {
      setLoading(true);
      const cartsRef = collection(db, 'carts');
      const q = query(cartsRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const cartDoc = querySnapshot.docs[0];
        const cartData = { id: cartDoc.id, ...cartDoc.data() } as Cart;
        setCart(cartData);
        
        const itemsDetails = await Promise.all(cartData.items.map(async (item) => {
            return {
                ...item,
            };
        }));
        setCartItemsDetails(itemsDetails);

      } else {
        setCart(null);
        setCartItemsDetails([]);
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const handleRemoveFromCart = async (itemId: string) => {
    if (!user || !cart) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить товар. Попробуйте перезагрузить страницу.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const newItems = cart.items.filter(item => item.id !== itemId);
      const cartRef = doc(db, 'carts', cart.id);
      await updateDoc(cartRef, {
        items: newItems,
        updatedAt: serverTimestamp(),
      });

      // Update local state to reflect removal
      setCartItemsDetails(newItems);
      const updatedCart = { ...cart, items: newItems };
      setCart(updatedCart);


      toast({
        title: 'Товар удален',
        description: 'Товар был успешно удален из вашей корзины.',
      });

      if(newItems.length === 0) {
        fetchCart();
      }

    } catch (error) {
      console.error("Error removing item from cart: ", error);
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при удалении товара.',
        variant: 'destructive',
      });
    }
  };

  const total = cartItemsDetails.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) {
    return (
      <div className="container py-12 md:py-20">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Ваша корзина</h1>
        <p>Загрузка...</p>
      </div>
    );
  }

  if (!user) {
      return (
        <div className="container py-12 md:py-20">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Ваша корзина</h1>
             <Card>
                <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
                    <h2 className="text-2xl font-semibold">Войдите, чтобы увидеть свою корзину</h2>
                    <p className="text-muted-foreground">Пожалуйста, войдите в свой аккаунт, чтобы управлять товарами в корзине.</p>
                    <Button asChild>
                    <Link href="/login">Войти</Link>
                    </Button>
                </div>
                </CardContent>
            </Card>
        </div>
      )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container py-12 md:py-20">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Ваша корзина</h1>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
              <h2 className="text-2xl font-semibold">Ваша корзина пуста</h2>
              <p className="text-muted-foreground">Похоже, вы еще ничего не добавили в корзину.</p>
              <Button asChild>
                <Link href="/catalog">Начать покупки</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-20">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Ваша корзина</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
            <Card>
                <CardContent className="p-0">
                    <div className="divide-y">
                        {cartItemsDetails.map(item => (
                            <div key={item.id} className="grid grid-cols-[auto,1fr,auto] items-center p-4 gap-4">
                                <Image src={item.image} alt={item.name} width={80} height={80} className="rounded-md object-cover w-20 h-20" />
                                <div className="flex flex-col">
                                    <h3 className="font-semibold leading-tight">{item.name}</h3>
                                    <p className="text-sm text-muted-foreground">Кол-во: {item.quantity}</p>
                                    <p className="font-semibold md:hidden mt-1">{(item.price * item.quantity).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 })}</p>
                                </div>
                                <div className="text-right flex flex-col items-end justify-between h-full">
                                    <p className="font-semibold hidden md:block">{(item.price * item.quantity).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 })}</p>
                                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive -mr-2" onClick={() => handleRemoveFromCart(item.id)}>
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Удалить</span>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Сумма заказа</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between">
                        <span>Промежуточный итог</span>
                        <span>{total.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 })}</span>
                    </div>
                     <div className="flex justify-between font-bold text-lg">
                        <span>Итого</span>
                        <span>{total.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 })}</span>
                    </div>
                    <Button className="w-full" size="lg" asChild>
                      <Link href="/checkout">Оформить заказ</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
