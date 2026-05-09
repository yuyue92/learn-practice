下面这部分可以直接当作**五年前端 CSS 面试复习大纲**来看。CSS 面试重点不是“会写几个属性”，而是你能不能讲清楚：**元素如何参与布局、尺寸如何计算、层级如何形成、移动端如何适配、样式如何工程化管理**。

---

# 一、CSS 布局基础

## 1. 盒模型

CSS 中每个元素都可以看成一个盒子，盒子由这几部分组成：

```txt
content 内容区
padding 内边距
border 边框
margin 外边距
```

常见盒模型有两种。

### 标准盒模型

```css
.box {
  width: 200px;
  padding: 20px;
  border: 10px solid #000;
}
```

实际占用宽度：

```txt
200 + 20 * 2 + 10 * 2 = 260px
```

也就是说，`width` 只表示内容区宽度。

---

### IE 盒模型 / border-box

```css
.box {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 10px solid #000;
}
```

实际占用宽度就是：

```txt
200px
```

内容区宽度变成：

```txt
200 - 40 - 20 = 140px
```

实际开发中通常会全局设置：

```css
* {
  box-sizing: border-box;
}
```

这样布局更可控，尤其是表单、弹窗、卡片、后台管理系统中非常常用。

---

## 2. 普通文档流

默认情况下，元素会按照 HTML 顺序从上到下、从左到右排列。

块级元素：

```txt
div、p、section、header、footer
```

特点：

```txt
独占一行
宽度默认撑满父容器
高度由内容决定
可以设置 width / height / margin / padding
```

行内元素：

```txt
span、a、em、strong
```

特点：

```txt
不会独占一行
宽高一般由内容决定
设置 width / height 不生效
水平方向 padding / margin 有效，垂直方向影响有限
```

行内块元素：

```css
display: inline-block;
```

特点：

```txt
可以和其他元素在一行
可以设置宽高
常用于按钮、标签、图标文字混排
```

---

# 二、BFC

BFC 全称是 Block Formatting Context，块级格式化上下文。

可以理解为：**一个独立的布局区域，里面的元素布局不会影响外部，外部也不会影响里面。**

## 1. BFC 常见触发方式

常见方式：

```css
overflow: hidden;
overflow: auto;
display: flow-root;
display: inline-block;
position: absolute;
position: fixed;
float: left;
float: right;
```

现在更推荐：

```css
.container {
  display: flow-root;
}
```

语义更明确，表示“创建一个新的块级格式化上下文”。

---

## 2. BFC 有什么用？

### 作用一：清除浮动

早期布局中子元素浮动后，父元素高度会塌陷：

```css
.parent {
  border: 1px solid #000;
}

.child {
  float: left;
}
```

父元素感知不到浮动子元素高度。

解决：

```css
.parent {
  display: flow-root;
}
```

或者旧写法：

```css
.parent {
  overflow: hidden;
}
```

---

### 作用二：避免 margin 合并

两个普通块级元素上下 margin 会合并：

```css
.box1 {
  margin-bottom: 20px;
}

.box2 {
  margin-top: 30px;
}
```

最终间距不是 50px，而是：

```txt
30px
```

因为垂直 margin 会合并。

可以通过 BFC 隔离：

```css
.wrapper {
  display: flow-root;
}
```

---

### 作用三：避免文字环绕浮动元素

```css
.left {
  float: left;
  width: 200px;
}

.right {
  overflow: hidden;
}
```

`right` 创建 BFC 后，不会被浮动元素覆盖，常用于老式两栏布局。

---

## 3. 面试回答模板

BFC 是 CSS 中一个独立的布局上下文。创建 BFC 后，内部元素的布局不会影响外部，外部浮动也不会影响内部。常见触发方式有 `overflow: hidden`、`display: flow-root`、`position: absolute/fixed`、`float` 等。实际开发中常用它解决父元素高度塌陷、margin 合并、浮动元素影响布局等问题。

---

# 三、Flex 布局

Flex 是一维布局模型，主要解决**一行或一列上的排列、对齐、分配空间**。

适合：

```txt
导航栏
按钮组
卡片列表
表单项左右布局
上下左右居中
后台管理系统的工具栏
```

---

## 1. 基本概念

```css
.container {
  display: flex;
}
```

容器叫 flex container，子元素叫 flex item。

主轴由 `flex-direction` 决定：

```css
flex-direction: row;        /* 默认，从左到右 */
flex-direction: column;     /* 从上到下 */
flex-direction: row-reverse;
flex-direction: column-reverse;
```

---

## 2. 主轴对齐 justify-content

```css
.container {
  justify-content: flex-start;
  justify-content: flex-end;
  justify-content: center;
  justify-content: space-between;
  justify-content: space-around;
  justify-content: space-evenly;
}
```

常见效果：

```txt
center：整体居中
space-between：两端对齐，中间均分
space-around：每个元素两侧都有间距
space-evenly：所有间距完全一致
```

---

## 3. 交叉轴对齐 align-items

```css
.container {
  align-items: stretch;
  align-items: flex-start;
  align-items: flex-end;
  align-items: center;
  align-items: baseline;
}
```

最常用：

```css
display: flex;
align-items: center;
```

用于垂直居中。

---

## 4. 换行 flex-wrap

```css
.container {
  display: flex;
  flex-wrap: wrap;
}
```

适合做卡片列表：

```css
.card {
  width: 25%;
}
```

不过现在更复杂的网格列表建议用 Grid。

---

## 5. flex: 1 到底是什么？

这是高频题。

```css
.item {
  flex: 1;
}
```

它是下面三个属性的缩写：

```css
.item {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0%;
}
```

意思是：

```txt
flex-grow: 1   可以放大，占据剩余空间
flex-shrink: 1 可以缩小
flex-basis: 0  初始主轴尺寸按 0 计算
```

所以多个子元素都设置 `flex: 1` 时，会平分剩余空间。

例如：

```css
.container {
  display: flex;
}

.left,
.right {
  flex: 1;
}
```

两个元素各占 50%。

---

## 6. flex: auto 和 flex: 1 的区别

```css
flex: 1;
/* 等价于 */
flex: 1 1 0%;
```

```css
flex: auto;
/* 等价于 */
flex: 1 1 auto;
```

区别在于 `flex-basis`。

`flex: 1`：忽略内容原本宽度，直接按剩余空间均分。

`flex: auto`：先考虑内容本身宽度，再分配剩余空间。

---

## 7. Flex 常见项目写法

### 左右布局

```css
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

### 左边固定，右边自适应

```css
.layout {
  display: flex;
}

.sidebar {
  width: 240px;
  flex-shrink: 0;
}

.content {
  flex: 1;
  min-width: 0;
}
```

这里 `min-width: 0` 很重要。

因为 flex item 默认 `min-width: auto`，内容过长时可能撑破布局。后台系统、表格、文本省略中经常要加：

```css
.content {
  min-width: 0;
}
```

---

# 四、Grid 布局

Grid 是二维布局模型，可以同时控制行和列。

适合：

```txt
仪表盘
九宫格
复杂后台页面
图片墙
表单布局
卡片布局
整体页面骨架
```

Flex 更适合一维排列，Grid 更适合二维布局。

---

## 1. 基础写法

```css
.container {
  display: grid;
  grid-template-columns: 200px 1fr 300px;
  grid-template-rows: 60px 1fr;
  gap: 16px;
}
```

含义：

```txt
列：左侧 200px，中间自适应，右侧 300px
行：顶部 60px，下面自适应
gap：行列间距
```

---

## 2. repeat

```css
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
```

表示四列等分。

---

## 3. auto-fit / minmax

响应式卡片常用：

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}
```

意思是：

```txt
每个卡片最小 240px
空间够就自动多列
空间不够就自动换行
```

这是非常实用的响应式布局写法。

---

## 4. Grid 适合什么场景？

面试可以这样答：

Grid 适合二维布局，比如页面整体骨架、仪表盘、卡片网格、图片墙、复杂表单布局等。Flex 更适合处理一维方向上的排列，比如导航栏、按钮组、左右结构、垂直居中等。在实际项目中，通常是 Grid 做大区域布局，Flex 做局部组件内部布局。

---

# 五、定位 position

## 1. static

默认值。

```css
position: static;
```

元素在普通文档流中，`top/right/bottom/left` 不生效。

---

## 2. relative

```css
.box {
  position: relative;
  top: 10px;
  left: 10px;
}
```

特点：

```txt
仍然占据原来的位置
视觉上发生偏移
常用于作为 absolute 子元素的定位参考
```

常见用途：

```css
.card {
  position: relative;
}

.badge {
  position: absolute;
  right: 0;
  top: 0;
}
```

---

## 3. absolute

```css
.child {
  position: absolute;
  right: 0;
  top: 0;
}
```

特点：

```txt
脱离普通文档流
不占据原位置
相对于最近一个非 static 的祖先元素定位
如果没有，则相对于初始包含块定位
```

常用于：

```txt
角标
弹层
自定义下拉框
tooltip
图片上的按钮
```

---

## 4. fixed

```css
.box {
  position: fixed;
  right: 20px;
  bottom: 20px;
}
```

特点：

```txt
脱离文档流
相对于视口定位
页面滚动时位置不变
```

常用于：

```txt
返回顶部
固定导航
浮动客服
移动端底部操作栏
```

注意：如果祖先元素使用了 `transform`、`filter` 等属性，可能会影响 fixed 的定位上下文。

---

## 5. sticky

```css
.header {
  position: sticky;
  top: 0;
}
```

特点：

```txt
未达到阈值时像 relative
达到阈值后像 fixed
不会完全脱离所在容器
```

常用于：

```txt
吸顶导航
表格表头吸顶
侧边目录吸附
```

sticky 生效条件：

```txt
必须设置 top / left / right / bottom 之一
父元素不能有不合理的 overflow: hidden / auto 限制
父容器高度要足够产生滚动
```

常见失败原因：

```css
.parent {
  overflow: hidden;
}
```

这可能导致 sticky 不生效。

---

# 六、居中方案

## 1. 文本水平居中

```css
.text {
  text-align: center;
}
```

---

## 2. 块级元素水平居中

```css
.box {
  width: 300px;
  margin: 0 auto;
}
```

前提是元素有明确宽度。

---

## 3. Flex 水平垂直居中

```css
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

最常用。

---

## 4. Grid 居中

```css
.parent {
  display: grid;
  place-items: center;
}
```

非常简洁。

---

## 5. absolute + transform

```css
.parent {
  position: relative;
}

.child {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
```

适合弹窗、浮层、绝对定位元素。

---

## 6. line-height 垂直居中

```css
.button {
  height: 40px;
  line-height: 40px;
  text-align: center;
}
```

只适合单行文本。

---

# 七、两栏布局

## 1. 左侧固定，右侧自适应：Flex 推荐

```css
.layout {
  display: flex;
}

.sidebar {
  width: 240px;
  flex-shrink: 0;
}

.main {
  flex: 1;
  min-width: 0;
}
```

这是现代项目最常用写法。

---

## 2. Grid 写法

```css
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 16px;
}
```

适合页面骨架更清晰的场景。

---

## 3. float + BFC 老写法

```css
.sidebar {
  float: left;
  width: 240px;
}

.main {
  overflow: hidden;
}
```

现在不推荐作为主要方案，但面试要知道。

---

# 八、三栏布局

## 1. Flex 写法

```css
.layout {
  display: flex;
}

.left {
  width: 200px;
  flex-shrink: 0;
}

.center {
  flex: 1;
  min-width: 0;
}

.right {
  width: 300px;
  flex-shrink: 0;
}
```

---

## 2. Grid 写法

```css
.layout {
  display: grid;
  grid-template-columns: 200px 1fr 300px;
  gap: 16px;
}
```

现代项目最推荐 Grid。

---

# 九、圣杯布局

圣杯布局的目标：

```txt
三栏布局
左右两栏固定宽度
中间自适应
中间内容优先加载
```

HTML 结构通常是：

```html
<div class="container">
  <main class="center">center</main>
  <aside class="left">left</aside>
  <aside class="right">right</aside>
</div>
```

传统 float 版本：

```css
.container {
  padding-left: 200px;
  padding-right: 300px;
}

.center,
.left,
.right {
  float: left;
  min-height: 200px;
}

.center {
  width: 100%;
}

.left {
  width: 200px;
  margin-left: -100%;
  position: relative;
  left: -200px;
}

.right {
  width: 300px;
  margin-left: -300px;
  position: relative;
  right: -300px;
}
```

面试知道原理即可，现在实际项目一般不用这种写法。

现代写法：

```css
.container {
  display: grid;
  grid-template-columns: 200px 1fr 300px;
}

.center {
  grid-column: 2;
}

.left {
  grid-column: 1;
}

.right {
  grid-column: 3;
}
```

---

# 十、双飞翼布局

双飞翼布局和圣杯布局目标类似，也是：

```txt
左右固定
中间自适应
中间优先加载
```

区别在于：

```txt
圣杯布局：通过父容器 padding + 相对定位调整左右栏
双飞翼布局：给中间内容内部再包一层，通过 margin 留出左右空间
```

结构：

```html
<div class="main">
  <div class="main-inner">center</div>
</div>
<div class="left">left</div>
<div class="right">right</div>
```

CSS：

```css
.main {
  float: left;
  width: 100%;
}

.main-inner {
  margin-left: 200px;
  margin-right: 300px;
}

.left {
  float: left;
  width: 200px;
  margin-left: -100%;
}

.right {
  float: left;
  width: 300px;
  margin-left: -300px;
}
```

面试重点不是死背代码，而是说清楚：

```txt
双飞翼通过中间栏内部容器的 margin 留出左右空间；
圣杯通过父容器 padding 和左右栏 relative 偏移实现。
```

---

# 十一、响应式布局

响应式布局的目标是：**同一套页面在不同屏幕宽度下自动适配。**

常见手段：

```txt
百分比
Flex
Grid
媒体查询
rem
vw / vh
max-width / min-width
图片自适应
断点设计
```

---

## 1. 百分比布局

```css
.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
}
```

常用于页面主体宽度控制。

---

## 2. 媒体查询

```css
.card-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

@media (max-width: 1024px) {
  .card-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .card-list {
    grid-template-columns: 1fr;
  }
}
```

常见断点：

```txt
>= 1200px：桌面大屏
>= 992px：普通桌面
>= 768px：平板
< 768px：移动端
< 480px：小屏手机
```

---

## 3. 移动端优先

推荐写法：

```css
.card-list {
  display: grid;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .card-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1200px) {
  .card-list {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

这种叫 mobile first，先写移动端，再逐步增强到大屏。

---

# 十二、移动端适配

## 1. viewport

移动端必须设置：

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

否则页面会按桌面宽度缩放，导致布局异常。

---

## 2. rem

`rem` 是相对于根元素 `html` 的字体大小。

```css
html {
  font-size: 16px;
}

.box {
  width: 10rem; /* 160px */
}
```

移动端常见方案是动态设置 html font-size。

例如设计稿 750px：

```js
function setRem() {
  const width = document.documentElement.clientWidth;
  document.documentElement.style.fontSize = width / 10 + 'px';
}

setRem();
window.addEventListener('resize', setRem);
```

这样：

```txt
屏幕宽度 750px 时，1rem = 75px
屏幕宽度 375px 时，1rem = 37.5px
```

---

## 3. vw / vh

```css
.box {
  width: 50vw;
  height: 100vh;
}
```

含义：

```txt
1vw = 视口宽度的 1%
1vh = 视口高度的 1%
```

比如屏幕宽度 375px：

```txt
1vw = 3.75px
100vw = 375px
```

移动端可以直接用 vw 做适配：

```css
.title {
  font-size: 4.2667vw;
}
```

如果设计稿是 375px，16px 可以换算为：

```txt
16 / 375 * 100 = 4.2667vw
```

---

## 4. vh 的坑

移动端浏览器地址栏会显示和隐藏，导致 `100vh` 在某些手机上不稳定。

现在可以考虑：

```css
height: 100dvh;
```

常见单位：

```txt
vh：传统视口高度
svh：小视口高度
lvh：大视口高度
dvh：动态视口高度
```

移动端全屏弹窗可以用：

```css
.modal {
  height: 100dvh;
}
```

---

## 5. safe-area 安全区域

iPhone 刘海屏、底部 Home Indicator 需要安全区域适配。

HTML：

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```

CSS：

```css
.footer {
  padding-bottom: env(safe-area-inset-bottom);
}
```

常见写法：

```css
.fixed-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
}
```

适合：

```txt
移动端底部导航
底部按钮
底部弹窗
支付按钮
操作栏
```

---

# 十三、样式工程化

五年前端面试里，这块非常重要。因为公司关心的不只是你会不会写 CSS，而是你能不能维护大型项目样式。

---

## 1. CSS Modules

CSS Modules 的核心是：**局部作用域，避免类名冲突。**

例如 React 中：

```css
/* Button.module.css */
.btn {
  height: 40px;
  padding: 0 16px;
}
```

```jsx
import styles from './Button.module.css';

function Button() {
  return <button className={styles.btn}>提交</button>;
}
```

最终编译后类名可能变成：

```txt
Button_btn__3x91a
```

优点：

```txt
天然局部作用域
避免全局污染
适合组件化开发
学习成本低
```

缺点：

```txt
动态主题能力一般
全局样式需要额外处理
类名组合有时略繁琐
```

---

## 2. Sass / Less

Sass 和 Less 是 CSS 预处理器。

提供：

```txt
变量
嵌套
混入 mixin
函数
循环
条件
模块化
```

Sass 示例：

```scss
$primary-color: #1677ff;

.button {
  color: $primary-color;

  &:hover {
    color: darken($primary-color, 10%);
  }
}
```

mixin：

```scss
@mixin ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.title {
  @include ellipsis;
}
```

优点：

```txt
增强 CSS 编写能力
适合传统中大型项目
变量和 mixin 能复用样式逻辑
```

缺点：

```txt
运行时主题切换不如 CSS Variables 灵活
嵌套过深会导致选择器复杂
```

---

## 3. PostCSS

PostCSS 本身不是预处理器，它是一个 CSS 转换工具。

常见用途：

```txt
自动添加浏览器前缀
px 转 rem / vw
使用未来 CSS 语法
CSS 压缩
兼容性处理
```

常见插件：

```txt
autoprefixer
postcss-pxtorem
postcss-px-to-viewport
cssnano
```

例如：

```css
.box {
  display: flex;
}
```

经过 autoprefixer 后可能变成：

```css
.box {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}
```

实际项目中，PostCSS 通常集成在 Vite / Webpack 构建流程里。

---

## 4. Tailwind CSS

Tailwind 是一种原子化 CSS 框架。

写法：

```html
<div class="flex items-center justify-between p-4 rounded-xl shadow">
  <span class="text-lg font-bold">标题</span>
  <button class="px-4 py-2 bg-blue-500 text-white rounded">提交</button>
</div>
```

优点：

```txt
开发效率高
不用反复起类名
样式约束统一
适合快速搭建后台、SaaS、管理系统
天然支持响应式和暗黑模式
```

缺点：

```txt
HTML class 很长
初期看起来不够优雅
复杂交互状态下需要组件封装
```

Tailwind 适合团队有统一设计规范、组件化程度高的项目。

---

## 5. CSS-in-JS

CSS-in-JS 是在 JS 中写 CSS。

常见库：

```txt
styled-components
emotion
stitches
vanilla-extract
```

示例：

```jsx
const Button = styled.button`
  height: 40px;
  padding: 0 16px;
  color: white;
  background: ${props => props.primary ? '#1677ff' : '#999'};
`;
```

优点：

```txt
样式和组件逻辑强绑定
支持动态样式
主题能力强
适合 React 组件库
```

缺点：

```txt
运行时开销
调试成本较高
SSR 需要额外处理
团队规范要求高
```

---

## 6. 原子化 CSS

原子化 CSS 的思想是：**一个类只做一件事。**

例如：

```css
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.mt-16 {
  margin-top: 16px;
}
```

Tailwind 就是典型代表。

优点：

```txt
复用率高
样式产物可控
减少重复 CSS
适合设计规范统一的系统
```

缺点：

```txt
类名多
语义不如传统 BEM 明确
依赖工具链和团队规范
```

---

## 7. 主题切换

现代主题切换推荐使用 CSS Variables。

```css
:root {
  --color-primary: #1677ff;
  --color-bg: #ffffff;
  --color-text: #111111;
}

[data-theme='dark'] {
  --color-primary: #4096ff;
  --color-bg: #141414;
  --color-text: #f5f5f5;
}

body {
  background: var(--color-bg);
  color: var(--color-text);
}

.button {
  background: var(--color-primary);
}
```

JS 切换：

```js
document.documentElement.setAttribute('data-theme', 'dark');
```

---

## 8. 暗黑模式

暗黑模式有两种常见方式。

### 跟随系统

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #141414;
    --color-text: #f5f5f5;
  }
}
```

### 手动切换

```css
[data-theme='dark'] {
  --color-bg: #141414;
  --color-text: #f5f5f5;
}
```

实际项目一般两者结合：

```txt
默认跟随系统
用户手动选择后优先使用用户设置
本地 localStorage 保存主题
```

---

## 9. 设计 Token

设计 Token 是设计系统中的最小样式变量。

例如：

```css
:root {
  --color-primary: #1677ff;
  --color-danger: #ff4d4f;

  --font-size-sm: 12px;
  --font-size-md: 14px;
  --font-size-lg: 16px;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
}
```

它解决的问题是：

```txt
颜色统一
间距统一
字号统一
圆角统一
阴影统一
主题统一
设计和研发协作统一
```

大型项目里，不应该到处写：

```css
color: #1677ff;
margin: 13px;
border-radius: 7px;
```

而应该使用 token：

```css
color: var(--color-primary);
margin: var(--spacing-md);
border-radius: var(--radius-md);
```

---

# 十四、高频 CSS 面试题

## 1. display: none 和 visibility: hidden 区别

```css
display: none;
```

特点：

```txt
元素不显示
不占据空间
不会参与布局
事件不会触发
会引起回流和重绘
```

```css
visibility: hidden;
```

特点：

```txt
元素不可见
仍然占据空间
仍然参与布局
一般不会触发点击事件
主要引起重绘
```

区别总结：

| 属性                 | 是否显示 | 是否占位 | 是否参与布局 | 是否触发重排 |
| ------------------ | ---- | ---- | ------ | ------ |
| display: none      | 否    | 否    | 否      | 是      |
| visibility: hidden | 否    | 是    | 是      | 通常不重排  |

---

## 2. opacity: 0 是否占位？

```css
opacity: 0;
```

特点：

```txt
元素完全透明
仍然占据空间
仍然参与布局
仍然可能响应点击事件
会创建层叠上下文
```

所以如果只是隐藏但不想影响布局，可以用：

```css
opacity: 0;
```

如果不想点击到它，需要加：

```css
pointer-events: none;
```

例如：

```css
.hidden {
  opacity: 0;
  pointer-events: none;
}
```

---

## 3. relative / absolute / fixed / sticky 区别

| position | 是否脱离文档流    | 定位参考           |
| -------- | ---------- | -------------- |
| relative | 否          | 自身原位置          |
| absolute | 是          | 最近的非 static 祖先 |
| fixed    | 是          | 视口             |
| sticky   | 否/类似 fixed | 滚动容器           |

面试回答重点：

```txt
relative 常用于微调和作为 absolute 定位上下文；
absolute 用于弹层、角标、浮动元素；
fixed 用于固定在视口的元素；
sticky 用于滚动到一定位置后的吸顶效果。
```

---

## 4. Flex: flex: 1 到底代表什么？

```css
flex: 1;
```

等价于：

```css
flex-grow: 1;
flex-shrink: 1;
flex-basis: 0%;
```

含义：

```txt
允许放大
允许缩小
初始主轴尺寸为 0
多个 flex: 1 元素会平分剩余空间
```

注意它不是简单等于：

```css
width: 100%;
```

也不是单纯的“占满剩余空间”。

---

## 5. Grid 适合什么场景？

Grid 适合二维布局。

典型场景：

```txt
页面整体布局
后台 dashboard
图片墙
卡片网格
复杂表单
固定侧边栏 + 主内容 + 右侧栏
```

Flex 适合一维布局：

```txt
水平排列
垂直排列
按钮组
导航栏
局部对齐
```

一句话：

```txt
一维用 Flex，二维用 Grid；大结构用 Grid，小组件用 Flex。
```

---

## 6. BFC 怎么触发，有什么用？

触发方式：

```css
display: flow-root;
overflow: hidden;
overflow: auto;
float: left;
position: absolute;
position: fixed;
display: inline-block;
```

作用：

```txt
清除浮动
阻止 margin 合并
避免浮动元素影响普通元素
形成独立布局区域
```

推荐回答：

```txt
现在更推荐用 display: flow-root 创建 BFC，因为语义明确，不会像 overflow: hidden 那样意外裁剪内容。
```

---

## 7. margin 合并

垂直方向相邻块级元素的 margin 可能会合并。

例如：

```css
.a {
  margin-bottom: 20px;
}

.b {
  margin-top: 30px;
}
```

最终间距是：

```txt
30px
```

不是 50px。

常见情况：

```txt
相邻兄弟元素上下 margin 合并
父元素和第一个/最后一个子元素 margin 合并
空块级元素自身上下 margin 合并
```

解决方式：

```css
.parent {
  display: flow-root;
}
```

或者：

```css
.parent {
  padding-top: 1px;
}
```

或者：

```css
.parent {
  border-top: 1px solid transparent;
}
```

实际开发中更推荐通过 `padding`、`gap`、`display: flow-root` 解决。

---

## 8. z-index 和层叠上下文

`z-index` 不是越大就一定越在上面。

它只在特定层叠上下文里比较。

常见创建层叠上下文的方式：

```css
position: relative;
z-index: 1;
```

```css
opacity: 0.9;
transform: translateZ(0);
filter: blur(0);
will-change: transform;
position: fixed;
position: sticky;
```

例子：

```html
<div class="parent-a">
  <div class="child-a"></div>
</div>

<div class="parent-b">
  <div class="child-b"></div>
</div>
```

```css
.parent-a {
  position: relative;
  z-index: 1;
}

.child-a {
  position: absolute;
  z-index: 9999;
}

.parent-b {
  position: relative;
  z-index: 2;
}

.child-b {
  position: absolute;
  z-index: 1;
}
```

虽然 `child-a` 是 `9999`，但它仍然可能在 `child-b` 下面，因为它被限制在 `parent-a` 的层叠上下文中。

面试回答重点：

```txt
z-index 的比较前提是处在同一个层叠上下文。不同层叠上下文中，先比较父级层叠上下文，再比较内部元素。
```

---

## 9. 移动端 1px 问题

原因：

```txt
CSS 的 1px 不一定等于物理设备的 1px
高清屏 DPR = 2 或 3 时，1px CSS 像素会对应多个物理像素
视觉上边框会显得更粗
```

解决方案一：transform 缩放

```css
.border-1px {
  position: relative;
}

.border-1px::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: #ddd;
  transform: scaleY(0.5);
  transform-origin: 0 100%;
}
```

DPR = 3 可以：

```css
@media (-webkit-min-device-pixel-ratio: 3) {
  .border-1px::after {
    transform: scaleY(0.3333);
  }
}
```

解决方案二：使用 viewport 缩放方案。

解决方案三：直接接受视觉差异，现在很多 UI 库已经内部处理。

---

## 10. 图片自适应

常见写法：

```css
img {
  max-width: 100%;
  height: auto;
  display: block;
}
```

这样图片不会超过父容器。

---

### 固定比例图片

```css
.image-wrapper {
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

`object-fit` 常见值：

```css
object-fit: cover;   /* 填满容器，可能裁剪 */
object-fit: contain; /* 完整显示，可能留白 */
object-fit: fill;    /* 拉伸填满，可能变形 */
```

卡片封面常用：

```css
.card-cover img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}
```

---

## 11. 文本超出省略

### 单行省略

```css
.title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
```

注意：

```txt
容器需要有明确宽度
或者在 flex 布局里设置 min-width: 0
```

Flex 中常见问题：

```css
.item {
  flex: 1;
  min-width: 0;
}

.text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
```

---

### 多行省略

```css
.desc {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

表示最多显示两行。

---

# 十五、项目中 CSS 该怎么讲

五年前端面试中，CSS 不要只说属性，要结合项目讲。

比如后台管理系统可以这样说：

```txt
项目整体布局使用 Grid / Flex 实现，左侧菜单固定宽度，右侧内容区 flex: 1 自适应。表格区域注意 min-width: 0，避免内容撑破布局。卡片列表使用 Grid 的 repeat(auto-fit, minmax()) 做响应式。移动端页面使用 rem / vw 结合媒体查询适配，并处理了 iPhone safe-area。样式组织上，组件内部使用 CSS Modules，公共变量使用 CSS Variables 和设计 Token 管理，主题切换通过 data-theme 控制。
```

---

# 十六、CSS 面试重点总结

你要优先掌握这几条主线：

```txt
1. 盒模型：content-box / border-box
2. 布局流：块级、行内、浮动、定位、Flex、Grid
3. BFC：清浮动、阻止 margin 合并、隔离布局
4. Flex：一维布局，flex: 1、主轴、交叉轴、换行
5. Grid：二维布局，页面骨架、卡片网格、复杂表单
6. 定位：relative、absolute、fixed、sticky
7. 层级：z-index 和层叠上下文
8. 响应式：媒体查询、rem、vw、vh、safe-area
9. 移动端：1px、图片适配、文本省略、视口问题
10. 工程化：CSS Modules、Sass、PostCSS、Tailwind、CSS-in-JS、Token、主题切换
```

面试官真正想听的是：

```txt
你不仅知道 CSS 属性怎么写，
还知道它为什么这么表现，
什么场景用什么方案，
遇到布局异常怎么排查，
大型项目中样式怎么维护。
```
