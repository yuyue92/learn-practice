HTML 元素的 data-xxx 属性，也就是 自定义数据属性（Custom Data Attributes）。

HTML5引入了一种新的属性格式：data-<name>="value"，可以在HTML5元素中嵌入自定义数据，可以被JavaScript获取和操作；

命名规则：
- 必须以 data- 开头
- 后面可以跟任意自定义名字（推荐小写和中划线）
- 在 JavaScript 中访问时，中划线会被转换为 驼峰命名
