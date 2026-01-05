```
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1);
}
输出3,3,3
原因：var 是函数作用域，循环结束后 i 已变成 3，三个回调执行时读到的都是同一个 i。

----------

for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1);
}
输出0,1,2
原因：let 是块级作用域，每次循环都会创建一个新的 i 绑定，回调各自捕获不同的 i 值。

------------
const user = {
	email: "my@email.com",
	updateEmail: email => {
		this.email = email
	}
}

user.updateEmail("new@email.com")
console.log(user.email)
运行结果：console.log(user.email) 打印的还是 "my@email.com"（在严格模式/模块环境下还可能在 this.email = email 这行报错）。
原因很简单：updateEmail 用的是 箭头函数，箭头函数的 this 不绑定调用者对象，它会捕获定义时的外层 this（这里不是 user）。
✅ 正确写法（用普通函数，让 this 指向调用者）：
const user = {
  email: "my@email.com",
  updateEmail(email) {
    this.email = email
  }
}
---------------

下面把 Object.seal()、Object.freeze() 以及常见“等特性”一口气讲清楚（含区别与小例子）。默认都是浅层（只作用对象本身的第一层属性）。
1) Object.preventExtensions(obj)，作用：让对象“不可扩展”——不能再加新属性。
2) Object.seal(obj)，作用：密封对象。= preventExtensions + 禁止删除 + 禁止重新配置属性。 但已有可写属性仍可改值。
3) Object.freeze(obj)，作用：冻结对象。= seal + 值也不可改（对数据属性设置 writable: false）。 所以加/删/改都不行。
```
