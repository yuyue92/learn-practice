**CSS动画详细指南**

CSS动画主要通过两种方式实现：transition（过渡）和 animation（动画）。
- Transitions用于在CSS属性值变化时创建平滑的过渡效果。
- Animations通过@keyframes规则定义动画的各个阶段，功能更强大。

**实际应用案例**

1、淡入效果
```
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-in {
  animation: fadeIn 1s ease-in;
}
```

2、弹跳效果
```
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
}

.bounce {
  animation: bounce 2s infinite;
}
```

3、旋转加载动画
```
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loader {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
```
