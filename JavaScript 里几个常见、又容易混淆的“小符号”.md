#### JavaScript 里几个常见、又容易混淆的“小符号”

下面把 JavaScript 里几个常见、又容易混淆的“小符号”讲清楚：三目运算符 ?:、空值合并 ??，顺带提一下常被一起用的可选链 ?. 与逻辑或 ||。

核心对比：
| 符号                        | 作用           | 何时走到右边                                     | 判定规则                                | 典型用途                                                    | 容易踩的坑|
| ------------------------- | ------------ | ------------------------------------------ | ----------------------------------- | ------------------------------------------------------- | ------------------------------ |
| `cond ? A : B`            | 条件选择         | `cond` 为真时取 `A`，否则取 `B`                    | **布尔**判断（truthy / falsy）            | 简短 if-else                                              |              |                                   |
| `a ?? b`                  | 空值合并（给“缺省值”） | **仅当** `a` 是 `null` 或 `undefined`          | **nullish** 判断（只认 `null/undefined`） | 给字段/参数补默认值                                              |
| \`a                       |              | b\`                                        | 逻辑或（也常被当成“默认值”）                     | 当 `a` 为 **falsy** 时（如 `0,'' ,false,NaN,null,undefined`） | 兼做布尔逻辑、兼做“兜底” |
| `obj?.prop` / `obj?.fn()` | 可选链（安全访问）    | `obj` 为 `null/undefined` 时短路返回 `undefined` | **nullish** 判断

一眼看懂的例子
```
// 1) 三目 ?:  —— 精简 if...else
const level = score >= 60 ? 'pass' : 'fail';

// 2) ?? 与 || 的差别
const input = 0;
const a = input || 42;  // => 42   （把 0 当“空”了）
const b = input ?? 42;  // => 0    （0 不是 null/undefined，不替换）

const nameA = '' || 'Anonymous'; // 'Anonymous'  （空字符串被替换）
const nameB = '' ?? 'Anonymous'; // ''           （保留空字符串）

// 3) 可选链 ?. 常与 ?? 搭配：安全读取 + 合理默认
const theme = settings?.appearance?.theme ?? 'light';

// 4) 只在缺值时赋默认（??=）
let timeout = config.timeout; // 可能是 undefined
timeout ??= 5000; // 只在为 null/undefined 时赋 5000
```
