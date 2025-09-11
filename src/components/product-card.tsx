
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, query, where, getDocs, serverTimestamp, doc } from 'firebase/firestore';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    if (!user) {
      toast({
        title: 'Требуется авторизация',
        description: 'Пожалуйста, войдите, чтобы добавить товары в корзину.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const cartsRef = collection(db, 'carts');
      const q = query(cartsRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);

      const newItem = {
        id: product.id,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      };

      if (querySnapshot.empty) {
        // Create a new cart
        await addDoc(cartsRef, {
          userId: user.uid,
          items: [newItem],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else {
        // Update existing cart
        const cartDoc = querySnapshot.docs[0];
        const cartData = cartDoc.data();
        const itemIndex = cartData.items.findIndex((item: any) => item.productId === product.id);

        let newItems;
        if (itemIndex > -1) {
          // Increment quantity
          newItems = [...cartData.items];
          newItems[itemIndex].quantity++;
        } else {
          // Add new item
          newItems = [...cartData.items, newItem];
        }

        await updateDoc(doc(db, 'carts', cartDoc.id), {
          items: newItems,
          updatedAt: serverTimestamp(),
        });
      }

      toast({
        title: 'Товар добавлен в корзину',
        description: `${product.name} был успешно добавлен.`,
      });
    } catch (error) {
      console.error("Error adding to cart: ", error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить товар в корзину.',
        variant: 'destructive',
      });
    }
  };


  return (
    <Card className={cn('overflow-hidden flex flex-col group', className)}>
      <CardHeader className="p-0 relative">
        <Link href={`/product/${product.id}`} className="block">
          <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={400}
            data-ai-hint={product.dataAiHint}
            className="w-full h-44 sm:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <p className="text-[11px] sm:text-xs text-muted-foreground">{product.category}</p>
        <CardTitle className="mt-1 text-base sm:text-lg">
          <Link href={`/product/${product.id}`} className="hover:text-primary transition-colors">
            {product.name}
          </Link>
        </CardTitle>
        <div className="mt-2 flex items-center gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-muted-foreground">({product.reviews})</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center gap-2">
        <div>
          <p className="text-lg sm:text-xl font-bold">{product.price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 })}</p>
          {product.originalPrice && (
            <p className="text-xs sm:text-sm text-muted-foreground line-through">{product.originalPrice.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 })}</p>
          )}
        </div>
        <Button size="sm" className="sm:size-default" onClick={handleAddToCart}>В корзину</Button>
      </CardFooter>
    </Card>
  );
}
