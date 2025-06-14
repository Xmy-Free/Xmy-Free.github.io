/**
 * 科幻主题管理模块
 * 提供科幻主题的特殊效果和功能
 */

const sciFiThemeConfig = {
    // 主题配置
    config: {
        name: '未来科幻',
        description: '高科技感的未来科幻主题',
        class: 'blue-theme sci-fi'
    },
    
    // 粒子效果配置
    particles: {
        minCount: 30,
        maxCount: 80,
        minSize: 1,
        maxSize: 5,
        updateInterval: 20000, // 粒子更新间隔（毫秒）
        containerSelector: '.mind-map-container'
    },
    
    // 动画配置
    animations: {
        nodeHover: 'all 0.4s cubic-bezier(0.17, 0.67, 0.83, 0.67)',
        particleFloat: '15s linear infinite'
    }
};

/**
 * 初始化科幻主题
 */
function initSciFiTheme() {
    console.log('初始化科幻主题...');
    addSciFiParticles();
    addNodeIdentifiers();
}

/**
 * 添加科幻主题粒子效果
 */
function addSciFiParticles() {
    // 移除现有粒子
    document.querySelectorAll('.sci-fi-particle').forEach(particle => particle.remove());
    
    const container = document.querySelector(sciFiThemeConfig.particles.containerSelector);
    if (!container) return;
    
    // 根据视窗大小计算粒子数量
    const particleCount = Math.min(
        Math.max(sciFiThemeConfig.particles.minCount, 
                window.innerWidth / 15),
        sciFiThemeConfig.particles.maxCount
    );
    
    // 创建粒子
    for (let i = 0; i < particleCount; i++) {
        const particle = createParticle();
        container.appendChild(particle);
    }
    
    // 定期刷新粒子效果
    setTimeout(addSciFiParticles, sciFiThemeConfig.particles.updateInterval);
}

/**
 * 创建单个粒子元素
 * @returns {HTMLElement} 粒子DOM元素
 */
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'sci-fi-particle';
    
    // 随机大小
    const isLargeParticle = Math.random() < 0.2; // 20%概率生成大粒子
    const size = isLargeParticle ? 
        Math.random() * (sciFiThemeConfig.particles.maxSize - 3) + 3 : 
        Math.random() * (sciFiThemeConfig.particles.minSize) + 1;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // 随机位置
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    
    // 随机动画延迟和持续时间
    particle.style.animationDelay = `${Math.random() * 10}s`;
    particle.style.animationDuration = `${Math.random() * 15 + 5}s`;
    
    // 随机透明度
    particle.style.opacity = (Math.random() * 0.5 + 0.3).toString();
    
    return particle;
}

/**
 * 为节点添加科幻风格的ID标识
 */
function addNodeIdentifiers() {
    document.querySelectorAll('.mind-map .node').forEach(node => {
        if (!node.hasAttribute('data-id')) {
            const randomId = Math.floor(Math.random() * 9000) + 1000;
            node.setAttribute('data-id', `SCI-${randomId}`);
        }
    });
}

/**
 * 应用科幻主题效果
 */
function applySciFiThemeEffects() {
    console.log('应用科幻主题特效...');
    
    // 添加节点标识
    addNodeIdentifiers();
    
    // 添加粒子效果
    addSciFiParticles();
    
    // 添加扫描线动画
    addScanlineEffect();
}

/**
 * 添加扫描线动画效果
 */
function addScanlineEffect() {
    document.querySelectorAll('.mind-map .node').forEach(node => {
        // 添加扫描线元素
        const scanline = document.createElement('div');
        scanline.className = 'sci-fi-scanline';
        node.appendChild(scanline);
    });
}

/**
 * 移除科幻主题效果
 */
function removeSciFiThemeEffects() {
    // 移除粒子
    document.querySelectorAll('.sci-fi-particle').forEach(particle => particle.remove());
    
    // 移除扫描线
    document.querySelectorAll('.sci-fi-scanline').forEach(scanline => scanline.remove());
}

/**
 * 更新科幻主题效果
 * 在窗口大小改变时调用
 */
function updateSciFiThemeEffects() {
    if (document.body.classList.contains('sci-fi')) {
        addSciFiParticles();
    }
}

/**
 * 加载科幻主题偏好
 */
function loadSciFiThemePreference() {
    try {
        const savedPrefs = localStorage.getItem('sciFiThemePrefs');
        if (savedPrefs) {
            const prefs = JSON.parse(savedPrefs);
            sciFiThemeConfig.currentState.enabled = prefs.enabled || false;
            
            if (sciFiThemeConfig.currentState.enabled) {
                // 应用保存的主题
                const body = document.querySelector('body');
                
                // 先移除所有主题相关类
                body.className = body.className
                    .replace(/blue-theme\S*/g, '')
                    .replace(/rainbow-theme\S*/g, '')
                    .replace(/deepsea-theme\S*/g, '')
                    .replace(/sci-fi-theme\S*/g, '')
                    .replace(/sci-fi-theme-only/g, '')
                    .trim();
                
                // 应用科幻主题类
                body.className += ' ' + sciFiThemeConfig.config.class;
                
                // 应用科幻特效
                applySciFiThemeEffects();
            }
        }
    } catch (e) {
        console.error('加载科幻主题偏好失败:', e);
    }
}

// 监听窗口大小变化
window.addEventListener('resize', () => {
    updateSciFiThemeEffects();
});

// 在页面加载完成后初始化科幻主题
document.addEventListener('DOMContentLoaded', () => {
    // 如果当前是科幻主题，初始化特效
    if (document.body.classList.contains('sci-fi')) {
        initSciFiTheme();
    }
}); 