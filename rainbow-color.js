/**
 * 彩虹主题管理模块
 * 为思维导图提供绚丽多彩的彩虹主题效果
 */

// 彩虹主题管理
document.addEventListener('DOMContentLoaded', () => {
    // 初始化彩虹主题
    initRainbowTheme();
    
    // 监听主题变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                updateRainbowThemeState();
            }
        });
    });
    
    // 开始监听body的class变化
    observer.observe(document.body, { attributes: true });
});

// 初始化彩虹主题
function initRainbowTheme() {
    // 检查当前主题设置
    const currentTheme = localStorage.getItem('mindMapTheme') || 'rainbow';
    
    // 如果设置为彩虹主题或者没有设置，则应用彩虹主题
    if (currentTheme === 'rainbow') {
        console.log('初始化彩虹主题');
        
        // 移除所有蓝色主题相关类
        document.body.classList.remove('blue-theme', 'deep-sea', 'neon');
        
        // 添加彩虹主题类
        document.body.classList.add('rainbow-theme');
        
        // 禁用蓝色主题
        localStorage.setItem('blueThemePrefs', JSON.stringify({
            enabled: false,
            variant: 'classic',
            crystalNodesEnabled: false
        }));
        
        // 保存主题设置
        localStorage.setItem('mindMapTheme', 'rainbow');
    }
}

// 更新彩虹主题状态
function updateRainbowThemeState() {
    // 检查当前body类
    if (document.body.classList.contains('rainbow-theme')) {
        // 如果应用了彩虹主题，更新localStorage
        localStorage.setItem('mindMapTheme', 'rainbow');
        
        // 禁用蓝色主题
        localStorage.setItem('blueThemePrefs', JSON.stringify({
            enabled: false,
            variant: 'classic',
            crystalNodesEnabled: false
        }));
    }
}
