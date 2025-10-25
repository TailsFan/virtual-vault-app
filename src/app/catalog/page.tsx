"use client";

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import type { Product } from '@/lib/types';
import { ProductCard } from "@/components/product-card";
import { Skeleton } from '@/components/ui/skeleton';
import { categories } from '@/lib/data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CatalogPage() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get('category');
  const searchQuery = searchParams.get('search');

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
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
          q = query(productsCollection);
        }
      } else {
        setTitle('Каталог товаров');
        q = query(productsCollection);
      }

      const productSnapshot = await getDocs(q);
      const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(productList);
      setFilteredProducts(productList);
      setLoading(false);
    };

    fetchProducts();
  }, [categorySlug]);

  // Фильтрация продуктов по поисковому запросу
  useEffect(() => {
    if (searchQuery && products.length > 0) {
      const query = searchQuery.toLowerCase();
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        (product.description && product.description.toLowerCase().includes(query)) ||
        (product.category && product.category.toLowerCase().includes(query))
      );
      setFilteredProducts(filtered);
      setTitle(`Результаты поиска: "${searchQuery}"`);
    } else if (products.length > 0) {
      setFilteredProducts(products);
      // Восстанавливаем заголовок в зависимости от категории
      if (categorySlug) {
        const currentCategory = categories.find(cat => cat.slug === categorySlug);
        setTitle(currentCategory ? `Каталог: ${currentCategory.name}` : 'Каталог товаров');
      } else {
        setTitle('Каталог товаров');
      }
    }
  }, [searchQuery, products, categorySlug]);

  return (
    <div className="container py-8 md:py-20">
        <h1 className="text-3xl font-bold tracking-tight mb-8">{title}</h1>
        
        {/* Показать информацию о поиске */}
        {searchQuery && (
          <div className="mb-6">
            <p className="text-muted-foreground">
              Найдено товаров: {filteredProducts.length}
              {categorySlug && (
                <> в категории "{categories.find(cat => cat.slug === categorySlug)?.name}"</>
              )}
            </p>
          </div>
        )}

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
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
              ))
            ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground text-lg mb-4">
                    {searchQuery 
                      ? `По запросу "${searchQuery}" ничего не найдено`
                      : 'В этой категории пока нет товаров.'
                    }
                  </p>
                  {searchQuery && (
                    <Button asChild variant="outline">
                      <Link href="/catalog">Показать все товары</Link>
                    </Button>
                  )}
                </div>
            )}
        </div>
    </div>
  );
}