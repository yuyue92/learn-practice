# TypeScript 进阶 8 周计划（前端向）

> 适合人群：有 TS 基础、写过 React/Vue 项目、但对泛型 / 条件类型 / 类型运算掌握不牢的前端开发者。
> 节奏：每天约 1 小时（**学 30 分钟 + 练 30 分钟**），每周 5 个学习日 + 1 个周项目日 + 1 天复盘。
> 工具：全程使用 [TS Playground](https://www.typescriptlang.org/play)，**鼠标悬停看推断结果**是第一生产力。

---

## 目录

- [使用说明](#使用说明)
- [第 1 周：类型收窄与基础功](#第-1-周类型收窄与基础功)
- [第 2 周：泛型](#第-2-周泛型)
- [第 3 周：工具类型与映射类型](#第-3-周工具类型与映射类型)
- [第 4 周：条件类型与 infer](#第-4-周条件类型与-infer)
- [第 5 周：模板字面量、递归、元组、变型](#第-5-周模板字面量递归元组变型)
- [第 6 周：React + TypeScript](#第-6-周react--typescript)
- [第 7 周：前端工程中的类型设计](#第-7-周前端工程中的类型设计)
- [第 8 周：综合实战与查漏补缺](#第-8-周综合实战与查漏补缺)
- [附录 A：重难点速查表](#附录-a重难点速查表)
- [附录 B：常见报错解读](#附录-b常见报错解读)
- [附录 C：资源清单](#附录-c资源清单)

---

## 使用说明

1. **先自己写，再看答案。** 每道题的答案都折叠在 `<details>` 里，卡住 15 分钟再展开。
2. **每天固定流程：** 读概念 → 在 Playground 敲示例 → 故意写错看报错 → 做练习。
3. **建立错题本：** 做错的类型题记录"为什么错"，每周复盘时重做。
4. **难度标记：** ⭐ 基础　⭐⭐ 中等　⭐⭐⭐ 困难
5. **开启严格模式**，所有练习默认在 `strict: true` 下完成。

推荐 tsconfig：

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "skipLibCheck": true
  }
}
```

---

# 第 1 周：类型收窄与基础功

**本周目标：** 把"收窄"练成肌肉记忆。后面所有高级类型，本质都是在"让编译器知道更多信息"。

## Day 1：类型系统的底层逻辑

**学习内容**
- 结构化类型：TS 比较"形状"，不比较名字
- 类型擦除：类型只存在于编译期
- 类型是"值的集合"：`string` 是所有字符串的集合，`"a"` 是只含一个元素的集合，`never` 是空集
- 子类型 = 子集：`"a"` 是 `string` 的子类型，所以可以赋值给 `string`

```ts
interface Point { x: number; y: number }
const p = { x: 1, y: 2, z: 3 };
const q: Point = p;            // ✅ 变量赋值不做多余属性检查
const r: Point = { x: 1, y: 2, z: 3 }; // ❌ 字面量会触发"多余属性检查"
```

**练习**
1. ⭐ 下面哪几行会报错？先预测再验证。
```ts
type A = { name: string };
type B = { name: string; age: number };
let a: A = { name: "a" };
let b: B = { name: "b", age: 1 };
a = b;           // (1)
b = a;           // (2)
const c: A = { name: "c", age: 2 }; // (3)
```
2. ⭐ 用"集合"的角度解释：为什么 `string | number` 能赋值给 `string | number | boolean`，反过来不行？
3. ⭐⭐ 找一个你项目里的 `.ts` 文件，开启 `strict` 并修掉所有报错（不用 `any`）。

<details><summary>参考答案</summary>

1. (1) ✅ B 有 A 需要的全部属性；(2) ❌ 缺 `age`；(3) ❌ 字面量多余属性检查。
2. 前者集合是后者的子集，子集可以放进超集里，反之不行。

</details>

---

## Day 2：`unknown` / `never` / 字面量 / `as const` / `satisfies`

**学习内容**
- `any` 关闭检查，`unknown` 要求先收窄
- `never` 的两个用途：不可能的分支、穷尽检查
- `as const`：把对象/数组冻结成最窄的字面量类型
- `satisfies`：校验类型但**保留**字面量推断

```ts
const ROUTES = {
  home: "/",
  user: "/user",
} as const;
type RouteKey = keyof typeof ROUTES;          // "home" | "user"
type RoutePath = (typeof ROUTES)[RouteKey];   // "/" | "/user"

const theme = {
  primary: "#1677ff",
  gap: 8,
} satisfies Record<string, string | number>;
theme.primary.toUpperCase(); // ✅ 仍是 string，而不是 string | number
```

**练习**
1. ⭐ 用 `as const` 定义 `const SIZES = ["sm", "md", "lg"]`，并派生出 `type Size = "sm" | "md" | "lg"`（不允许手写联合）。
2. ⭐⭐ 用 `satisfies` 定义一个主题配置，要求：key 必须是 `"light" | "dark"`，value 必须含 `bg` 和 `fg`，同时 `theme.light.bg` 保持字面量类型。
3. ⭐⭐ 解释 `const x = { a: 1 } as const` 与 `const x: { a: number } = { a: 1 }` 的区别。

<details><summary>参考答案</summary>

```ts
// 1
const SIZES = ["sm", "md", "lg"] as const;
type Size = (typeof SIZES)[number];

// 2
const theme = {
  light: { bg: "#fff", fg: "#000" },
  dark: { bg: "#000", fg: "#fff" },
} as const satisfies Record<"light" | "dark", { bg: string; fg: string }>;
```
3. 前者：`a` 是 `readonly` 且类型为字面量 `1`；后者：`a` 是可变的 `number`。

</details>

---

## Day 3：类型收窄（Narrowing）

**学习内容**
- `typeof` / `instanceof` / `in` / 真值收窄 / 相等收窄
- 自定义守卫 `x is T`、断言函数 `asserts x is T`
- 收窄在回调、闭包里会失效（理解原因）

```ts
function isString(x: unknown): x is string {
  return typeof x === "string";
}

function assertNonNull<T>(x: T): asserts x is NonNullable<T> {
  if (x == null) throw new Error("null!");
}
```

**练习**
1. ⭐ 写 `isNonEmptyArray<T>(arr: T[]): arr is [T, ...T[]]`。
2. ⭐⭐ 写 `isUser(x: unknown): x is User`，`User = { id: number; name: string; tags?: string[] }`，要求完全不用 `any`/`as`。
3. ⭐⭐ 为什么下面 `u.name` 在回调里报错？怎么修？
```ts
function f(u: { name?: string }) {
  if (!u.name) return;
  [1, 2].forEach(() => console.log(u.name.length));
}
```
（提示：看你的 TS 版本，较新版本对 `const`/只读参数有改进，理解"可变属性可能被改"的原因即可。）

<details><summary>参考答案</summary>

```ts
// 1
function isNonEmptyArray<T>(arr: T[]): arr is [T, ...T[]] {
  return arr.length > 0;
}
// 2
function isUser(x: unknown): x is User {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Record<string, unknown>; // 此处 as 是对 object 的安全窄化，若要完全不用 as，可用 "in" 逐项收窄
  return (
    typeof o.id === "number" &&
    typeof o.name === "string" &&
    (o.tags === undefined ||
      (Array.isArray(o.tags) && o.tags.every((t) => typeof t === "string")))
  );
}
// 3 修复：先取局部常量
const name = u.name; if (!name) return; ... name.length
```
</details>

---

## Day 4：可辨识联合 + 穷尽检查（前端最常用模式）

**学习内容**
- 用一个公共字面量字段（`type` / `status` / `kind`）区分联合成员
- `never` 穷尽检查，新增分支时编译器自动提醒
- 状态建模原则：**让非法状态无法表示**

```ts
// ❌ 反例：可以同时 loading 且有 error
type BadState = { loading: boolean; data?: string; error?: string };

// ✅ 正例
type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: string }
  | { status: "error"; error: Error };

function assertNever(x: never): never {
  throw new Error("Unexpected: " + JSON.stringify(x));
}
```

**练习**
1. ⭐ 为 `State` 写 `renderState(s: State): string`，使用 `assertNever` 做穷尽检查，再给 `State` 加一个 `"empty"` 分支，观察报错。
2. ⭐⭐ 用可辨识联合建模 Redux 风格 action：`add` / `remove` / `toggle` / `clear`，写出 `reducer`。
3. ⭐⭐ 把表单字段建模成联合：`text` 有 `maxLength`，`select` 有 `options`，`checkbox` 有 `checked`。

<details><summary>参考答案</summary>

```ts
type Action =
  | { type: "add"; text: string }
  | { type: "remove"; id: number }
  | { type: "toggle"; id: number }
  | { type: "clear" };

interface Todo { id: number; text: string; done: boolean }

function reducer(state: Todo[], a: Action): Todo[] {
  switch (a.type) {
    case "add": return [...state, { id: Date.now(), text: a.text, done: false }];
    case "remove": return state.filter((t) => t.id !== a.id);
    case "toggle": return state.map((t) => (t.id === a.id ? { ...t, done: !t.done } : t));
    case "clear": return [];
    default: return assertNever(a);
  }
}
```
</details>

---

## Day 5：函数类型、重载、变型初探

**学习内容**
- 函数重载：签名列表 + 实现签名（实现签名对外不可见）
- `this` 参数
- 参数**逆变**（`strictFunctionTypes`）：参数更宽的函数可以赋给参数更窄的位置
- 方法简写 vs 属性函数写法的差异（方法是双变的）

```ts
type Handler = (e: MouseEvent) => void;
const h1: Handler = (e: Event) => {};      // ✅ 参数更宽，安全
// const h2: Handler = (e: PointerEvent) => {}; // ❌ 参数更窄，不安全
```

**练习**
1. ⭐⭐ 写 `toArray` 的重载：传 `string` 返回 `string[]`，传 `number` 返回 `number[]`。
2. ⭐⭐ 不看答案判断：`(a: string | number) => void` 能否赋给 `(a: string) => void`？反过来呢？为什么？
3. ⭐⭐⭐ 给 `document.addEventListener` 风格的函数写类型：`on("click", e => ...)` 里 `e` 自动是 `MouseEvent`，`on("keydown", e => ...)` 里是 `KeyboardEvent`（提示：用 `HTMLElementEventMap`，第 2 周会学泛型，本题可提前尝试）。

<details><summary>参考答案</summary>

2. 前者可以赋给后者（逆变：接受更宽的更安全）；反过来不行。
3. 
```ts
function on<K extends keyof HTMLElementEventMap>(
  type: K,
  handler: (e: HTMLElementEventMap[K]) => void
): void {}
on("click", (e) => e.clientX);   // MouseEvent
on("keydown", (e) => e.key);     // KeyboardEvent
```
</details>

---

## Day 6：周项目 —— 类型安全的 `useAsync`

实现一个 `useAsync` 状态管理（不依赖 React 也行，先实现纯函数版 reducer）：

- 状态用可辨识联合表示 `idle | loading | success | error`
- 提供 `reducer` 与 `assertNever`
- 单测里验证：`success` 状态下才能访问 `data`

**验收标准：** 没有任何 `any` / `as` / `!`。

## Day 7：复盘

- 重做本周做错的题
- 用自己的话写下三条："收窄是什么"、"为什么要可辨识联合"、"逆变是什么"

---

# 第 2 周：泛型

**本周目标：** 能读懂并写出常见泛型函数/接口，理解"类型参数就是类型层面的函数参数"。

## Day 1：泛型基础与推断

**学习内容**
- 泛型 = 类型的"参数化"
- TS 如何从实参推断 `T`
- 何时需要显式传类型参数 `fn<string>(...)`

```ts
function identity<T>(x: T): T { return x; }
identity(1);        // T = 1 (字面量)；const 变量时更窄
identity<string>("a");

function pair<A, B>(a: A, b: B): [A, B] { return [a, b]; }
```

**练习**
1. ⭐ 写 `last<T>(arr: T[]): T | undefined`。
2. ⭐ 写 `swap<A, B>(t: [A, B]): [B, A]`。
3. ⭐⭐ 写 `groupBy<T, K extends string | number>(arr: T[], fn: (x: T) => K): Record<K, T[]>`（暂时可用 `Partial<Record<K,T[]>>` 更严谨）。

<details><summary>参考答案</summary>

```ts
const last = <T,>(arr: T[]): T | undefined => arr[arr.length - 1];
const swap = <A, B>(t: [A, B]): [B, A] => [t[1], t[0]];
function groupBy<T, K extends string | number>(arr: T[], fn: (x: T) => K) {
  const res = {} as Partial<Record<K, T[]>>;
  for (const x of arr) (res[fn(x)] ??= []).push(x);
  return res;
}
```
> 注意：`.tsx` 文件中箭头泛型要写成 `<T,>`，避免与 JSX 混淆。
</details>

---

## Day 2：泛型约束、`keyof`、索引访问类型

**学习内容**
- `T extends Constraint`
- `keyof T`、`T[K]`
- 经典组合：`<T, K extends keyof T>`

```ts
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
const user = { id: 1, name: "a" };
getProp(user, "name");  // string
// getProp(user, "age"); // ❌
```

**练习**
1. ⭐⭐ 写 `pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>`。
2. ⭐⭐ 写 `setProp`，要求 `value` 类型与 `obj[key]` 一致。
3. ⭐⭐ 写 `pluck<T, K extends keyof T>(arr: T[], key: K): T[K][]`。
4. ⭐⭐⭐ 写 `sortBy<T>(arr: T[], key: keyof T)`，再思考：如何让 key 只能是"值为 number 的属性"？

<details><summary>参考答案</summary>

```ts
function setProp<T, K extends keyof T>(obj: T, key: K, value: T[K]) { obj[key] = value; }

// 4：只允许 number 属性
type NumberKeys<T> = { [K in keyof T]: T[K] extends number ? K : never }[keyof T];
function sortByNum<T>(arr: T[], key: NumberKeys<T>) {
  return [...arr].sort((a, b) => (a[key] as number) - (b[key] as number));
}
```
（`NumberKeys` 会在第 3~4 周详解，这里先见个面。）
</details>

---

## Day 3：泛型接口 / 默认类型 / `const` 类型参数 / `NoInfer`

**学习内容**
- 泛型 `interface` / `type` / `class`
- 默认类型参数 `<T = string>`
- `const T`（TS 5.0+）：让字面量推断得更窄
- `NoInfer<T>`（TS 5.4+）：阻止某个位置参与推断

```ts
interface ApiResponse<T = unknown> { code: number; data: T }

function defineRoutes<const T extends readonly string[]>(routes: T): T { return routes; }
const r = defineRoutes(["home", "user"]); // readonly ["home","user"]

function createState<T>(initial: T, fallback: NoInfer<T>) {}
```

**练习**
1. ⭐ 定义分页响应 `PageResult<T>`，并写一个 `fetchPage<T>(url: string): Promise<PageResult<T>>`。
2. ⭐⭐ 实现泛型类 `Stack<T>`（`push` / `pop` / `peek`）。
3. ⭐⭐ 实现 `createStore<S>(initial: S)`，返回 `{ get(): S; set(patch: Partial<S>): void }`。
4. ⭐⭐⭐ 实现 `defineEnum`，让 `defineEnum(["A","B"])` 的返回类型能得出 `"A" | "B"`，不使用 `as const`（用 `const T`）。

---

## Day 4：从值派生类型（`typeof` / `ReturnType` / `Parameters` / `Awaited`）

**学习内容**
- 以"值为唯一真相来源"，类型从值推导，避免重复定义
- `ReturnType<typeof fn>`、`Parameters<typeof fn>`、`Awaited<ReturnType<typeof asyncFn>>`

```ts
async function fetchUser() { return { id: 1, name: "a" }; }
type User = Awaited<ReturnType<typeof fetchUser>>;
```

**练习**
1. ⭐ 从 `const config = { api: "/x", retry: 3 }` 派生 `type Config`。
2. ⭐⭐ 给定 `const handlers = { onClick(e: MouseEvent){}, onKey(e: KeyboardEvent){} }`，派生"所有 handler 的参数类型联合"。
3. ⭐⭐ 手写 `MyReturnType`（需要 `infer`，可先看第 4 周；也可以先尝试，不会就跳过，第 4 周回来做）。

<details><summary>参考答案</summary>

```ts
type Config = typeof config;
type HandlerArgs = Parameters<(typeof handlers)[keyof typeof handlers]>[0]; // MouseEvent | KeyboardEvent
```
</details>

---

## Day 5：泛型实战 —— 类型安全的 EventEmitter

```ts
type Events = {
  login: { userId: string };
  logout: void;
  error: Error;
};
```

目标：`emitter.on("login", (p) => p.userId)` 中 `p` 自动是 `{ userId: string }`。

**练习**
1. ⭐⭐⭐ 实现 `Emitter<E extends Record<string, unknown>>`，包含 `on` / `off` / `emit`。
2. ⭐⭐⭐ 让 `emit("logout")` 不需要传第二个参数，而 `emit("login")` 必须传（提示：条件类型 + 剩余参数元组，`...args: E[K] extends void ? [] : [E[K]]`）。

<details><summary>参考答案</summary>

```ts
class Emitter<E extends Record<string, unknown>> {
  private map: { [K in keyof E]?: Array<(p: E[K]) => void> } = {};

  on<K extends keyof E>(type: K, fn: (p: E[K]) => void) {
    (this.map[type] ??= []).push(fn);
  }
  off<K extends keyof E>(type: K, fn: (p: E[K]) => void) {
    this.map[type] = this.map[type]?.filter((f) => f !== fn);
  }
  emit<K extends keyof E>(
    type: K,
    ...args: E[K] extends void ? [] : [E[K]]
  ) {
    this.map[type]?.forEach((fn) => fn(args[0] as E[K]));
  }
}
```
</details>

---

## Day 6：周项目 —— 泛型 `request` 封装

```ts
const api = createApi({
  getUser: { method: "GET", path: "/user/:id" },
  createPost: { method: "POST", path: "/post" },
});
```

要求（先做基础版，工程化版放第 7 周）：
- 每个接口声明响应类型
- `request<K extends keyof Endpoints>(name: K, ...)` 返回 `Promise<Endpoints[K]["res"]>`

## Day 7：复盘

手写默写：`getProp`、`pick`、`Emitter` 的类型签名，不看资料。

---

# 第 3 周：工具类型与映射类型

**本周目标：** 把 `Partial / Pick / Omit / Record` 等内置工具类型**自己实现一遍**。

## Day 1：内置工具类型"会用"

| 工具类型 | 作用 | 前端场景 |
|---|---|---|
| `Partial<T>` | 全部可选 | 表单草稿、更新 patch |
| `Required<T>` | 全部必选 | 默认值合并后 |
| `Readonly<T>` | 全部只读 | 配置、props |
| `Pick<T,K>` / `Omit<T,K>` | 选/排除属性 | 组件 props 继承 |
| `Record<K,V>` | 构造对象类型 | 字典、枚举映射 |
| `Exclude / Extract` | 联合筛选 | 事件名、变体筛选 |
| `NonNullable<T>` | 去掉 null/undefined | |
| `ReturnType / Parameters` | 函数派生 | |

**练习**
1. ⭐ 给一个 `User`，用工具类型得到：创建表单类型（去掉 `id` 和 `createdAt`）、更新类型（全部可选且不含 `id`）。
2. ⭐⭐ 给 `Button` 组件写 props：继承 `<button>` 原生属性，但覆盖 `type` 为 `"primary" | "ghost"`（提示：`Omit<ComponentProps<"button">, "type">`）。

---

## Day 2：手写工具类型（上）

**练习**（不看源码，写完用 Playground 对比）
1. ⭐⭐ `MyPartial<T>`、`MyRequired<T>`、`MyReadonly<T>`
2. ⭐⭐ `MyPick<T, K extends keyof T>`
3. ⭐⭐ `MyRecord<K extends keyof any, V>`

<details><summary>参考答案</summary>

```ts
type MyPartial<T> = { [K in keyof T]?: T[K] };
type MyRequired<T> = { [K in keyof T]-?: T[K] };
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };
type MyRecord<K extends keyof any, V> = { [P in K]: V };
```
`-?` 和 `-readonly` 是"移除修饰符"。
</details>

---

## Day 3：键重映射（Key Remapping）与过滤

**学习内容**
- `as` 子句：重命名 key，或者映射到 `never` 来过滤 key
- 配合模板字面量生成新键名

```ts
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};
type OnlyString<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};
```

**练习**
1. ⭐⭐ 实现 `Setters<T>`：`{ name: string }` → `{ setName: (v: string) => void }`。
2. ⭐⭐ 实现 `OmitByType<T, U>`：删掉值类型是 `U` 的属性。
3. ⭐⭐⭐ 实现 `Mutable<T>`（去掉 readonly）。
4. ⭐⭐⭐ 实现 `RequiredKeys<T>` 与 `OptionalKeys<T>`（返回联合）。

<details><summary>参考答案</summary>

```ts
type Setters<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (v: T[K]) => void;
};
type OmitByType<T, U> = { [K in keyof T as T[K] extends U ? never : K]: T[K] };
type Mutable<T> = { -readonly [K in keyof T]: T[K] };
type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];
type RequiredKeys<T> = Exclude<keyof T, OptionalKeys<T>>;
```
</details>

---

## Day 4：`Exclude` / `Extract` / `Omit` 原理 + 分布式初见

```ts
type MyExclude<T, U> = T extends U ? never : T;
type MyExtract<T, U> = T extends U ? T : never;
type MyOmit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

**练习**
1. ⭐⭐ 实现 `MyExclude`、`MyExtract`、`MyNonNullable`、`MyOmit`。
2. ⭐⭐⭐ 为什么内置 `Omit` 对**联合类型**不会分发？写出一个会分发的 `DistributiveOmit<T, K>`。

<details><summary>参考答案</summary>

`Omit<A | B, "x">` 中 `keyof (A|B)` 只取公共键，结果被"压扁"。
```ts
type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;
```
</details>

---

## Day 5：实战 —— 表单类型工具

给定：
```ts
interface Profile { name: string; age: number; tags: string[]; address: { city: string } }
```
**练习**
1. ⭐⭐ `FormErrors<T>`：每个字段对应 `string | undefined`。
2. ⭐⭐ `TouchedMap<T>`：每个字段对应 `boolean`。
3. ⭐⭐⭐ `FormState<T>` = `{ values: T; errors: FormErrors<T>; touched: TouchedMap<T> }`，并写 `setField<K extends keyof T>(k: K, v: T[K])`。

## Day 6：周项目 —— 迷你 `type-fest`

自己实现并带测试用例（用 `Equal` 断言类型）：
`Mutable` / `DeepPartial` / `PickByType` / `OmitByType` / `RequiredKeys` / `OptionalKeys` / `Merge<A, B>`

类型断言工具：
```ts
type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
type Expect<T extends true> = T;
type _t1 = Expect<Equal<Mutable<{ readonly a: 1 }>, { a: 1 }>>;
```

## Day 7：复盘

---

# 第 4 周：条件类型与 infer

**本周目标：** 彻底搞懂 `T extends U ? X : Y`、`infer`、分布式行为。这是 TS 最大的分水岭。

## Day 1：条件类型基础

**学习内容**
- 语法：`T extends U ? X : Y`，可理解为类型层面的 `if`
- `extends` 在这里表示"可赋值给"
- 条件类型可以嵌套（相当于 `else if`）

```ts
type IsString<T> = T extends string ? true : false;
type A = IsString<"a">;    // true
type B = IsString<number>; // false

type TypeName<T> =
  T extends string ? "string" :
  T extends number ? "number" :
  T extends boolean ? "boolean" :
  "object";
```

**练习**
1. ⭐ `IsArray<T>`、`IsFunction<T>`。
2. ⭐⭐ `If<C extends boolean, T, F>`。
3. ⭐⭐ `Flatten<T>`：`Flatten<string[]>` 得 `string`，`Flatten<number>` 得 `number`（先不用 `infer`，用 `T extends any[] ? T[number] : T`）。

<details><summary>参考答案</summary>

```ts
type IsArray<T> = T extends any[] ? true : false;
type IsFunction<T> = T extends (...args: any[]) => any ? true : false;
type If<C extends boolean, T, F> = C extends true ? T : F;
type Flatten<T> = T extends any[] ? T[number] : T;
```
</details>

---

## Day 2：`infer`（"在条件里捕获类型"）

```ts
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type ElementOf<T> = T extends (infer E)[] ? E : never;
```

**练习**
1. ⭐⭐ `MyReturnType`、`MyParameters`
2. ⭐⭐ `FirstArg<F>`：取函数第一个参数
3. ⭐⭐ `PropType<T, K>`：`T extends { [P in K]: infer V } ? V : never`
4. ⭐⭐⭐ `ComponentProps` 类似物：`PropsOf<C>`，从 `(props: infer P) => any` 取出组件 props

<details><summary>参考答案</summary>

```ts
type MyParameters<T> = T extends (...args: infer P) => any ? P : never;
type FirstArg<F> = F extends (first: infer A, ...rest: any[]) => any ? A : never;
type PropsOf<C> = C extends (props: infer P) => any ? P : never;
```
</details>

---

## Day 3：分布式条件类型（高频坑点）

**规则：** 当条件类型的"被检查类型"是**裸类型参数**，且传入联合类型时，会对联合成员**逐个**计算再合并。

```ts
type ToArray<T> = T extends any ? T[] : never;
type R1 = ToArray<string | number>;   // string[] | number[]   ← 分发

type ToArrayNoDist<T> = [T] extends [any] ? T[] : never;
type R2 = ToArrayNoDist<string | number>; // (string | number)[] ← 阻止分发
```

**必须记住的两个坑：**
1. `never` 是"空联合"，分发时结果直接是 `never`：`IsNever<never>` 写成 `T extends never ? true : false` 会得到 `never`，正确写法是 `[T] extends [never] ? true : false`。
2. `boolean` 本质是 `true | false`，会被分发。

**练习**
1. ⭐⭐ 预测以下结果，再验证：
```ts
type T1 = ToArray<never>;
type T2 = ToArray<boolean>;
type T3 = ToArrayNoDist<never>;
```
2. ⭐⭐ 实现 `IsNever<T>`、`IsUnion<T>`。
3. ⭐⭐⭐ 实现 `Includes<Arr extends readonly unknown[], U>`（要求能区分 `1` 与 `number`，需要 `Equal`）。

<details><summary>参考答案</summary>

1. `never`、`false[] | true[]`、`never[]`。
```ts
type IsNever<T> = [T] extends [never] ? true : false;
type IsUnion<T, U = T> = [T] extends [never] ? false : T extends any ? ([U] extends [T] ? false : true) : never;
type Includes<A extends readonly unknown[], U> =
  A extends [infer H, ...infer R] ? (Equal<H, U> extends true ? true : Includes<R, U>) : false;
```
</details>

---

## Day 4：`infer` 进阶 —— 元组、递归、约束

```ts
type First<T extends any[]> = T extends [infer H, ...any[]] ? H : never;
type Last<T extends any[]> = T extends [...any[], infer L] ? L : never;
type MyAwaited<T> = T extends PromiseLike<infer U> ? MyAwaited<U> : T;
type InferStr<T> = T extends `${infer H}${string}` ? H : never; // 与第 5 周衔接
type StrNum<T> = T extends `${infer N extends number}` ? N : never; // infer ... extends
```

**练习**
1. ⭐⭐ `Push<T, V>`、`Unshift<T, V>`、`Concat<A, B>`
2. ⭐⭐ `Pop<T>`、`Shift<T>`
3. ⭐⭐⭐ 实现 `MyAwaited`，支持嵌套 `Promise<Promise<string>>`
4. ⭐⭐⭐ `Reverse<T extends any[]>`

<details><summary>参考答案</summary>

```ts
type Push<T extends any[], V> = [...T, V];
type Pop<T extends any[]> = T extends [...infer R, any] ? R : [];
type Shift<T extends any[]> = T extends [any, ...infer R] ? R : [];
type Reverse<T extends any[]> = T extends [infer H, ...infer R] ? [...Reverse<R>, H] : [];
```
</details>

---

## Day 5：条件类型的"判断工具箱"

**练习**（每题都用 `Expect<Equal<...>>` 写测试）
1. ⭐⭐ `IsAny<T>`：利用 `0 extends 1 & T`
2. ⭐⭐ `IsTuple<T>`：与普通数组区分（`number extends T["length"]`）
3. ⭐⭐⭐ `UnionToIntersection<U>`
4. ⭐⭐⭐ `UnionToTuple<U>`（挑战题，可看答案学习，重点理解为什么需要 UnionToIntersection + 函数重载推断最后一个成员）

<details><summary>参考答案</summary>

```ts
type IsAny<T> = 0 extends 1 & T ? true : false;
type IsTuple<T> = T extends readonly any[] ? (number extends T["length"] ? false : true) : false;
type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
```
关键原理：函数参数位置是**逆变**，多个候选会被推断为**交叉类型**。
</details>

---

## Day 6：周项目 —— type-challenges Easy 全通

在 [type-challenges](https://github.com/type-challenges/type-challenges) 完成：
`Pick` `Readonly` `Tuple to Object` `First of Array` `Length of Tuple` `Exclude` `Awaited` `If` `Concat` `Includes` `Push` `Unshift` `Parameters`

## Day 7：复盘

自测：不看资料，解释 `[T] extends [never]` 为什么能判断 `never`。

---

# 第 5 周：模板字面量、递归、元组、变型

## Day 1：模板字面量类型 + 字符串工具

```ts
type EventName<T extends string> = `on${Capitalize<T>}`;
type Size = "sm" | "md";
type Color = "red" | "blue";
type ClassName = `${Size}-${Color}`; // "sm-red" | "sm-blue" | "md-red" | "md-blue"
```
内置：`Uppercase` `Lowercase` `Capitalize` `Uncapitalize`

**练习**
1. ⭐ 生成 CSS 单位类型 ``type Px = `${number}px` ``，并写一个只接受它的函数。
2. ⭐⭐ `CamelCase<"foo-bar-baz">` → `"fooBarBaz"`
3. ⭐⭐ `KebabCase<"fooBarBaz">` → `"foo-bar-baz"`
4. ⭐⭐ `Trim<S>`、`TrimLeft<S>`

<details><summary>参考答案</summary>

```ts
type CamelCase<S extends string> =
  S extends `${infer H}-${infer T}` ? `${H}${CamelCase<Capitalize<T>>}` : S;
type TrimLeft<S extends string> = S extends ` ${infer R}` ? TrimLeft<R> : S;
type TrimRight<S extends string> = S extends `${infer R} ` ? TrimRight<R> : S;
type Trim<S extends string> = TrimLeft<TrimRight<S>>;
```
</details>

---

## Day 2：模板字面量 + `infer`：字符串解析

```ts
type Split<S extends string, D extends string> =
  S extends `${infer H}${D}${infer T}` ? [H, ...Split<T, D>] : [S];

// 前端经典：从路由中提取参数
type RouteParams<P extends string> =
  P extends `${string}:${infer Param}/${infer Rest}`
    ? Param | RouteParams<`/${Rest}`>
    : P extends `${string}:${infer Param}`
      ? Param
      : never;

type P = RouteParams<"/user/:id/post/:postId">; // "id" | "postId"
```

**练习**
1. ⭐⭐ `Split`、`Join`
2. ⭐⭐ `ReplaceAll<S, From, To>`
3. ⭐⭐⭐ `ParseQuery<"a=1&b=2">` → `{ a: "1"; b: "2" }`
4. ⭐⭐⭐ 基于 `RouteParams` 写 `buildPath(path, params)`，保证 params 的 key 与路径参数完全匹配。

<details><summary>参考答案</summary>

```ts
type ReplaceAll<S extends string, F extends string, T extends string> =
  F extends "" ? S :
  S extends `${infer H}${F}${infer R}` ? `${H}${T}${ReplaceAll<R, F, T>}` : S;

type ParseQuery<Q extends string> =
  Q extends `${infer K}=${infer V}&${infer R}`
    ? { [P in K]: V } & ParseQuery<R>
    : Q extends `${infer K}=${infer V}` ? { [P in K]: V } : {};

declare function buildPath<P extends string>(path: P, params: Record<RouteParams<P>, string | number>): string;
```
</details>

---

## Day 3：递归类型

```ts
type DeepReadonly<T> =
  T extends (...args: any[]) => any ? T :
  T extends object ? { readonly [K in keyof T]: DeepReadonly<T[K]> } : T;
```

**学习内容**
- 递归终止条件
- 函数/数组/Date 等特殊对象要单独处理
- 递归深度限制（约 1000 层，尾递归优化后更深）

**练习**
1. ⭐⭐ `DeepPartial<T>`、`DeepRequired<T>`
2. ⭐⭐⭐ `Paths<T>`：`{ a: { b: string }; c: number }` → `"a" | "a.b" | "c"`（用于 `lodash.get` 风格的类型安全取值）
3. ⭐⭐⭐ `PathValue<T, P>`：根据路径取值类型
4. ⭐⭐⭐ 用 `Paths` + `PathValue` 实现 `get(obj, "a.b")`

<details><summary>参考答案</summary>

```ts
type Paths<T> = T extends object
  ? { [K in keyof T & string]: T[K] extends object ? K | `${K}.${Paths<T[K]>}` : K }[keyof T & string]
  : never;

type PathValue<T, P extends string> =
  P extends `${infer H}.${infer R}`
    ? H extends keyof T ? PathValue<T[H], R> : never
    : P extends keyof T ? T[P] : never;

declare function get<T, P extends Paths<T>>(obj: T, path: P): PathValue<T, P>;
```
</details>

---

## Day 4：元组类型与可变元组

**学习内容**
- 元组 `[A, B]`、可选元素 `[A, B?]`、剩余元素 `[A, ...B[]]`、具名元组
- 可变元组展开：`[...A, ...B]`
- `T["length"]` 是字面量 → 类型层面做算术

```ts
type Length<T extends readonly any[]> = T["length"];
type BuildTuple<N extends number, R extends any[] = []> =
  R["length"] extends N ? R : BuildTuple<N, [...R, unknown]>;
type Add<A extends number, B extends number> =
  [...BuildTuple<A>, ...BuildTuple<B>]["length"];
```

**练习**
1. ⭐⭐ `TupleToUnion<T>`、`TupleToObject<T>`
2. ⭐⭐ `Chunk<T, N>`（挑战）
3. ⭐⭐⭐ `Add<A, B>`、`Sub<A, B>`
4. ⭐⭐⭐ 给 `curry` 函数写类型

<details><summary>参考答案</summary>

```ts
type TupleToUnion<T extends readonly any[]> = T[number];
type TupleToObject<T extends readonly PropertyKey[]> = { [K in T[number]]: K };
type Sub<A extends number, B extends number> =
  BuildTuple<A> extends [...BuildTuple<B>, ...infer R] ? R["length"] : never;
```
</details>

---

## Day 5：协变 / 逆变 / 品牌类型

**学习内容**
- 协变：`Dog[]` 可赋给 `Animal[]`（只读场景安全）
- 逆变：函数参数位置，方向相反
- 不变：既读又写
- `in` / `out` 变型注解（TS 4.7+）
- 品牌类型：用 `& { __brand }` 在类型层面区分"同为 string 的 ID"

```ts
type Brand<T, B extends string> = T & { readonly __brand: B };
type UserId = Brand<string, "UserId">;
type OrderId = Brand<string, "OrderId">;
const toUserId = (s: string) => s as UserId;
declare function getUser(id: UserId): void;
// getUser("abc" as OrderId); // ❌
```

**练习**
1. ⭐⭐ 解释为什么 `Array<Dog>` 赋给 `Array<Animal>` TS 允许（但不绝对安全）。
2. ⭐⭐ 实现品牌类型 `Email`，写 `parseEmail(s: string): Email | null`，只有通过校验才能得到 `Email`。
3. ⭐⭐⭐ 用品牌类型区分 `px` 与 `rem` 数值，使 `add(px, rem)` 编译报错。

## Day 6：周项目 —— type-challenges Medium 前 15 题

建议顺序：`Get Return Type` → `Omit` → `Readonly 2` → `Deep Readonly` → `Tuple to Union` → `Chainable Options` → `Last of Array` → `Pop` → `Promise.all` → `Type Lookup` → `Trim Left` → `Trim` → `Capitalize` → `Replace` → `ReplaceAll`

## Day 7：复盘

---

# 第 6 周：React + TypeScript

**本周目标：** 把前三周的类型能力落到组件开发里，能写出"别人用起来有完整提示"的组件。

## Day 1：Props、children、事件类型

```tsx
import type { ReactNode, ComponentProps, MouseEvent } from "react";

interface CardProps {
  title: string;
  children?: ReactNode;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
}

// 继承原生属性
type InputProps = ComponentProps<"input"> & { label: string };
```

**要点**
- 不推荐 `React.FC`（隐式 children 的历史包袱已移除，但它对泛型组件不友好），直接写函数 + props 类型即可
- `ReactNode`（所有可渲染）vs `ReactElement`（JSX 元素）vs `JSX.Element`
- 常用事件：`ChangeEvent<HTMLInputElement>`、`FormEvent<HTMLFormElement>`、`KeyboardEvent<HTMLElement>`

**练习**
1. ⭐ 写 `Button` 组件，继承 `<button>` 全部属性，并新增 `variant: "primary" | "ghost"`、`loading?: boolean`。
2. ⭐⭐ 写 `TextField`，`onChange` 直接给出 `string` 而不是事件对象（同时不能丢掉原生 `onChange` 的覆盖冲突，提示：先 `Omit`）。
3. ⭐⭐ 解释：`ComponentProps<"button">` 与 `ComponentPropsWithoutRef<"button">` 的区别（`ref`）。

<details><summary>参考答案</summary>

```tsx
type ButtonProps = ComponentProps<"button"> & {
  variant: "primary" | "ghost";
  loading?: boolean;
};
type TextFieldProps = Omit<ComponentProps<"input">, "onChange" | "value"> & {
  value: string;
  onChange: (value: string) => void;
};
```
</details>

---

## Day 2：Hooks 类型

```tsx
const [user, setUser] = useState<User | null>(null);
const ref = useRef<HTMLInputElement>(null);     // DOM ref，初始 null
const timer = useRef<number | undefined>(undefined); // 可变值 ref

type Action = { type: "inc" } | { type: "set"; value: number };
const [n, dispatch] = useReducer(reducer, 0);
```

**练习**
1. ⭐⭐ 写 `useToggle(initial = false)`，返回 `[boolean, () => void]`；用 `as const` 或显式返回类型避免被推成数组。
2. ⭐⭐ 写泛型 `useLocalStorage<T>(key: string, initial: T)`，返回 `[T, (v: T | ((prev: T) => T)) => void]`。
3. ⭐⭐⭐ 写 `useAsync<T, Args extends any[]>(fn: (...args: Args) => Promise<T>)`，状态使用第 1 周的可辨识联合，`run(...args: Args)` 参数类型与 `fn` 完全一致。
4. ⭐⭐⭐ 写 `useDebounce<T>(value: T, delay: number): T`。

<details><summary>参考答案</summary>

```tsx
function useToggle(initial = false) {
  const [on, set] = useState(initial);
  return [on, () => set((v) => !v)] as const;
}
function useAsync<T, Args extends any[]>(fn: (...args: Args) => Promise<T>) {
  const [state, setState] = useState<AsyncState<T>>({ status: "idle" });
  const run = async (...args: Args) => {
    setState({ status: "loading" });
    try { setState({ status: "success", data: await fn(...args) }); }
    catch (e) { setState({ status: "error", error: e as Error }); }
  };
  return { state, run };
}
```
</details>

---

## Day 3：泛型组件

```tsx
interface ListProps<T> {
  items: readonly T[];
  getKey: (item: T) => string | number;
  renderItem: (item: T) => ReactNode;
}
function List<T>({ items, getKey, renderItem }: ListProps<T>) {
  return <ul>{items.map((i) => <li key={getKey(i)}>{renderItem(i)}</li>)}</ul>;
}
```

**练习**
1. ⭐⭐ 实现 `Select<T>`：`options: T[]`、`value: T`、`onChange: (v: T) => void`、`getLabel: (v: T) => string`。
2. ⭐⭐⭐ 实现 `Table<T>`：`columns: Array<{ key: keyof T; title: string; render?: (v: T[keyof T], row: T) => ReactNode }>`。再思考：如何让 `render` 的第一个参数精确对应所选 `key` 的值类型？（提示：把 `Column` 做成"分布式映射联合"）
3. ⭐⭐⭐ 给 `Table` 加排序：`sortKey` 只能是值为 `number | string` 的列。

<details><summary>参考答案（第 2 题精确版）</summary>

```tsx
type Column<T> = {
  [K in keyof T]: {
    key: K;
    title: string;
    render?: (value: T[K], row: T) => ReactNode;
  };
}[keyof T];

interface TableProps<T> { rows: T[]; columns: Column<T>[] }
```
</details>

---

## Day 4：多态组件（`as` prop）与 `forwardRef`

```tsx
type AsProp<C extends React.ElementType> = { as?: C };
type PolymorphicProps<C extends React.ElementType, P = {}> =
  P & AsProp<C> & Omit<React.ComponentPropsWithoutRef<C>, keyof (P & AsProp<C>)>;

function Text<C extends React.ElementType = "span">({
  as, ...rest
}: PolymorphicProps<C, { size?: "sm" | "lg" }>) {
  const Comp = as ?? "span";
  return <Comp {...rest} />;
}
<Text as="a" href="/x">link</Text>   // href 合法
// <Text as="span" href="/x" />        // ❌ span 没有 href
```

**练习**
1. ⭐⭐⭐ 实现 `Box`：`as` 可选，默认 `div`，属性随 `as` 变化。
2. ⭐⭐ 用 `forwardRef` 包装 `Input`，让外部 `ref` 指向原生 `<input>`（React 19 中 `ref` 可作为普通 prop，了解两种写法）。
3. ⭐⭐⭐ 让 `forwardRef` 组件保持泛型（常见痛点），写出类型断言包装。

---

## Day 5：互斥 props / 条件 props

```tsx
// 要么传 href（渲染 a），要么传 onClick（渲染 button），不能都传
type LinkProps = { href: string; onClick?: never };
type BtnProps = { onClick: () => void; href?: never };
type Props = (LinkProps | BtnProps) & { label: string };

// 受控 / 非受控
type Controlled = { value: string; onChange: (v: string) => void; defaultValue?: never };
type Uncontrolled = { defaultValue?: string; value?: never; onChange?: (v: string) => void };
```

**练习**
1. ⭐⭐ 写 `Modal` props：`closable: true` 时必须传 `onClose`；`closable: false` 时不能传 `onClose`。
2. ⭐⭐⭐ 写 `XOR<A, B>` 工具类型。
3. ⭐⭐⭐ 写 `Select` 支持单选 / 多选：`multiple: true` → `value: T[]`；否则 `value: T`。

<details><summary>参考答案</summary>

```ts
type Without<T, U> = { [K in Exclude<keyof T, keyof U>]?: never };
type XOR<A, B> = (Without<A, B> & B) | (Without<B, A> & A);

type SelectProps<T> =
  | { multiple: true;  value: T[]; onChange: (v: T[]) => void }
  | { multiple?: false; value: T;   onChange: (v: T) => void };
```
</details>

---

## Day 6：周项目 —— 类型安全的 `DataTable<T>`

要求：
- `columns` 中 `key` 与 `render` 的值类型严格对应
- `sortable` 只能出现在值为 `string | number | Date` 的列
- `onRowClick(row: T)`、`rowKey: keyof T | ((row: T) => Key)`
- `selectable` 为 `"single"` 时回调给 `T`，`"multiple"` 时给 `T[]`
- 无任何 `any`，测试用 `Expect<Equal<...>>` + `@ts-expect-error` 覆盖正反例

## Day 7：复盘

---

# 第 7 周：前端工程中的类型设计

## Day 1：Context 与自定义 Hook 的类型安全

```tsx
function createStrictContext<T>(name: string) {
  const Ctx = createContext<T | undefined>(undefined);
  const useCtx = () => {
    const v = useContext(Ctx);
    if (v === undefined) throw new Error(`${name} must be used within Provider`);
    return v;
  };
  return [Ctx.Provider, useCtx] as const;
}
```

**练习**
1. ⭐⭐ 用 `createStrictContext` 实现 `ThemeContext`、`AuthContext`。
2. ⭐⭐⭐ 实现简易 `createStore<S, A>`（reducer 风格）+ `useStore(selector)`：`selector` 的返回类型要自动推断为 hook 的返回类型。

---

## Day 2：API 层类型设计

```ts
interface Endpoints {
  "GET /users/:id":  { params: { id: string }; res: User };
  "GET /users":      { query?: { page?: number }; res: PageResult<User> };
  "POST /users":     { body: CreateUser; res: User };
}

type ReqOf<K extends keyof Endpoints> = Omit<Endpoints[K], "res">;
declare function request<K extends keyof Endpoints>(
  endpoint: K,
  ...args: keyof ReqOf<K> extends never ? [] : [ReqOf<K>]
): Promise<Endpoints[K]["res"]>;
```

**练习**
1. ⭐⭐ 补全上面 `request`，让无参接口调用时可省略第二个参数。
2. ⭐⭐⭐ 用 `RouteParams` 自动从 `"GET /users/:id"` 推导 `params`，不再手写。
3. ⭐⭐⭐ 给所有接口响应统一包一层 `{ code: number; data: T }`，`request` 的返回只暴露 `data`。

---

## Day 3：运行时校验与类型同源（Zod）

TS 类型在运行时不存在，**接口返回、表单输入、URL 参数、localStorage** 都应该做运行时校验。

```ts
import { z } from "zod";

const UserSchema = z.object({
  id: z.string(),
  age: z.number().int().min(0),
  role: z.enum(["admin", "user"]),
  email: z.string().email().optional(),
});
type User = z.infer<typeof UserSchema>;

const result = UserSchema.safeParse(json);
if (result.success) result.data; // User
```

**练习**
1. ⭐⭐ 用 Zod 定义登录表单 schema，并结合 `react-hook-form` 的 `zodResolver` 完成表单，字段名提示完整。
2. ⭐⭐ 写 `fetchJson<S extends z.ZodTypeAny>(url: string, schema: S): Promise<z.infer<S>>`。
3. ⭐⭐⭐ 手写一个迷你版 `v` 校验库：`v.string()`、`v.number()`、`v.object({...})`，并实现 `Infer<S>`，体会 Zod 的类型原理。

<details><summary>参考答案（第 3 题核心）</summary>

```ts
interface Schema<T> { parse(x: unknown): T }
type Infer<S> = S extends Schema<infer T> ? T : never;
const v = {
  string: (): Schema<string> => ({ parse: (x) => { if (typeof x !== "string") throw 0; return x; } }),
  number: (): Schema<number> => ({ parse: (x) => { if (typeof x !== "number") throw 0; return x; } }),
  object: <S extends Record<string, Schema<any>>>(shape: S): Schema<{ [K in keyof S]: Infer<S[K]> }> => ({
    parse: (x) => {
      if (typeof x !== "object" || x === null) throw 0;
      const out: any = {};
      for (const k in shape) out[k] = shape[k].parse((x as any)[k]);
      return out;
    },
  }),
};
```
</details>

---

## Day 4：类型安全的路由 / 导航

```ts
const routes = {
  home: "/",
  user: "/user/:id",
  post: "/user/:id/post/:postId",
} as const;

type Routes = typeof routes;
declare function navigate<K extends keyof Routes>(
  name: K,
  ...args: RouteParams<Routes[K]> extends never ? [] : [params: Record<RouteParams<Routes[K]>, string>]
): void;

navigate("home");
navigate("user", { id: "1" });
// navigate("user", {});  // ❌
```

**练习**
1. ⭐⭐⭐ 实现上面 `navigate`，并补上 `query` 可选项。
2. ⭐⭐⭐ 实现 `useParams<K extends keyof Routes>(name: K)`，返回对应参数对象。
3. ⭐⭐ 思考：如何支持可选参数 `/user/:id?`。

---

## Day 5：声明文件与模块增强

**场景：**
- 给无类型的第三方库补 `.d.ts`
- 全局变量 / `window` 扩展
- 静态资源导入（`*.svg`、`*.module.css`）
- 环境变量类型（`import.meta.env`）
- 扩展 UI 库主题（如 MUI / styled-components 的 `Theme`）

```ts
// global.d.ts
declare module "*.svg" {
  const src: string;
  export default src;
}

interface Window { __APP_CONFIG__: { apiBase: string } }

interface ImportMetaEnv { readonly VITE_API_BASE: string }
interface ImportMeta { readonly env: ImportMetaEnv }

// 模块增强
import "react";
declare module "react" {
  interface CSSProperties { [key: `--${string}`]: string | number }
}
```

**练习**
1. ⭐⭐ 给一个无类型 npm 包写最小 `.d.ts`。
2. ⭐⭐ 让 `style={{ "--gap": 8 }}` 通过类型检查。
3. ⭐⭐ 给环境变量加运行时校验（Zod），导出强类型 `env`。

---

## Day 6：周项目 —— 类型安全的 API 客户端 + 路由

整合本周内容：端点表 + 路径参数推导 + Zod 校验 + `useQuery` 风格 hook，做到：
- 写错接口名、漏传路径参数、传错 body → 编译期报错
- 响应数据在运行时被 schema 校验

## Day 7：复盘

---

# 第 8 周：综合实战与查漏补缺

## Day 1～2：读源码 / 读类型

挑一个读，**只读类型定义，不读实现**：
- `type-fest`：挑 10 个工具类型，逐个看懂
- `zod`：`ZodType`、`infer` 相关
- `@tanstack/react-query`：`useQuery` 的泛型参数设计（`TQueryFnData / TError / TData / TQueryKey`）
- `React` 的 `@types/react`：`ComponentProps`、`JSX.IntrinsicElements`

**练习：** 每个库写一页笔记：它为什么要这样设计泛型参数？哪些用了条件类型 / 映射类型 / infer？

## Day 3～5：综合项目（三选一）

| 项目 | 必须用到 | 验收 |
|---|---|---|
| **A. 组件库（5 个组件）**：Button / Select / Table / Form / Modal | 泛型组件、多态、互斥 props、`forwardRef` | 每个组件有类型测试 |
| **B. 类型安全的状态管理库**（类 Zustand） | 泛型、条件类型、`infer`、selector 推导 | `useStore(s => s.a.b)` 返回类型精确 |
| **C. 类型安全的前后端契约**（类 tRPC） | 映射类型、模板字面量、递归 | 前端调用即带完整提示 |

## Day 6：type-challenges 查缺补漏

- 完成 Medium 剩余题目中你**做错过**的类型
- 尝试 5 道 Hard：`Currying`、`Union to Tuple`、`Get Required`、`Camelize`、`Vue Basic Props`

## Day 7：总结与输出

- 写一篇博客 / 文档：**《我对 TS 泛型与条件类型的理解》**（输出是最好的检验）
- 整理团队内部的《TS 类型规范》：何时用 `interface`、何时 `type`；禁用 `any` 的规则；复杂类型必须带注释和测试

---

# 附录 A：重难点速查表

| 主题 | 一句话理解 | 常见坑 |
|---|---|---|
| 结构化类型 | 比形状不比名字 | 字面量会触发多余属性检查，变量不会 |
| `unknown` vs `any` | `unknown` 必须先收窄 | `any` 会"传染"，关掉整条链路检查 |
| 可辨识联合 | 公共字面量字段区分成员 | 别用多个 boolean 表达状态 |
| 泛型约束 | `T extends X` 限制可选范围 | 约束里的 `extends` 不是条件类型 |
| `keyof` / `T[K]` | 取键 / 取值类型 | `Object.keys` 返回 `string[]`（刻意设计） |
| 映射类型 | 遍历键生成新类型 | 同态映射保留修饰符，非同态不保留 |
| 条件类型 | 类型层面的 if | 裸类型参数会分发；`never` 分发后为 `never` |
| `infer` | 在条件里"捕获"类型 | 多个候选位置：协变→联合，逆变→交叉 |
| 模板字面量 | 字符串类型运算 | 联合相乘会爆炸（超过 10 万会报错） |
| 递归类型 | 自己引用自己 | 要有终止条件，注意深度限制 |
| 逆变 | 参数位置方向反转 | 方法简写是双变，属性函数写法才严格 |
| 品牌类型 | 同底层类型的"名义化" | 需要在入口处统一创建（工厂函数） |
| `satisfies` | 校验但不拓宽 | 不会改变变量类型，只做检查 |
| `as const` | 冻结为最窄字面量 | 会让数组变 `readonly` 元组 |

---

# 附录 B：常见报错解读

| 报错 | 通常原因 | 排查方向 |
|---|---|---|
| `Type 'X' is not assignable to type 'Y'` | 类型不兼容 | **从最后一行往上读**，最底下才是根因 |
| `Type instantiation is excessively deep and possibly infinite` | 递归类型太深 | 加终止条件 / 改写为尾递归 / 减少分支 |
| `Expression produces a union type that is too complex to represent` | 联合爆炸 | 减少模板字面量组合 |
| `'T' could be instantiated with a different subtype of constraint` | 泛型函数返回了具体值 | 用重载或断言，或重新设计签名 |
| `Property 'x' does not exist on type 'never'` | 收窄过头 / 穷尽后访问 | 检查 `switch` 分支或守卫逻辑 |
| `Object is possibly 'undefined'`（索引访问） | 开启了 `noUncheckedIndexedAccess` | 先判断再用，不要直接 `!` |
| `Type 'string' cannot be used to index type 'X'` | 用 `string` 访问对象 | 用 `keyof X` 约束，或 `as keyof X` 前先收窄 |
| `This expression is not callable. Each member of the union type ... has signatures, but none of those signatures are compatible` | 联合函数类型调用 | 先收窄成单一类型，或用交叉参数 |

---

# 附录 C：资源清单

**官方**
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TS Playground](https://www.typescriptlang.org/play)
- [TypeScript Release Notes](https://www.typescriptlang.org/docs/handbook/release-notes/overview.html)（每个版本新增特性，关注 4.x → 5.x）

**练习**
- [type-challenges](https://github.com/type-challenges/type-challenges)（核心练习，按 Easy → Medium → Hard 走）
- [Total TypeScript Exercises](https://www.totaltypescript.com/)（含免费部分，偏前端/React）

**书籍**
- 《Effective TypeScript》（Dan Vanderkam）
- 《Programming TypeScript》

**前端实战**
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [TanStack Query 类型设计](https://tanstack.com/query/latest/docs/framework/react/typescript)
- [type-fest](https://github.com/sindresorhus/type-fest)

**中文**
- 阮一峰《TypeScript 教程》（查漏补缺）

---

## 最后的建议

1. **能用简单类型解决的，不要用类型体操。** 业务代码优先可读，复杂类型必须带注释与测试。
2. **类型设计从"使用者"出发：** 先写出你希望的调用方式，再反推类型定义。
3. **每个高级类型都问三个问题：** 输入是什么？输出是什么？边界情况（`never` / `any` / 联合 / 空对象）怎么处理？
4. **坚持写 `Expect<Equal<...>>` 测试**，类型也需要单测。

> 祝学习顺利！建议把"每周复盘"当作硬性任务，进步最大的往往是复盘那一天。
