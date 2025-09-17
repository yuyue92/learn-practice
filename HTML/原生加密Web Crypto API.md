## Web Crypto API示例

Web Crypto API 是浏览器提供的一组原生API，用于在web应用中，安全的执行加密操作，如生成密钥、加密、解密、签名验证等；它比传统的JavaScript加密库（如CryptoJS）更安全，因为它在浏览器的底层实现，避免了纯JS实现中潜在的安全漏洞，也能使用硬件加速。

使用场景：
- 用户密码加密（（如 PBKDF2、SHA-256 哈希））；
- 对称加密、解密（（如 AES））；
- 非对称加密、签名（如 RSA、ECDSA））；
- 安全随机数生成（如 token、验证码）；
- 签名与验证（如 JWT 的签名部分）；

常用API：crypto.subtle(提供加密相关的所有核心方法)；crypto.getRandomValues() （生成安全随机数）；

示例一，生成随机安全数：
```
const array = new Uint8Array(16);
crypto.getRandomValues(array);
console.log(array); // 安全随机的 16 字节
```

示例 2：计算字符串的 SHA-256 哈希:
```
async function sha256(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

sha256("hello world").then(console.log);
```

使用生成密钥加密/解密时 流程图解:
```
生成密钥 (CryptoKey) 
    → 导出为字符串 (Base64) 
    → 存储密钥字符串 (localStorage/sessionStorage)
    → 加密用户数据 (用原始 CryptoKey + 随机 IV) 
    → 存储加密数据 + IV (localStorage)
    
解密时：
    读取密钥字符串 → 恢复为 CryptoKey 
    → 读取加密数据 + IV 
    → 解密数据
```
