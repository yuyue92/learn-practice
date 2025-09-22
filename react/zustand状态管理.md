react 中 zustand全局状态管理

一、npm i zustand      //安装依赖

二、创建store（全局状态）//src/store/useCounter.js
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

三、在组件中使用
```
import React from "react";
import { useCounterStore } from "./store/useCounter";

export default function App() {
  // 从 store 中取状态和方法
  const { count, increase, decrease, reset, getCount } = useCounterStore();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-100">
      <h1 className="text-2xl font-bold">Zustand 示例</h1>
      <p className="text-lg">当前计数：{count}</p>

      <div className="flex gap-3">
        <button
          onClick={increase}
          className="px-4 py-2 rounded bg-green-500 text-white"
        >
          +1
        </button>
        <button
          onClick={decrease}
          className="px-4 py-2 rounded bg-red-500 text-white"
        >
          -1
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 rounded bg-gray-500 text-white"
        >
          重置
        </button>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        getCount() 直接读取：{getCount()}
      </div>
    </div>
  );
}
```
