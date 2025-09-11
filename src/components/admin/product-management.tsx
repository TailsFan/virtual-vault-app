
"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Product } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { ProductForm } from "./product-form";


export function ProductManagement() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const productsCollection = collection(db, "Products");
            const productSnapshot = await getDocs(productsCollection);
            const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
            setProducts(productList.sort((a, b) => a.name.localeCompare(b.name)));
        } catch (error) {
            console.error("Error fetching products: ", error);
            toast({ title: "Ошибка", description: "Не удалось загрузить товары.", variant: "destructive" });
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
      }, []);

    const handleFormSubmit = async (values: Omit<Product, 'id'>) => {
        try {
            const productData = {
                ...values,
                updatedAt: serverTimestamp(),
            };

            if (editingProduct) {
                const productDocRef = doc(db, 'Products', editingProduct.id);
                await updateDoc(productDocRef, productData);
                toast({ title: "Успех", description: "Товар успешно обновлен." });
            } else {
                await addDoc(collection(db, 'Products'), {
                    ...productData,
                    createdAt: serverTimestamp(),
                });
                toast({ title: "Успех", description: "Товар успешно добавлен." });
            }
            fetchProducts();
            setIsDialogOpen(false);
            setEditingProduct(null);
        } catch (error) {
            console.error("Error submitting product: ", error);
            toast({ title: "Ошибка", description: "Не удалось сохранить товар.", variant: "destructive" });
        }
    };

    const handleDeleteProduct = async (id: string) => {
        try {
            const productDocRef = doc(db, 'Products', id);
            await deleteDoc(productDocRef);
            toast({ title: "Успех", description: "Товар удален." });
            fetchProducts();
        } catch (error) {
            console.error("Error deleting product: ", error);
            toast({ title: "Ошибка", description: "Не удалось удалить товар.", variant: "destructive" });
        }
    };

    const handleEditClick = (product: Product) => {
        setEditingProduct(product);
        setIsDialogOpen(true);
    };
    
    const handleAddClick = () => {
        setEditingProduct(null);
        setIsDialogOpen(true);
    }


  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Управление товарами</CardTitle>
                <CardDescription>Добавление, изменение и удаление товаров.</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
                    setIsDialogOpen(isOpen);
                    if (!isOpen) setEditingProduct(null);
                }}>
                <DialogTrigger asChild>
                    <Button onClick={handleAddClick}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Добавить товар
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                        <DialogTitle>{editingProduct ? "Редактировать товар" : "Добавить новый товар"}</DialogTitle>
                    </DialogHeader>
                    <ProductForm
                        onSubmit={handleFormSubmit}
                        product={editingProduct}
                        onCancel={() => {
                            setIsDialogOpen(false);
                            setEditingProduct(null);
                        }}
                    />
                </DialogContent>
            </Dialog>

        </div>
      </CardHeader>
      <CardContent>
        {loading ? <p>Загрузка товаров...</p> : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Изображение</span>
              </TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Категория</TableHead>
              <TableHead>Цена</TableHead>
              <TableHead>
                <span className="sr-only">Действия</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="hidden sm:table-cell">
                  <Image
                    alt={product.name}
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={product.image || 'https://placehold.co/64'}
                    width="64"
                    data-ai-hint={product.dataAiHint}
                  />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 })}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Открыть меню</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Действия</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEditClick(product)}>Редактировать</DropdownMenuItem>
                       <AlertDialog>
                            <AlertDialogTrigger asChild>
                                 <button className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full text-destructive hover:bg-destructive/10">Удалить</button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Это действие необратимо. Товар будет удален навсегда.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Отмена</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteProduct(product.id)} className="bg-destructive hover:bg-destructive/90">Удалить</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )}
      </CardContent>
    </Card>
  );
}
