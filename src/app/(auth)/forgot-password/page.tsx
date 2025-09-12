
"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";


const formSchema = z.object({
  email: z.string().email({ message: "Неверный формат почты." }),
});

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await sendPasswordResetEmail(auth, values.email);
      toast({
        title: "Проверьте вашу почту",
        description: "Мы отправили вам ссылку для сброса пароля.",
      });
      form.reset();
    } catch (error: any) {
        let errorMessage = "Произошла ошибка при отправке письма.";
        if (error.code === 'auth/user-not-found') {
            errorMessage = "Пользователь с такой почтой не найден.";
        }
      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Забыли пароль?</CardTitle>
        <CardDescription>
          Введите свою почту, и мы пришлем вам ссылку для сброса пароля.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <Label htmlFor="email">Почта</Label>
                  <FormControl>
                    <Input id="email" type="email" placeholder="m@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Отправка..." : "Сбросить пароль"}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Вспомнили пароль?{" "}
          <Link href="/login" className="underline">
            Войти
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
