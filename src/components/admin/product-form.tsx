
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from "@/components/ui/form";
import type { Product } from "@/lib/types";
import { categories } from "@/lib/data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(3, { message: "Название должно быть не менее 3 символов." }),
  description: z.string().min(10, { message: "Описание должно быть не менее 10 символов." }),
  price: z.coerce.number().positive({ message: "Цена должна быть положительным числом." }),
  originalPrice: z.coerce.number().optional().or(z.literal('')),
  image: z.string().url({ message: "Введите корректный URL изображения." }),
  dataAiHint: z.string().optional(),
  category: z.string().min(1, { message: "Выберите категорию." }),
  platform: z.string().min(1, { message: "Укажите платформу." }),
  rating: z.coerce.number().min(0).max(5).optional().default(0),
  reviews: z.coerce.number().min(0).optional().default(0),
  tags: z.any().transform(val => (val && typeof val === 'string') ? val.split(',').map(tag => tag.trim()) : Array.isArray(val) ? val : []),
});


type ProductFormProps = {
  onSubmit: (values: Partial<Product>) => void;
  product?: Product | null;
  onCancel: () => void;
};

export function ProductForm({ onSubmit, product, onCancel }: ProductFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: product ? {
            ...product,
            tags: product.tags ? product.tags.join(', ') : '',
            originalPrice: product.originalPrice || '',
        } : {
            name: '',
            description: '',
            price: 0,
            originalPrice: '',
            image: '',
            dataAiHint: '',
            category: '',
            platform: '',
            rating: 0,
            reviews: 0,
            tags: '',
        },
    });

    useEffect(() => {
        if (product) {
            form.reset({
                ...product,
                tags: product.tags ? product.tags.join(', ') : '',
                originalPrice: product.originalPrice || '',
            });
        } else {
            form.reset({
                name: '',
                description: '',
                price: 0,
                originalPrice: '',
                image: '',
                dataAiHint: '',
                category: '',
                platform: '',
                rating: 0,
                reviews: 0,
                tags: '',
            });
        }
    }, [product, form]);

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        const originalPriceNumber = Number(values.originalPrice);
        const submissionValues: Partial<Product> = {
            ...values,
        };

        if (originalPriceNumber > 0) {
            submissionValues.originalPrice = originalPriceNumber;
        } else {
            delete submissionValues.originalPrice;
        }

        onSubmit(submissionValues);
    };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название</FormLabel>
              <FormControl>
                <Input placeholder="Cyberpunk 2077" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea placeholder="Опишите товар..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Цена (RUB)</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="1599" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="originalPrice"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Старая цена (RUB)</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="2999" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
                <FormItem>
                <FormLabel>URL Изображения</FormLabel>
                <FormControl>
                    <Input placeholder="https://picsum.photos/600/400" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Категория</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Выберите категорию" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {categories.map(cat => (
                                <SelectItem key={cat.slug} value={cat.name}>{cat.name}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Платформа</FormLabel>
                    <FormControl>
                        <Input placeholder="PC, PS5, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Теги</FormLabel>
                <FormControl>
                    <Input placeholder="RPG, Открытый мир, Киберпанк (через запятую)" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="ghost" onClick={onCancel}>Отмена</Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Сохранение..." : "Сохранить"}
            </Button>
        </div>
      </form>
    </Form>
  );
}
