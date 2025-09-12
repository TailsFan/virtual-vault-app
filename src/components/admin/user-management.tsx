
"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { UserProfile, UserRole } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";


export function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { userProfile: adminProfile } = useAuth();
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    const usersCollection = collection(db, "users");
    const userSnapshot = await getDocs(usersCollection);
    const userList = userSnapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id } as UserProfile));
    setUsers(userList);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (uid: string, newRole: UserRole) => {
    if (!adminProfile || adminProfile.role !== 'admin') {
        toast({ title: "Ошибка", description: "Недостаточно прав.", variant: "destructive" });
        return;
    }
    if (uid === adminProfile.uid) {
        toast({ title: "Ошибка", description: "Вы не можете изменить свою собственную роль.", variant: "destructive" });
        return;
    }
    
    try {
        const userDocRef = doc(db, 'users', uid);
        await updateDoc(userDocRef, { role: newRole });
        toast({ title: "Успех", description: `Роль пользователя обновлена на ${newRole}.` });
        fetchUsers(); // Refresh the user list
    } catch (error) {
        console.error("Error updating role: ", error);
        toast({ title: "Ошибка", description: "Не удалось обновить роль пользователя.", variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление пользователями</CardTitle>
        <CardDescription>Просмотр и изменение ролей пользователей.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Загрузка пользователей...</p>
        ) : (
          <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Имя</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Роль</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell>{user.displayName || 'N/A'}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                        value={user.role}
                        onValueChange={(value) => handleRoleChange(user.uid, value as UserRole)}
                        disabled={user.uid === adminProfile?.uid || user.role === 'admin'}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Выберите роль" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="admin" disabled>Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
