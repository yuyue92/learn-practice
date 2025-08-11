export type User = { id: string; name: string; email: string; age?: number }
export type Product = { id: string; name: string; price: number; stock: number }

export const users: User[] = [
  { id: 'u1', name: 'Alice', email: 'alice@example.com', age: 28 },
  { id: 'u2', name: 'Bob', email: 'bob@example.com', age: 32 },
  { id: 'u3', name: 'Charlie', email: 'charlie@example.com', age: 22 }
]

export const products: Product[] = [
  { id: 'p1', name: '压缩机 X100', price: 1280, stock: 12 },
  { id: 'p2', name: '过滤器 F2', price: 80, stock: 100 },
  { id: 'p3', name: '润滑油 L1', price: 45, stock: 200 }
]
