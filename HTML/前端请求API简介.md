**前端请求API简介**

1、fetch API：浏览器原生支持的现代请求方式，返回promise；
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
