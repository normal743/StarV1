# STAR AI 助手项目设置和运行指南

## 1. 后端设置

1. 确保你已经安装了 Python 3.7 或更高版本。

2. 进入后端目录：
   ```
   cd star-ai-assistant/backend
   ```

3. 创建并激活虚拟环境（可选但推荐）：
   ```
   python -m venv venv
   source venv/bin/activate  # 在 Windows 上使用 venv\Scripts\activate
   ```

4. 安装所需的 Python 包：
   ```
   pip install flask flask-cors openai tiktoken
   ```

5. 设置 OpenAI API 密钥：
   ```
   export OPENAI_API_KEY=你的OpenAI_API密钥
   ```
   在 Windows 上，使用 `set` 而不是 `export`。

## 2. 前端设置

1. 确保你已经安装了 Node.js 和 npm。

2. 进入前端目录：
   ```
   cd star-ai-assistant/frontend
   ```

3. 安装所需的 npm 包：
   ```
   npm install
   ```

## 3. 运行项目

1. 启动后端服务器：
   在 backend 目录中运行：
   ```
   python app.py
   ```
   这将在 http://localhost:5000 启动 Flask 服务器。

2. 在新的终端窗口中启动前端开发服务器：
   在 frontend 目录中运行：
   ```
   npm start
   ```
   这将在 http://localhost:3000 启动 React 开发服务器。

3. 在浏览器中打开 http://localhost:3000 来访问 STAR AI 助手界面。

## 注意事项

- 确保后端和前端都在运行时，应用才能正常工作。
- 如果你修改了后端代码，你需要重新启动 Flask 服务器。
- 前端代码的修改通常会自动重新加载，无需重启服务器。
- 请确保你的 OpenAI API 密钥有足够的配额来处理请求。