
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProductCard } from '@/components/product-card';
import { categories, testimonials } from '@/lib/data';
import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';


export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setLoading(true);
      const productsRef = collection(db, 'Products');
      // Simple query to get 4 products. In a real app, you might query by rating or sales.
      const q = query(productsRef, orderBy('rating', 'desc'), limit(4));
      const querySnapshot = await getDocs(q);
      const productsList = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()} as Product));
      setFeaturedProducts(productsList);
      setLoading(false);
    }

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center text-center text-white my-12 overflow-hidden rounded-lg">
        <Image
          src="https://picsum.photos/1600/900?random=12"
          alt="Hero banner with abstract cyber art"
          data-ai-hint="abstract cyber"
          fill
          className="object-cover -z-10 brightness-50"
        />
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-headline font-bold tracking-normal sm:text-4xl md:text-5xl text-shadow-lg">
              Откройте свой цифровой мир
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-200">
              Мгновенная доставка игровых ключей, программного обеспечения, подписок и многого другого. Ваше следующее приключение всего в одном клике.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" asChild>
                <Link href="/catalog">Изучить каталог</Link>
              </Button>
              <Button size="lg" variant="secondary">
                Скидки дня
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <div className="py-12 md:py-20 space-y-16">
        {/* Categories Section */}
        <section id="categories" className="space-y-6">
          <h2 className="text-3xl font-headline font-bold tracking-tight text-center">Просмотр по категориям</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link href={`/catalog?category=${category.slug}`} key={category.name}>
                <Card className="text-center p-4 hover:bg-primary/10 border-primary/20 hover:border-primary transition-colors group">
                  <category.icon className="h-10 w-10 mx-auto text-primary" />
                  <p className="mt-2 font-semibold">{category.name}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products Section */}
        <section id="deals" className="space-y-6">
          <h2 className="text-3xl font-headline font-bold tracking-tight">Популярные продукты</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-[192px] w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))
            ) : (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="space-y-8">
          <h2 className="text-3xl font-headline font-bold tracking-tight text-center">Что говорят наши клиенты</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="bg-secondary/50 border-secondary">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.dataAiHint} />
                      <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">&quot;{testimonial.quote}&quot;</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
