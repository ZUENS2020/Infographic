<img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18"> 简体中文 | [English](/README.md)

<div align="center">

# Infographic, bring words to life!

🦋 新一代信息图可视化引擎，让文字信息栩栩如生！



[![build status](https://img.shields.io/github/actions/workflow/status/ZUENS2020/Infographic/build.yml)](https://github.com/ZUENS2020/Infographic/actions)
![Visitors](https://hitscounter.dev/api/hit?url=https://github.com/ZUENS2020/Infographic&label=Visitors&icon=graph-up&color=%23dc3545&message=&style=flat&tz=UTC)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*EdkXSojOxqsAAAAAQHAAAAgAemJ7AQ/original" width="256">

</div>

**AntV Infographic** 是 AntV 推出的新一代**声明式信息图可视化引擎**，通过精心设计的信息图语法，能够快速、灵活地渲染出高质量的信息图，让信息表达更高效，让数据叙事更简单。

<div align="center">

<p align="center">
  <a href="https://github.com/ZUENS2020/Infographic">
    <img src="https://img.shields.io/badge/GitHub-000000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
</p>

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*ZdeISZWHuyIAAAAAbEAAAAgAemJ7AQ/fmt.webp" width="768" alt="AntV Infographic 预览">

</div>

## ✨ 特性

- 🤖 **AI 友好**：配置和语法更适合 AI 生成，提供简洁有效的 Prompt，支持 AI 流式输出和渲染
- 📦 **开箱即用**：内置 ~200 信息图模板、数据项组件与布局，快速构建专业信息图
- 🎨 **主题系统**：支持手绘、渐变、图案、多套预设主题，允许深度自定义
- 🧑🏻‍💻 **内置编辑器**：内置信息图的编辑器，让 AI 生成之后可以二次编辑
- 📐 **高质量 SVG 输出**：默认基于 SVG 渲染，保证视觉品质与可编辑性

## 🚀 安装

```bash
npm install @antv/infographic
```

## 📝 快速开始

详细文档和示例请访问 [AntV Infographic 官网](https://infographic.antv.vision)：

- [入门指南](https://infographic.antv.vision/learn/getting-started)
- [信息图语法](https://infographic.antv.vision/learn/infographic-syntax)
- [配置项](https://infographic.antv.vision/reference/infographic-options)

```ts
import { Infographic } from '@antv/infographic';

const infographic = new Infographic({
  container: '#container',
  width: '100%',
  height: '100%',
  editable: true,
});

infographic.render(`
infographic list-row-simple-horizontal-arrow
data
  items:
    - label: Step 1
      desc: Start
    - label: Step 2
      desc: In Progress
    - label: Step 3
      desc: Complete
`);
```

渲染结果如下：

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*uvj8Qb26F1MAAAAARAAAAAgAemJ7AQ/fmt.webp" width="480" alt="AntV Infographic DEMO">

## 流式渲染

更多详情请参考[官方文档](https://infographic.antv.vision/learn/infographic-syntax)。

使用具有高容错性的信息图语法能够实时接收 AI 流式输出并逐步渲染信息图。

```ts
let buffer = '';
for (const chunk of chunks) {
  buffer += chunk;
  infographic.render(buffer);
}
```

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*e_PFSZrR9AQAAAAASdAAAAgAemJ7AQ/original" width="480" alt="AntV Infographic 流式渲染">

## 💬 社区与交流

- 在 [GitHub Issues](https://github.com/ZUENS2020/Infographic/issues) 提交你的问题或建议
- 参与 [GitHub Discussions](https://github.com/ZUENS2020/Infographic/discussions) 与社区交流
- 欢迎参与贡献，一起完善本项目！

如有任何建议，欢迎在 GitHub 上与我们交流！欢迎 Star ⭐ 支持我们。

- [AntV 原始项目](https://github.com/antvis/infographic)
- [AntV 官网](https://antv.antgroup.com/)
- [GitHub 仓库](https://github.com/ZUENS2020/Infographic)
- [问题反馈](https://github.com/ZUENS2020/Infographic/issues)

## 📄 许可证

本项目基于 **MIT** 许可开源，详见 [LICENSE](./LICENSE)。
