**前端请求API简介**

1、fetch API：浏览器原生支持的现代请求方式，返回promise；优点：原生支持、语法简洁、支持 async/await；缺点：不自动处理错误状态，需要手动判断 response.ok；
```
// GET 请求
fetch('https://jsonplaceholder.typicode.com/posts/1')
  .then(response => {
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json(); // 转成 JSON
  })
  .then(data => console.log(data))
  .catch(err => console.error('请求出错:', err));

// POST 请求
fetch('https://jsonplaceholder.typicode.com/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Hello',
    body: 'Fetch 示例',
    userId: 1
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

2、XMLHttpRequest (XHR)：较旧的请求方式，但依然可用（比如需要兼容旧浏览器）。优点：老浏览器兼容好,缺点：语法冗长，不如 fetch 简洁;
```
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://jsonplaceholder.typicode.com/posts/1');
xhr.onload = function () {
  if (xhr.status === 200) {
    console.log(JSON.parse(xhr.responseText));
  } else {
    console.error('请求失败:', xhr.status);
  }
};
xhr.onerror = function () {
  console.error('网络错误');
};
xhr.send();
```

3、axios（第三方库）基于 Promise，功能更丰富（浏览器 + Node.js 通用）；
```
import axios from 'axios';

// GET
axios.get('https://jsonplaceholder.typicode.com/posts/1')
  .then(res => console.log(res.data))
  .catch(err => console.error(err));

// POST
axios.post('https://jsonplaceholder.typicode.com/posts', {
  title: 'Hello',
  body: 'Axios 示例',
  userId: 1
})
  .then(res => console.log(res.data))
  .catch(err => console.error(err));
```
