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

4、脉冲效果
```
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.pulse {
  animation: pulse 2s ease-in-out infinite;
}
```

5、滑入效果
```
@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.slide-in {
  animation: slideInLeft 0.5s ease-out;
}
```

**性能优化建议**
- 优先使用transform和opacity：这些属性不会触发重排，性能更好；
- 使用will-change属性：会提前告知浏览器哪些属性会变化；
- 同时避免动画化多个属性，可能导致性能问题；
- 使用硬件加速：通过transform: translateZ(0)或transform: translate3d(0,0,0)

CSS动画是现代网页设计的重要组成部分，合理使用可以大大提升用户体验。建议从简单的过渡效果开始练习，逐步掌握复杂的关键帧动画。
