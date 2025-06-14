/**
 * 蓝色主题管理模块 - 为思维导图提供多种精美的蓝色系主题
 * 包含主题切换功能、主题变体和特效
 */

// 主题配置
const blueThemeConfig = {
    // 主题变体
    variants: {
        'classic': {
            name: '经典蓝',
            description: '优雅深邃的标准蓝色主题',
            class: 'blue-theme-classic'
        },
        'deep-sea': {
            name: '深海蓝',
            description: '神秘深邃的深色蓝调',
            class: 'blue-theme-deep-sea'
        },
        'neon': {
            name: '霓虹蓝',
            description: '明亮炫目的霓虹蓝调',
            class: 'blue-theme-neon'
        }
    },
    
    // 当前主题状态
    currentState: {
        enabled: false,
        variant: 'classic',
        previousTheme: '',
        crystalNodesEnabled: false
    },
    
    // 主题元素选择器
    selectors: {
        body: 'body',
        nodes: '.mind-map .node',
        rootNode: '.mind-map .root-node',
        connections: '#connectionsContainer path',
        randomNodes: [] // 将存储随机选择的节点
    }
};

/**
 * 初始化蓝色主题系统
 */
function initBlueTheme() {
    console.log('正在初始化蓝色主题系统...');
    
    // 加载用户主题偏好
    loadThemePreference();
    
    // 为特定节点添加水晶效果的计时器
    setInterval(updateRandomCrystalNodes, 10000); // 每10秒更新一次
    
    console.log('蓝色主题系统初始化完成');
}

/**
 * 切换蓝色主题
 */
function toggleBlueTheme() {
    const body = document.querySelector(blueThemeConfig.selectors.body);
    
    if (!blueThemeConfig.currentState.enabled) {
        // 启用蓝色主题
        
        // 保存当前的主题类名
        blueThemeConfig.currentState.previousTheme = Array.from(body.classList)
            .filter(cls => !cls.includes('theme'))
            .join(' ');
        
        // 移除所有现有主题类
        body.className = body.className
            .replace(/blue-theme\S*/g, '')
            .replace(/rainbow-theme\S*/g, '')
            .replace(/deepsea-theme\S*/g, '')
            .replace(/sci-fi-theme\S*/g, '')
            .replace(/sci-fi-theme-only/g, '')
            .trim();
        
        // 应用当前选择的变体
        const variant = blueThemeConfig.variants[blueThemeConfig.currentState.variant];
        body.className += ' ' + variant.class;
        
        // 添加水晶效果到随机节点
        if (blueThemeConfig.currentState.crystalNodesEnabled) {
            updateRandomCrystalNodes();
        }
        
        // 更新连接线颜色和属性
        updateConnectionsForBlueTheme();
        
        // 添加根节点动画效果
        addRootNodeEffects();
        
        // 为一级节点添加特殊效果
        addPrimaryNodesEffects();
        
        // 设置状态为已启用
        blueThemeConfig.currentState.enabled = true;
        
        // 显示通知
        showThemeNotification(`已启用 ${variant.name} 主题`);
    } else {
        // 禁用蓝色主题
        
        // 移除所有蓝色主题相关类
        body.className = body.className.replace(/blue-theme\S*/g, '').trim();
        
        // 还原之前的主题
        if (blueThemeConfig.currentState.previousTheme) {
            body.className += ' ' + blueThemeConfig.currentState.previousTheme;
        }
        
        // 移除水晶效果
        document.querySelectorAll('.crystal-node').forEach(node => {
            node.classList.remove('crystal-node');
        });
        
        // 恢复连接线默认样式
        restoreDefaultConnections();
        
        // 移除根节点特殊效果
        removeRootNodeEffects();
        
        // 设置状态为已禁用
        blueThemeConfig.currentState.enabled = false;
        
        // 显示通知
        showThemeNotification('已恢复默认主题');
    }
    
    // 保存主题偏好
    saveThemePreference();
}

/**
 * 显示主题变体选项
 */
function showThemeOptions() {
    // 创建一个临时的悬浮菜单
    const menuContainer = document.createElement('div');
    menuContainer.className = 'theme-options-menu';
    menuContainer.style.position = 'fixed';
    menuContainer.style.zIndex = '9999';
    menuContainer.style.top = '50%';
    menuContainer.style.left = '50%';
    menuContainer.style.transform = 'translate(-50%, -50%)';
    menuContainer.style.background = 'rgba(0, 24, 69, 0.95)';
    menuContainer.style.padding = '20px';
    menuContainer.style.borderRadius = '12px';
    menuContainer.style.boxShadow = '0 12px 32px rgba(0, 18, 51, 0.6), 0 0 20px rgba(72, 202, 228, 0.4)';
    menuContainer.style.backdropFilter = 'blur(20px)';
    menuContainer.style.border = '1px solid rgba(144, 224, 239, 0.3)';
    
    // 添加标题
    const title = document.createElement('h3');
    title.textContent = '选择蓝色主题变体';
    title.style.color = '#fff';
    title.style.textAlign = 'center';
    title.style.marginTop = '0';
    title.style.marginBottom = '15px';
    title.style.textShadow = '0 0 10px rgba(72, 202, 228, 0.8)';
    menuContainer.appendChild(title);
    
    // 添加各主题变体选项
    Object.keys(blueThemeConfig.variants).forEach(key => {
        const variant = blueThemeConfig.variants[key];
        
        const option = document.createElement('div');
        option.className = 'theme-option';
        option.dataset.variant = key;
        option.style.padding = '10px 15px';
        option.style.margin = '8px 0';
        option.style.borderRadius = '8px';
        option.style.cursor = 'pointer';
        option.style.transition = 'all 0.3s ease';
        option.style.borderLeft = '3px solid transparent';
        
        // 高亮当前选中的变体
        if (key === blueThemeConfig.currentState.variant) {
            option.style.background = 'rgba(72, 202, 228, 0.2)';
            option.style.borderLeft = '3px solid rgba(72, 202, 228, 0.8)';
        }
        
        // 悬停效果
        option.onmouseover = function() {
            if (key !== blueThemeConfig.currentState.variant) {
                this.style.background = 'rgba(51, 161, 253, 0.1)';
                this.style.borderLeft = '3px solid rgba(51, 161, 253, 0.5)';
            }
        };
        option.onmouseout = function() {
            if (key !== blueThemeConfig.currentState.variant) {
                this.style.background = 'transparent';
                this.style.borderLeft = '3px solid transparent';
            }
        };
        
        // 变体名称
        const name = document.createElement('div');
        name.textContent = variant.name;
        name.style.color = '#fff';
        name.style.fontWeight = 'bold';
        name.style.marginBottom = '3px';
        
        // 变体描述
        const desc = document.createElement('div');
        desc.textContent = variant.description;
        desc.style.color = 'rgba(255, 255, 255, 0.7)';
        desc.style.fontSize = '0.85em';
        
        option.appendChild(name);
        option.appendChild(desc);
        
        // 点击事件
        option.onclick = function() {
            const variantName = this.dataset.variant;
            selectThemeVariant(variantName);
            
            // 隐藏菜单
            document.body.removeChild(menuContainer);
            document.body.removeChild(overlay);
        };
        
        menuContainer.appendChild(option);
    });
    
    // 添加水晶节点效果选项
    const crystalOption = document.createElement('div');
    crystalOption.className = 'theme-option crystal-option';
    crystalOption.style.padding = '10px 15px';
    crystalOption.style.margin = '15px 0 8px 0';
    crystalOption.style.borderRadius = '8px';
    crystalOption.style.cursor = 'pointer';
    crystalOption.style.transition = 'all 0.3s ease';
    crystalOption.style.borderLeft = '3px solid transparent';
    crystalOption.style.borderTop = '1px solid rgba(144, 224, 239, 0.2)';
    crystalOption.style.paddingTop = '15px';
    
    // 水晶选项容器
    const crystalContainer = document.createElement('div');
    crystalContainer.style.display = 'flex';
    crystalContainer.style.alignItems = 'center';
    crystalContainer.style.justifyContent = 'space-between';
    
    // 水晶选项标题
    const crystalTitle = document.createElement('div');
    crystalTitle.textContent = '水晶节点效果';
    crystalTitle.style.color = '#fff';
    crystalTitle.style.fontWeight = 'bold';
    
    // 水晶开关
    const crystalToggle = document.createElement('div');
    crystalToggle.className = 'crystal-toggle';
    crystalToggle.style.width = '40px';
    crystalToggle.style.height = '20px';
    crystalToggle.style.background = blueThemeConfig.currentState.crystalNodesEnabled ? 
        'rgba(72, 202, 228, 0.8)' : 'rgba(100, 100, 100, 0.3)';
    crystalToggle.style.borderRadius = '10px';
    crystalToggle.style.position = 'relative';
    crystalToggle.style.transition = 'all 0.3s ease';
    
    const toggleKnob = document.createElement('div');
    toggleKnob.style.width = '16px';
    toggleKnob.style.height = '16px';
    toggleKnob.style.background = '#fff';
    toggleKnob.style.borderRadius = '50%';
    toggleKnob.style.position = 'absolute';
    toggleKnob.style.top = '2px';
    toggleKnob.style.left = blueThemeConfig.currentState.crystalNodesEnabled ? '22px' : '2px';
    toggleKnob.style.transition = 'all 0.3s ease';
    
    crystalToggle.appendChild(toggleKnob);
    
    // 点击事件
    crystalToggle.onclick = function(e) {
        e.stopPropagation();
        blueThemeConfig.currentState.crystalNodesEnabled = !blueThemeConfig.currentState.crystalNodesEnabled;
        
        this.style.background = blueThemeConfig.currentState.crystalNodesEnabled ? 
            'rgba(72, 202, 228, 0.8)' : 'rgba(100, 100, 100, 0.3)';
        toggleKnob.style.left = blueThemeConfig.currentState.crystalNodesEnabled ? '22px' : '2px';
        
        // 更新水晶节点
        if (blueThemeConfig.currentState.enabled) {
            if (blueThemeConfig.currentState.crystalNodesEnabled) {
                updateRandomCrystalNodes();
            } else {
                // 移除水晶效果
                document.querySelectorAll('.crystal-node').forEach(node => {
                    node.classList.remove('crystal-node');
                });
            }
        }
        
        // 保存偏好
        saveThemePreference();
    };
    
    crystalContainer.appendChild(crystalTitle);
    crystalContainer.appendChild(crystalToggle);
    crystalOption.appendChild(crystalContainer);
    
    menuContainer.appendChild(crystalOption);
    
    // 关闭按钮
    const closeBtn = document.createElement('div');
    closeBtn.textContent = '关闭';
    closeBtn.style.textAlign = 'center';
    closeBtn.style.padding = '8px';
    closeBtn.style.marginTop = '15px';
    closeBtn.style.borderRadius = '8px';
    closeBtn.style.background = 'rgba(72, 202, 228, 0.2)';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.color = '#fff';
    closeBtn.style.transition = 'all 0.3s ease';
    
    closeBtn.onmouseover = function() {
        this.style.background = 'rgba(72, 202, 228, 0.3)';
    };
    closeBtn.onmouseout = function() {
        this.style.background = 'rgba(72, 202, 228, 0.2)';
    };
    
    closeBtn.onclick = function() {
        document.body.removeChild(menuContainer);
        document.body.removeChild(overlay);
    };
    
    menuContainer.appendChild(closeBtn);
    
    // 添加半透明遮罩
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '9998';
    overlay.style.backdropFilter = 'blur(5px)';
    
    // 点击遮罩关闭菜单
    overlay.onclick = function() {
        document.body.removeChild(menuContainer);
        document.body.removeChild(overlay);
    };
    
    document.body.appendChild(overlay);
    document.body.appendChild(menuContainer);
}

/**
 * 选择主题变体
 * @param {string} variantName - 变体名称
 */
function selectThemeVariant(variantName) {
    if (!blueThemeConfig.variants[variantName]) {
        console.error(`未知的主题变体: ${variantName}`);
        return;
    }
    
    // 保存当前变体选择
    blueThemeConfig.currentState.variant = variantName;
    
    // 如果主题已启用，重新应用
    if (blueThemeConfig.currentState.enabled) {
        const body = document.querySelector(blueThemeConfig.selectors.body);
        
        // 移除所有蓝色主题变体类
        body.className = body.className
            .replace(/blue-theme-\S*/g, '')
            .trim();
        
        // 应用所选变体
        body.classList.add(blueThemeConfig.variants[variantName].class);
        
        // 更新连接线
        updateConnectionsForBlueTheme();
        
        // 显示通知
        showThemeNotification(`已切换到 ${blueThemeConfig.variants[variantName].name} 主题`);
    }
    
    // 保存主题偏好
    saveThemePreference();
}

/**
 * 更新连接线样式以适应蓝色主题
 */
function updateConnectionsForBlueTheme() {
    // 获取所有连接线
    const connections = document.querySelectorAll(blueThemeConfig.selectors.connections);
    
    // 根据当前变体应用不同样式
    const variant = blueThemeConfig.currentState.variant;
    
    connections.forEach(conn => {
        // 应用基本样式
        conn.style.transition = 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
        
        // 根据变体应用不同样式
        switch (variant) {
            case 'classic':
                // 明亮的皇家蓝色实线
                conn.setAttribute('stroke', '#0055FF');
                conn.setAttribute('stroke-dasharray', '');
                conn.setAttribute('stroke-width', '2.5');
                conn.setAttribute('filter', 'drop-shadow(0 0 6px rgba(0, 85, 255, 0.7))');
                break;
                
            case 'deep-sea':
                // 深邃的海洋蓝渐变点状线
                // 创建或获取SVG defs元素
                let svg = conn.closest('svg');
                let defs = svg.querySelector('defs');
                if (!defs) {
                    defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
                    svg.insertBefore(defs, svg.firstChild);
                }
                
                // 创建深海蓝渐变
                let deepSeaGradient = document.getElementById('deepSeaGradient');
                if (!deepSeaGradient) {
                    deepSeaGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
                    deepSeaGradient.setAttribute("id", "deepSeaGradient");
                    deepSeaGradient.setAttribute("x1", "0%");
                    deepSeaGradient.setAttribute("y1", "0%");
                    deepSeaGradient.setAttribute("x2", "100%");
                    deepSeaGradient.setAttribute("y2", "0%");
                    
                    // 添加渐变色标
                    const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                    stop1.setAttribute("offset", "0%");
                    stop1.setAttribute("stop-color", "#001E3C");
                    
                    const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                    stop2.setAttribute("offset", "50%");
                    stop2.setAttribute("stop-color", "#0077B6");
                    
                    const stop3 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                    stop3.setAttribute("offset", "100%");
                    stop3.setAttribute("stop-color", "#001E3C");
                    
                    deepSeaGradient.appendChild(stop1);
                    deepSeaGradient.appendChild(stop2);
                    deepSeaGradient.appendChild(stop3);
                    
                    defs.appendChild(deepSeaGradient);
                }
                
                // 应用深海蓝点状线样式
                conn.setAttribute('stroke', 'url(#deepSeaGradient)');
                conn.setAttribute('stroke-dasharray', '1, 3');
                conn.setAttribute('stroke-width', '3');
                conn.setAttribute('filter', 'drop-shadow(0 0 5px rgba(0, 119, 182, 0.8))');
                conn.setAttribute('stroke-linecap', 'round');
                break;
                
            case 'neon':
                // 明亮的霓虹青色
                conn.setAttribute('stroke', '#00FFEA');
                conn.setAttribute('stroke-dasharray', '5,2');
                conn.setAttribute('stroke-width', '2');
                conn.setAttribute('filter', 'drop-shadow(0 0 12px rgba(0, 255, 234, 0.9))');
                break;
        }
    });
}

/**
 * 恢复连接线默认样式
 */
function restoreDefaultConnections() {
    const connections = document.querySelectorAll(blueThemeConfig.selectors.connections);
    
    connections.forEach(conn => {
        conn.removeAttribute('style');
        conn.setAttribute('stroke', '');
        conn.setAttribute('filter', '');
        conn.setAttribute('stroke-dasharray', '');
    });
}

/**
 * 为根节点添加特殊效果
 */
function addRootNodeEffects() {
    const rootNode = document.querySelector(blueThemeConfig.selectors.rootNode);
    if (!rootNode) return;
    
    // 根节点浮动效果
    rootNode.style.transition = 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
    rootNode.style.animation = 'float 3s ease-in-out infinite';
    
    // 根据当前变体应用不同特效
    const variant = blueThemeConfig.currentState.variant;
    
    switch (variant) {
        case 'neon':
            // 霓虹效果
            rootNode.style.textShadow = '0 0 10px rgba(0, 255, 255, 0.9), 0 0 20px rgba(0, 255, 255, 0.5)';
            rootNode.style.boxShadow = '0 15px 35px rgba(0, 18, 51, 0.4), 0 0 30px rgba(0, 255, 255, 0.4), inset 0 0 15px rgba(0, 255, 255, 0.2)';
            break;
            
        case 'deep-sea':
            // 深海效果
            rootNode.style.textShadow = '0 0 15px rgba(3, 83, 164, 0.8)';
            rootNode.style.boxShadow = '0 15px 35px rgba(0, 18, 51, 0.5), 0 0 25px rgba(3, 83, 164, 0.3), inset 0 0 15px rgba(3, 83, 164, 0.1)';
            break;
            
        default:
            // 经典效果
            rootNode.style.textShadow = '0 0 15px rgba(72, 202, 228, 0.8)';
            rootNode.style.boxShadow = '0 15px 35px rgba(0, 18, 51, 0.4), 0 0 25px rgba(51, 161, 253, 0.3), inset 0 0 15px rgba(72, 202, 228, 0.1)';
    }
}

/**
 * 移除根节点特殊效果
 */
function removeRootNodeEffects() {
    const rootNode = document.querySelector(blueThemeConfig.selectors.rootNode);
    if (!rootNode) return;
    
    rootNode.style.animation = '';
    rootNode.style.textShadow = '';
    rootNode.style.boxShadow = '';
    rootNode.style.transition = '';
}

/**
 * 为一级节点添加特殊效果
 */
function addPrimaryNodesEffects() {
    // 获取所有一级节点
    const primaryNodes = document.querySelectorAll('.level-1 > .node > .node-content');
    if (!primaryNodes || primaryNodes.length === 0) return;
    
    // 为每个一级节点添加特效
    primaryNodes.forEach((node, index) => {
        // 设置延迟，使动画错开
        const delay = index * 0.2;
        
        // 添加轻微的浮动效果
        node.style.animation = `float 4s ease-in-out ${delay}s infinite`;
        
        // 根据当前变体应用不同特效
        const variant = blueThemeConfig.currentState.variant;
        
        switch (variant) {
            case 'neon':
                node.style.textShadow = '0 0 8px rgba(0, 255, 255, 0.8), 0 0 16px rgba(0, 255, 255, 0.4)';
                break;
                
            case 'deep-sea':
                node.style.textShadow = '0 0 8px rgba(3, 83, 164, 0.7)';
                break;
                
            default:
                node.style.textShadow = '0 0 8px rgba(72, 202, 228, 0.7)';
        }
    });
}

/**
 * 更新随机节点的水晶效果
 */
function updateRandomCrystalNodes() {
    if (!blueThemeConfig.currentState.enabled || 
        !blueThemeConfig.currentState.crystalNodesEnabled) {
        return;
    }
    
    // 移除现有的水晶效果
    document.querySelectorAll('.crystal-node').forEach(node => {
        node.classList.remove('crystal-node');
    });
    
    // 获取所有节点
    const allNodes = document.querySelectorAll('.node-content');
    if (!allNodes || allNodes.length === 0) return;
    
    // 计算要添加效果的节点数量 (约15%的节点)
    const count = Math.max(1, Math.floor(allNodes.length * 0.15));
    
    // 随机选择节点
    const selectedIndices = [];
    while (selectedIndices.length < count) {
        const randomIndex = Math.floor(Math.random() * allNodes.length);
        if (!selectedIndices.includes(randomIndex)) {
            selectedIndices.push(randomIndex);
        }
    }
    
    // 应用水晶效果
    selectedIndices.forEach(index => {
        allNodes[index].classList.add('crystal-node');
    });
}

/**
 * 显示主题切换通知
 * @param {string} message - 通知消息
 */
function showThemeNotification(message) {
    // 检查是否已存在通知
    let notification = document.querySelector('.theme-notification');
    
    if (!notification) {
        // 创建新通知
        notification = document.createElement('div');
        notification.className = 'theme-notification';
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.padding = '10px 20px';
        notification.style.background = 'rgba(0, 24, 69, 0.9)';
        notification.style.color = '#fff';
        notification.style.borderRadius = '8px';
        notification.style.boxShadow = '0 8px 20px rgba(0, 18, 51, 0.5), 0 0 15px rgba(72, 202, 228, 0.3)';
        notification.style.zIndex = '9999';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';
        notification.style.backdropFilter = 'blur(10px)';
        notification.style.border = '1px solid rgba(72, 202, 228, 0.3)';
        
        document.body.appendChild(notification);
        
        // 淡入效果
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
    }
    
    // 更新消息
    notification.textContent = message;
    
    // 自动隐藏
    setTimeout(() => {
        notification.style.opacity = '0';
        
        // 移除元素
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 2000);
}

/**
 * 保存主题偏好到本地存储
 */
function saveThemePreference() {
    try {
        const themePrefs = {
            enabled: blueThemeConfig.currentState.enabled,
            variant: blueThemeConfig.currentState.variant,
            crystalNodesEnabled: blueThemeConfig.currentState.crystalNodesEnabled
        };
        
        localStorage.setItem('blueThemePrefs', JSON.stringify(themePrefs));
    } catch (e) {
        console.error('保存主题偏好失败:', e);
    }
}

/**
 * 加载用户主题偏好
 */
function loadThemePreference() {
    console.log('加载主题偏好设置...');
    
    try {
        // 检查是否已经设置了彩虹主题
        const mindMapTheme = localStorage.getItem('mindMapTheme');
        if (mindMapTheme === 'rainbow') {
            console.log('检测到彩虹主题设置，不应用蓝色主题');
            blueThemeConfig.currentState.enabled = false;
            return; // 如果已经设置了彩虹主题，则不应用蓝色主题
        }
        
        // 尝试从本地存储加载主题偏好
        const savedPrefs = localStorage.getItem('blueThemePrefs');
        if (savedPrefs) {
            const prefs = JSON.parse(savedPrefs);
            
            // 更新当前状态
            blueThemeConfig.currentState.enabled = prefs.enabled || false;
            blueThemeConfig.currentState.variant = prefs.variant || 'classic';
            blueThemeConfig.currentState.crystalNodesEnabled = prefs.crystalNodesEnabled || false;
            
            console.log('已加载主题偏好:', blueThemeConfig.currentState);
            
            // 如果启用了蓝色主题，则应用它
            if (blueThemeConfig.currentState.enabled) {
                const body = document.querySelector(blueThemeConfig.selectors.body);
                
                // 移除现有的蓝色主题类
                body.className = body.className
                    .replace(/blue-theme-\S*/g, '')
                    .trim();
                
                // 应用当前选择的变体
                const variant = blueThemeConfig.variants[blueThemeConfig.currentState.variant];
                body.className += ' ' + variant.class;
                
                // 更新连接线
                updateConnectionsForBlueTheme();
                
                // 添加根节点效果
                addRootNodeEffects();
                
                // 添加一级节点效果
                addPrimaryNodesEffects();
                
                // 如果启用了水晶效果，则应用它
                if (blueThemeConfig.currentState.crystalNodesEnabled) {
                    updateRandomCrystalNodes();
                }
            }
        } else {
            console.log('未找到保存的主题偏好，使用默认设置');
        }
    } catch (error) {
        console.error('加载主题偏好时出错:', error);
    }
}

// 在页面加载完成后初始化蓝色主题
document.addEventListener('DOMContentLoaded', function() {
    // 延迟初始化，确保其他脚本已加载完成
    setTimeout(initBlueTheme, 500);
});
