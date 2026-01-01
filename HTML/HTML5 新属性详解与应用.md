**HTML5引入了大量新属性，极大地增强了Web开发的功能性和语义化。**

一、表单类型新属性
- 新的input type 类型：
```
<!-- 电子邮件 -->
<input type="email" placeholder="请输入邮箱">

<!-- 网址 -->
<input type="url" placeholder="请输入网址">

<!-- 电话号码 -->
<input type="tel" placeholder="请输入电话">

<!-- 数字 -->
<input type="number" min="1" max="100" step="5">

<!-- 日期选择器 -->
<input type="date">
<input type="time">
<input type="datetime-local">
<input type="month">
<input type="week">

<!-- 颜色选择器 -->
<input type="color">

<!-- 范围滑块 -->
<input type="range" min="0" max="100" value="50">

<!-- 搜索框 -->
<input type="search" placeholder="搜索...">
```
- 表单验证属性：
```
<!-- required - 必填项 -->
<input type="text" required>

<!-- pattern - 正则验证 -->
<input type="text" pattern="[0-9]{6}" title="请输入6位数字">

<!-- minlength/maxlength - 长度限制 -->
<input type="text" minlength="3" maxlength="20">

<!-- min/max - 数值范围 -->
<input type="number" min="18" max="65">

<!-- step - 数值间隔 -->
<input type="number" step="0.5">

<!-- multiple - 允许多个值 -->
<input type="email" multiple>
<input type="file" multiple>
```
- 表单增强属性：
```
<!-- placeholder - 占位符 -->
<input type="text" placeholder="请输入用户名">

<!-- autofocus - 自动获取焦点 -->
<input type="text" autofocus>

<!-- autocomplete - 自动完成 -->
<input type="text" autocomplete="on">
<input type="email" autocomplete="email">
<input type="tel" autocomplete="tel">

<!-- disabled - 禁用 -->
<input type="text" disabled>

<!-- readonly - 只读 -->
<input type="text" readonly value="只读内容">

<!-- form - 关联表单（可在表单外） -->
<input type="text" form="myForm">

<!-- formaction - 提交到不同URL -->
<button type="submit" formaction="/alternate-url">提交到其他地址</button>

<!-- list - 关联数据列表 -->
<input type="text" list="browsers">
<datalist id="browsers">
  <option value="Chrome">
  <option value="Firefox">
  <option value="Safari">
</datalist>
```

二、多媒体属性：
- video、audio属性：
```
<video 
  src="video.mp4"
  controls          <!-- 显示播放控件 -->
  autoplay          <!-- 自动播放 -->
  loop              <!-- 循环播放 -->
  muted             <!-- 静音 -->
  poster="cover.jpg" <!-- 封面图 -->
  preload="auto"    <!-- 预加载：none/metadata/auto -->
  width="640"
  height="360">
  您的浏览器不支持视频播放
</video>

<audio 
  src="audio.mp3"
  controls
  autoplay
  loop
  preload="metadata">
</audio>

<!-- 多源支持 -->
<video controls>
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  <source src="video.ogg" type="video/ogg">
</video>
```

三、全局属性：
- data-** 自定义数据属性：
```
<div 
  data-user-id="12345"
  data-user-name="张三"
  data-role="admin"
  data-created-at="2024-01-01">
  用户信息
</div>

<script>
  const div = document.querySelector('div');
  console.log(div.dataset.userId);      // "12345"
  console.log(div.dataset.userName);    // "张三"
  console.log(div.dataset.role);        // "admin"
</script>
```
- CSS中使用：
```
[data-role="admin"] {
  background-color: gold;
}

div::after {
  content: attr(data-user-name);
}
```
- 2. contenteditable - 可编辑内容
```
<div contenteditable="true">
  这段文字可以编辑
</div>

<p contenteditable="false">
  这段文字不可编辑
</p>

<!-- 实际应用：简易富文本编辑器 -->
<div 
  contenteditable="true" 
  style="border: 1px solid #ccc; padding: 10px; min-height: 200px;">
  开始输入内容...
</div>
```
