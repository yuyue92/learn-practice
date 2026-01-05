```
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1);
}
输出3,3,3
原因：var 是函数作用域，循环结束后 i 已变成 3，三个回调执行时读到的都是同一个 i。

for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1);
}
输出0,1,2
原因：let 是块级作用域，每次循环都会创建一个新的 i 绑定，回调各自捕获不同的 i 值。
```
