import { create } from "zustand";
import { nanoid } from "nanoid";

// 用户数据类型
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  createdAt: string;
}

// store 类型
interface UserState {
  users: User[];
  getUsers: () => User[];
  addUser: (user: Omit<User, "id" | "createdAt">) => void;
  updateUser: (id: string, updates: Partial<Omit<User, "id" | "createdAt">>) => void;
  deleteUser: (id: string) => void;
  getUserById: (id: string) => User | undefined;
}

// Zustand Store
export const useUserStore = create<UserState>((set, get) => ({
  users: [
    // {
    //   id: "2pCe7ZPG6F8LlItLPTa5z",
    //   name: "Alice",
    //   email: "alice@example.com",
    //   role: "admin",
    //   createdAt: new Date().toISOString(),
    // },
    // {
    //   id: "uUUaX5Yiebugg67ZvUbE-",
    //   name: "Bob",
    //   email: "bob@example.com",
    //   role: "editor",
    //   createdAt: "2023-12-22T00:00:00.000Z"
    // },
  ],

  // 查询所有
  getUsers: () => get().users,

  // 新增
  addUser: (user) =>
    set((state) => ({
      users: [
        ...state.users,
        {
          id: nanoid(),
          createdAt: new Date().toISOString(),
          ...user,
        },
      ],
    })),

  // 更新
  updateUser: (id, updates) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === id ? { ...u, ...updates } : u
      ),
    })),

  // 删除
  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
    })),

  // 查询单个
  getUserById: (id) => get().users.find((u) => u.id === id),
}));
