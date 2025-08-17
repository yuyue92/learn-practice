document.addEventListener('DOMContentLoaded', function() {
    // 创建水印
    function createWatermark() {
        const canvas = document.getElementById('watermark');
        const ctx = canvas.getContext('2d');
        
        // 设置canvas尺寸为窗口大小
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // 水印文本
        const text = '机密文件 严禁外传';
        const fontSize = 20;
        const fontFamily = 'Microsoft YaHei';
        const color = 'rgba(200, 200, 200, 0.2)';
        const angle = -20; // 旋转角度
        
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        
        // 计算水印间距
        const textWidth = ctx.measureText(text).width;
        const spacingX = textWidth * 2;
        const spacingY = fontSize * 4;
        
        // 绘制水印
        ctx.save();
        for (let x = 0; x < canvas.width; x += spacingX) {
            for (let y = 0; y < canvas.height; y += spacingY) {
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(angle * Math.PI / 180);
                ctx.fillText(text, 0, 0);
                ctx.restore();
            }
        }
        ctx.restore();
        
        // 防止控制台删除水印
        protectWatermark();
    }
    
    // 保护水印不被删除
    function protectWatermark() {
        const watermark = document.getElementById('watermark');
        
        // 监听DOM变化
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (!document.body.contains(watermark)) {
                    document.body.appendChild(watermark);
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // 防止控制台修改样式
        Object.defineProperty(watermark.style, 'display', {
            get() {
                return 'block';
            },
            set() {
                return 'block';
            }
        });
        
        // 窗口大小变化时重绘水印
        window.addEventListener('resize', function() {
            createWatermark();
        });
    }
    
    // 初始化水印
    createWatermark();
});