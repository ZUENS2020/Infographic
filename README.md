# Infographic

> 声明式信息图表可视化引擎 - 将文字转化为生动的高质量信息图表

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Vite](https://img.shields.io/badge/Vite-Latest-646CFF)
![React](https://img.shields.io/badge/React-18.x-61DAFB)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 概述

**Infographic** 是一个功能强大的信息图表生成和渲染框架。通过精心设计的声明式语法，可以快速、灵活地渲染高质量的信息图表，使信息呈现更加高效，数据故事更加简单。

> 本项目为 AntV Infographic 的本地部署版本，针对私有化场景进行了优化配置。

## 核心特性

- **AI 友好**
  - 配置和语法针对 AI 生成优化
  - 支持简洁的提示词输入
  - 支持 AI 流式输出和实时渲染

- **开箱即用**
  - 200+ 内置信息图表模板
  - 丰富的数据项组件库
  - 多种布局方案，几分钟内构建专业图表

- **主题系统**
  - 手绘风格 (rough.js)
  - 渐变效果
  - 图案填充
  - 深度自定义主题

- **内置编辑器**
  - 可视化编辑界面
  - AI 生成结果可进一步编辑
  - 实时预览

- **高质量 SVG 输出**
  - 默认 SVG 渲染
  - 确保视觉保真度
  - 易于后期编辑

## 技术架构

```
核心语言: TypeScript
构建工具: Vite + Rollup
渲染引擎: 自定义 JSX 运行时 + SVG
可视化库: d3, @antv/hierarchy, roughjs
颜色处理: culori
工具库: lodash-es
后端服务: Express (可选)
AI 集成: OpenAI SDK
```

## 项目结构

```
Infographic/
├── src/
│   ├── jsx/               # JSX 运行时和 SVG 渲染系统
│   ├── designs/           # 设计系统
│   │   ├── components/    # UI 组件库
│   │   ├── items/        # 可视化项
│   │   ├── layouts/      # 布局系统
│   │   └── structures/    # 结构定义
│   ├── templates/         # 200+ 内置模板
│   ├── editor/           # 内置编辑器
│   ├── syntax/           # 语法解析器
│   ├── runtime/          # 核心运行时
│   ├── renderer/         # 渲染器
│   └── themes/          # 主题系统
├── server/               # Express 后端服务
├── web-app/              # React Web 应用
├── lib/                  # CommonJS 输出
├── esm/                  # ES Module 输出
└── dist/                 # UMD 打包输出
```

## 快速开始

### 安装

```bash
# NPM
npm install @antv/infographic

# Yarn
yarn add @antv/infographic

# PNPM
pnpm add @antv/infographic
```

### 基础使用

```typescript
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

### 本地开发

1. **克隆仓库**
```bash
git clone https://github.com/antvis/infographic.git
cd infographic
```

2. **安装依赖**
```bash
npm install
```

3. **启动开发服务器**
```bash
# 核心库开发
npm run dev

# Web 应用开发
cd web-app && npm run dev
```

4. **构建**
```bash
# 构建 ESM / CJS / UMD
npm run build

# 构建 Web 应用
cd web-app && npm run build
```

### 启动后端服务

```bash
cd server

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，添加 OPENAI_API_KEY

# 启动服务 (端口 3001)
npm start
```

## 语法说明

Infographic 使用 YAML 风格的声明式语法：

```yaml
infographic <template-name>
data
  title: 标题
  desc: 描述
  items:
    - label: 标签
      value: 值
      desc: 描述
      icon: 图标
      children: 子项
theme
  palette: 颜色调色板
  stylize: 样式效果
```

### 语法示例

**列表布局**
```yaml
infographic list-row-simple-horizontal-arrow
data
  items:
    - label: 规划
      desc: 制定方案
    - label: 开发
      desc: 编码实现
    - label: 测试
      desc: 质量保证
    - label: 部署
      desc: 上线发布
theme
  palette: catppuccin
```

**层级结构**
```yaml
infographic hierarchy-mindmap
data
  items:
    - label: 中心主题
      children:
        - label: 分支1
          children:
            - label: 子项1
            - label: 子项2
        - label: 分支2
theme
  palette: pastel
  stylize: hand-drawn
```

## 渲染流程

```
语法解析 → 模板匹配 → 数据绑定 → 主题应用 → 布局计算 → SVG 渲染
```

### 流式渲染

支持 AI 流式输出实时渲染：

```typescript
let buffer = '';
for await (const chunk of aiStream) {
  buffer += chunk;
  infographic.render(buffer);
}
```

## API 端点

后端服务提供以下 API：

| 端点 | 方法 | 功能 |
|------|------|------|
| `/api/config` | GET | 获取配置 |
| `/api/config` | POST | 更新配置 |
| `/api/history` | GET | 获取历史记录 |
| `/api/history` | POST | 保存历史记录 |
| `/api/history/:id` | DELETE | 删除历史记录 |

## 模板系统

Infographic 内置 200+ 模板，按类别分为：

- **列表布局**: list-row-simple, list-card, list-timeline 等
- **层级结构**: hierarchy-mindmap, hierarchy-tree, hierarchy-org 等
- **对比展示**: comparison-table, comparison-versus 等
- **流程图**: flow-horizontal, flow-vertical 等
- **图表**: chart-bar, chart-pie, chart-line 等
- **卡片**: card-badge, card-stats, card-profile 等

## 主题系统

### 预设主题

```typescript
import { getTheme } from '@antv/infographic';

// 获取主题
const theme = getTheme('catppuccin');
const handDrawn = getTheme('hand-drawn');
const pastel = getTheme('pastel');
```

### 自定义主题

```typescript
const customTheme = {
  palette: {
    primary: '#00f2ff',
    secondary: '#ff00aa',
    background: '#1a1a2e',
    text: '#e8e8e8'
  },
  stylize: {
    handDrawn: true,
    roughness: 1,
    strokeWidth: 2
  }
};

infographic.render(code, { theme: customTheme });
```

## 常见问题

### 如何在 React 中使用？

```tsx
import { useRef, useEffect } from 'react';
import { Infographic } from '@antv/infographic';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const infographic = new Infographic({
      container: containerRef.current!,
      width: '100%',
      height: '100%',
    });

    infographic.render(`
      infographic list-row-simple
      data
        items:
          - label: Item 1
          - label: Item 2
    `);

    return () => infographic.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '500px' }} />;
}
```

### 如何导出 SVG？

```typescript
import { renderSVG } from '@antv/infographic';

const svgString = renderSVG(`
  infographic list-row-simple
  data
    items:
      - label: Item 1
`);

// 下载 SVG
const blob = new Blob([svgString], { type: 'image/svg+xml' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'infographic.svg';
a.click();
```

## 配置选项

```typescript
interface InfographicOptions {
  container: string | HTMLElement;
  width?: string | number;
  height?: string | number;
  editable?: boolean;
  theme?: string | Theme;
  locale?: string;
  padding?: number | [number, number, number, number];
}
```

## 开发指南

### 添加自定义模板

```typescript
import { registerTemplate } from '@antv/infographic';

registerTemplate('my-template', {
  type: 'custom',
  render: (data, theme) => {
    // 返回 JSX 元素
    return <div>{/* ... */}</div>;
  }
});
```

### 添加自定义组件

```typescript
import { registerComponent } from '@antv/infographic';

registerComponent('my-component', {
  render: (props, context) => {
    return <g>{/* SVG 内容 */}</g>;
  }
});
```

## 许可证

MIT License

## 相关资源

- [官方文档](https://infographic.antv.vision)
- [示例画廊](https://infographic.antv.vision/examples)
- [GitHub 仓库](https://github.com/antvis/infographic)
- [AntV 官网](https://antv.antgroup.com)

---

**AntV Infographic** - 让数据故事更简单
