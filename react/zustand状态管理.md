react 中 zustand全局状态管理

一、npm i zustand      //安装依赖

二、创建store（全局状态）
```
import { create } from "zustand";

// 定义全局状态
export const useCounterStore = create((set, get) => ({
  count: 0,
  // 方法：增加
  increase: () => set({ count: get().count + 1 }),
  // 方法：减少
  decrease: () => set({ count: get().count - 1 }),
  // 方法：重置
  reset: () => set({ count: 0 }),
  // 方法：获取当前值
  getCount: () => get().count,
}));
```
