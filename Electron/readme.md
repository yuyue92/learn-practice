**electron 知识点**

## 主进程(Main Process)和渲染进程(Renderer Process)的区别

- 主进程是应用的核心，负责创建窗口、管理生命周期及原生API调用，运行在Node.js环境。
- 渲染进程 则是每个窗口的独立网页进程，负责界面渲染（基于Chromium），默认禁用了Node.js集成以确保安全。
- 两者通过IPC（进程间通信）交互，主进程可控制多个渲染进程，而渲染进程通过主进程访问系统功能，主进程有更高权限，渲染进程则侧重界面展示。

## Electron 使用 IPC（Inter-Process Communication） 在主进程（Main Process）和渲染进程（Renderer Process）之间通信。
- IPCMain：用于在主进程中监听渲染进程发送的消息。通过 ipcMain.on(channel, callback) 接收消息，并可返回数据或触发事件。
- ipcRenderer（渲染进程）：用于渲染进程向主进程发送消息或监听主进程回复。通过 ipcRenderer.send(channel, data) 发送消息，ipcRenderer.on(channel, callback) 监听回复。
- 主进程（ipcMain）负责监听和处理请求。渲染进程（ipcRenderer）负责发送消息并接收响应。
- 通信方式：单向（send/on）或双向（invoke/handle）。

Context Bridge 是 Electron 的安全机制，用于在主进程和渲染进程之间安全地暴露 API，防止直接使用 nodeIntegration 带来的安全风险。
- 主进程（preload.js）使用 contextBridge.exposeInMainWorld 暴露 API：
- 渲染进程直接调用 window.api 方法，避免直接访问 Node.js API，提升安全性。适用于隔离模式（sandbox），防止恶意代码攻击。

## Electron 生命周期， 由 主进程 控制，核心事件包括
- ready：应用初始化完成，可创建窗口。
- window-all-closed：所有窗口关闭（可决定是否退出）。
- before-quit / will-quit / quit：应用退出前的钩子，用于清理资源。
- activate（macOS）：点击 Dock 图标重新激活应用。
- 渲染进程 的生命周期与浏览器类似（如 DOMContentLoaded、beforeunload），但关闭由主进程管理。通过合理监听这些事件，可实现应用的优雅启动和退出。

## ELectron性能优化
- 减少主进程负担：使用 多窗口/多进程 分散计算任务，避免阻塞主进程。将 CPU 密集型任务 移至 Worker 线程（如 worker_threads）或子进程。
- 优化渲染进程：启用硬件加速（app.disableHardwareAcceleration() 仅在必要时禁用）。懒加载 页面组件，减少初始化压力。避免频繁 DOM 操作，使用虚拟滚动（如 react-window）优化长列表渲染。
- 内存管理：及时释放资源，监听 window.on('closed') 卸载事件。禁用不必要的 Chromium 功能（如 webSecurity: false 仅限开发环境）。
- 通信优化：批量 IPC 调用，减少主进程与渲染进程频繁通信。使用 contextBridge 安全暴露 API，替代高开销的 remote 模块。
- 打包优化：使用 electron-builder 分平台打包，移除无用依赖。压缩资源（如 asar 归档），减少应用体积。
- 通过合理架构和优化策略，可显著提升 Electron 应用的响应速度和资源利用率。

## Electron 通过多进程架构将 Chromium 和 Node.js 集成：
- 主进程运行 Node.js，负责窗口管理、系统交互等后端逻辑。
- 渲染进程基于 Chromium，每个窗口独立运行前端页面（支持 Web 技术）。
- 桥接机制：通过 preload 脚本和 contextBridge 安全地暴露 Node.js API 给渲染进程，同时利用 IPC（进程间通信）实现双向交互。
- 这种设计让开发者既能使用浏览器能力，又能调用系统级 Node.js 模块，实现跨平台桌面应用。

Electron 单实例运行实现方法：
- 使用 app.requestSingleInstanceLock()，主进程启动时检测锁，若失败则退出；
- 监听 second-instance 事件，聚焦已存在的窗口；
- 确保应用唯一性，避免资源冲突。

如何实现Electron应用的自动更新？
- 使用 electron-updater（推荐）
- 监听更新事件：update-available（有新版本）
- 适用于生产环境，支持静默更新和用户交互。

electron 怎样在两个窗口间共享数据？
- 通过主进程中转：通过 ipcMain/ipcRenderer 通信，主进程作为中介存储和转发数据（适合低频通信）。
- 全局变量：主进程使用 global.sharedObject 定义共享数据，通过 preload 脚本暴露给渲染进程（需注意安全）。
- 本地存储：共用 localStorage（同源窗口）或 electron-store（跨进程持久化）。
- 内存数据库：嵌入 SQLite 或 Redis 实现高效多窗口读写（适合复杂数据）。
- 总结：根据场景选择，简单数据用 IPC，持久化数据用本地存储，高频读写用内存数据库。

Electron应用出现内存泄漏如何排查？
- 工具检测：
   - 使用 Chrome DevTools 的 Memory 面板记录堆快照，对比分析未释放对象。
   - Electron 内置 process.getProcessMemoryInfo() 监控内存变化。
 
- 常见泄漏点：
   - 未解绑事件监听（如 ipcRenderer.on、window.addEventListener）。
   - 全局变量堆积（如缓存未清理）。
   - 闭包引用（尤其是 DOM 节点或 Electron 对象）。
 
- 修复策略：
   - 及时销毁：窗口关闭时移除监听器（beforeunload 事件）。
   - 弱引用：使用 WeakMap/WeakSet 避免强引用。

如何优化Electron应用的启动速度？
- 代码分割与懒加载：使用动态导入（如 import()）按需加载模块，减少初始化负担。
- 预加载优化：精简 preload.js，仅暴露必要 API，避免阻塞渲染进程。
- 优化窗口加载：先展示空白窗口，待内容就绪再显示（show: false + ready-to-show 事件）。使用 webPreferences 的 backgroundThrottling: false 防止后台降频。
- 效果：显著减少冷启动时间，提升用户体验。

为什么要启用上下文隔离？如何配置？
- 安全性：防止渲染进程直接访问Node.js或Electron API，减少恶意代码攻击风险。
- 沙盒化：确保前端代码运行在独立环境，避免意外修改全局对象（如window）。
- 如何配置：主进程设置：在BrowserWindow配置中启用；预加载脚本：使用contextBridge暴露有限API。
- 结果：前端仅能通过window.api调用授权方法，兼顾功能与安全。

electron MessagePort简介：
- MessagePort 是 HTML5 标准 API，用于跨上下文通信（如主进程与渲染进程、Worker 线程或 iframe）。在 Electron 中，结合 postMessage 和 MessageChannel 可实现高效、低耦合的双向数据传输，替代部分 IPC 场景。
- 特点：
   - 直接通信：无需主进程中转，减少开销。
   - 安全可控：需通过 postMessage 传递端口，避免全局暴露。
   - 适用场景：高频消息交互（如实时数据流）、多窗口协同。

