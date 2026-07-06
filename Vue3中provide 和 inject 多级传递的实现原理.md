Vue3 `provide / inject` 多级传递的实现原理 ------ 原型链查找

Vue3 的 `provides  / inject` 是利用组件实例上的`provides`属性和原型链  `__proto__` ，把祖先组件提供的`provides` 挂载到组件实例的 `provides` 的原型链上；当组件`inject`找不到，就要沿着`provides` 这条原型链往上找；直到命中或者返回undefined；从而实现  '跨越任意层级'  的依赖、数据注入。

一，数据结构 关键点：
- `provides`： 如果该组件没有调用 provide ，会默认指向父实例的`provides` （原型继承）。
- 如果本组件自己也有 provide()，则把“父 provides”设成新对象的 `__proto__`，再让本实例的 provides 指向这个新对象——于是整条原型链就是“祖辈组件→父辈组件→组件”的provide层级。

二，`provide` 关键点：
- 只有第一次  `provide()` 时才会新建对象并把“父辈 provides”挂到 `__proto__`。
- 后续再 provide() 只是往自己身上加属性，不再动原型链 。

三，`inject`关键点
- key in provides 会自动沿着 __proto__向上查找 ，所以任何深层的子孙都能命中祖先提供的值；
- 一旦命中就立即返回，性能≈原型链属性读取 ，没有递归、没有事件广播。

