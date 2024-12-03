# 充电站管理系统

一个基于 Vue 3 的充电站管理系统前端项目，用于管理电动汽车充电站和充电桩。

## 功能特点

- 充电站管理
  - 查看充电站列表
  - 新增/编辑充电站信息
  - 查看充电站运营状态
  - 统计充电桩使用情况

- 充电桩管理
  - 按充电站查看充电桩列表
  - 新增/编辑/删除充电桩
  - 设置充电功率和价格
  - 监控充电桩状态

## 技术栈

- Vue 3
- Vue Router
- Pinia 状态管理
- Element Plus UI 组件库
- Vite 构建工具

## 开发环境设置

1. 克隆项目
```bash
git clone [your-repository-url]
cd EleStubWeb
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 构建生产版本
```bash
npm run build
```

## 项目结构

```
EleStubWeb/
├── src/
│   ├── assets/      # 静态资源
│   ├── components/  # 公共组件
│   ├── router/      # 路由配置
│   ├── stores/      # Pinia 状态管理
│   ├── views/       # 页面组件
│   ├── App.vue      # 根组件
│   └── main.js      # 入口文件
├── public/          # 公共资源
└── package.json     # 项目配置
```

## 许可证

[MIT License](LICENSE)
