

"use client";

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { Star, ShoppingCart } from 'lucide-react';
import { doc, getDoc, collection, addDoc, updateDoc, query, where, getDocs, serverTimestamp, limit, documentId } from 'firebase/firestore';

import { db } from '@/lib/firebase';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/product-card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductPage() {
  const params = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const productId = params.id as string;

    const fetchProduct = async () => {
      if (!productId) return;
      setLoading(true);
      const docRef = doc(db, 'Products', productId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const foundProduct = { id: docSnap.id, ...docSnap.data() } as Product;
        setProduct(foundProduct);

        // Fetch related products
        if (foundProduct.category) {
            const productsRef = collection(db, 'Products');
            const relatedQuery = query(
                productsRef, 
                where('category', '==', foundProduct.category),
                where(documentId(), '!=', foundProduct.id),
                limit(4)
            );
            const relatedSnapshot = await getDocs(relatedQuery);
            const related = relatedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
            setRelatedProducts(related);
        }

      } else {
        setProduct(null);
      }
      
      setLoading(false);
    };

    fetchProduct();
  }, [params.id]);

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: 'Требуется авторизация',
        description: 'Пожалуйста, войдите, чтобы добавить товары в корзину.',
        variant: 'destructive',
      });
      return;
    }

    if (!product) return;

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

  if (loading) {
    return (
        <div className="container py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            <Skeleton className="rounded-lg w-full aspect-[4/3]" />
            <div className="space-y-6">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-24 w-full" />
                <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                </div>
                 <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                 </div>
            </div>
          </div>
        </div>
      );
  }

  if (!product) {
    return notFound();
  }

  return (
    <div className="container py-12 md:py-20">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        <div>
          <Image
            src={product.image}
            alt={product.name}
            width={800}
            height={600}
            data-ai-hint={product.dataAiHint}
            className="rounded-lg object-cover w-full aspect-[4/3]"
          />
        </div>
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">{product.category} / {product.platform}</p>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mt-1">{product.name}</h1>
            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-5 h-5 fill-current" />
                <span className="font-semibold text-lg">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-muted-foreground">({product.reviews} отзывов)</span>
            </div>
          </div>
          
          <div>
            <p className="text-3xl font-bold">
              {product.price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 })}
            </p>
            {product.originalPrice && (
              <p className="text-lg text-muted-foreground line-through">
                {product.originalPrice.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 })}
              </p>
            )}
          </div>

          <p className="text-muted-foreground">{product.description}</p>
          
          {product.tags && product.tags.length > 0 && (
             <div className="flex flex-wrap gap-2">
              {product.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
            </div>
          )}

          <Separator />

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="flex-1" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Добавить в корзину
            </Button>
          </div>
        </div>
      </div>

      <section className="mt-16 md:mt-24">
        <h2 className="text-3xl font-bold tracking-tight mb-8">Похожие товары</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
