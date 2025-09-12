
"use client";

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import type { Product } from '@/lib/types';
import { ProductCard } from "@/components/product-card";
import { Skeleton } from '@/components/ui/skeleton';
import { categories } from '@/lib/data';

export default function CatalogPage() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('Каталог товаров');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const productsCollection = collection(db, "Products");
      let q;

      if (categorySlug) {
        const currentCategory = categories.find(cat => cat.slug === categorySlug);
        if (currentCategory) {
          setTitle(`Каталог: ${currentCategory.name}`);
          q = query(productsCollection, where("category", "==", currentCategory.name));
        } else {
            setTitle('Категория не найдена');
            q = query(productsCollection); // Fallback to all products
        }
      } else {
        setTitle('Каталог товаров');
        q = query(productsCollection);
      }

      const productSnapshot = await getDocs(q);
      const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(productList);
      setLoading(false);
    };

    fetchProducts();
  }, [categorySlug]);

  return (
    <div className="container py-8 md:py-20">
        <h1 className="text-3xl font-bold tracking-tight mb-8">{title}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-[192px] w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))
            ) : products.length > 0 ? (
              products.map((product) => (
                  <ProductCard key={product.id} product={product} />
              ))
            ) : (
                <p className="col-span-full text-center text-muted-foreground">В этой категории пока нет товаров.</p>
            )}
        </div>
    </div>
  );
}
