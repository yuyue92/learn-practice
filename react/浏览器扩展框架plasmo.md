## 1) Plasmo 简介：为现代前端准备的浏览器扩展框架

Plasmo（Plasmo Framework）可以理解成“浏览器扩展开发的 Next.js / Vite 级体验”：它帮你把扩展里最烦的部分（manifest、入口组织、打包、多浏览器构建、热更新）都抽象掉，你用熟悉的 React/TS 写代码即可。 

你会最常用到的能力：
- 声明式入口：你写 popup.tsx / options.tsx / contents/*.tsx / background.ts 这种文件，Plasmo 自动识别并生成对应的扩展入口与 manifest 配置。
- 开发体验强：本地开发、HMR/自动刷新扩展，改完代码不需要手动重新加载扩展（体验上非常接近 Web App 开发）。
- Manifest 覆盖机制：你可以只写你关心的部分，Plasmo 会合并生成最终 manifest（尤其适合 MV3）。
- 多页面/多入口天然支持：popup/options/newtab/content-script UI/background 等，都能用同一套工程化方式组织。

**一、Plasmo框架简介**

Plasmo是一个基于React的浏览器插件开发框架，它提供了一套完整的工具链，让开发者可以轻松地构建现代浏览器插件。Plasmo支持Chrome、Firefox、Edge等主流浏览器，并且内置了TypeScript、React、CSS模块等支持，同时提供了热重载、自动构建和打包等功能。

Plasmo的主要特点：
- 基于React，可以使用现代前端开发技术。
- 支持多个浏览器，可以一次开发，多浏览器发布。
- 内置了常用的开发工具，如热重载、自动构建等。
- 提供了丰富的API和组件，方便插件开发。
