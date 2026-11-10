# Web Crypto API 完整指南与应用案例

> 整理日期：2026-11-10  
> 内容范围：根据本次对话完整整理概念、算法选择、公共工具、12 个应用案例、代码示例、常见误区与业务落地建议。  
> 示例语言：JavaScript，非 TypeScript；使用原生 Web Crypto API。  
> 阅读方式：各案例共用第 3 章工具函数；部分案例还复用前文定义的函数或密钥，依赖关系见第 10 章。

## 目录

- [1. Web Crypto API 是什么](#section-1)
- [2. 运行环境与核心接口](#section-2)
- [3. 公共工具：字节、编码和随机值](#section-3)
- [4. 用户密码：SHA-256 与 PBKDF2](#section-4)
  - [案例 A：文本与文件 SHA-256 摘要](#case-a)
  - [案例 B：PBKDF2 注册与密码验证](#case-b)
- [5. 对称加密：AES-GCM](#section-5)
  - [案例 C：私人笔记与业务 JSON 加密](#case-c)
  - [案例 D：密码保护的数据备份](#case-d)
- [6. 非对称加密与数字签名](#section-6)
  - [案例 E：RSA-OAEP 加密短消息](#case-e)
  - [案例 F：RSA 与 AES 混合加密](#case-f)
  - [案例 G：ECDSA 签署审批结果及 RSA-PSS 补充](#case-g)
- [7. 安全随机数](#section-7)
  - [案例 H：重置密码 token](#case-h)
  - [案例 I：均匀生成六位验证码](#case-i)
  - [案例 J：UUID](#case-j)
- [8. 消息认证与 JWT 签名验证](#section-8)
  - [案例 K：HMAC 消息认证](#case-k)
  - [案例 L：HS256 JWT 签发与验证](#case-l)
- [9. 业务场景选型与安全边界](#section-9)
- [10. 代码运行顺序与验证说明](#section-10)
- [11. 参考资料](#section-11)

---

<a id="section-1"></a>
## 1. Web Crypto API 是什么

Web Crypto API 是 JavaScript 内置的一组密码学接口，可以完成哈希、密钥生成、加密解密、数字签名、签名验证和安全随机数生成。浏览器原生提供，通常不需要安装第三方加密库；Node.js 也提供兼容接口。[1][2]

理解它的关键，是分清各种操作的目的。

| 操作 | 解决什么问题 | 是否需要密钥 | 是否可以恢复原文 | 常见算法或接口 |
|---|---|---|---|---|
| 普通哈希 | 给数据生成摘要，检查内容是否一致 | 否 | 不可逆，但低熵输入可以被猜中 | SHA-256 |
| 口令派生 | 提高猜测密码的成本，或从密码生成密钥 | 使用密码、盐及计算参数 | 不可逆，但仍可能被离线猜测 | PBKDF2 |
| 对称加密 | 保护数据内容 | 双方持有同一密钥 | 可以 | AES-GCM |
| 非对称加密 | 让持有私钥的人才能解密 | 公钥、私钥 | 可以，由私钥解密 | RSA-OAEP |
| 数字签名 | 验证数据由对应私钥签发，且未被修改 | 私钥签名、公钥验证 | 不负责隐藏或恢复原文 | ECDSA、RSA-PSS |
| 消息认证码 | 在共享密钥的双方之间验证完整性和真实性 | 同一秘密密钥 | 不负责隐藏原文 | HMAC-SHA-256 |
| 安全随机数 | 生成难以预测的随机值 | 调用时通常不需要提供 | 不适用 | getRandomValues() |

本指南对应五类需求：用户密码处理、对称加密解密、非对称加密与签名、安全随机数、签名验证及 JWT。

API 提供的是密码学基础能力。密钥保存、身份认证、可信公钥分发、授权、限流、防重放和数据格式，仍由应用设计负责。

<a id="section-2"></a>
## 2. 运行环境与核心接口

### 2.1 浏览器运行方式

浏览器中的 `crypto.subtle` 应在 HTTPS 或 `http://localhost` 这样的安全上下文中使用。`getRandomValues()` 的上下文限制有所不同，但不能据此省略网站的 HTTPS。[1][4]

下面的代码全部使用 JavaScript，不使用 TypeScript。可以放进同一个模块脚本，按顺序运行：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <title>Web Crypto 学习示例</title>
</head>
<body>
  <input id="fileInput" type="file">

  <script type="module">
    // 先粘贴公共工具，再粘贴需要运行的案例。
    // 结果在浏览器开发者工具的 Console 中查看。
  </script>
</body>
</html>
```

示例使用顶层 `await`，因此需要模块环境。若放进普通函数，需要把函数声明为 `async`。

### 2.2 Node.js 运行方式

支持这些接口的现代 Node.js 可以使用 `globalThis.crypto`，也可以通过 `node:crypto` 导入 Web Crypto。本文主代码统一使用 `globalThis.crypto`。[2]

将代码保存为 `.mjs` 文件后运行：

```bash
node webcrypto-demo.mjs
```

文件输入控件属于浏览器功能，Node.js 中没有 `document` 和浏览器文件选择界面。第 4 章已对事件绑定增加浏览器环境判断。

### 2.3 核心接口速查

Web Crypto 中的大部分密码学操作返回 `Promise`，二进制结果通常是 `ArrayBuffer`；密钥则由 `CryptoKey` 对象表示。

| 方法 | 主要用途 |
|---|---|
| `crypto.getRandomValues()` | 填充密码学安全的随机值，同步调用 |
| `crypto.randomUUID()` | 生成随机 UUID，同步调用 |
| `crypto.subtle.digest()` | 计算哈希 |
| `crypto.subtle.generateKey()` | 生成密钥或密钥对 |
| `crypto.subtle.importKey()` / `exportKey()` | 导入、导出密钥 |
| `crypto.subtle.deriveBits()` / `deriveKey()` | 派生字节或密钥 |
| `crypto.subtle.encrypt()` / `decrypt()` | 加密、解密 |
| `crypto.subtle.sign()` / `verify()` | 生成、验证签名或 MAC |
| `crypto.subtle.wrapKey()` / `unwrapKey()` | 加密导出密钥、解密导入密钥 |

`CryptoKey` 不只是一个字符串，它包含算法、用途、密钥类型和是否允许导出的信息。比如声明为只能 `verify` 的密钥，不能直接用于 `sign`。

<a id="section-3"></a>
## 3. 公共工具：字节、编码和随机值

所有案例首先加载本章工具。

```js
const wc = globalThis.crypto;

if (!wc?.subtle) {
  throw new Error("当前环境不支持 Web Crypto，请使用 HTTPS 或 localhost");
}

const enc = new TextEncoder();
const dec = new TextDecoder("utf-8", { fatal: true });

// 文本 → UTF-8 字节。
const utf8 = text => enc.encode(text);

// 生成随机字节。本教程只用于少量随机数据。
function randomBytes(length) {
  return wc.getRandomValues(new Uint8Array(length));
}

// ArrayBuffer / Uint8Array → Base64URL。
function toB64u(data) {
  const bytes =
    data instanceof Uint8Array ? data : new Uint8Array(data);

  let binary = "";

  // 分块，避免大数组展开导致调用栈溢出。
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(
      ...bytes.subarray(i, i + 0x8000)
    );
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Base64URL → Uint8Array。
function fromB64u(value) {
  if (
    typeof value !== "string" ||
    !/^[A-Za-z0-9_-]*$/.test(value) ||
    value.length % 4 === 1
  ) {
    throw new Error("无效的 Base64URL");
  }

  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - base64.length % 4) % 4);

  const bytes = Uint8Array.from(
    atob(padded),
    char => char.charCodeAt(0)
  );

  if (toB64u(bytes) !== value) {
    throw new Error("非规范的 Base64URL");
  }

  return bytes;
}

function toHex(data) {
  return Array.from(new Uint8Array(data), byte =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}
```

### 3.1 编码与加密的区别

`TextEncoder` 将字符编码为字节；Base64URL 把二进制数据表示成便于传输的文本。这两者都不提供加密保护。

| 数据形式 | 用途 | 示例说明 |
|---|---|---|
| JavaScript 字符串 | 表达文本 | `"你好"` |
| `Uint8Array` | 处理具体字节 | UTF-8 编码后的内容 |
| `ArrayBuffer` | 保存二进制内存 | 常见 Web Crypto 返回值 |
| 十六进制 | 人类可读的摘要展示 | SHA-256 常见为 64 个十六进制字符 |
| Base64URL | 在 JSON、URL 和 JWT 中表示二进制 | 用 `-`、`_` 替代普通 Base64 的部分字符 |
| `CryptoKey` | 承载密钥及其使用限制 | AES、HMAC、公钥或私钥 |

不要把字符串直接交给要求 `BufferSource` 的密码学方法，也不要对中文字符串直接调用 `btoa()`；应先完成 UTF-8 编码。

<a id="section-4"></a>
## 4. 用户密码：SHA-256 与 PBKDF2

### 4.1 登录密码通常应做慢速口令哈希

登录密码通常应该存储为**带盐的慢速口令哈希**，不应保存为以后可以解密的密文。

SHA-256 计算很快，适合内容摘要，不适合直接保存用户密码。对于新建的服务端密码存储系统，OWASP 优先建议 Argon2id；PBKDF2 是另一种可用方案，尤其适合相关兼容或合规要求。浏览器广泛可用的 Web Crypto 接口中，可以直接使用 PBKDF2。[3]

| 需求 | 应采用的方式 |
|---|---|
| 检查文件内容是否相同 | SHA-256 |
| 保存登录密码的验证记录 | 成熟的慢速口令哈希方案，例如 Argon2id；适当场景可使用 PBKDF2 |
| 用户输入密码后解密自己的备份 | PBKDF2 派生密钥，再用 AES-GCM 加密解密 |
| 保护高熵随机 token 的数据库记录 | 可存储 SHA-256 摘要，配合过期和一次性消费机制 |

<a id="case-a"></a>
### 4.2 案例 A：文本与文件 SHA-256 摘要

例如，考勤系统导入 CSV 时，可以计算文件摘要，用于提示“这个文件此前已经导入过”。

```js
async function sha256Hex(data) {
  const digest = await wc.subtle.digest("SHA-256", data);
  return toHex(digest);
}

console.log(await sha256Hex(utf8("hello")));
// 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824

console.log(await sha256Hex(utf8("你好，Web Crypto")));

// 浏览器 File 对象。
async function hashFile(file) {
  const buffer = await file.arrayBuffer();
  return sha256Hex(buffer);
}

// 页面需要有 <input id="fileInput" type="file">。
if (typeof document !== "undefined") {
  document.querySelector("#fileInput")?.addEventListener(
    "change",
    async event => {
      const file = event.target.files?.[0];
      if (!file) return;

      console.log("文件名：", file.name);
      console.log("SHA-256：", await hashFile(file));
    }
  );
}
```

使用时注意：

- 相同字节得到相同摘要；文件名不同但内容相同，摘要也相同。
- CSV 换行符、BOM 或编码发生变化，也会改变摘要。
- 摘要只能检查内容是否匹配。防止恶意替换时，预期摘要本身必须来自可信渠道。
- `digest()` 不是流式接口，上面的写法会把整个文件读入内存；特别大的文件需要另外设计处理方案。
- 浏览器计算的摘要不能替代服务器去重和权限控制；服务器不能无条件信任客户端提交的摘要。

以下写法不适合作为登录密码的存储方案：

```js
// 反例，不要将其用于登录密码存储：
// const passwordHash = await sha256Hex(utf8(password));
```

即使加上盐，单次 SHA-256 仍然太快，不能提供慢速口令派生的抗猜测成本。

<a id="case-b"></a>
### 4.3 案例 B：PBKDF2 注册与密码验证

PBKDF2 可以理解为：使用密码、每条记录独立的随机盐和一定计算成本，派生出一段字节。

本例使用 PBKDF2-HMAC-SHA-256、16 字节随机盐、32 字节输出，以及 600,000 次迭代。600,000 是整理时 OWASP 对该 PBKDF2 变体给出的建议值。实际部署需结合服务器性能、登录并发和限流措施评估。[3]

```js
const PASSWORD_ITERATIONS = 600_000;

async function derivePasswordBits(password, salt, iterations) {
  const material = await wc.subtle.importKey(
    "raw",
    utf8(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const result = await wc.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations,
      hash: "SHA-256"
    },
    material,
    256 // 输出 256 bit，也就是 32 字节。
  );

  return new Uint8Array(result);
}

// 教学用比较函数：避免发现首个差异就返回。
// JavaScript/JIT 不保证这种写法具有严格的常量时间特性。
function equalBytes(a, b) {
  if (a.length !== b.length) return false;

  let difference = 0;
  for (let i = 0; i < a.length; i++) {
    difference |= a[i] ^ b[i];
  }
  return difference === 0;
}

// 注册阶段：生成可存入数据库的记录。
async function createPasswordRecord(password) {
  const salt = randomBytes(16);
  const hash = await derivePasswordBits(
    password,
    salt,
    PASSWORD_ITERATIONS
  );

  return {
    version: 1,
    algorithm: "PBKDF2",
    hashAlgorithm: "SHA-256",
    iterations: PASSWORD_ITERATIONS,
    salt: toB64u(salt),
    hash: toB64u(hash)
  };
}

// 登录阶段：使用数据库记录里的参数重新派生。
async function verifyPassword(password, record) {
  if (
    record.version !== 1 ||
    record.algorithm !== "PBKDF2" ||
    record.hashAlgorithm !== "SHA-256" ||
    !Number.isInteger(record.iterations) ||
    record.iterations < 600_000 ||
    record.iterations > 2_000_000
  ) {
    throw new Error("不支持的口令记录参数");
  }

  const salt = fromB64u(record.salt);
  const expected = fromB64u(record.hash);

  if (salt.length !== 16 || expected.length !== 32) {
    throw new Error("口令记录格式错误");
  }

  const actual = await derivePasswordBits(
    password,
    salt,
    record.iterations
  );

  return equalBytes(actual, expected);
}

const passwordRecord =
  await createPasswordRecord("Yuri-demo-password-2026!");

console.log(
  await verifyPassword("Yuri-demo-password-2026!", passwordRecord)
); // true

console.log(
  await verifyPassword("wrong-password", passwordRecord)
); // false
```

#### 盐、参数保存与算法升级

`salt`、算法名、版本和迭代次数都可以随哈希一起保存。盐让相同密码产生不同结果，阻止攻击者直接复用一套预计算结果；它不是需要藏起来的秘密密钥。

代码中的迭代次数上下界是本示例定义的策略，不是协议通用范围。已有系统升级参数时，需要兼容受支持的历史记录，并在用户成功登录后重新派生、升级记录。

#### 实际执行位置

真实登录系统中，密码验证应由服务端完成。Node.js 服务端可使用 `node:crypto` 的 `timingSafeEqual()` 比较相同长度的结果，密码哈希方案优先使用成熟实现。

浏览器先计算 `SHA256(password)` 再发送给服务器，不能替代 HTTPS。如果服务器直接把该哈希当成登录凭证，拿到它的人就可能重放登录。

对于 Vue3 + Supabase 项目，账户登录应交给 Supabase Auth；Web Crypto 更适合处理额外的客户端数据加密需求。

<a id="section-5"></a>
## 5. 对称加密：AES-GCM

### 5.1 AES-GCM 的作用与参数

对称加密使用同一把密钥加密和解密，适合笔记、配置、业务数据和文件内容。

AES-GCM 同时提供内容加密和完整性认证。密文或认证数据被修改时，解密会失败。常用 IV 长度为 12 字节，**同一密钥下绝不能重复使用相同 IV**。[5]

| 参数 | 示例 | 是否保密 | 作用 |
|---|---|---|---|
| `key` | AES-256 密钥 | 是 | 决定谁能解密 |
| `iv` | 每次新生成的 12 字节随机值 | 否 | 保证每次加密使用不同的初始化值 |
| `additionalData` | `employee:123:notes:v1` | 否 | 将密文绑定到指定业务上下文 |
| `tagLength` | 128 bit | 否 | 指定认证标签长度 |
| 密文及认证标签 | `encrypt()` 返回值 | 可以存储、传输 | 加密结果 |

<a id="case-c"></a>
### 5.2 案例 C：私人笔记与业务 JSON 加密

```js
const notesKey = await wc.subtle.generateKey(
  { name: "AES-GCM", length: 256 },
  false, // 不允许 exportKey() 导出此密钥。
  ["encrypt", "decrypt"]
);

async function encryptText(key, text, context = "notes:v1") {
  const iv = randomBytes(12);

  const encrypted = await wc.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
      additionalData: utf8(context),
      tagLength: 128
    },
    key,
    utf8(text)
  );

  return {
    v: 1,
    iv: toB64u(iv),
    data: toB64u(encrypted)
  };
}

async function decryptText(key, packet, context = "notes:v1") {
  if (packet.v !== 1) {
    throw new Error("不支持的密文版本");
  }

  const iv = fromB64u(packet.iv);

  if (iv.length !== 12) {
    throw new Error("无效的 IV");
  }

  const decrypted = await wc.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
      additionalData: utf8(context),
      tagLength: 128
    },
    key,
    fromB64u(packet.data)
  );

  return dec.decode(decrypted);
}

const note = {
  title: "员工备注",
  content: "这是需要保密的内容",
  updatedAt: new Date().toISOString()
};

const encryptedNote = await encryptText(
  notesKey,
  JSON.stringify(note),
  "employee:123:notes:v1"
);

// 可以把 encryptedNote 存到数据库。
console.log(encryptedNote);

const decryptedNote = JSON.parse(
  await decryptText(
    notesKey,
    encryptedNote,
    "employee:123:notes:v1"
  )
);

console.log(decryptedNote);
```

#### AAD：将密文绑定到业务上下文

`additionalData` 通常简称 AAD，可防止某些“把合法密文挪到错误位置”的操作。

例如，同一密钥用于多个员工备注时，把员工 123 的密文复制到员工 456 的记录下，若解密端根据可信的目标记录构造 AAD，就会验证失败：

```js
try {
  await decryptText(
    notesKey,
    encryptedNote,
    "employee:456:notes:v1"
  );
} catch {
  console.log("解密失败：密钥、密文或业务上下文不匹配");
}
```

AAD 的业务值应根据正在访问的目标记录确定。如果直接照搬攻击者随包提交的员工编号，就失去了这种绑定的意义。AAD 被认证，但不被加密。

#### AES-GCM 的使用边界

- 返回的密文已包含认证标签，代码将它们整体保存。
- 数据库保存密文和 IV，密钥必须另外管理。
- 每次加密都重新生成 IV。大量加密或多设备共用同一密钥时，需要控制使用量并制定轮换方案。
- 解密失败不一定代表密码错误，也可能是密文损坏、AAD 不匹配或密钥不对。
- `extractable: false` 禁止正常接口导出密钥，但页面中的恶意脚本仍可能调用密钥执行解密，不能解决 XSS。
- 本例密钥只在当前运行中使用；刷新页面后若没有另外保存或恢复密钥，将无法用新生成的密钥解密旧数据。

<a id="case-d"></a>
### 5.3 案例 D：密码保护的数据备份

这个需求与登录密码存储不同：用户希望以后输入同一个密码，恢复原来的数据。

处理过程是：PBKDF2 从密码派生 AES 密钥，再用 AES-GCM 加密备份。盐、迭代次数和 IV 随密文保存。

```js
async function deriveBackupKey(password, salt, iterations) {
  const material = await wc.subtle.importKey(
    "raw",
    utf8(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return wc.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations,
      hash: "SHA-256"
    },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encryptBackup(password, value) {
  const salt = randomBytes(16);
  const iterations = 600_000;

  const key = await deriveBackupKey(password, salt, iterations);
  const encrypted = await encryptText(
    key,
    JSON.stringify(value),
    "backup:v1"
  );

  return {
    ...encrypted,
    kdf: "PBKDF2-SHA256",
    iterations,
    salt: toB64u(salt)
  };
}

async function decryptBackup(password, packet) {
  // 密文包属于不可信输入，先限制参数，避免超大计算成本。
  if (
    packet.v !== 1 ||
    packet.kdf !== "PBKDF2-SHA256" ||
    !Number.isInteger(packet.iterations) ||
    packet.iterations < 600_000 ||
    packet.iterations > 2_000_000
  ) {
    throw new Error("不支持的备份参数");
  }

  const salt = fromB64u(packet.salt);
  if (salt.length !== 16) {
    throw new Error("无效的盐");
  }

  const key = await deriveBackupKey(
    password,
    salt,
    packet.iterations
  );

  const plaintext = await decryptText(key, packet, "backup:v1");
  return JSON.parse(plaintext);
}

const backupPacket = await encryptBackup(
  "a-long-backup-passphrase",
  {
    tasks: [
      { id: 1, title: "检查考勤数据", done: false }
    ],
    settings: { theme: "dark" }
  }
);

const backupJSON = JSON.stringify(backupPacket);

const restored = await decryptBackup(
  "a-long-backup-passphrase",
  JSON.parse(backupJSON)
);

console.log(restored);
```

适用场景包括离线笔记、个人配置备份、密码保护的导出文件。

忘记密码后，如果没有另设恢复机制，就无法正常恢复数据。密码过弱时，拿到密文的人仍然可以离线猜测。

若希望修改密码时不重新加密全部文件，可以使用两层密钥：随机数据密钥负责加密文件，密码派生密钥只负责加密数据密钥。

<a id="section-6"></a>
## 6. 非对称加密与数字签名

### 6.1 公钥、私钥与算法职责

非对称算法使用公钥、私钥，但不同算法解决不同问题。

| Web Crypto 算法名 | 用途 | 关键操作 |
|---|---|---|
| `RSA-OAEP` | 非对称加密 | 公钥加密，私钥解密 |
| `RSA-PSS` | 数字签名 | 私钥签名，公钥验签 |
| `RSASSA-PKCS1-v1_5` | 数字签名，常用于兼容现有协议 | 私钥签名，公钥验签 |
| `ECDSA` | 椭圆曲线数字签名 | 私钥签名，公钥验签 |
| `ECDH` | 密钥协商 | 双方派生共享秘密，再用于后续加密 |

不要把签名理解成“用私钥加密”。签名用于验证真实性和完整性，消息本身通常仍是公开的。Web Crypto 会通过密钥算法和用途限制，区分 RSA 加密密钥与 RSA 签名密钥。

<a id="case-e"></a>
### 6.2 案例 E：RSA-OAEP 加密短消息

```js
const rsaKeys = await wc.subtle.generateKey(
  {
    name: "RSA-OAEP",
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]), // 65537
    hash: "SHA-256"
  },
  false,
  ["encrypt", "decrypt", "wrapKey", "unwrapKey"]
);

const rsaCiphertext = await wc.subtle.encrypt(
  { name: "RSA-OAEP" },
  rsaKeys.publicKey,
  utf8("一段较短的秘密")
);

const rsaPlaintext = await wc.subtle.decrypt(
  { name: "RSA-OAEP" },
  rsaKeys.privateKey,
  rsaCiphertext
);

console.log(dec.decode(rsaPlaintext));
```

RSA-OAEP 不能直接加密任意长度的数据。采用 2048 位 RSA 和 SHA-256 时，单次明文上限为：

```text
模数字节数 - 2 × 哈希输出字节数 - 2
= 256 - 2 × 32 - 2
= 190 字节
```

限制单位是字节，中文字符数不能直接等同于字节数。文件和大型 JSON 应使用混合加密。[5]

<a id="case-f"></a>
### 6.3 案例 F：RSA 与 AES 混合加密

每份数据随机生成一把 AES 密钥；AES 加密内容，接收者的 RSA 公钥加密该 AES 密钥。

接收者使用 RSA 私钥恢复 AES 密钥，再解密内容。

```js
async function hybridEncrypt(publicKey, text) {
  const dataKey = await wc.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true, // wrapKey() 需要先导出这把临时数据密钥。
    ["encrypt", "decrypt"]
  );

  const encryptedContent = await encryptText(
    dataKey,
    text,
    "hybrid:v1"
  );

  const wrappedKey = await wc.subtle.wrapKey(
    "raw",
    dataKey,
    publicKey,
    { name: "RSA-OAEP" }
  );

  return {
    ...encryptedContent,
    wrappedKey: toB64u(wrappedKey)
  };
}

async function hybridDecrypt(privateKey, packet) {
  const dataKey = await wc.subtle.unwrapKey(
    "raw",
    fromB64u(packet.wrappedKey),
    privateKey,
    { name: "RSA-OAEP" },
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );

  return decryptText(dataKey, packet, "hybrid:v1");
}

const hybridPacket = await hybridEncrypt(
  rsaKeys.publicKey,
  JSON.stringify({
    document: "这里可以换成比 RSA 单次上限大得多的数据",
    rows: Array.from({ length: 100 }, (_, i) => ({ id: i }))
  })
);

const openedDocument = JSON.parse(
  await hybridDecrypt(rsaKeys.privateKey, hybridPacket)
);

console.log(openedDocument);
```

这里演示的是混合加密的核心机制，并不是完整的 JWE 文件格式。正式跨系统协议还应定义算法标识、版本、密钥编号和数据大小限制。

加密给某个公钥不能证明发送者是谁：任何拿到该公钥的人都可以生成新的加密包。若要验证发送者，还需要签名。

接收者公钥必须来自可信渠道，否则攻击者可能把它替换为自己的公钥。

<a id="case-g"></a>
### 6.4 案例 G：ECDSA 签署审批结果

例如，服务器生成审批结果，希望其他系统能够验证它确实来自可信服务器，且金额、单号没有被修改。

```js
const signingKeys = await wc.subtle.generateKey(
  {
    name: "ECDSA",
    namedCurve: "P-256"
  },
  false,
  ["sign", "verify"]
);

const approval = {
  approvalId: "AP-20261110-001",
  employeeId: "EMP-123",
  amount: 1200,
  status: "approved"
};

// 签名针对的是这段确定的字节，而非抽象的 JS 对象。
const approvalText = JSON.stringify(approval);

const approvalSignature = await wc.subtle.sign(
  {
    name: "ECDSA",
    hash: "SHA-256"
  },
  signingKeys.privateKey,
  utf8(approvalText)
);

const signedApproval = {
  payload: approvalText,
  signature: toB64u(approvalSignature)
};

async function verifyApproval(packet, publicKey) {
  return wc.subtle.verify(
    { name: "ECDSA", hash: "SHA-256" },
    publicKey,
    fromB64u(packet.signature),
    utf8(packet.payload)
  );
}

console.log(
  await verifyApproval(signedApproval, signingKeys.publicKey)
); // true

const changedApproval = {
  ...signedApproval,
  payload: signedApproval.payload.replace(
    '"amount":1200',
    '"amount":999999'
  )
};

console.log(
  await verifyApproval(changedApproval, signingKeys.publicKey)
); // false
```

#### 为什么直接传输被签署的字符串

签名针对具体字节。接收者应先对原始 `payload` 字符串验签，成功后再解析 JSON。

如果接收端先解析对象、调整属性顺序后重新序列化，即使业务含义相同，也可能因为字节变化而验签失败。需要跨语言重新序列化时，应约定规范化格式。

Web Crypto 的 ECDSA 签名采用固定长度的 `r || s` 格式，P-256 为 64 字节。一些其他库使用 ASN.1 DER 格式，互通时要明确格式差异。[6]

#### 导出与导入公钥

公钥可以导出为 JWK，交给验证方：

```js
const publicJwk = await wc.subtle.exportKey(
  "jwk",
  signingKeys.publicKey
);

const importedPublicKey = await wc.subtle.importKey(
  "jwk",
  publicJwk,
  { name: "ECDSA", namedCurve: "P-256" },
  true,
  ["verify"]
);

console.log(
  await verifyApproval(signedApproval, importedPublicKey)
); // true
```

`generateKey(..., false, ...)` 对这类密钥对生成操作会使私钥不可导出，公钥仍可导出。公钥无需保密，但验证方必须确认它对应可信的签发者。

#### 补充：RSA-PSS 签名与验证

如果系统要求 RSA 签名，应使用单独的 RSA-PSS 密钥对，不复用 RSA-OAEP 密钥：

```js
const rsaSigningKeys = await wc.subtle.generateKey(
  {
    name: "RSA-PSS",
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: "SHA-256"
  },
  false,
  ["sign", "verify"]
);

const rsaSignature = await wc.subtle.sign(
  { name: "RSA-PSS", saltLength: 32 },
  rsaSigningKeys.privateKey,
  utf8(approvalText)
);

console.log(
  await wc.subtle.verify(
    { name: "RSA-PSS", saltLength: 32 },
    rsaSigningKeys.publicKey,
    rsaSignature,
    utf8(approvalText)
  )
); // true
```

<a id="section-7"></a>
## 7. 安全随机数

### 7.1 为什么不用 Math.random()

`Math.random()` 不适合生成登录凭证、重置密码链接、密钥或安全验证码。`crypto.getRandomValues()` 用于生成密码学安全的随机值，每次调用可填充的数组大小最多为 65,536 字节。[4]

<a id="case-h"></a>
### 7.2 案例 H：重置密码 token

```js
function createToken() {
  // 32 字节 = 256 bit 随机值。
  return toB64u(randomBytes(32));
}

const resetToken = createToken();

console.log(resetToken);
console.log(resetToken.length); // 43 个 Base64URL 字符。
```

正式的重置密码流程应由服务端生成 token，给用户发送原始值，数据库只保存摘要及状态：

```js
// 服务端逻辑示意，避免把 token 写入生产日志。
const rawToken = createToken();
const tokenHash = await sha256Hex(utf8(rawToken));

const resetRecord = {
  userId: "user-123",
  tokenHash,
  expiresAt: Date.now() + 15 * 60 * 1000,
  usedAt: null
};

// 数据库保存 resetRecord。
// 发给用户的链接中携带 rawToken。
```

用户提交 token 时，服务器计算摘要，查找记录，检查有效期，并在使用成功时原子地标记为已消费，避免同一个 token 被并发重复使用。

这里直接使用 SHA-256 是合理的：原始 token 是高熵随机值，攻击者无法像猜常见密码一样有效枚举。它与人类选择的低熵密码不同。

<a id="case-i"></a>
### 7.3 案例 I：均匀生成六位验证码

不能简单地对一个随机字节取 `% 10`。因为 256 不能被 10 整除，会让部分数字出现概率略高，这称为取模偏差。

下面使用拒绝采样，丢弃不能均匀分组的尾部值：

```js
// 返回 [0, max) 范围内的均匀随机整数。
function randomInt(max) {
  if (
    !Number.isSafeInteger(max) ||
    max < 1 ||
    max > 2 ** 32
  ) {
    throw new Error("max 必须是 1 到 2^32 之间的整数");
  }

  const range = 2 ** 32;
  const limit = Math.floor(range / max) * max;

  let value;
  do {
    value = wc.getRandomValues(new Uint32Array(1))[0];
  } while (value >= limit);

  return value % max;
}

function createVerificationCode() {
  return String(randomInt(1_000_000)).padStart(6, "0");
}

console.log(createVerificationCode());
// 可能是 "038251"，因此不要转换为数字保存。
```

验证码只有一百万种组合。随机数安全不等于整个验证流程安全。短信或邮件登录验证码必须在服务端生成和验证，并设置有效期、错误次数上限、发送频率及一次性消费机制。

验证码的数据库保护也与高熵 token 不同：六位数字直接做 SHA-256，数据库泄露后仍容易枚举。可以用服务器独立保管的 HMAC 密钥保护验证码记录，同时限制在线尝试次数。

<a id="case-j"></a>
### 7.4 案例 J：UUID

```js
const recordId = wc.randomUUID();
console.log(recordId);
// 例如：xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx。
```

UUID 适合记录编号和请求追踪编号。承载授权能力的秘密链接或访问凭证，使用专门的随机 token 方案更便于明确随机长度和用途。

<a id="section-8"></a>
## 8. 消息认证与 JWT 签名验证

### 8.1 HMAC 与数字签名的区别

| 对比 | HMAC | ECDSA / RSA 数字签名 |
|---|---|---|
| 生成方使用什么 | 共享秘密密钥 | 私钥 |
| 验证方使用什么 | 同一个秘密密钥 | 公钥 |
| 验证方能否自行生成合法结果 | 能 | 仅持公钥时不能 |
| 常见用途 | 共享密钥服务间认证、HS256 JWT | 多服务验签、公开验证、ES256/RS256 JWT |

Web Crypto 统一通过 `sign()`、`verify()` 操作 HMAC，但从密码学分类上，HMAC 属于消息认证码。

<a id="case-k"></a>
### 8.2 案例 K：HMAC 消息认证

```js
const hmacKey = await wc.subtle.generateKey(
  {
    name: "HMAC",
    hash: "SHA-256",
    length: 256
  },
  false,
  ["sign", "verify"]
);

const message = JSON.stringify({
  orderId: "ORDER-1001",
  amount: 19900,
  currency: "CNY"
});

const messageMac = await wc.subtle.sign(
  "HMAC",
  hmacKey,
  utf8(message)
);

console.log(
  await wc.subtle.verify(
    "HMAC",
    hmacKey,
    messageMac,
    utf8(message)
  )
); // true

console.log(
  await wc.subtle.verify(
    "HMAC",
    hmacKey,
    messageMac,
    utf8(message.replace("19900", "1"))
  )
); // false
```

用于 Webhook 时，应按双方约定，对原始请求体或明确拼接的字节签名，并纳入时间戳、事件编号等信息。接收端还要限制时间窗口、记录已处理事件，防止重放合法消息。

不要在接收端解析 JSON 后随意重新序列化再验签，空格或字段顺序变化都可能改变签名字节。

<a id="case-l"></a>
### 8.3 案例 L：HS256 JWT 签发与验证

#### JWT 三段结构

常见的签名 JWT 使用三段式 JWS 紧凑格式：

```text
Base64URL(header).Base64URL(payload).Base64URL(signature)
```

HS256 的计算方式：

```text
签名输入 = 编码后的 header + "." + 编码后的 payload
signature = HMAC-SHA256(秘密密钥, 签名输入)
```

HS256 应使用至少 256 bit 的高熵密钥。JWT 算法名与 Web Crypto 参数不是同一套字符串，需要正确映射。[7]

| JWT 算法 | Web Crypto 算法 | 参数说明 |
|---|---|---|
| HS256 | HMAC | SHA-256，至少 256 bit 高熵密钥 |
| ES256 | ECDSA | P-256 + SHA-256 |
| RS256 | RSASSA-PKCS1-v1_5 | SHA-256 |
| PS256 | RSA-PSS | SHA-256，按协议要求配置盐长度 |

下面是固定只支持 HS256、普通 JWT 头的教学实现，不是通用 JOSE 库。

#### 生成 JWT

```js
function jsonPart(value) {
  return toB64u(utf8(JSON.stringify(value)));
}

async function signJwtHS256(payload, key) {
  const header = {
    alg: "HS256",
    typ: "JWT"
  };

  const signingInput =
    `${jsonPart(header)}.${jsonPart(payload)}`;

  const signature = await wc.subtle.sign(
    "HMAC",
    key,
    utf8(signingInput)
  );

  return `${signingInput}.${toB64u(signature)}`;
}

const jwtKey = await wc.subtle.generateKey(
  {
    name: "HMAC",
    hash: "SHA-256",
    length: 256
  },
  false,
  ["sign", "verify"]
);

const now = Math.floor(Date.now() / 1000);

const jwt = await signJwtHS256(
  {
    sub: "user-123",
    iss: "https://auth.example.com",
    aud: "attendance-api",
    iat: now,
    exp: now + 15 * 60,
    role: "staff"
  },
  jwtKey
);

console.log(jwt);
```

JWT 时间字段使用 Unix 秒，`Date.now()` 返回毫秒，因此要除以 1000。

| 字段 | 含义 |
|---|---|
| `sub` | 主体标识，例如用户 ID |
| `iss` | 签发方 |
| `aud` | 预期接收方 |
| `iat` | 签发时间 |
| `exp` | 过期时间 |
| `nbf` | 在此时间之前不可接受 |
| `role` | 本例自定义业务声明，不是 JWT 通用权限机制 |

#### 验证 JWT

```js
async function verifyJwtHS256(
  token,
  key,
  {
    issuer,
    audience,
    now = Math.floor(Date.now() / 1000)
  }
) {
  if (typeof token !== "string" || token.length > 8192) {
    throw new Error("无效的 token");
  }

  const parts = token.split(".");

  if (parts.length !== 3 || parts.some(part => !part)) {
    throw new Error("JWT 必须包含三个非空部分");
  }

  const [encodedHeader, encodedPayload, encodedSignature] = parts;

  const header = JSON.parse(
    dec.decode(fromB64u(encodedHeader))
  );

  // 固定算法白名单，不让输入决定可使用的密码学算法。
  // 同时拒绝 crit、b64 等本示例未实现的扩展头。
  if (
    !header ||
    header.alg !== "HS256" ||
    header.typ !== "JWT" ||
    Object.keys(header).some(
      key => !["alg", "typ"].includes(key)
    )
  ) {
    throw new Error("不支持的 JWT header");
  }

  const signature = fromB64u(encodedSignature);

  const validSignature =
    signature.length === 32 &&
    await wc.subtle.verify(
      "HMAC",
      key,
      signature,
      utf8(`${encodedHeader}.${encodedPayload}`)
    );

  if (!validSignature) {
    throw new Error("JWT 签名无效");
  }

  // 验签成功后，再读取和检查业务声明。
  const claims = JSON.parse(
    dec.decode(fromB64u(encodedPayload))
  );

  if (
    !claims ||
    typeof claims !== "object" ||
    Array.isArray(claims)
  ) {
    throw new Error("无效的 JWT payload");
  }

  // 本应用要求必须携带 exp。
  if (!Number.isFinite(claims.exp) || now >= claims.exp) {
    throw new Error("JWT 已过期或缺少有效的 exp");
  }

  if (
    claims.nbf !== undefined &&
    (!Number.isFinite(claims.nbf) || now < claims.nbf)
  ) {
    throw new Error("JWT 尚未生效");
  }

  if (claims.iss !== issuer) {
    throw new Error("签发方不匹配");
  }

  const aud = claims.aud;

  const validAudience =
    aud === audience ||
    (
      Array.isArray(aud) &&
      aud.every(value => typeof value === "string") &&
      aud.includes(audience)
    );

  if (!validAudience) {
    throw new Error("接收方不匹配");
  }

  if (typeof claims.sub !== "string" || !claims.sub) {
    throw new Error("缺少有效的用户标识");
  }

  return claims;
}

const verifiedClaims = await verifyJwtHS256(
  jwt,
  jwtKey,
  {
    issuer: "https://auth.example.com",
    audience: "attendance-api"
  }
);

console.log(verifiedClaims.sub);  // user-123
console.log(verifiedClaims.role); // staff
```

#### 验证代码的设计要点

1. 算法固定为 HS256，不能只读取输入中的 `alg` 就无条件使用该算法。
2. 验证原始两段编码组成的字节，不解析后重组 header、payload 再验签。
3. 验签后仍检查声明：合法签名不代表 token 没过期，也不代表它发给当前 API。
4. 本应用将 `exp` 定为必填；规范中的可选字段可以由业务进一步要求。
5. 拒绝未实现的扩展头。完整 JOSE 还有更多边界条件，生产系统应使用成熟实现。

固定可接受算法、验证签发方与接收方，是 JWT 安全最佳实践的关键要求。[8]

#### JWT 的实际限制

**普通签名 JWT 不隐藏内容。** Header 和 payload 可以直接解码。不要放密码、完整身份证号等秘密内容；内容保密应另行设计加密机制，或使用符合要求的 JWE。

**HS256 验签方也能签发。** 验签需要同一把秘密密钥，不能把正式系统的 HS256 密钥放进 Vue 前端、环境变量打包结果或浏览器脚本中。浏览器运行本例仅用于理解算法，真实签发和权威验证应在可信服务端完成。

**前端验签不能替代 API 鉴权。** ES256、RS256 等公钥算法允许前端持公钥验签，但攻击者可以修改自己的前端，服务器必须独立验证请求权限。

**验签通过不代表会话仍可使用。** 用户可能已被禁用、权限已变化，token 也可能需要撤销。应结合短有效期、服务端状态或其他会话策略处理。

本教学实现没有覆盖通用密钥发现、JWKS 缓存、`kid` 密钥选择、密钥轮换、通用 JOSE 扩展及完整的业务权限系统。生产环境应根据协议使用成熟库，并限定可信密钥来源。

<a id="section-9"></a>
## 9. 业务场景选型与安全边界

### 9.1 业务选型表

| 业务需求 | 合适的处理方式 | 主要执行位置 |
|---|---|---|
| Vue + Supabase 账户登录 | 使用 Supabase Auth 管理密码和会话 | 认证服务 |
| 检查 CSV 是否重复导入 | SHA-256 文件摘要，服务端复核去重规则 | 浏览器可预计算 |
| 密码保护的个人备份 | PBKDF2 派生密钥 + AES-GCM | 浏览器 |
| 数据库敏感字段加密 | AES-GCM + 独立密钥管理 | 通常在服务端 |
| 只让接收者解密的数据包 | AES-GCM + RSA-OAEP 混合加密 | 按协议分工 |
| 公开验证的审批结果 | ECDSA 或 RSA 签名，可信公钥验签 | 可信签发端 |
| 重置密码链接 | 高熵随机 token + 摘要存储 + 一次性消费 | 服务端 |
| 短信或邮件验证码 | 安全随机数 + 过期、限流、尝试次数限制 | 服务端 |
| 服务间 Webhook | HMAC + 时间戳和防重放机制 | 服务端 |
| JWT 登录凭证 | 成熟 JOSE 实现 + 完整声明和权限检查 | 可信认证端与 API |

### 9.2 密钥管理

密钥管理决定算法能否真正保护数据。把 AES 密钥和密文一起保存到同一个可读位置，或者把 JWT 签名密钥打包进前端，都会破坏预期安全边界。

浏览器不会替应用完成密钥备份、跨设备同步、轮换或恢复设计。应明确回答：密钥由谁产生、保存在哪里、谁能使用、怎样恢复，以及什么时候失效。

| 数据 | 是否可以公开保存 | 要点 |
|---|---|---|
| PBKDF2 盐和迭代次数 | 可以 | 每条记录独立随机盐，记录算法版本 |
| AES-GCM IV | 可以 | 同一密钥下不能重复 |
| AAD | 可以 | 被认证但不被加密，来源必须符合业务设计 |
| 公钥 | 可以 | 必须确认对应可信身份 |
| AES / HMAC 秘密密钥 | 不可以 | 只交给被授权执行操作的一方 |
| 私钥 | 不可以 | 签名私钥与解密私钥按用途管理 |
| 随机 token 原始值 | 应保密 | 拿到值的人可能获得对应能力 |
| 密码派生记录 | 需要访问控制 | 泄露后可遭离线猜测，盐不是访问控制替代品 |

### 9.3 常见误区速查

| 误区 | 正确理解 |
|---|---|
| Base64 后就看不懂了，因此是加密 | Base64 是可逆编码，没有秘密密钥 |
| SHA-256 不可逆，所以适合保存任何密码 | 低熵密码可以被高速猜测，需要慢速口令哈希 |
| 加了盐，就不需要计算成本 | 盐防止结果复用，计算成本提高每次猜测代价 |
| 前端哈希可替代 HTTPS | 可重放的哈希本身也可能成为凭证 |
| AES 的 IV 可以固定 | AES-GCM 同一密钥下禁止 IV 重复 |
| RSA 可以直接加密任意文件 | RSA-OAEP 有严格长度限制，通常用混合加密 |
| 数字签名就是私钥加密 | 签名是验证真实性和完整性的独立机制 |
| 加密给公钥就证明了发送者身份 | 任何持有公钥的人都能加密，发送者认证需另行处理 |
| 不可导出密钥就能抵御 XSS | 恶意脚本仍可能调用密钥完成操作 |
| 验证码使用安全随机数就足够 | 仍需服务端验证、限流、过期与一次性消费 |
| JWT 验签通过就一定可以授权 | 还需检查声明、会话状态与业务权限 |
| 在前端隐藏签名密钥即可 | 打包给客户端的秘密不能作为服务端信任根 |

<a id="section-10"></a>
## 10. 代码运行顺序与验证说明

### 10.1 示例依赖

可以将全部 `js` 代码块按文档顺序放入一个模块运行，也可以只复制所需案例及依赖。不要重复声明同名顶层变量。

| 案例 | 需要先加载的内容 |
|---|---|
| A：SHA-256 | 第 3 章公共工具 |
| B：PBKDF2 | 第 3 章公共工具 |
| C：AES-GCM | 第 3 章公共工具 |
| D：密码备份 | 公共工具；案例 C 的 `encryptText()`、`decryptText()` |
| E：RSA-OAEP | 第 3 章公共工具 |
| F：混合加密 | 公共工具；案例 C 的文本加密函数；案例 E 的 `rsaKeys` |
| G：ECDSA / RSA-PSS | 公共工具；该案例中定义的审批原文 |
| H：token 摘要存储 | 公共工具；案例 A 的 `sha256Hex()` |
| I：验证码 | 第 3 章的 `wc` |
| J：UUID | 第 3 章的 `wc` |
| K：HMAC | 第 3 章公共工具 |
| L：JWT | 第 3 章公共工具；同一案例中的签发与验证函数 |

### 10.2 验证记录与范围

原对话已在 Node.js 24.22.1 的 Web Crypto 实现中验证以下核心操作：

- PBKDF2：正确密码结果一致，错误密码结果不同。
- AES-GCM：正常往返解密成功，密文篡改及 AAD 不匹配被拒绝。
- RSA-OAEP：短消息加密解密成功，AES 密钥封装及恢复成功。
- ECDSA：原始消息验签通过，修改消息验签失败，JWK 公钥导出导入成功。
- 安全随机值：token 编码长度和随机整数范围检查通过。
- JWT：有效 token 验证成功；篡改、过期、错误接收方及 `alg: none` 被拒绝。

这些是算法和示例路径验证，不等同于生产系统安全审计。浏览器文件选择、页面集成、目标浏览器支持、密钥生命周期及业务后端仍需按项目验证。

演示中的密码均为公开示例，控制台输出仅用于学习。生产环境避免记录密码、原始 token、私钥和其他敏感内容。

<a id="section-11"></a>
## 11. 参考资料

以下为原对话查阅的规范与文档。算法参数建议和环境支持可能随时间变化，正式落地时应再次核对。

1. [W3C — Web Cryptography API / Web Cryptography Level 2](https://www.w3.org/TR/webcrypto/)：接口、算法与密钥对象规范。原对话访问页面为 Level 2 工作草案，不意味着其中每项新能力都已在全部浏览器实现。
2. [Node.js — Web Crypto API](https://nodejs.org/api/webcrypto.html)：Node.js Web Crypto 接口及算法支持。
3. [OWASP — Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)：密码哈希、盐、算法选型与 PBKDF2 工作因子建议。
4. [MDN — Crypto.getRandomValues()](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues)：安全随机值与单次填充大小限制。
5. [MDN — SubtleCrypto.encrypt()](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt)：RSA-OAEP、AES 加密参数与使用说明。
6. [MDN — SubtleCrypto.sign()](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/sign)：签名算法、HMAC 与 ECDSA 签名格式。
7. [RFC 7518 — JSON Web Algorithms](https://www.rfc-editor.org/rfc/rfc7518)：HS256、ES256、RS256、PS256 等 JOSE 算法定义；使用时同时留意后续更新。
8. [RFC 8725 — JSON Web Token Best Current Practices](https://www.rfc-editor.org/rfc/rfc8725)：算法白名单、签发方、接收方与 JWT 验证安全要求。

