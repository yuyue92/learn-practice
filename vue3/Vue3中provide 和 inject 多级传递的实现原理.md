Vue3 provide / inject 多级传递的实现原理 ------ 原型链查找

Vue3 的 provides  / inject 是利用组件实例上的provides属性和原型链  __proto__ ，把祖先组件提供的provides 挂载到组件实例的 provides 的原型链上；当组件inject找不到，就要沿着provides 这条原型链往上找；直到命中或者返回undefined；从而实现  '跨越任意层级'  的依赖、数据注入。

关键点
- key in provides 会自动沿着 __proto__向上查找 ，所以任何深层的子孙都能命中祖先提供的值；
- 一旦命中就立即返回，性能≈原型链属性读取 ，没有递归、没有事件广播。

