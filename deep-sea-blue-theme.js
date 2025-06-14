/**
 * 深海蓝主题管理模块 - 为思维导图提供深邃神秘的海洋视觉体验
 * 包含主题切换功能、深海特效和水下氛围
 */

// 深海蓝主题配置
const deepseaThemeConfig = {
    // 主题变体
    variants: {
        'classic': {
            name: '标准深海蓝',
            description: '深邃蓝调的海洋主题',
            class: 'deepsea-theme'
        },
        'abyss': {
            name: '深渊',
            description: '更暗、更神秘的深海主题',
            class: 'deepsea-theme abyss'
        },
        'coral': {
            name: '珊瑚礁',
            description: '带有珊瑚色调点缀的深海主题',
            class: 'deepsea-theme coral'
        },
        'bioluminescent': {
            name: '深海生物发光',
            description: '模拟深海生物发光效果',
            class: 'deepsea-theme bioluminescent'
        }
    },
    
    // 当前主题状态
    currentState: {
        enabled: false,
        variant: 'classic',
        previousTheme: '',
        bubblesEnabled: true,
        particlesEnabled: true
    },
    
    // 主题元素选择器
    selectors: {
        body: 'body',
        nodes: '.mind-map .node',
        rootNode: '.mind-map .root-node',
        connections: '#connectionsContainer path',
        bubbles: [] // 存储气泡元素
    }
};

/**
 * 初始化深海蓝主题系统
 */
function initDeepseaTheme() {
    console.log('正在初始化深海蓝主题系统...');
    
    // 加载用户主题偏好
    loadDeepseaThemePreference();
    
    // 为节点添加水下效果的计时器
    if (deepseaThemeConfig.currentState.enabled) {
        // 创建初始气泡
        createInitialBubbles();
        
        // 定期创建新气泡
        setInterval(createRandomBubbles, 3000); // 每3秒创建新气泡
        
        // 添加水下光束
        createUnderwaterLightBeams();
    }
    
    console.log('深海蓝主题系统初始化完成');
}

/**
 * 切换深海蓝主题
 */
function toggleDeepseaTheme() {
    const body = document.querySelector(deepseaThemeConfig.selectors.body);
    
    if (!deepseaThemeConfig.currentState.enabled) {
        // 启用深海蓝主题
        
        // 保存当前的主题类名
        deepseaThemeConfig.currentState.previousTheme = Array.from(body.classList)
            .filter(cls => cls !== 'deepsea-theme' && !cls.startsWith('deepsea-theme'))
            .join(' ');
        
        // 移除现有主题类
        body.className = body.className.replace(/deepsea-theme\S*/g, '').trim();
        
        // 应用当前选择的变体
        const variant = deepseaThemeConfig.variants[deepseaThemeConfig.currentState.variant];
        body.className += ' ' + variant.class;
        
        // 添加深海特效
        if (deepseaThemeConfig.currentState.bubblesEnabled) {
            createInitialBubbles();
            // 定期创建新气泡
            window.bubbleInterval = setInterval(createRandomBubbles, 3000);
        }
        
        // 添加水下光束效果
        createUnderwaterLightBeams();
        
        // 更新连接线颜色和属性
        updateConnectionsForDeepseaTheme();
        
        // 添加根节点动画效果
        addRootNodeDeepseaEffects();
        
        // 添加水波纹效果
        initWaterRippleEffect();
        
        // 设置状态为已启用
        deepseaThemeConfig.currentState.enabled = true;
        
        // 显示通知
        showThemeNotification(`已启用 ${variant.name} 主题`);
        
    } else {
        // 禁用深海蓝主题
        
        // 移除所有深海蓝主题相关类
        body.className = body.className.replace(/deepsea-theme\S*/g, '').trim();
        
        // 还原之前的主题
        if (deepseaThemeConfig.currentState.previousTheme) {
            body.className += ' ' + deepseaThemeConfig.currentState.previousTheme;
        }
        
        // 清除气泡效果
        clearBubbles();
        clearInterval(window.bubbleInterval);
        
        // 移除光束效果
        removeUnderwaterLightBeams();
        
        // 恢复连接线默认样式
        restoreDefaultConnections();
        
        // 移除根节点特殊效果
        removeRootNodeDeepseaEffects();
        
        // 移除水波纹效果
        removeWaterRippleEffect();
        
        // 设置状态为已禁用
        deepseaThemeConfig.currentState.enabled = false;
        
        // 显示通知
        showThemeNotification('已恢复默认主题');
    }
    
    // 保存主题偏好
    saveDeepseaThemePreference();
}

/**
 * 显示深海蓝主题变体选项
 */
function showDeepseaThemeOptions() {
    // 创建半透明背景遮罩
    const overlay = document.createElement('div');
    overlay.className = 'deepsea-theme-overlay';
    overlay.style.position = 'fixed';
    overlay.style.zIndex = '9998';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'radial-gradient(circle at center, rgba(0, 23, 31, 0.7), rgba(0, 8, 14, 0.85))';
    overlay.style.backdropFilter = 'blur(8px)';
    overlay.style.webkitBackdropFilter = 'blur(8px)';
    overlay.style.opacity = '1'; // 立即显示，无渐变
    
    document.body.appendChild(overlay);
    
    // 创建主菜单容器
    const menuContainer = document.createElement('div');
    menuContainer.className = 'theme-options-menu deepsea-theme';
    menuContainer.style.position = 'fixed';
    menuContainer.style.zIndex = '9999';
    menuContainer.style.top = '50%';
    menuContainer.style.left = '50%';
    menuContainer.style.transform = 'translate(-50%, -50%)'; // 立即显示，无缩放动画
    menuContainer.style.minWidth = '320px';
    menuContainer.style.maxWidth = '90%';
    menuContainer.style.padding = '28px';
    menuContainer.style.opacity = '1'; // 立即显示，无渐变
    
    // 设置深海风格渐变背景
    menuContainer.style.background = 'linear-gradient(135deg, rgba(0, 40, 60, 0.92), rgba(0, 14, 24, 0.96))';
    
    // 设置发光边框
    menuContainer.style.border = '1px solid transparent';
    menuContainer.style.borderImage = 'linear-gradient(to bottom, rgba(0, 168, 232, 0.8), rgba(144, 224, 239, 0.3), rgba(0, 119, 182, 0.5)) 1';
    menuContainer.style.boxShadow = '0 0 40px rgba(0, 8, 14, 0.7), 0 0 25px rgba(0, 168, 232, 0.3), inset 0 0 25px rgba(0, 23, 31, 0.8)';
    menuContainer.style.borderRadius = '16px';
    menuContainer.style.backdropFilter = 'blur(15px)';
    menuContainer.style.webkitBackdropFilter = 'blur(15px)';
    
    // 创建背景纹理和效果
    const bgTexture = document.createElement('div');
    bgTexture.className = 'deepsea-texture';
    bgTexture.style.position = 'absolute';
    bgTexture.style.inset = '0';
    bgTexture.style.borderRadius = 'inherit';
    bgTexture.style.opacity = '0.4';
    bgTexture.style.background = 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%230066aa\' fill-opacity=\'0.03\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")';
    bgTexture.style.zIndex = '0';
    menuContainer.appendChild(bgTexture);
    
    // 创建顶部光晕效果
    const topGlow = document.createElement('div');
    topGlow.className = 'deepsea-top-glow';
    topGlow.style.position = 'absolute';
    topGlow.style.top = '0';
    topGlow.style.left = '10%';
    topGlow.style.right = '10%';
    topGlow.style.height = '40%';
    topGlow.style.background = 'radial-gradient(ellipse at center, rgba(72, 202, 228, 0.1), rgba(0, 168, 232, 0.05) 40%, transparent 70%)';
    topGlow.style.borderRadius = 'inherit';
    topGlow.style.opacity = '0.8';
    topGlow.style.zIndex = '0';
    topGlow.style.animation = 'deepseaLightSwell 12s ease-in-out infinite';
    menuContainer.appendChild(topGlow);
    
    // 创建内容容器
    const contentContainer = document.createElement('div');
    contentContainer.style.position = 'relative';
    contentContainer.style.zIndex = '1';
    menuContainer.appendChild(contentContainer);

    // 添加标题
    const title = document.createElement('h3');
    title.textContent = '选择深海蓝主题变体';
    title.style.color = '#ffffff';
    title.style.textAlign = 'center';
    title.style.marginTop = '0';
    title.style.marginBottom = '22px';
    title.style.fontSize = '1.6em';
    title.style.fontWeight = '600';
    title.style.textShadow = '0 0 15px rgba(72, 202, 228, 0.9), 0 0 30px rgba(0, 168, 232, 0.6)';
    title.style.letterSpacing = '1px';
    contentContainer.appendChild(title);
    
    // 添加装饰线
    const decorativeLine = document.createElement('div');
    decorativeLine.style.width = '80%';
    decorativeLine.style.height = '1px';
    decorativeLine.style.margin = '0 auto 20px';
    decorativeLine.style.background = 'linear-gradient(to right, transparent, rgba(144, 224, 239, 0.3) 20%, rgba(0, 168, 232, 0.6) 50%, rgba(144, 224, 239, 0.3) 80%, transparent)';
    decorativeLine.style.boxShadow = '0 0 8px rgba(72, 202, 228, 0.6)';
    contentContainer.appendChild(decorativeLine);
    
    // 添加主题变体选项容器
    const variantsContainer = document.createElement('div');
    variantsContainer.style.marginBottom = '20px';
    contentContainer.appendChild(variantsContainer);
    
    // 添加各主题变体选项
    Object.keys(deepseaThemeConfig.variants).forEach(key => {
        const variant = deepseaThemeConfig.variants[key];
        
        const option = document.createElement('div');
        option.className = 'theme-option';
        option.dataset.variant = key;
        
        // 设置选项样式
        option.style.background = 'linear-gradient(135deg, rgba(0, 23, 31, 0.75), rgba(0, 14, 24, 0.85))';
        option.style.borderLeft = '3px solid ' + (key === deepseaThemeConfig.currentState.variant ? 
            'rgba(72, 202, 228, 1)' : 'rgba(0, 168, 232, 0.4)');
        option.style.borderRadius = '10px';
        option.style.margin = '12px 0';
        option.style.padding = '16px 18px';
        option.style.boxShadow = '0 4px 15px rgba(0, 8, 14, 0.3), 0 0 8px rgba(0, 40, 60, 0.2)';
        option.style.cursor = 'pointer';
        option.style.position = 'relative';
        option.style.overflow = 'hidden';
        option.style.transition = 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)';
        
        // 添加顶部水波纹效果线
        const topLine = document.createElement('div');
        topLine.style.position = 'absolute';
        topLine.style.left = '0';
        topLine.style.right = '0';
        topLine.style.top = '0';
        topLine.style.height = '1px';
        topLine.style.background = 'linear-gradient(to right, transparent, rgba(144, 224, 239, 0.1) 20%, rgba(0, 168, 232, 0.3) 50%, rgba(144, 224, 239, 0.1) 80%, transparent)';
        option.appendChild(topLine);
        
        // 添加底部水波纹效果线
        const bottomLine = document.createElement('div');
        bottomLine.style.position = 'absolute';
        bottomLine.style.left = '0';
        bottomLine.style.right = '0';
        bottomLine.style.bottom = '0';
        bottomLine.style.height = '1px';
        bottomLine.style.background = 'linear-gradient(to right, transparent, rgba(0, 40, 60, 0.3) 20%, rgba(0, 119, 182, 0.2) 50%, rgba(0, 40, 60, 0.3) 80%, transparent)';
        option.appendChild(bottomLine);
        
        // 高亮当前选中的变体
        if (key === deepseaThemeConfig.currentState.variant) {
            option.style.background = 'linear-gradient(135deg, rgba(0, 52, 89, 0.65), rgba(0, 40, 60, 0.5))';
            option.style.boxShadow = '0 6px 20px rgba(0, 8, 14, 0.4), 0 0 18px rgba(0, 168, 232, 0.4)';
            option.style.transform = 'translateX(8px)';
            
            // 选中项的上边缘增强效果
            topLine.style.background = 'linear-gradient(to right, transparent, rgba(144, 224, 239, 0.2) 20%, rgba(72, 202, 228, 0.5) 50%, rgba(144, 224, 239, 0.2) 80%, transparent)';
            topLine.style.boxShadow = '0 0 10px rgba(72, 202, 228, 0.5)';
        }
        
        // 悬停效果
        option.addEventListener('mouseenter', function() {
            if (key !== deepseaThemeConfig.currentState.variant) {
                this.style.background = 'linear-gradient(135deg, rgba(0, 40, 60, 0.8), rgba(0, 23, 31, 0.7))';
                this.style.borderLeft = '3px solid rgba(0, 168, 232, 0.9)';
                this.style.boxShadow = '0 6px 20px rgba(0, 8, 14, 0.4), 0 0 15px rgba(0, 168, 232, 0.3)';
                this.style.transform = 'translateX(5px) translateY(-2px)';
                
                // 悬停时上边缘动画
                topLine.style.animation = 'deepseaOptionTopGlow 2s ease-in-out infinite';
            }
        });
        
        option.addEventListener('mouseleave', function() {
            if (key !== deepseaThemeConfig.currentState.variant) {
                this.style.background = 'linear-gradient(135deg, rgba(0, 23, 31, 0.75), rgba(0, 14, 24, 0.85))';
                this.style.borderLeft = '3px solid rgba(0, 168, 232, 0.4)';
                this.style.boxShadow = '0 4px 15px rgba(0, 8, 14, 0.3), 0 0 8px rgba(0, 40, 60, 0.2)';
                this.style.transform = 'none';
                
                // 移除动画
                topLine.style.animation = 'none';
            }
        });
        
        // 点击切换主题变体
        option.addEventListener('click', function() {
            selectDeepseaThemeVariant(key);
            
            // 添加水波纹效果
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'radial-gradient(circle, rgba(0, 168, 232, 0.4), transparent)';
            ripple.style.width = '200%';
            ripple.style.height = '200%';
            ripple.style.left = '-50%';
            ripple.style.top = '-50%';
            ripple.style.transform = 'scale(0)';
            ripple.style.opacity = '1';
            ripple.style.transition = 'transform 0.8s ease-out, opacity 0.8s ease-out';
            
            option.appendChild(ripple);
            
            // 立即开始波纹动画
            ripple.style.transform = 'scale(1)';
            ripple.style.opacity = '0';
            
            // 关闭菜单
            setTimeout(() => {
                closeMenu();
            }, 300);
        });
        
        // 添加变体名称
        const variantName = document.createElement('div');
        variantName.textContent = variant.name;
        variantName.style.fontWeight = '600';
        variantName.style.fontSize = '1.05em';
        variantName.style.marginBottom = '5px';
        variantName.style.color = 'rgba(144, 224, 239, 0.95)';
        variantName.style.textShadow = '0 0 8px rgba(0, 168, 232, 0.6)';
        option.appendChild(variantName);
        
        // 添加变体描述
        const variantDesc = document.createElement('div');
        variantDesc.textContent = variant.description;
        variantDesc.style.fontSize = '0.9em';
        variantDesc.style.opacity = '0.85';
        variantDesc.style.lineHeight = '1.4';
        variantDesc.style.color = 'rgba(255, 255, 255, 0.85)';
        option.appendChild(variantDesc);
        
        variantsContainer.appendChild(option);
    });
    
    // 添加分隔线
    const separator = document.createElement('div');
    separator.style.position = 'relative';
    separator.style.height = '1px';
    separator.style.margin = '22px 0';
    separator.style.background = 'rgba(144, 224, 239, 0.2)';
    separator.style.overflow = 'hidden';
    contentContainer.appendChild(separator);
    
    // 添加分隔线发光效果
    const separatorGlow = document.createElement('div');
    separatorGlow.style.position = 'absolute';
    separatorGlow.style.top = '0';
    separatorGlow.style.left = '0';
    separatorGlow.style.right = '0';
    separatorGlow.style.height = '1px';
    separatorGlow.style.background = 'linear-gradient(to right, transparent, rgba(0, 168, 232, 0.4), transparent)';
    separatorGlow.style.animation = 'deepseaBorderPulse 4s ease-in-out infinite';
    separator.appendChild(separatorGlow);
    
    // 添加特效开关标题
    const effectsTitle = document.createElement('div');
    effectsTitle.textContent = '水下视觉特效';
    effectsTitle.style.fontSize = '1.1em';
    effectsTitle.style.fontWeight = '600';
    effectsTitle.style.marginBottom = '15px';
    effectsTitle.style.color = 'rgba(144, 224, 239, 0.9)';
    effectsTitle.style.textShadow = '0 0 8px rgba(0, 168, 232, 0.4)';
    contentContainer.appendChild(effectsTitle);
    
    // 添加特效开关容器
    const effectsContainer = document.createElement('div');
    contentContainer.appendChild(effectsContainer);
    
    // 气泡效果开关
    const bubblesSwitch = createEffectSwitch(
        '气泡效果', 
        deepseaThemeConfig.currentState.bubblesEnabled,
        function(enabled) {
            deepseaThemeConfig.currentState.bubblesEnabled = enabled;
            if (enabled) {
                createInitialBubbles();
                window.bubbleInterval = setInterval(createRandomBubbles, 3000);
            } else {
                clearBubbles();
                clearInterval(window.bubbleInterval);
            }
            saveDeepseaThemePreference();
        }
    );
    effectsContainer.appendChild(bubblesSwitch);
    
    // 粒子效果开关
    const particlesSwitch = createEffectSwitch(
        '水下粒子', 
        deepseaThemeConfig.currentState.particlesEnabled,
        function(enabled) {
            deepseaThemeConfig.currentState.particlesEnabled = enabled;
            if (enabled) {
                addUnderwaterParticles();
            } else {
                removeUnderwaterParticles();
            }
            saveDeepseaThemePreference();
        }
    );
    effectsContainer.appendChild(particlesSwitch);
    
    // 关闭按钮
    const closeButton = document.createElement('button');
    closeButton.textContent = '确认设置';
    closeButton.style.marginTop = '25px';
    closeButton.style.width = '100%';
    closeButton.style.padding = '10px 15px';
    closeButton.style.background = 'linear-gradient(135deg, rgba(0, 40, 60, 0.8), rgba(0, 23, 31, 0.9))';
    closeButton.style.color = '#ffffff';
    closeButton.style.border = '1px solid rgba(144, 224, 239, 0.3)';
    closeButton.style.borderRadius = '8px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontWeight = '500';
    closeButton.style.letterSpacing = '0.5px';
    closeButton.style.position = 'relative';
    closeButton.style.overflow = 'hidden';
    closeButton.style.transition = 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)';
    closeButton.style.boxShadow = '0 4px 12px rgba(0, 8, 14, 0.4), 0 0 10px rgba(0, 119, 182, 0.2)';
    contentContainer.appendChild(closeButton);
    
    // 按钮闪光效果
    const buttonGlow = document.createElement('div');
    buttonGlow.style.position = 'absolute';
    buttonGlow.style.top = '-50%';
    buttonGlow.style.left = '-50%';
    buttonGlow.style.width = '200%';
    buttonGlow.style.height = '200%';
    buttonGlow.style.background = 'radial-gradient(circle at center, rgba(144, 224, 239, 0.1), rgba(0, 168, 232, 0.05) 30%, transparent 70%)';
    buttonGlow.style.transform = 'rotate(30deg)';
    buttonGlow.style.opacity = '0';
    buttonGlow.style.transition = 'opacity 0.3s ease';
    closeButton.appendChild(buttonGlow);
    
    // 按钮悬停效果
    closeButton.addEventListener('mouseenter', function() {
        this.style.background = 'linear-gradient(135deg, rgba(0, 52, 89, 0.85), rgba(0, 40, 60, 0.95))';
        this.style.borderColor = 'rgba(144, 224, 239, 0.5)';
        this.style.boxShadow = '0 6px 16px rgba(0, 8, 14, 0.5), 0 0 15px rgba(0, 168, 232, 0.3)';
        this.style.transform = 'translateY(-2px)';
        buttonGlow.style.opacity = '1';
        buttonGlow.style.animation = 'deepseaButtonGlow 2s infinite';
    });
    
    closeButton.addEventListener('mouseleave', function() {
        this.style.background = 'linear-gradient(135deg, rgba(0, 40, 60, 0.8), rgba(0, 23, 31, 0.9))';
        this.style.borderColor = 'rgba(144, 224, 239, 0.3)';
        this.style.boxShadow = '0 4px 12px rgba(0, 8, 14, 0.4), 0 0 10px rgba(0, 119, 182, 0.2)';
        this.style.transform = 'none';
        buttonGlow.style.opacity = '0';
        buttonGlow.style.animation = 'none';
    });
    
    closeButton.addEventListener('click', function() {
        closeMenu();
    });
    
    // 添加菜单到页面
    document.body.appendChild(menuContainer);
    
    // 添加水下视觉效果 - 立即调用
    addDeepseaEffectsToMenu(menuContainer);
    
    // 立即创建初始波纹效果
    createInitialMenuRipples(menuContainer);
    
    // 监听ESC键
    function handleEscKey(e) {
        if (e.key === 'Escape') {
            closeMenu();
            document.removeEventListener('keydown', handleEscKey);
        }
    }
    document.addEventListener('keydown', handleEscKey);
    
    // 点击遮罩关闭
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeMenu();
        }
    });
    
    // 关闭菜单函数
    function closeMenu() {
        // 立即移除
        document.body.removeChild(overlay);
        document.body.removeChild(menuContainer);
        document.removeEventListener('keydown', handleEscKey);
    }
}

/**
 * 立即创建初始波纹效果
 */
function createInitialMenuRipples(menuContainer) {
    // 获取波纹容器
    const rippleContainer = menuContainer.querySelector('.deepsea-menu-ripples');
    if (!rippleContainer) return;
    
    // 立即创建4个波纹，位于不同位置
    const positions = [
        { top: '10%', left: '20%' },
        { top: '30%', left: '90%' },
        { top: '70%', left: '15%' },
        { top: '85%', left: '75%' }
    ];
    
    positions.forEach((pos, index) => {
        const ripple = document.createElement('div');
        ripple.className = 'deepsea-menu-ripple';
        ripple.style.position = 'absolute';
        ripple.style.border = '1px solid rgba(144, 224, 239, 0.2)';
        ripple.style.borderRadius = '50%';
        ripple.style.boxShadow = '0 0 10px rgba(0, 168, 232, 0.1)';
        ripple.style.top = pos.top;
        ripple.style.left = pos.left;
        
        // 设置初始大小和不同的动画阶段
        const initialSize = index * 30; // 不同大小
        ripple.style.width = initialSize + 'px';
        ripple.style.height = initialSize + 'px';
        ripple.style.opacity = 0.8 - (index * 0.15); // 不同透明度
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.transition = 'all 4s cubic-bezier(0, 0.5, 0.25, 1)';
        
        rippleContainer.appendChild(ripple);
        
        // 立即开始动画
        setTimeout(() => {
            ripple.style.width = '200px';
            ripple.style.height = '200px';
            ripple.style.opacity = '0';
        }, 50);
        
        // 动画结束后移除
        setTimeout(() => {
            if (ripple.parentNode === rippleContainer) {
                rippleContainer.removeChild(ripple);
            }
        }, 4000);
    });
    
    // 开始定期创建波纹
    setTimeout(function createMenuRipple() {
        if (!document.body.contains(menuContainer)) return;
        
        const ripple = document.createElement('div');
        ripple.className = 'deepsea-menu-ripple';
        ripple.style.position = 'absolute';
        ripple.style.border = '1px solid rgba(144, 224, 239, 0.2)';
        ripple.style.borderRadius = '50%';
        ripple.style.boxShadow = '0 0 10px rgba(0, 168, 232, 0.1)';
        
        // 随机位置（菜单边缘）
        const position = Math.random();
        let top, left;
        
        if (position < 0.25) {
            // 上边缘
            top = '0%';
            left = `${Math.random() * 100}%`;
        } else if (position < 0.5) {
            // 右边缘
            top = `${Math.random() * 100}%`;
            left = '100%';
        } else if (position < 0.75) {
            // 下边缘
            top = '100%';
            left = `${Math.random() * 100}%`;
        } else {
            // 左边缘
            top = `${Math.random() * 100}%`;
            left = '0%';
        }
        
        ripple.style.top = top;
        ripple.style.left = left;
        
        // 设置初始大小和动画
        ripple.style.width = '0';
        ripple.style.height = '0';
        ripple.style.opacity = '0.8';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.transition = 'all 4s cubic-bezier(0, 0.5, 0.25, 1)';
        
        rippleContainer.appendChild(ripple);
        
        // 立即开始动画
        setTimeout(() => {
            ripple.style.width = '200px';
            ripple.style.height = '200px';
            ripple.style.opacity = '0';
        }, 50);
        
        // 动画结束后移除
        setTimeout(() => {
            if (ripple.parentNode === rippleContainer) {
                rippleContainer.removeChild(ripple);
            }
        }, 4000);
        
        // 安排下一个波纹
        if (document.body.contains(menuContainer)) {
            setTimeout(createMenuRipple, Math.random() * 2000 + 1000);
        }
    }, 1000);
}

/**
 * 创建效果开关
 */
function createEffectSwitch(label, initialState, onChange) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.justifyContent = 'space-between';
    container.style.alignItems = 'center';
    container.style.margin = '10px 0';
    
    const labelElement = document.createElement('span');
    labelElement.textContent = label;
    container.appendChild(labelElement);
    
    const switchContainer = document.createElement('div');
    switchContainer.style.width = '40px';
    switchContainer.style.height = '20px';
    switchContainer.style.backgroundColor = initialState ? 'rgba(0, 168, 232, 0.5)' : 'rgba(0, 23, 31, 0.5)';
    switchContainer.style.borderRadius = '10px';
    switchContainer.style.position = 'relative';
    switchContainer.style.cursor = 'pointer';
    switchContainer.style.transition = 'background-color 0.3s';
    
    const switchHandle = document.createElement('div');
    switchHandle.style.width = '16px';
    switchHandle.style.height = '16px';
    switchHandle.style.backgroundColor = '#fff';
    switchHandle.style.borderRadius = '50%';
    switchHandle.style.position = 'absolute';
    switchHandle.style.top = '2px';
    switchHandle.style.left = initialState ? '22px' : '2px';
    switchHandle.style.transition = 'left 0.3s';
    
    switchContainer.appendChild(switchHandle);
    
    let state = initialState;
    switchContainer.onclick = function() {
        state = !state;
        switchContainer.style.backgroundColor = state ? 'rgba(0, 168, 232, 0.5)' : 'rgba(0, 23, 31, 0.5)';
        switchHandle.style.left = state ? '22px' : '2px';
        onChange(state);
    };
    
    container.appendChild(switchContainer);
    return container;
}

/**
 * 选择深海蓝主题变体
 */
function selectDeepseaThemeVariant(variantName) {
    // 检查变体是否存在
    if (!deepseaThemeConfig.variants[variantName]) {
        console.error('未知的深海蓝主题变体:', variantName);
        return;
    }
    
    const body = document.querySelector(deepseaThemeConfig.selectors.body);
    const currentThemeEnabled = deepseaThemeConfig.currentState.enabled;
    
    // 更新当前变体
    deepseaThemeConfig.currentState.variant = variantName;
    
    // 如果主题当前已启用，则需要更新DOM
    if (currentThemeEnabled) {
        // 移除现有深海蓝主题类
        body.className = body.className.replace(/deepsea-theme\S*/g, '').trim();
        
        // 应用新变体
        const variant = deepseaThemeConfig.variants[variantName];
        body.className += ' ' + variant.class;
        
        // 根据变体更新特定效果
        updateDeepseaThemeEffects(variantName);
        
        // 显示通知
        showThemeNotification(`已切换至 ${variant.name} 主题`);
    }
    
    // 保存主题偏好
    saveDeepseaThemePreference();
}

/**
 * 根据主题变体更新视觉效果
 */
function updateDeepseaThemeEffects(variantName) {
    // 清除当前效果
    clearBubbles();
    removeUnderwaterLightBeams();
    
    // 应用新效果
    if (deepseaThemeConfig.currentState.bubblesEnabled) {
        createInitialBubbles();
    }
    
    // 创建光束效果
    createUnderwaterLightBeams();
    
    // 特定变体效果
    switch(variantName) {
        case 'abyss':
            // 添加深渊特有效果
            createAbyssEffects();
            break;
            
        case 'coral':
            // 添加珊瑚礁特有效果
            createCoralEffects();
            break;
            
        case 'bioluminescent':
            // 添加生物发光特有效果
            createBioluminescentEffects();
            break;
    }
}

/**
 * 创建初始气泡
 */
function createInitialBubbles() {
    // 清除现有气泡
    clearBubbles();
    
    // 获取思维导图容器
    const mindMap = document.querySelector('.mind-map');
    if (!mindMap) return;
    
    // 创建10-20个气泡
    const bubbleCount = Math.floor(Math.random() * 11) + 10;
    
    for (let i = 0; i < bubbleCount; i++) {
        createBubble(mindMap);
    }
}

/**
 * 随机创建新气泡
 */
function createRandomBubbles() {
    if (!deepseaThemeConfig.currentState.enabled || 
        !deepseaThemeConfig.currentState.bubblesEnabled) return;
    
    const mindMap = document.querySelector('.mind-map');
    if (!mindMap) return;
    
    // 创建1-3个新气泡
    const newBubbles = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < newBubbles; i++) {
        createBubble(mindMap);
    }
}

/**
 * 创建单个气泡
 */
function createBubble(container) {
    // 创建气泡元素
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    // 随机大小（5-20px）
    const size = Math.random() * 15 + 5;
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';
    
    // 随机起始位置（底部）
    const containerWidth = container.clientWidth;
    const startX = Math.random() * containerWidth;
    bubble.style.left = startX + 'px';
    bubble.style.bottom = '-' + size + 'px';
    
    // 随机透明度
    bubble.style.opacity = (Math.random() * 0.4 + 0.2).toFixed(2);
    
    // 随机动画持续时间（8-20秒）
    const animationDuration = Math.random() * 12 + 8;
    bubble.style.setProperty('--particle-duration', animationDuration + 's');
    
    // 添加到容器
    container.appendChild(bubble);
    
    // 存储气泡引用
    deepseaThemeConfig.selectors.bubbles.push(bubble);
    
    // 气泡结束动画后移除
    setTimeout(() => {
        if (bubble.parentNode === container) {
            container.removeChild(bubble);
            
            // 从数组中移除引用
            const index = deepseaThemeConfig.selectors.bubbles.indexOf(bubble);
            if (index > -1) {
                deepseaThemeConfig.selectors.bubbles.splice(index, 1);
            }
        }
    }, animationDuration * 1000);
}

/**
 * 清除所有气泡
 */
function clearBubbles() {
    // 移除所有气泡元素
    deepseaThemeConfig.selectors.bubbles.forEach(bubble => {
        if (bubble.parentNode) {
            bubble.parentNode.removeChild(bubble);
        }
    });
    
    // 清空气泡数组
    deepseaThemeConfig.selectors.bubbles = [];
}

/**
 * 创建水下光束效果
 */
function createUnderwaterLightBeams() {
    const mindMap = document.querySelector('.mind-map');
    if (!mindMap) return;
    
    // 创建3-5个光束
    const beamCount = Math.floor(Math.random() * 3) + 3;
    
    for (let i = 0; i < beamCount; i++) {
        // 创建光束元素
        const beam = document.createElement('div');
        beam.className = 'light-beam';
        
        // 随机位置
        beam.style.left = (Math.random() * 80 + 10) + '%';
        beam.style.top = '0';
        
        // 随机旋转角度
        const rotation = Math.random() * 30 + 75; // 75-105度
        beam.style.setProperty('--beam-rotate', rotation + 'deg');
        
        // 随机宽度
        beam.style.width = (Math.random() * 30 + 10) + 'px';
        
        // 随机高度
        beam.style.height = (Math.random() * 300 + 200) + 'px';
        
        // 添加到容器
        mindMap.appendChild(beam);
    }
}

/**
 * 移除水下光束效果
 */
function removeUnderwaterLightBeams() {
    const beams = document.querySelectorAll('.light-beam');
    beams.forEach(beam => {
        if (beam.parentNode) {
            beam.parentNode.removeChild(beam);
        }
    });
}

/**
 * 初始化水波纹效果
 */
function initWaterRippleEffect() {
    const mindMap = document.querySelector('.mind-map');
    if (!mindMap) return;
    
    // 添加点击事件监听器
    mindMap.addEventListener('click', createWaterRippleAtClick);
}

/**
 * 点击时创建水波纹效果
 */
function createWaterRippleAtClick(event) {
    if (!deepseaThemeConfig.currentState.enabled) return;
    
    const mindMap = document.querySelector('.mind-map');
    if (!mindMap) return;
    
    // 创建波纹元素
    const ripple = document.createElement('div');
    ripple.className = 'water-ripple';
    
    // 获取点击位置
    const rect = mindMap.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // 设置波纹位置
    ripple.style.left = (x - 100) + 'px'; // 中心点偏移
    ripple.style.top = (y - 100) + 'px';  // 中心点偏移
    
    // 添加到容器
    mindMap.appendChild(ripple);
    
    // 动画结束后移除
    setTimeout(() => {
        if (ripple.parentNode === mindMap) {
            mindMap.removeChild(ripple);
        }
    }, 4000); // 与CSS动画时长匹配
}

/**
 * 移除水波纹效果
 */
function removeWaterRippleEffect() {
    const mindMap = document.querySelector('.mind-map');
    if (!mindMap) return;
    
    // 移除事件监听器
    mindMap.removeEventListener('click', createWaterRippleAtClick);
    
    // 移除现有波纹
    const ripples = mindMap.querySelectorAll('.water-ripple');
    ripples.forEach(ripple => {
        mindMap.removeChild(ripple);
    });
}

/**
 * 更新连接线为深海蓝主题样式
 */
function updateConnectionsForDeepseaTheme() {
    const connections = document.querySelectorAll(deepseaThemeConfig.selectors.connections);
    
    // 首先检查是否已存在渐变和动画定义
    let defs = document.querySelector('svg defs');
    if (!defs) {
        // 创建defs元素
        const svg = document.querySelector('svg');
        if (svg) {
            defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
            svg.insertBefore(defs, svg.firstChild);
        }
    }
    
    // 如果找到defs元素，创建渐变和动画
    if (defs) {
        // 移除旧的渐变定义(如果存在)
        const oldGradient = document.getElementById('deepseaGradient');
        if (oldGradient) {
            oldGradient.parentNode.removeChild(oldGradient);
        }
        
        // 创建深海渐变
        const gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
        gradient.setAttribute("id", "deepseaGradient");
        gradient.setAttribute("x1", "0%");
        gradient.setAttribute("y1", "0%");
        gradient.setAttribute("x2", "100%");
        gradient.setAttribute("y2", "100%");
        
        // 添加渐变色标 - 使用深邃的海洋蓝色系
        const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop1.setAttribute("offset", "0%");
        stop1.setAttribute("stop-color", "#000C38");
        
        const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop2.setAttribute("offset", "50%");
        stop2.setAttribute("stop-color", "#003366");
        
        const stop3 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop3.setAttribute("offset", "100%");
        stop3.setAttribute("stop-color", "#000C38");
        
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        gradient.appendChild(stop3);
        
        // 添加动画 - 渐变移动效果
        const animateTransform = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
        animateTransform.setAttribute("attributeName", "gradientTransform");
        animateTransform.setAttribute("type", "rotate");
        animateTransform.setAttribute("from", "0 0.5 0.5");
        animateTransform.setAttribute("to", "360 0.5 0.5");
        animateTransform.setAttribute("dur", "20s");
        animateTransform.setAttribute("repeatCount", "indefinite");
        gradient.appendChild(animateTransform);
        
        defs.appendChild(gradient);
    }
    
    connections.forEach(connection => {
        // 保存原始样式
        if (!connection.dataset.originalStroke) {
            connection.dataset.originalStroke = connection.getAttribute('stroke') || '';
        }
        if (!connection.dataset.originalStrokeWidth) {
            connection.dataset.originalStrokeWidth = connection.getAttribute('stroke-width') || '';
        }
        
        // 应用深海蓝主题样式
        connection.setAttribute('stroke', 'url(#deepseaGradient)');
        connection.setAttribute('stroke-width', '4');
        connection.setAttribute('stroke-opacity', '1');
        connection.setAttribute('stroke-linecap', 'round');
        
        // 波纹线条效果
        connection.setAttribute('stroke-dasharray', '4, 4');
        connection.setAttribute('stroke-dashoffset', '0');
        
        // 设置动画
        const animate = document.createElementNS("http://www.w3.org/2000/svg", "animate");
        animate.setAttribute("attributeName", "stroke-dashoffset");
        animate.setAttribute("from", "0");
        animate.setAttribute("to", "16");
        animate.setAttribute("dur", "3s");
        animate.setAttribute("repeatCount", "indefinite");
        connection.appendChild(animate);
        
        connection.classList.add('deepsea-connection');
    });
}

/**
 * 恢复连接线默认样式
 */
function restoreDefaultConnections() {
    const connections = document.querySelectorAll(deepseaThemeConfig.selectors.connections);
    
    connections.forEach(connection => {
        // 恢复原始样式
        if (connection.dataset.originalStroke) {
            connection.setAttribute('stroke', connection.dataset.originalStroke);
        }
        if (connection.dataset.originalStrokeWidth) {
            connection.setAttribute('stroke-width', connection.dataset.originalStrokeWidth);
        }
        
        connection.removeAttribute('stroke-opacity');
        connection.classList.remove('deepsea-connection');
    });
}

/**
 * 为根节点添加深海蓝主题效果
 */
function addRootNodeDeepseaEffects() {
    const rootNode = document.querySelector('.root');
    if (!rootNode) return;
    
    // 添加波浪动画
    rootNode.style.animation = 'deepseaWave 8s ease-in-out infinite';
    
    // 添加辉光效果
    rootNode.style.boxShadow = '0 12px 28px rgba(0, 8, 14, 0.4), 0 0 20px rgba(0, 119, 182, 0.3), inset 0 2px 16px rgba(144, 224, 239, 0.1)';
    rootNode.style.textShadow = '0 0 12px rgba(144, 224, 239, 0.8)';
}

/**
 * 移除根节点深海蓝主题效果
 */
function removeRootNodeDeepseaEffects() {
    const rootNode = document.querySelector('.root');
    if (!rootNode) return;
    
    // 移除波浪动画和特效
    rootNode.style.animation = '';
    rootNode.style.boxShadow = '';
    rootNode.style.textShadow = '';
}

/**
 * 向主题选项菜单添加深海效果
 */
function addDeepseaEffectsToMenu(menuContainer) {
    // 添加气泡效果
    const bubblesContainer = document.createElement('div');
    bubblesContainer.className = 'deepsea-menu-bubbles';
    bubblesContainer.style.position = 'absolute';
    bubblesContainer.style.inset = '0';
    bubblesContainer.style.overflow = 'hidden';
    bubblesContainer.style.borderRadius = 'inherit';
    bubblesContainer.style.pointerEvents = 'none';
    bubblesContainer.style.zIndex = '2';
    menuContainer.appendChild(bubblesContainer);
    
    // 创建15-20个大小、速度各异的气泡，立即显示在不同位置
    for (let i = 0; i < 20; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        // 随机大小（3-22px）
        const size = Math.random() * 19 + 3;
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        
        // 随机位置 - 分布在整个容器的不同高度
        bubble.style.left = (Math.random() * 100) + '%';
        
        // 气泡在不同高度，而不是全部从底部开始
        const initialPos = Math.random() * 120 - 20; // -20% 到 100% 的范围
        bubble.style.bottom = initialPos + '%';
        
        // 随机透明度
        const opacity = Math.random() * 0.4 + 0.1;
        bubble.style.opacity = opacity.toString();
        
        // 随机动画持续时间
        const duration = Math.random() * 15 + 6;
        
        // 随机动画延迟 - 最大延迟2秒，确保快速出现效果
        const delay = Math.random() * 2;
        
        // 设置动画，使用自定义属性传递透明度
        bubble.style.setProperty('--opacity', opacity.toString());
        bubble.style.animation = `deepseaMenuBubbleRise ${duration}s ease-in-out ${delay}s infinite`;
        
        // 添加气泡反光效果
        const highlight = document.createElement('div');
        highlight.style.position = 'absolute';
        highlight.style.width = '30%';
        highlight.style.height = '30%';
        highlight.style.borderRadius = '50%';
        highlight.style.top = '20%';
        highlight.style.left = '20%';
        highlight.style.background = 'rgba(255, 255, 255, 0.4)';
        highlight.style.filter = 'blur(1px)';
        bubble.appendChild(highlight);
        
        bubblesContainer.appendChild(bubble);
    }
    
    // 添加水中光束效果
    const beamsContainer = document.createElement('div');
    beamsContainer.className = 'deepsea-menu-beams';
    beamsContainer.style.position = 'absolute';
    beamsContainer.style.inset = '0';
    beamsContainer.style.overflow = 'hidden';
    beamsContainer.style.borderRadius = 'inherit';
    beamsContainer.style.pointerEvents = 'none';
    beamsContainer.style.zIndex = '0';
    menuContainer.appendChild(beamsContainer);
    
    // 添加5-6道光束，覆盖更多区域
    for (let i = 0; i < 6; i++) {
        const beam = document.createElement('div');
        beam.className = 'deepsea-light-beam';
        beam.style.position = 'absolute';
        beam.style.width = '150%';
        beam.style.height = '50%';
        beam.style.background = 'linear-gradient(to bottom, rgba(72, 202, 228, 0.03) 0%, rgba(0, 168, 232, 0.03) 50%, transparent 100%)';
        
        // 保存旋转角度到自定义属性
        const rotation = `rotate(${30 + Math.random() * 60}deg)`;
        beam.style.setProperty('--rotate', rotation);
        beam.style.transform = rotation;
        
        beam.style.top = `-${Math.random() * 20}%`;
        beam.style.left = `-${Math.random() * 50}%`;
        beam.style.transformOrigin = 'top left';
        
        // 设置不同的透明度
        const beamOpacity = Math.random() * 0.2 + 0.1;
        beam.style.setProperty('--opacity', beamOpacity.toString());
        beam.style.opacity = beamOpacity;
        
        beam.style.filter = 'blur(15px)';
        
        // 无延迟动画
        beam.style.animation = `deepseaBeamSway ${8 + Math.random() * 7}s ease-in-out infinite alternate`;
        
        beamsContainer.appendChild(beam);
    }
    
    // 添加深海粒子效果
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'deepsea-menu-particles';
    particlesContainer.style.position = 'absolute';
    particlesContainer.style.inset = '0';
    particlesContainer.style.overflow = 'hidden';
    particlesContainer.style.borderRadius = 'inherit';
    particlesContainer.style.pointerEvents = 'none';
    particlesContainer.style.zIndex = '1';
    menuContainer.appendChild(particlesContainer);
    
    // 添加30-40个浮动粒子，增加密度
    for (let i = 0; i < 35; i++) {
        const particle = document.createElement('div');
        particle.className = 'deepsea-particle';
        
        // 随机大小
        const size = Math.random() * 3 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.borderRadius = '50%';
        
        // 随机位置
        particle.style.position = 'absolute';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // 随机颜色和亮度
        const brightness = 150 + Math.floor(Math.random() * 105);
        const opacity = Math.random() * 0.4 + 0.1;
        particle.style.backgroundColor = `rgba(${brightness}, ${brightness + 20}, 255, ${opacity})`;
        particle.style.boxShadow = `0 0 ${size}px rgba(${brightness}, ${brightness + 50}, 255, ${opacity * 0.8})`;
        
        // 随机动画 - 无延迟或最小延迟
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 1; // 最大延迟1秒
        particle.style.animation = `deepseaParticleFloat ${duration}s ease-in-out ${delay}s infinite`;
        
        particlesContainer.appendChild(particle);
    }
    
    // 添加菜单周围的水波纹效果
    const rippleContainer = document.createElement('div');
    rippleContainer.className = 'deepsea-menu-ripples';
    rippleContainer.style.position = 'absolute';
    rippleContainer.style.inset = '0';
    rippleContainer.style.overflow = 'hidden';
    rippleContainer.style.borderRadius = 'inherit';
    rippleContainer.style.pointerEvents = 'none';
    rippleContainer.style.zIndex = '3';
    menuContainer.appendChild(rippleContainer);
    
    // 立即创建初始波纹 - 在不同位置和不同阶段
    for (let i = 0; i < 5; i++) {
        const ripple = document.createElement('div');
        ripple.className = 'deepsea-menu-ripple';
        ripple.style.position = 'absolute';
        ripple.style.border = '1px solid rgba(144, 224, 239, 0.2)';
        ripple.style.borderRadius = '50%';
        ripple.style.boxShadow = '0 0 10px rgba(0, 168, 232, 0.1)';
        
        // 随机位置
        ripple.style.top = `${Math.random() * 100}%`;
        ripple.style.left = `${Math.random() * 100}%`;
        
        // 不同大小和透明度，模拟不同阶段的波纹
        const initialSize = i * 40; // 0, 40, 80, 120, 160
        const initialOpacity = 0.8 - (i * 0.15); // 0.8, 0.65, 0.5, 0.35, 0.2
        
        ripple.style.width = `${initialSize}px`;
        ripple.style.height = `${initialSize}px`;
        ripple.style.opacity = initialOpacity.toString();
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.transition = 'all 4s cubic-bezier(0, 0.5, 0.25, 1)';
        
        rippleContainer.appendChild(ripple);
        
        // 立即开始动画
        setTimeout(() => {
            ripple.style.width = '200px';
            ripple.style.height = '200px';
            ripple.style.opacity = '0';
        }, 50);
        
        // 动画结束后移除
        setTimeout(() => {
            if (ripple.parentNode === rippleContainer) {
                rippleContainer.removeChild(ripple);
            }
        }, 4000);
    }
    
    // 定期创建水波纹 - 立即启动
    createMenuRipple();
    
    function createMenuRipple() {
        if (!document.body.contains(menuContainer)) return;
        
        const ripple = document.createElement('div');
        ripple.className = 'deepsea-menu-ripple';
        ripple.style.position = 'absolute';
        ripple.style.border = '1px solid rgba(144, 224, 239, 0.2)';
        ripple.style.borderRadius = '50%';
        ripple.style.boxShadow = '0 0 10px rgba(0, 168, 232, 0.1)';
        
        // 随机位置（菜单边缘）
        const position = Math.random();
        let top, left;
        
        if (position < 0.25) {
            // 上边缘
            top = '0%';
            left = `${Math.random() * 100}%`;
        } else if (position < 0.5) {
            // 右边缘
            top = `${Math.random() * 100}%`;
            left = '100%';
        } else if (position < 0.75) {
            // 下边缘
            top = '100%';
            left = `${Math.random() * 100}%`;
        } else {
            // 左边缘
            top = `${Math.random() * 100}%`;
            left = '0%';
        }
        
        ripple.style.top = top;
        ripple.style.left = left;
        
        // 设置初始大小和动画
        ripple.style.width = '0';
        ripple.style.height = '0';
        ripple.style.opacity = '0.8';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.transition = 'all 4s cubic-bezier(0, 0.5, 0.25, 1)';
        
        rippleContainer.appendChild(ripple);
        
        // 立即开始动画
        setTimeout(() => {
            ripple.style.width = '200px';
            ripple.style.height = '200px';
            ripple.style.opacity = '0';
        }, 50);
        
        // 动画结束后移除
        setTimeout(() => {
            if (ripple.parentNode === rippleContainer) {
                rippleContainer.removeChild(ripple);
            }
        }, 4000);
        
        // 安排下一个波纹 - 更快的间隔
        if (document.body.contains(menuContainer)) {
            setTimeout(createMenuRipple, Math.random() * 1500 + 500); // 0.5-2秒间隔
        }
    }
    
    // 添加深海发光边框效果
    const glowBorder = document.createElement('div');
    glowBorder.className = 'deepsea-menu-glow-border';
    glowBorder.style.position = 'absolute';
    glowBorder.style.inset = '0';
    glowBorder.style.borderRadius = 'inherit';
    glowBorder.style.pointerEvents = 'none';
    glowBorder.style.zIndex = '4';
    glowBorder.style.boxShadow = 'inset 0 0 15px rgba(0, 168, 232, 0.15)';
    glowBorder.style.border = '1px solid rgba(144, 224, 239, 0.1)';
    glowBorder.style.animation = 'deepseaBorderGlow 4s ease-in-out infinite alternate';
    menuContainer.appendChild(glowBorder);
    
    // 添加CSS动画定义 - 确保立即可用
    if (!document.getElementById('deepseaMenuAnimations')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'deepseaMenuAnimations';
        styleSheet.textContent = `
            @keyframes deepseaMenuBubbleRise {
                0% {
                    transform: translateY(0) translateX(0) scale(0.5);
                    opacity: 0.2;
                }
                20% {
                    opacity: var(--opacity, 0.2);
                    transform: translateY(-20%) translateX(5px) scale(0.8);
                }
                40% {
                    transform: translateY(-40%) translateX(-10px) scale(0.9);
                }
                60% {
                    opacity: var(--opacity, 0.2);
                    transform: translateY(-60%) translateX(10px) scale(1);
                }
                80% {
                    transform: translateY(-80%) translateX(-5px) scale(0.9);
                }
                100% {
                    transform: translateY(-100%) translateX(0) scale(0.5);
                    opacity: 0;
                }
            }
            
            @keyframes deepseaBeamSway {
                0% {
                    opacity: var(--opacity, 0.1);
                    transform: var(--rotate) translateY(10%);
                }
                100% {
                    opacity: calc(var(--opacity, 0.1) * 1.5);
                    transform: var(--rotate) translateY(-10%);
                }
            }
            
            @keyframes deepseaParticleFloat {
                0%, 100% {
                    transform: translateY(0) translateX(0);
                }
                25% {
                    transform: translateY(-10px) translateX(7px);
                }
                50% {
                    transform: translateY(-15px) translateX(-10px);
                }
                75% {
                    transform: translateY(-5px) translateX(12px);
                }
            }
            
            @keyframes deepseaBorderGlow {
                0%, 100% {
                    box-shadow: inset 0 0 15px rgba(0, 168, 232, 0.15);
                    border-color: rgba(144, 224, 239, 0.1);
                }
                50% {
                    box-shadow: inset 0 0 25px rgba(0, 168, 232, 0.25);
                    border-color: rgba(144, 224, 239, 0.2);
                }
            }
        `;
        document.head.appendChild(styleSheet);
    }
    
    // 鼠标移动时产生额外气泡效果
    menuContainer.addEventListener('mousemove', function(e) {
        // 提高概率到30%，增加交互感
        if (Math.random() > 0.7) {
            const rect = menuContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            createMenuMouseBubble(bubblesContainer, x, y);
        }
    });
    
    // 立即创建一些鼠标气泡，模拟初始活跃状态
    for (let i = 0; i < 8; i++) {
        const x = Math.random() * menuContainer.offsetWidth;
        const y = Math.random() * menuContainer.offsetHeight;
        createMenuMouseBubble(bubblesContainer, x, y);
    }
}

/**
 * 创建鼠标移动时跟随的气泡
 */
function createMenuMouseBubble(container, x, y) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble mouse-bubble';
    
    // 气泡样式 - 增大尺寸
    const size = Math.random() * 12 + 5; // 5-17px，比原来更大
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.position = 'absolute';
    bubble.style.borderRadius = '50%';
    
    // 更亮、更明显的气泡
    bubble.style.background = 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5), rgba(72,202,228,0.2))';
    bubble.style.boxShadow = `0 0 ${size/2}px rgba(72, 202, 228, 0.5)`;
    bubble.style.opacity = '0.6'; // 提高透明度
    bubble.style.left = `${x}px`;
    bubble.style.top = `${y}px`;
    bubble.style.transform = 'translate(-50%, -50%)';
    bubble.style.pointerEvents = 'none';
    bubble.style.zIndex = '10'; // 确保在上层显示
    
    container.appendChild(bubble);
    
    // 更流畅的气泡上升动画
    const animation = bubble.animate([
        { 
            transform: 'translate(-50%, -50%) scale(0.6)',
            opacity: 0.2
        },
        { 
            transform: 'translate(-60%, -150%) scale(1.2)',
            opacity: 0.6
        },
        { 
            transform: 'translate(-40%, -300%) scale(0.8)',
            opacity: 0
        }
    ], {
        duration: 1800 + Math.random() * 1000,
        easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)'
    });
    
    // 确保动画立即开始
    animation.play();
    
    // 动画结束后移除
    setTimeout(() => {
        if (bubble.parentNode) {
            container.removeChild(bubble);
        }
    }, 2800);
    
    // 创建额外的小气泡，增加视觉效果
    if (Math.random() > 0.5) {
        setTimeout(() => {
            const smallBubble = document.createElement('div');
            smallBubble.className = 'bubble small-mouse-bubble';
            
            // 小气泡样式
            const smallSize = size * 0.4;
            smallBubble.style.width = `${smallSize}px`;
            smallBubble.style.height = `${smallSize}px`;
            smallBubble.style.position = 'absolute';
            smallBubble.style.borderRadius = '50%';
            smallBubble.style.background = 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), rgba(144,224,239,0.2))';
            smallBubble.style.boxShadow = `0 0 ${smallSize}px rgba(144, 224, 239, 0.4)`;
            smallBubble.style.opacity = '0.5';
            
            // 位置稍微偏移
            smallBubble.style.left = `${x + (Math.random() * 10 - 5)}px`;
            smallBubble.style.top = `${y + (Math.random() * 5)}px`;
            smallBubble.style.transform = 'translate(-50%, -50%)';
            smallBubble.style.pointerEvents = 'none';
            
            container.appendChild(smallBubble);
            
            // 小气泡动画
            smallBubble.animate([
                { 
                    transform: 'translate(-50%, -50%) scale(0.5)',
                    opacity: 0.2
                },
                { 
                    transform: 'translate(-40%, -120%) scale(0.8)',
                    opacity: 0.5
                },
                { 
                    transform: 'translate(-60%, -250%) scale(0.4)',
                    opacity: 0
                }
            ], {
                duration: 1500 + Math.random() * 800,
                easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)'
            });
            
            // 移除小气泡
            setTimeout(() => {
                if (smallBubble.parentNode) {
                    container.removeChild(smallBubble);
                }
            }, 2300);
        }, 100); // 稍微延迟，创造气泡分裂的效果
    }
}

/**
 * 显示主题通知
 */
function showThemeNotification(message) {
    // 检查是否已存在通知
    let notification = document.querySelector('.theme-notification');
    
    if (!notification) {
        // 创建通知元素
        notification = document.createElement('div');
        notification.className = 'theme-notification deepsea-theme';
        document.body.appendChild(notification);
    }
    
    // 设置通知样式
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '12px 20px';
    notification.style.background = 'linear-gradient(135deg, rgba(0, 40, 60, 0.9), rgba(0, 14, 24, 0.95))';
    notification.style.color = '#fff';
    notification.style.borderRadius = '8px';
    notification.style.boxShadow = '0 4px 20px rgba(0, 8, 14, 0.5), 0 0 15px rgba(0, 168, 232, 0.2)';
    notification.style.border = '1px solid rgba(144, 224, 239, 0.3)';
    notification.style.zIndex = '9999';
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(50px)';
    notification.style.transition = 'all 0.3s ease-out';
    
    // 设置通知文本
    notification.textContent = message;
    
    // 显示通知
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // 自动隐藏
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(50px)';
        
        // 移除元素
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

/**
 * 创建深渊特有效果
 */
function createAbyssEffects() {
    // 此处实现深渊特有的视觉效果
    console.log('添加深渊效果');
}

/**
 * 创建珊瑚礁特有效果
 */
function createCoralEffects() {
    // 此处实现珊瑚礁特有的视觉效果
    console.log('添加珊瑚礁效果');
}

/**
 * 创建生物发光特有效果
 */
function createBioluminescentEffects() {
    // 此处实现生物发光特有的视觉效果
    console.log('添加生物发光效果');
}

/**
 * 添加水下粒子效果
 */
function addUnderwaterParticles() {
    const mindMap = document.querySelector('.mind-map');
    if (!mindMap || !deepseaThemeConfig.currentState.enabled) return;
    
    // 创建20-30个浮动粒子
    const particleCount = Math.floor(Math.random() * 11) + 20;
    
    for (let i = 0; i < particleCount; i++) {
        // 创建粒子元素
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // 随机大小
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // 随机位置
        particle.style.left = (Math.random() * 95 + 2.5) + '%';
        particle.style.top = (Math.random() * 95 + 2.5) + '%';
        
        // 随机动画持续时间
        const duration = Math.random() * 20 + 10;
        particle.style.setProperty('--particle-duration', duration + 's');
        
        // 添加到容器
        mindMap.appendChild(particle);
    }
}

/**
 * 移除水下粒子效果
 */
function removeUnderwaterParticles() {
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    });
}

/**
 * 保存深海蓝主题偏好
 */
function saveDeepseaThemePreference() {
    if (typeof localStorage !== 'undefined') {
        const preferences = {
            enabled: deepseaThemeConfig.currentState.enabled,
            variant: deepseaThemeConfig.currentState.variant,
            bubblesEnabled: deepseaThemeConfig.currentState.bubblesEnabled,
            particlesEnabled: deepseaThemeConfig.currentState.particlesEnabled
        };
        
        localStorage.setItem('deepseaThemePreferences', JSON.stringify(preferences));
    }
}

/**
 * 加载深海蓝主题偏好
 */
function loadDeepseaThemePreference() {
    if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('deepseaThemePreferences');
        
        if (saved) {
            try {
                const preferences = JSON.parse(saved);
                
                // 恢复保存的设置
                deepseaThemeConfig.currentState.variant = preferences.variant || 'classic';
                deepseaThemeConfig.currentState.bubblesEnabled = preferences.bubblesEnabled !== undefined ? preferences.bubblesEnabled : true;
                deepseaThemeConfig.currentState.particlesEnabled = preferences.particlesEnabled !== undefined ? preferences.particlesEnabled : true;
                
                // 如果之前启用了主题，则自动应用
                if (preferences.enabled) {
                    toggleDeepseaTheme();
                }
            } catch (e) {
                console.error('无法解析保存的主题偏好:', e);
            }
        }
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initDeepseaTheme();
});

// 暴露给主题选择器使用的方法
window.deepseaTheme = {
    toggle: toggleDeepseaTheme,
    showOptions: showDeepseaThemeOptions,
    select: selectDeepseaThemeVariant
}; 