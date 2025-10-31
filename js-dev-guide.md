# JavaScript开发常用方法与技巧大全

## 一、数组方法

### 1. 遍历与迭代
```javascript
// forEach - 遍历数组
arr.forEach((item, index, array) => {});

// map - 映射转换，返回新数组
const newArr = arr.map(item => item * 2);

// filter - 过滤，返回符合条件的新数组
const filtered = arr.filter(item => item > 10);

// find - 查找第一个符合条件的元素
const found = arr.find(item => item.id === 5);

// findIndex - 查找第一个符合条件的索引
const index = arr.findIndex(item => item.id === 5);

// some - 判断是否有元素符合条件
const hasMatch = arr.some(item => item > 10);

// every - 判断是否所有元素都符合条件
const allMatch = arr.every(item => item > 0);

// reduce - 累加器，将数组归约为单个值
const sum = arr.reduce((acc, cur) => acc + cur, 0);

// reduceRight - 从右向左累加
const result = arr.reduceRight((acc, cur) => acc + cur, 0);
```

### 2. 数组修改
```javascript
// push - 末尾添加元素
arr.push(item);

// pop - 删除末尾元素
const last = arr.pop();

// unshift - 开头添加元素
arr.unshift(item);

// shift - 删除开头元素
const first = arr.shift();

// splice - 添加/删除元素
arr.splice(startIndex, deleteCount, ...items);

// slice - 切片，返回新数组（不改变原数组）
const sliced = arr.slice(start, end);

// concat - 合并数组
const merged = arr1.concat(arr2, arr3);

// flat - 数组扁平化
const flattened = arr.flat(depth);

// flatMap - map + flat
const result = arr.flatMap(item => [item, item * 2]);
```

### 3. 数组排序与查找
```javascript
// sort - 排序（会改变原数组）
arr.sort((a, b) => a - b); // 升序
arr.sort((a, b) => b - a); // 降序

// reverse - 反转数组
arr.reverse();

// indexOf - 查找元素索引
const index = arr.indexOf(item);

// lastIndexOf - 从后向前查找
const lastIndex = arr.lastIndexOf(item);

// includes - 判断是否包含元素
const hasItem = arr.includes(item);

// join - 数组转字符串
const str = arr.join(',');
```

### 4. 数组实用技巧
```javascript
// 数组去重
const unique = [...new Set(arr)];
const unique2 = arr.filter((item, index) => arr.indexOf(item) === index);

// 数组扁平化（深度扁平）
const deepFlat = arr => arr.flat(Infinity);
const deepFlat2 = arr => arr.toString().split(',').map(Number);

// 数组分组
const grouped = arr.reduce((acc, cur) => {
  const key = cur.category;
  if (!acc[key]) acc[key] = [];
  acc[key].push(cur);
  return acc;
}, {});

// 数组求和/平均值
const sum = arr.reduce((a, b) => a + b, 0);
const avg = sum / arr.length;

// 数组最大/最小值
const max = Math.max(...arr);
const min = Math.min(...arr);

// 随机打乱数组
const shuffled = arr.sort(() => Math.random() - 0.5);

// 数组分页
const paginate = (arr, pageSize, pageNum) => {
  return arr.slice((pageNum - 1) * pageSize, pageNum * pageSize);
};

// 数组差集/交集/并集
const diff = arr1.filter(x => !arr2.includes(x));
const intersection = arr1.filter(x => arr2.includes(x));
const union = [...new Set([...arr1, ...arr2])];
```

## 二、字符串方法

### 1. 字符串操作
```javascript
// slice - 切片
str.slice(start, end);

// substring - 子字符串
str.substring(start, end);

// substr - 子字符串（已弃用）
str.substr(start, length);

// split - 分割成数组
const arr = str.split(',');

// trim - 去除首尾空格
str.trim();
str.trimStart(); // 去除开头空格
str.trimEnd();   // 去除末尾空格

// padStart / padEnd - 填充字符串
str.padStart(length, '0');
str.padEnd(length, '0');

// repeat - 重复字符串
str.repeat(count);

// replace - 替换
str.replace('old', 'new');
str.replaceAll('old', 'new'); // 替换所有

// toLowerCase / toUpperCase - 大小写转换
str.toLowerCase();
str.toUpperCase();
```

### 2. 字符串查找
```javascript
// indexOf - 查找子串位置
const index = str.indexOf('sub');

// lastIndexOf - 从后向前查找
const lastIndex = str.lastIndexOf('sub');

// includes - 判断是否包含
const has = str.includes('sub');

// startsWith / endsWith - 判断开头/结尾
str.startsWith('prefix');
str.endsWith('suffix');

// search - 正则搜索
const index = str.search(/pattern/);

// match - 正则匹配
const matches = str.match(/pattern/g);

// matchAll - 获取所有匹配（返回迭代器）
const matches = [...str.matchAll(/pattern/g)];
```

### 3. 字符串实用技巧
```javascript
// 首字母大写
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

// 驼峰转下划线
const toSnakeCase = str => str.replace(/([A-Z])/g, '_$1').toLowerCase();

// 下划线转驼峰
const toCamelCase = str => str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

// 反转字符串
const reverse = str => str.split('').reverse().join('');

// 截断字符串
const truncate = (str, len) => str.length > len ? str.slice(0, len) + '...' : str;

// 移除HTML标签
const stripHtml = str => str.replace(/<[^>]*>/g, '');

// 字符串模板
const template = (str, data) => str.replace(/\{(\w+)\}/g, (_, key) => data[key]);
```

## 三、对象方法

### 1. 对象操作
```javascript
// Object.keys - 获取所有键
const keys = Object.keys(obj);

// Object.values - 获取所有值
const values = Object.values(obj);

// Object.entries - 获取键值对数组
const entries = Object.entries(obj);

// Object.fromEntries - 从键值对创建对象
const obj = Object.fromEntries([['a', 1], ['b', 2]]);

// Object.assign - 合并对象（浅拷贝）
const merged = Object.assign({}, obj1, obj2);

// 对象解构合并
const merged = { ...obj1, ...obj2 };

// Object.freeze - 冻结对象
Object.freeze(obj);

// Object.seal - 密封对象
Object.seal(obj);

// hasOwnProperty - 判断自有属性
obj.hasOwnProperty('key');

// in 操作符 - 判断属性（包括原型链）
'key' in obj;
```

### 2. 对象实用技巧
```javascript
// 深拷贝
const deepClone = obj => JSON.parse(JSON.stringify(obj));
const deepClone2 = obj => structuredClone(obj); // 现代浏览器

// 深拷贝（递归实现）
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  const clone = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key]);
    }
  }
  return clone;
}

// 删除对象属性
delete obj.key;
const { key, ...rest } = obj; // 解构删除

// 对象过滤
const filtered = Object.fromEntries(
  Object.entries(obj).filter(([key, value]) => value !== null)
);

// 对象映射
const mapped = Object.fromEntries(
  Object.entries(obj).map(([key, value]) => [key, value * 2])
);

// 检查空对象
const isEmpty = obj => Object.keys(obj).length === 0;

// 对象路径取值
const getPath = (obj, path) => path.split('.').reduce((acc, key) => acc?.[key], obj);

// 对象路径设值
const setPath = (obj, path, value) => {
  const keys = path.split('.');
  const last = keys.pop();
  const target = keys.reduce((acc, key) => acc[key] = acc[key] || {}, obj);
  target[last] = value;
};

// 对象比较
const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
```

## 四、常用DOM事件

### 1. 鼠标事件
```javascript
// click - 单击
element.addEventListener('click', e => {});

// dblclick - 双击
element.addEventListener('dblclick', e => {});

// mousedown - 鼠标按下
element.addEventListener('mousedown', e => {});

// mouseup - 鼠标抬起
element.addEventListener('mouseup', e => {});

// mousemove - 鼠标移动
element.addEventListener('mousemove', e => {});

// mouseenter - 鼠标进入（不冒泡）
element.addEventListener('mouseenter', e => {});

// mouseleave - 鼠标离开（不冒泡）
element.addEventListener('mouseleave', e => {});

// mouseover - 鼠标移入（冒泡）
element.addEventListener('mouseover', e => {});

// mouseout - 鼠标移出（冒泡）
element.addEventListener('mouseout', e => {});

// contextmenu - 右键菜单
element.addEventListener('contextmenu', e => {
  e.preventDefault(); // 阻止默认菜单
});

// wheel - 鼠标滚轮
element.addEventListener('wheel', e => {});
```

### 2. 键盘事件
```javascript
// keydown - 按键按下
element.addEventListener('keydown', e => {
  console.log(e.key, e.code, e.keyCode);
});

// keyup - 按键抬起
element.addEventListener('keyup', e => {});

// keypress - 按键按下（已弃用）
element.addEventListener('keypress', e => {});

// 常用按键判断
e.key === 'Enter'
e.key === 'Escape'
e.ctrlKey // Ctrl键
e.shiftKey // Shift键
e.altKey // Alt键
e.metaKey // Command/Windows键
```

### 3. 表单事件
```javascript
// input - 输入变化（实时）
input.addEventListener('input', e => {
  console.log(e.target.value);
});

// change - 值改变并失焦
input.addEventListener('change', e => {});

// focus - 获得焦点
input.addEventListener('focus', e => {});

// blur - 失去焦点
input.addEventListener('blur', e => {});

// submit - 表单提交
form.addEventListener('submit', e => {
  e.preventDefault(); // 阻止默认提交
});

// reset - 表单重置
form.addEventListener('reset', e => {});

// select - 文本选中
input.addEventListener('select', e => {});
```

### 4. 页面事件
```javascript
// DOMContentLoaded - DOM加载完成
document.addEventListener('DOMContentLoaded', () => {});

// load - 页面完全加载
window.addEventListener('load', () => {});

// beforeunload - 页面卸载前
window.addEventListener('beforeunload', e => {
  e.preventDefault();
  e.returnValue = ''; // 显示确认对话框
});

// unload - 页面卸载
window.addEventListener('unload', () => {});

// resize - 窗口大小改变
window.addEventListener('resize', () => {});

// scroll - 滚动
window.addEventListener('scroll', () => {});

// visibilitychange - 页面可见性改变
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('页面隐藏');
  } else {
    console.log('页面可见');
  }
});
```

### 5. 触摸事件（移动端）
```javascript
// touchstart - 触摸开始
element.addEventListener('touchstart', e => {});

// touchmove - 触摸移动
element.addEventListener('touchmove', e => {});

// touchend - 触摸结束
element.addEventListener('touchend', e => {});

// touchcancel - 触摸取消
element.addEventListener('touchcancel', e => {});

// 触摸点信息
e.touches // 当前触摸点列表
e.changedTouches // 改变的触摸点
e.targetTouches // 目标元素上的触摸点
```

### 6. 拖放事件
```javascript
// dragstart - 开始拖动
element.addEventListener('dragstart', e => {
  e.dataTransfer.setData('text', e.target.id);
});

// drag - 拖动中
element.addEventListener('drag', e => {});

// dragend - 拖动结束
element.addEventListener('dragend', e => {});

// dragenter - 拖入目标
element.addEventListener('dragenter', e => {});

// dragover - 在目标上方
element.addEventListener('dragover', e => {
  e.preventDefault(); // 必须阻止默认行为才能drop
});

// dragleave - 离开目标
element.addEventListener('dragleave', e => {});

// drop - 放置
element.addEventListener('drop', e => {
  e.preventDefault();
  const data = e.dataTransfer.getData('text');
});
```

## 五、事件处理技巧

### 1. 事件监听
```javascript
// 添加事件监听
element.addEventListener('click', handler);
element.addEventListener('click', handler, { once: true }); // 只触发一次
element.addEventListener('click', handler, { passive: true }); // 不调用preventDefault
element.addEventListener('click', handler, { capture: true }); // 捕获阶段

// 移除事件监听
element.removeEventListener('click', handler);

// 事件委托（事件代理）
parent.addEventListener('click', e => {
  if (e.target.matches('.child')) {
    // 处理子元素点击
  }
});
```

### 2. 事件对象
```javascript
e.preventDefault(); // 阻止默认行为
e.stopPropagation(); // 阻止冒泡
e.stopImmediatePropagation(); // 阻止当前元素其他监听器执行
e.target // 触发事件的元素
e.currentTarget // 绑定事件的元素
e.type // 事件类型
e.timeStamp // 事件时间戳
```

### 3. 防抖与节流
```javascript
// 防抖 - 延迟执行，频繁触发只执行最后一次
function debounce(fn, delay = 300) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// 使用示例
const handleInput = debounce(e => {
  console.log(e.target.value);
}, 500);
input.addEventListener('input', handleInput);

// 节流 - 固定频率执行
function throttle(fn, delay = 300) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= delay) {
      fn.apply(this, args);
      last = now;
    }
  };
}

// 使用示例
const handleScroll = throttle(() => {
  console.log(window.scrollY);
}, 200);
window.addEventListener('scroll', handleScroll);
```

## 六、异步处理

### 1. Promise
```javascript
// 创建Promise
const promise = new Promise((resolve, reject) => {
  // 异步操作
  if (success) resolve(data);
  else reject(error);
});

// Promise链式调用
promise
  .then(data => {})
  .catch(err => {})
  .finally(() => {});

// Promise静态方法
Promise.all([p1, p2, p3]) // 所有完成
Promise.allSettled([p1, p2, p3]) // 所有结束（无论成功失败）
Promise.race([p1, p2, p3]) // 第一个完成
Promise.any([p1, p2, p3]) // 第一个成功
Promise.resolve(value) // 创建成功的Promise
Promise.reject(error) // 创建失败的Promise
```

### 2. async/await
```javascript
// async函数
async function fetchData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

// 并行执行多个异步任务
async function parallel() {
  const [data1, data2, data3] = await Promise.all([
    fetch(url1).then(r => r.json()),
    fetch(url2).then(r => r.json()),
    fetch(url3).then(r => r.json())
  ]);
}

// 顺序执行
async function sequence() {
  const data1 = await fetch(url1).then(r => r.json());
  const data2 = await fetch(url2).then(r => r.json());
  const data3 = await fetch(url3).then(r => r.json());
}
```

### 3. 定时器
```javascript
// setTimeout - 延迟执行
const timerId = setTimeout(() => {}, delay);
clearTimeout(timerId);

// setInterval - 周期执行
const intervalId = setInterval(() => {}, interval);
clearInterval(intervalId);

// requestAnimationFrame - 动画帧
function animate() {
  // 动画逻辑
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

## 七、数据处理技巧

### 1. 数据转换
```javascript
// 类型转换
String(value)
Number(value)
Boolean(value)
parseInt(str, radix)
parseFloat(str)

// JSON
JSON.stringify(obj, replacer, space)
JSON.parse(str, reviver)

// 日期处理
new Date()
Date.now()
date.toISOString()
date.toLocaleDateString()
date.getTime()

// 数字格式化
num.toFixed(2) // 保留小数
num.toLocaleString() // 千分位
```

### 2. 数据验证
```javascript
// 类型判断
typeof value
value instanceof Constructor
Array.isArray(value)
Object.prototype.toString.call(value) === '[object Object]'

// 空值判断
value == null // null或undefined
value === null
value === undefined
!value // 假值判断

// 正则验证
/pattern/.test(str)

// 常用正则
const emailReg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
const phoneReg = /^1[3-9]\d{9}$/;
const urlReg = /^https?:\/\/.+/;
const idCardReg = /^\d{17}[\dXx]$/;
```

### 3. 数据处理工具函数
```javascript
// 生成唯一ID
const uuid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

// 生成随机数
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// 随机字符串
const randomStr = len => Math.random().toString(36).slice(2, 2 + len);

// 数字格式化
const formatNumber = (num, decimals = 2) => {
  return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// 文件大小格式化
const formatBytes = bytes => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
};

// 时间格式化
const formatTime = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  const d = new Date(date);
  const map = {
    YYYY: d.getFullYear(),
    MM: String(d.getMonth() + 1).padStart(2, '0'),
    DD: String(d.getDate()).padStart(2, '0'),
    HH: String(d.getHours()).padStart(2, '0'),
    mm: String(d.getMinutes()).padStart(2, '0'),
    ss: String(d.getSeconds()).padStart(2, '0')
  };
  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, match => map[match]);
};

// 相对时间
const timeAgo = date => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = {
    年: 31536000,
    月: 2592000,
    周: 604800,
    天: 86400,
    小时: 3600,
    分钟: 60,
    秒: 1
  };
  for (const [unit, value] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / value);
    if (interval >= 1) return `${interval}${unit}前`;
  }
  return '刚刚';
};

// URL参数解析
const parseQuery = url => {
  const query = url.split('?')[1] || '';
  return Object.fromEntries(new URLSearchParams(query));
};

// URL参数生成
const buildQuery = obj => {
  return new URLSearchParams(obj).toString();
};

// 金额大写转换
const digitUppercase = n => {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(num * 10 * 10 ** index) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i++) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j++) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }
  return s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
};
```

## 八、常用Web API

### 1. 本地存储
```javascript
// localStorage - 永久存储
localStorage.setItem('key', 'value');
localStorage.getItem('key');
localStorage.removeItem('key');
localStorage.clear();

// sessionStorage - 会话存储
sessionStorage.setItem('key', 'value');
sessionStorage.getItem('key');

// 存储对象
localStorage.setItem('user', JSON.stringify(obj));
const user = JSON.parse(localStorage.getItem('user'));

// Cookie操作
document.cookie = 'name=value; expires=date; path=/';
const getCookie = name => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
};
```

### 2. Fetch API
```javascript
// GET请求
fetch(url)
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));

// POST请求
fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
  .then(res => res.json())
  .then(data => console.log(data));

// 上传文件
const formData = new FormData();
formData.append('file', file);
fetch(url, {
  method: 'POST',
  body: formData
});

// 请求配置
fetch(url, {
  method: 'GET',
  headers: {},
  body: null,
  mode: 'cors',
  credentials: 'include',
  cache: 'default',
  redirect: 'follow',
  referrer: 'client'
});
```

### 3. DOM操作
```javascript
// 选择元素
document.getElementById('id')
document.querySelector('.class')
document.querySelectorAll('.class')
document.getElementsByClassName('class')
document.getElementsByTagName('tag')

// 创建元素
const el = document.createElement('div');
const text = document.createTextNode('text');

// 插入元素
parent.appendChild(child);
parent.insertBefore(newNode, referenceNode);
parent.append(...nodes); // 可插入多个
parent.prepend(...nodes);
el.insertAdjacentHTML('beforeend', html);

// 删除元素
parent.removeChild(child);
el.remove();

// 克隆元素
const clone = el.cloneNode(true); // true为深克隆

// 属性操作
el.getAttribute('attr');
el.setAttribute('attr', 'value');
el.removeAttribute('attr');
el.hasAttribute('attr');

// 类名操作
el.classList.add('class');
el.classList.remove('class');
el.classList.toggle('class');
el.classList.contains('class');
el.className = 'class1 class2';

// 样式操作
el.style.color = 'red';
el.style.cssText = 'color: red; font-size: 14px;';
getComputedStyle(el).color;

// 数据属性
el.dataset.id // data-id
el.dataset.userName // data-user-name

// 内容操作
el.innerHTML // HTML内容
el.textContent // 文本内容
el.innerText // 渲染后的文本
el.value // 表单值
```

### 4. 其他常用API
```javascript
// IntersectionObserver - 元素可见性监听
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // 元素可见
    }
  });
});
observer.observe(element);

// MutationObserver - DOM变化监听
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    console.log(mutation.type);
  });
});
observer.observe(element, {
  childList: true,
  attributes: true,
  characterData: true,
  subtree: true
});

// ResizeObserver - 元素大小变化监听
const observer = new ResizeObserver(entries => {
  entries.forEach(entry => {
    console.log(entry.contentRect);
  });
});
observer.observe(element);

// Clipboard API - 剪贴板
navigator.clipboard.writeText(text);
navigator.clipboard.readText().then(text => {});

// Geolocation API - 地理位置
navigator.geolocation.getCurrentPosition(
  position => console.log(position.coords),
  error => console.error(error)
);

// Notification API - 通知
Notification.requestPermission().then(permission => {
  if (permission === 'granted') {
    new Notification('标题', { body: '内容' });
  }
});
```

## 九、ES6+新特性

### 1. 解构赋值
```javascript
// 数组解构
const [a, b, ...rest] = [1, 2, 3, 4, 5];
const [x = 0, y = 0] = [1]; // 默认值

// 对象解构
const { name, age } = obj;
const { name: userName, age: userAge } = obj; // 重命名
const { name = 'default' } = obj; // 默认值

// 函数参数解构
function fn({ name, age = 18