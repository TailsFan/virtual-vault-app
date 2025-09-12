"use client";

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import type { Product } from '@/lib/types';
import { ProductCard } from "@/components/product-card";
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryParam = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (queryParam) {
      setSearchQuery(queryParam);
      performSearch(queryParam);
    }
  }, [queryParam]);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setProducts([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);
    
    try {
      const productsCollection = collection(db, "Products");
      // Поиск по названию продукта (регистронезависимый)
      const q = query(
        productsCollection,
        where("name", ">=", query.toLowerCase()),
        where("name", "<=", query.toLowerCase() + "\uf8ff")
      );
      
      const productSnapshot = await getDocs(q);
      const productList = productSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Product));
      
      // Если точного совпадения нет, попробуем поиск по частичному совпадению
      if (productList.length === 0) {
        const allProductsSnapshot = await getDocs(productsCollection);
        const allProducts = allProductsSnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        } as Product));
        
        const filteredProducts = allProducts.filter(product => 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description?.toLowerCase().includes(query.toLowerCase())
        );
        
        setProducts(filteredProducts);
      } else {
        setProducts(productList);
      }
    } catch (error) {
      console.error('Ошибка поиска:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="container py-8 md:py-20">
      <div className="max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-6 text-center">Поиск продуктов</h1>
        
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Введите название продукта..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Поиск...' : 'Найти'}
          </Button>
        </form>
      </div>

      {hasSearched && (
        <div className="mb-6">
          <p className="text-muted-foreground">
            {loading ? (
              'Поиск...'
            ) : products.length > 0 ? (
              `Найдено ${products.length} ${products.length === 1 ? 'продукт' : products.length < 5 ? 'продукта' : 'продуктов'} по запросу "${queryParam}"`
            ) : (
              `По запросу "${queryParam}" ничего не найдено`
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
        ) : products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : hasSearched ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground text-lg">
              Попробуйте изменить поисковый запрос или просмотрите наш каталог
            </p>
            <Button asChild className="mt-4">
              <a href="/catalog">Перейти в каталог</a>
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
