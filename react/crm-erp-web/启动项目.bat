@echo off
chcp 65001 >nul
echo ==========================================
echo   企业级 CRM/ERP Web 应用 - 启动脚本
echo ==========================================
echo.

:: 检查 Node.js 是否安装
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js 18+
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

:: 显示 Node.js 版本
echo [信息] Node.js 版本:
node -v
echo.

:: 检查是否已安装依赖
if not exist "node_modules" (
    echo [提示] 首次运行，正在安装项目依赖...
    echo [提示] 这可能需要 3-5 分钟，请耐心等待...
    echo.
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo [错误] 依赖安装失败，请检查网络连接
        pause
        exit /b 1
    )
    echo.
    echo [成功] 依赖安装完成!
    echo.
)

:: 启动开发服务器
echo [启动] 正在启动开发服务器...
echo [提示] 服务器启动后会自动打开浏览器
echo [提示] 测试账号: admin / admin123
echo.
echo ==========================================
echo.

call npm run dev
