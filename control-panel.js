// 控制面板功能
document.addEventListener('DOMContentLoaded', () => {
    const mindMap = window.mindMap;
    const tooltip = document.getElementById('tooltip');
    const controlPanel = document.querySelector('.control-panel');
    const minimizeBtn = document.getElementById('minimizeBtn');
    
    // 检查是否有保存的最小化状态
    const isMinimized = localStorage.getItem('controlPanelMinimized') === 'true';
    if (isMinimized) {
        controlPanel.classList.add('minimized');
    }
    
    // 最小化/最大化控制面板
    minimizeBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // 防止事件冒泡
        
        controlPanel.classList.toggle('minimized');
        const isNowMinimized = controlPanel.classList.contains('minimized');
        
        // 保存状态到本地存储
        localStorage.setItem('controlPanelMinimized', isNowMinimized);
    });
    
    // 点击最小化状态的控制面板时展开
    controlPanel.addEventListener('click', (e) => {
        if (controlPanel.classList.contains('minimized')) {
            // 移除最小化状态
            controlPanel.classList.remove('minimized');
            
            // 保存状态
            localStorage.setItem('controlPanelMinimized', 'false');
        }
    });
    
    // 显示工具提示（已禁用）
    function showTooltip(text, x, y) {
        // 函数保留但不执行任何操作，禁用提示弹窗
        return;
    }
    
    // 主题管理
    // 检测当前实际应用的主题
    function detectCurrentTheme() {
        const body = document.body;
        if (body.classList.contains('blue-theme')) {
            if (body.classList.contains('deep-sea')) {
                return 'blue-deep-sea';
            } else if (body.classList.contains('neon')) {
                return 'blue-neon';
            } else {
                return 'blue';
            }
        } else if (body.classList.contains('rainbow-theme')) {
            return 'rainbow';
        }
        return 'rainbow'; // 默认返回彩虹主题
    }
    
    // 获取当前主题并应用对应的特殊类名
    let currentTheme = detectCurrentTheme();
    // 确保类名一致性
    if (currentTheme === 'blue' && !document.body.classList.contains('standard-blue')) {
        document.body.classList.add('standard-blue');
    }
    
    // 更新localStorage以匹配实际主题
    localStorage.setItem('mindMapTheme', currentTheme);
    
    // 确保蓝色主题不会自动覆盖彩虹主题
    if (currentTheme === 'rainbow') {
        // 禁用蓝色主题的自动加载
        localStorage.setItem('blueThemePrefs', JSON.stringify({
            enabled: false,
            variant: 'classic',
            crystalNodesEnabled: false
        }));
    }
    
    // 应用主题函数
    function applyTheme(theme) {
        // 移除所有主题相关类
        document.body.classList.remove('rainbow-theme', 'blue-theme', 'deep-sea', 'neon', 'standard-blue');
        
        // 添加应用主题的动画类
        document.body.classList.add('theme-transition');
        
        // 创建过渡效果遮罩
        const transitionOverlay = document.createElement('div');
        transitionOverlay.style.position = 'fixed';
        transitionOverlay.style.top = '0';
        transitionOverlay.style.left = '0';
        transitionOverlay.style.width = '100%';
        transitionOverlay.style.height = '100%';
        transitionOverlay.style.backgroundColor = theme.includes('blue') ? 
            'rgba(0, 30, 60, 0.3)' : 'rgba(60, 0, 60, 0.3)';
        transitionOverlay.style.zIndex = '9990';
        transitionOverlay.style.opacity = '0';
        transitionOverlay.style.transition = 'opacity 0.8s ease';
        transitionOverlay.style.pointerEvents = 'none';
        
        document.body.appendChild(transitionOverlay);
        
        // 触发遮罩动画
        setTimeout(() => {
            transitionOverlay.style.opacity = '1';
        
        // 应用选择的主题
            setTimeout(() => {
        switch(theme) {
            case 'rainbow':
                document.body.classList.add('rainbow-theme');
                // 禁用蓝色主题
                localStorage.setItem('blueThemePrefs', JSON.stringify({
                    enabled: false,
                    variant: 'classic',
                    crystalNodesEnabled: false
                }));
                break;
            case 'blue':
                document.body.classList.add('blue-theme');
                        document.body.classList.add('standard-blue');
                // 更新蓝色主题设置
                localStorage.setItem('blueThemePrefs', JSON.stringify({
                    enabled: true,
                    variant: 'classic',
                    crystalNodesEnabled: false
                }));
                break;
            case 'blue-deep-sea':
                document.body.classList.add('blue-theme');
                document.body.classList.add('deep-sea');
                // 更新蓝色主题设置
                localStorage.setItem('blueThemePrefs', JSON.stringify({
                    enabled: true,
                    variant: 'deep-sea',
                    crystalNodesEnabled: false
                }));
                break;
            case 'blue-neon':
                document.body.classList.add('blue-theme');
                document.body.classList.add('neon');
                // 更新蓝色主题设置
                localStorage.setItem('blueThemePrefs', JSON.stringify({
                    enabled: true,
                    variant: 'neon',
                    crystalNodesEnabled: false
                }));
                break;
            default:
                // 默认使用彩虹主题
                document.body.classList.add('rainbow-theme');
                currentTheme = 'rainbow';
                break;
        }
        
        // 保存主题选择
        currentTheme = theme;
        localStorage.setItem('mindMapTheme', currentTheme);
                
                // 淡出遮罩
                setTimeout(() => {
                    transitionOverlay.style.opacity = '0';
                    
                    setTimeout(() => {
                        document.body.removeChild(transitionOverlay);
                        
                        // 移除过渡动画类
                        setTimeout(() => {
                            document.body.classList.remove('theme-transition');
                        }, 200);
                    }, 800);
                }, 400);
            }, 200);
        }, 10);
    }
    
    // 重置视图
    document.getElementById('resetBtn').addEventListener('click', (e) => {
        if (confirm('确定要重置视图吗？所有自定义位置将被清除。')) {
            localStorage.removeItem('mindMapNodePositions');
            location.reload();
        }
    });
    
    // 放大
    document.getElementById('zoomInBtn').addEventListener('click', (e) => {
        const center = {
            x: mindMap.container.clientWidth / 2,
            y: mindMap.container.clientHeight / 2
        };
        mindMap.zoom(1, center.x, center.y);
    });
    
    // 缩小
    document.getElementById('zoomOutBtn').addEventListener('click', (e) => {
        const center = {
            x: mindMap.container.clientWidth / 2,
            y: mindMap.container.clientHeight / 2
        };
        mindMap.zoom(-1, center.x, center.y);
    });
    
    // 自动布局
    document.getElementById('autoLayoutBtn').addEventListener('click', (e) => {
        mindMap.autoArrangeNodes();
    });
    
    // 展开所有节点
    document.getElementById('expandAllBtn').addEventListener('click', (e) => {
        const allNodes = document.querySelectorAll('.node');
        let expandedCount = 0;
        
        allNodes.forEach(node => {
            if (node.querySelector('.children')) {
                node.classList.add('open');
                expandedCount++;
            }
        });
        
        mindMap.updateConnectionsRAF();
    });
    
    // 保存思维导图
    document.getElementById('saveBtn').addEventListener('click', async (e) => {
        if (typeof saveMindMap === 'function') {
            try {
                const success = await saveMindMap();
            } catch (error) {
                console.error('保存失败:', error);
            }
        } else {
            console.error('保存函数未找到');
        }
    });
    
    // 移除按钮悬停提示
    const buttons = document.querySelectorAll('.control-panel button');
    buttons.forEach(button => {
        button.removeEventListener('mouseover', showTooltip);
        button.removeEventListener('mouseout', () => {
            tooltip.classList.remove('show');
        });
    });
    
    // 创建主题选择菜单
    function showThemeSelector(e) {
        console.log('显示主题选择器，当前主题:', document.body.classList.contains('rainbow-theme') ? '彩虹主题' : '蓝色主题');
        const isRainbowTheme = document.body.classList.contains('rainbow-theme');
        
        // 如果已存在主题选择器，则移除
        const existingSelector = document.querySelector('.theme-selector');
        const existingOverlay = document.querySelector('.theme-overlay');
        if (existingSelector) document.body.removeChild(existingSelector);
        if (existingOverlay) document.body.removeChild(existingOverlay);
        
        // 创建半透明遮罩
        const overlay = document.createElement('div');
        overlay.className = 'theme-overlay';
        document.body.appendChild(overlay);
        
        // 添加动画类
        setTimeout(() => {
            overlay.classList.add('show');
        }, 10);
        
        // 创建菜单容器
        const themeMenu = document.createElement('div');
        themeMenu.className = 'theme-selector';
        
        // 添加背景容器
        const bgContainer = document.createElement('div');
        bgContainer.className = 'theme-selector-bg';
        themeMenu.appendChild(bgContainer);
        
        // 创建粒子效果 (只在彩虹主题下添加)
        if (isRainbowTheme) {
            const particlesContainer = document.createElement('div');
            particlesContainer.className = 'particles';
            
            // 创建300个细小七彩渐变粒子（进一步增加数量）
            for (let i = 0; i < 300; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                
                // 非常小的粒子尺寸
                const size = Math.random() * 2 + 0.5; // 0.5-2.5px大小
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                
                // 均匀分布在整个选择器中
                const left = Math.random() * 100;
                const top = Math.random() * 100;
                particle.style.left = `${left}%`;
                particle.style.top = `${top}%`;
                
                // 七彩渐变色
                const hueStart = Math.floor(Math.random() * 360);
                const hueEnd = (hueStart + 60 + Math.floor(Math.random() * 60)) % 360;
                
                // 使用渐变而非单色
                const gradient = `linear-gradient(135deg, 
                    hsla(${hueStart}, 100%, 70%, 0.7),
                    hsla(${hueEnd}, 100%, 70%, 0.7))`;
                particle.style.background = gradient;
                
                // 添加微弱发光效果
                particle.style.boxShadow = `0 0 ${size}px hsla(${hueStart}, 100%, 70%, 0.6)`;
                
                // 极短的随机动画延迟，确保粒子几乎立即出现
                const delay = Math.random() * 0.3; // 最大延迟0.3秒
                particle.style.animationDelay = `${delay}s`;
                
                // 随机动画持续时间
                const duration = Math.random() * 2 + 2.5;
                particle.style.animationDuration = `${duration}s`;
                
                // 设置初始可见性
                particle.style.opacity = '0.4'; // 初始就有较高的不透明度
                
                particlesContainer.appendChild(particle);
            }
            
            themeMenu.appendChild(particlesContainer);
        } else {
            // 蓝色主题下添加星星效果
            const starsContainer = document.createElement('div');
            starsContainer.className = 'stars';
            
            // 确定当前具体蓝色主题
            const isDeepSea = document.body.classList.contains('deep-sea');
            const isNeon = document.body.classList.contains('neon');
            const starCount = isNeon ? 25 : (isDeepSea ? 15 : 20);
            
            // 创建随机星星
            for (let i = 0; i < starCount; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                
                // 随机大小 - 霓虹蓝星星更大更亮
                const baseSize = isNeon ? 1.5 : (isDeepSea ? 0.8 : 1);
                const size = Math.random() * 3 * baseSize + baseSize;
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;
                
                // 随机位置
                const left = Math.random() * 100;
                const top = Math.random() * 100;
                star.style.left = `${left}%`;
                star.style.top = `${top}%`;
                
                // 随机动画延迟
                const delay = Math.random() * 4;
                star.style.animationDelay = `${delay}s`;
                
                // 随机动画持续时间
                const baseDuration = isNeon ? 3 : (isDeepSea ? 5 : 4);
                const duration = Math.random() * 3 + baseDuration;
                star.style.animationDuration = `${duration}s`;
                
                starsContainer.appendChild(star);
            }
            
            themeMenu.appendChild(starsContainer);
        }
        
        // 创建内容容器
        const contentContainer = document.createElement('div');
        contentContainer.style.position = 'relative';
        contentContainer.style.zIndex = '5';
        themeMenu.appendChild(contentContainer);
        
        // 添加标题
        const titleContainer = document.createElement('div');
        const title = document.createElement('h3');
        title.textContent = '选择主题';
        titleContainer.appendChild(title);
        contentContainer.appendChild(titleContainer);
        
        // 重新检测当前主题
        currentTheme = detectCurrentTheme();
        
        // 主题选项
        const themes = [
            { id: 'rainbow', name: '彩虹主题', desc: '多彩绚丽的彩虹效果' },
            { id: 'blue', name: '蓝色主题', desc: '沉稳大气的蓝色系' },
            { id: 'blue-deep-sea', name: '深海蓝', desc: '神秘深邃的蓝色变体' },
            { id: 'blue-neon', name: '霓虹蓝', desc: '明亮炫目的蓝色特效' }
        ];
        
        // 创建选项容器
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'theme-options-container';
        
        // 创建主题选项
        themes.forEach((theme, index) => {
            const option = document.createElement('div');
            option.className = `theme-option ${theme.id}`;
            if (currentTheme === theme.id) {
                option.classList.add('selected');
            }
            
            // 创建选项名称
            const nameElement = document.createElement('div');
            nameElement.className = 'theme-option-name';
            nameElement.textContent = theme.name;
            
            // 创建描述
            const descElement = document.createElement('div');
            descElement.className = 'theme-option-desc';
            descElement.textContent = theme.desc;
            
            // 组合内容
            option.appendChild(nameElement);
            option.appendChild(descElement);
            
            // 点击事件
            option.addEventListener('click', () => {
                // 添加震动效果
                if ('vibrate' in navigator) {
                    navigator.vibrate(50);
                }
                
                // 添加选中动画
                const allOptions = optionsContainer.querySelectorAll('.theme-option');
                allOptions.forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                option.classList.add('selected');
                
                // 使用延迟以显示动画效果
                setTimeout(() => {
                    // 淡出菜单
                    themeMenu.classList.add('hide');
                    overlay.classList.add('hide');
                    
                    // 应用主题
                applyTheme(theme.id);
                    
                    // 移除元素
                    setTimeout(() => {
                        if (document.body.contains(themeMenu)) {
                document.body.removeChild(themeMenu);
                        }
                        if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
                        }
                    }, 600);
                }, 150);
            });
            
            optionsContainer.appendChild(option);
        });
        
        contentContainer.appendChild(optionsContainer);
        
        // 创建底部信息栏
            const footer = document.createElement('div');
        footer.style.marginTop = '14px';
            footer.style.fontSize = '11px';
            footer.style.textAlign = 'center';
            footer.style.fontStyle = 'italic';
        footer.style.opacity = '0.7';
        footer.style.color = isRainbowTheme ? 'rgba(255, 255, 255, 0.7)' : 'rgba(200, 230, 255, 0.7)';
            footer.textContent = '点击选择您喜欢的主题风格';
            contentContainer.appendChild(footer);
        
        // 计算菜单位置 - 智能定位
        const rect = e.target.getBoundingClientRect();
        const isRightSide = rect.left > window.innerWidth / 2;
        const isBottomHalf = rect.top > window.innerHeight / 2;
        
        if (isRightSide) {
            // 在按钮左侧显示
            themeMenu.style.top = `${rect.top}px`;
            themeMenu.style.left = `${rect.left - 310}px`;
        } else if (isBottomHalf) {
            // 在按钮上方显示
            themeMenu.style.bottom = `${window.innerHeight - rect.top + 12}px`;
            themeMenu.style.left = `${rect.left - 60}px`;
            themeMenu.style.top = 'auto';
        } else {
            // 在按钮下方显示
            themeMenu.style.top = `${rect.bottom + 12}px`;
            themeMenu.style.left = `${rect.left - 60}px`;
        }
        
        // 点击遮罩关闭菜单
        overlay.addEventListener('click', () => {
            themeMenu.classList.add('hide');
            overlay.classList.add('hide');
            
            setTimeout(() => {
                if (document.body.contains(themeMenu)) {
                document.body.removeChild(themeMenu);
                }
                if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
                }
            }, 600);
        });
        
        document.body.appendChild(themeMenu);
        
        // 触发重排并启用动画
        setTimeout(() => {
            themeMenu.classList.add('show');
        }, 50);
        
        // 添加键盘事件监听器 - ESC关闭
        const escKeyHandler = (event) => {
            if (event.key === 'Escape') {
                themeMenu.classList.add('hide');
                overlay.classList.add('hide');
                
                setTimeout(() => {
                    if (document.body.contains(themeMenu)) {
                        document.body.removeChild(themeMenu);
                    }
                    if (document.body.contains(overlay)) {
                        document.body.removeChild(overlay);
                    }
                    document.removeEventListener('keydown', escKeyHandler);
                }, 600);
            }
        };
        
        document.addEventListener('keydown', escKeyHandler);
    }
    
    // 添加主题选择按钮点击事件
    document.getElementById('themeBtn').addEventListener('click', (e) => {
        showThemeSelector(e);
    });
    
    // 监听主题变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                // 重新检测当前主题并更新状态
                currentTheme = detectCurrentTheme();
                localStorage.setItem('mindMapTheme', currentTheme);
            }
        });
    });
    
    // 开始监听body的class变化
    observer.observe(document.body, { attributes: true });
    
    // 辅助函数：重新加载CSS文件
    function reloadCSS(filename) {
        const links = document.getElementsByTagName('link');
        for (let i = 0; i < links.length; i++) {
            const link = links[i];
            if (link.rel === 'stylesheet' && link.href.includes(filename)) {
                const href = link.href;
                link.href = '';
                setTimeout(() => {
                    link.href = href + '?v=' + new Date().getTime();
                    console.log('已重新加载CSS文件:', filename);
                }, 100);
                return;
            }
        }
        console.error('未找到CSS文件:', filename);
    }
    
    // 添加快捷键Ctrl+R重新加载主题选择器CSS
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            reloadCSS('theme-selector.css');
        }
    });
    
    // 添加悬浮动画到主题按钮
    const themeBtn = document.getElementById('themeBtn');
    themeBtn.addEventListener('mouseenter', () => {
        themeBtn.style.transform = 'scale(1.15)';
        themeBtn.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
    
    themeBtn.addEventListener('mouseleave', () => {
        themeBtn.style.transform = 'scale(1)';
    });
    
    // 给主题按钮添加闪光效果
    let isHovering = false;
    
    function addGlowEffect() {
        if (!isHovering) return;
        
        const glow = document.createElement('div');
        glow.style.position = 'absolute';
        glow.style.width = '100%';
        glow.style.height = '100%';
        glow.style.top = '0';
        glow.style.left = '0';
        glow.style.borderRadius = 'inherit';
        glow.style.pointerEvents = 'none';
        glow.style.backgroundColor = document.body.classList.contains('rainbow-theme') ? 
            'rgba(255, 255, 255, 0.2)' : 'rgba(0, 140, 255, 0.2)';
        glow.style.opacity = '0';
        glow.style.transition = 'opacity 0.6s ease';
        
        themeBtn.appendChild(glow);
        
        setTimeout(() => {
            glow.style.opacity = '1';
            
            setTimeout(() => {
                glow.style.opacity = '0';
                
                setTimeout(() => {
                    if (glow.parentNode === themeBtn) {
                        themeBtn.removeChild(glow);
                    }
                    
                    if (isHovering) {
                        addGlowEffect();
                    }
                }, 600);
            }, 400);
        }, 10);
    }
    
    themeBtn.addEventListener('mouseenter', () => {
        isHovering = true;
        addGlowEffect();
    });
    
    themeBtn.addEventListener('mouseleave', () => {
        isHovering = false;
    });
});

// 添加主题切换过渡动画CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = `
.theme-transition {
    transition: background-color 0.8s ease, color 0.8s ease;
}
.theme-transition * {
    transition: background-color 0.8s ease, color 0.8s ease, border-color 0.8s ease, box-shadow 0.8s ease !important;
}
`;
document.head.appendChild(styleSheet);

// 添加页面加载动画
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// 主题按钮点击事件处理
document.getElementById('themeBtn').addEventListener('click', function() {
    // 如果存在主题选择器API，使用它
    if (window.themeSelector && typeof window.themeSelector.open === 'function') {
        window.themeSelector.open();
        return;
    }
    
    // 临时的主题切换器
    let themeBtn = this;
    
    // 检查当前激活的主题
    if (document.body.classList.contains('rainbow-theme')) {
        // 从彩虹主题切换到蓝色主题
        document.body.classList.remove('rainbow-theme');
        document.body.classList.add('blue-theme');
        
        // 禁用彩虹主题特效并启用蓝色主题
        if (typeof toggleRainbowTheme === 'function') toggleRainbowTheme();
        if (typeof toggleBlueTheme === 'function') toggleBlueTheme();
        
        themeBtn.innerHTML = '<i>🎨</i>深海蓝主题';
    }
    else if (document.body.classList.contains('blue-theme')) {
        // 从蓝色主题切换到深海蓝主题
        document.body.classList.remove('blue-theme');
        
        // 禁用蓝色主题
        if (typeof toggleBlueTheme === 'function' && document.body.classList.contains('blue-theme')) {
            toggleBlueTheme();
        }
        
        // 启用深海蓝主题
        if (typeof window.deepseaTheme !== 'undefined' && typeof window.deepseaTheme.toggle === 'function') {
            window.deepseaTheme.toggle();
        }
        
        themeBtn.innerHTML = '<i>🎨</i>科幻主题';
    }
    else if (document.body.classList.contains('deepsea-theme')) {
        // 从深海蓝主题切换到科幻主题
        
        // 禁用深海蓝主题
        if (typeof window.deepseaTheme !== 'undefined' && typeof window.deepseaTheme.toggle === 'function') {
            window.deepseaTheme.toggle();
        }
        
        // 启用科幻主题
        if (typeof window.scifiTheme !== 'undefined' && typeof window.scifiTheme.toggle === 'function') {
            window.scifiTheme.toggle();
        }
        
        themeBtn.innerHTML = '<i>🎨</i>默认主题';
    }
    else if (document.body.classList.contains('sci-fi-theme')) {
        // 从科幻主题切换回默认主题
        
        // 禁用科幻主题
        if (typeof window.scifiTheme !== 'undefined' && typeof window.scifiTheme.toggle === 'function') {
            window.scifiTheme.toggle();
        }
        
        document.body.className = document.body.className
            .replace(/sci-fi-theme\S*/g, '')
            .replace(/blue-theme\S*/g, '')
            .replace(/rainbow-theme\S*/g, '')
            .replace(/deepsea-theme\S*/g, '')
            .trim();
            
        themeBtn.innerHTML = '<i>🎨</i>彩虹主题';
    }
    else {
        // 从默认主题切换到彩虹主题
        document.body.classList.add('rainbow-theme');
        
        // 启用彩虹主题特效
        if (typeof toggleRainbowTheme === 'function') toggleRainbowTheme();
        
        themeBtn.innerHTML = '<i>🎨</i>蓝色主题';
    }
});
