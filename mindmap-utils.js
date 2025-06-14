// 工具函数、布局算法和数据管理功能
(function() {
    // 获取主类的引用
    const MindMapProto = MindMap.prototype;
    
    // 自动布局所有节点
    MindMapProto.autoArrangeNodes = function() {
        if (!this.nodes.length) return;
        
        // 找到根节点
        const rootNode = this.nodes.find(node => node.element.classList.contains('root'));
        if (!rootNode) return;
        
        // 设置根节点位置到中心
        rootNode.x = this.container.clientWidth / 2;
        rootNode.y = this.container.clientHeight / 2;
        rootNode.element.style.left = `${rootNode.x}px`;
        rootNode.element.style.top = `${rootNode.y}px`;
        
        // 递归布局节点
        const layoutNode = (node, level = 0, angle = 0, parentAngle = 0) => {
            if (!node.children || node.children.length === 0) return;
            
            const childCount = node.children.length;
            let startAngle, endAngle;
            
            if (level === 0) {
                // 根节点的子节点围绕一圈分布
                startAngle = 0;
                endAngle = 2 * Math.PI;
            } else {
                // 非根节点的子节点在父节点方向的扇区内分布
                const sectorAngle = Math.PI / 2; // 90度扇区
                startAngle = parentAngle - sectorAngle / 2;
                endAngle = parentAngle + sectorAngle / 2;
            }
            
            // 计算每个子节点的角度和距离
            const angleStep = (endAngle - startAngle) / childCount;
            let distance = 200 * (level + 1);
            
            node.children.forEach((child, index) => {
                const childAngle = startAngle + angleStep * (index + 0.5);
                
                // 为根节点的子节点调整距离，确保右侧节点连线长度一致
                if (level === 0) {
                    // 计算水平因子（接近水平方向的程度）
                    const horizontalFactor = Math.abs(Math.cos(childAngle));
                    
                    // 根据角度调整距离
                    if (horizontalFactor > 0.85) {
                        // 水平方向（右侧和左侧）需要更大的距离
                        distance = 380;
                    } else if (horizontalFactor > 0.5) {
                        // 斜向方向需要中等距离
                        distance = 330;
                    } else {
                        // 垂直方向使用基础距离
                        distance = 250;
                    }
                    
                    // 特别处理右侧区域的节点
                    const isRightSide = Math.abs(childAngle) < Math.PI * 0.15 || Math.abs(childAngle - 2 * Math.PI) < Math.PI * 0.15;
                    if (isRightSide) {
                        distance += 30; // 额外增加右侧节点的距离
                    }
                }
                
                child.x = node.x + Math.cos(childAngle) * distance;
                child.y = node.y + Math.sin(childAngle) * distance;
                
                // 应用位置
                child.element.style.left = `${child.x}px`;
                child.element.style.top = `${child.y}px`;
                
                // 递归布局子节点
                layoutNode(child, level + 1, childAngle, childAngle);
            });
        };
        
        // 开始布局
        layoutNode(rootNode);
        
        // 更新连接线
        this.updateConnectionsRAF();
        
        // 保存所有节点位置
        this.saveAllNodePositions();
        
        // 显示提示
        this.showTooltip('节点已自动布局', this.container.clientWidth / 2, 60);
    };
    
    // 导出思维导图为图片
    MindMapProto.exportToImage = async function() {
        try {
            // 显示加载中提示
            this.showTooltip('正在生成图片，请稍候...', this.container.clientWidth / 2, 60, 6000);
            
            // 创建临时容器，用于生成图像
            const tempContainer = document.createElement('div');
            tempContainer.className = 'mind-map-container';
            const tempMindMap = document.createElement('div');
            tempMindMap.className = 'mind-map';
            tempContainer.appendChild(tempMindMap);
            
            // 设置临时容器样式
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-9999px';
            tempContainer.style.top = '-9999px';
            document.body.appendChild(tempContainer);
            
            // 计算思维导图的边界框
            const bounds = this.calculateBounds();
            const padding = 100; // 添加边距
            
            // 设置临时容器的尺寸
            tempContainer.style.width = `${(bounds.width + padding * 2) * this.exportScale}px`;
            tempContainer.style.height = `${(bounds.height + padding * 2) * this.exportScale}px`;
            
            // 复制节点和连接线到临时容器
            for (const node of this.nodes) {
                // 跳过隐藏的节点
                if (node.element.style.display === 'none') continue;
                
                const clonedNode = node.element.cloneNode(true);
                clonedNode.style.position = 'absolute';
                clonedNode.style.left = `${(node.x - bounds.minX + padding) * this.exportScale}px`;
                clonedNode.style.top = `${(node.y - bounds.minY + padding) * this.exportScale}px`;
                clonedNode.style.transform = `scale(${this.exportScale})`;
                clonedNode.style.transformOrigin = 'left top';
                
                // 添加节点阴影和样式增强
                clonedNode.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
                
                tempMindMap.appendChild(clonedNode);
            }
            
            // 复制连接线
            const connectors = document.querySelectorAll('.connector');
            for (const connector of connectors) {
                // 跳过隐藏的连接线
                if (connector.style.display === 'none') continue;
                
                const parentId = connector.getAttribute('data-parent');
                const childId = connector.getAttribute('data-child');
                
                const parent = this.findNodeById(parentId);
                const child = this.findNodeById(childId);
                
                if (parent && child) {
                    const clonedConnector = connector.cloneNode(true);
                    tempMindMap.appendChild(clonedConnector);
                    
                    // 重新计算连接线位置
                    const parentRect = parent.element.getBoundingClientRect();
                    const childRect = child.element.getBoundingClientRect();
                    
                    // 获取父节点和子节点的中心坐标(相对于边界框)
                    const parentX = parent.x - bounds.minX + padding;
                    const parentY = parent.y - bounds.minY + padding;
                    const childX = child.x - bounds.minX + padding;
                    const childY = child.y - bounds.minY + padding;
                    
                    // 计算连接线起点和终点
                    let startX, startY, endX, endY;
                    if (Math.abs(childX - parentX) > Math.abs(childY - parentY)) {
                        if (childX > parentX) {
                            startX = parentX + parentRect.width / this.scale;
                            startY = parentY + parentRect.height / (2 * this.scale);
                            endX = childX;
                            endY = childY + childRect.height / (2 * this.scale);
                        } else {
                            startX = parentX;
                            startY = parentY + parentRect.height / (2 * this.scale);
                            endX = childX + childRect.width / this.scale;
                            endY = childY + childRect.height / (2 * this.scale);
                        }
                    } else {
                        if (childY > parentY) {
                            startX = parentX + parentRect.width / (2 * this.scale);
                            startY = parentY + parentRect.height / this.scale;
                            endX = childX + childRect.width / (2 * this.scale);
                            endY = childY;
                        } else {
                            startX = parentX + parentRect.width / (2 * this.scale);
                            startY = parentY;
                            endX = childX + childRect.width / (2 * this.scale);
                            endY = childY + childRect.height / this.scale;
                        }
                    }
                    
                    // 应用缩放
                    startX *= this.exportScale;
                    startY *= this.exportScale;
                    endX *= this.exportScale;
                    endY *= this.exportScale;
                    
                    // 计算连接线长度和角度
                    const dx = endX - startX;
                    const dy = endY - startY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const angle = Math.atan2(dy, dx);
                    
                    // 设置连接线样式
                    clonedConnector.style.width = `${distance}px`;
                    clonedConnector.style.left = `${startX}px`;
                    clonedConnector.style.top = `${startY}px`;
                    clonedConnector.style.transform = `rotate(${angle}rad)`;
                    clonedConnector.style.height = '2.5px';
                }
            }
            
            // 使用html2canvas捕获图像
            await new Promise(resolve => setTimeout(resolve, 500)); // 等待渲染
            const html2canvas = window.html2canvas;
            if (!html2canvas) {
                throw new Error('html2canvas库未加载');
            }
            
            const canvas = await html2canvas(tempContainer, {
                backgroundColor: document.body.classList.contains('dark-mode') ? '#121212' : '#f5f5f5',
                scale: 1,
                useCORS: true,
                allowTaint: true,
            });
            
            // 创建下载链接
            const link = document.createElement('a');
            link.download = `MindMap-${new Date().toISOString().slice(0, 10)}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            // 清理
            document.body.removeChild(tempContainer);
            
            this.showTooltip('图片导出成功！', this.container.clientWidth / 2, 60);
        } catch (error) {
            console.error('导出失败:', error);
            this.showTooltip('导出失败，请确保已加载html2canvas库', this.container.clientWidth / 2, 60);
        }
    };
    
    // 计算思维导图的边界框
    MindMapProto.calculateBounds = function() {
        if (!this.nodes.length) {
            return { minX: 0, minY: 0, maxX: 800, maxY: 600, width: 800, height: 600 };
        }
        
        // 初始化边界值
        let minX = Number.MAX_VALUE;
        let minY = Number.MAX_VALUE;
        let maxX = Number.MIN_VALUE;
        let maxY = Number.MIN_VALUE;
        
        // 计算所有节点的边界，包括可见和不可见节点
        for (const node of this.nodes) {
            // 不再跳过任何节点，即使它可能被标记为不可见
            // 获取节点尺寸
            const rect = node.element.getBoundingClientRect();
            const width = rect.width / this.scale;
            const height = rect.height / this.scale;
            
            minX = Math.min(minX, node.x);
            minY = Math.min(minY, node.y);
            maxX = Math.max(maxX, node.x + width);
            maxY = Math.max(maxY, node.y + height);
        }
        
        // 如果没有节点，提供默认值
        if (minX === Number.MAX_VALUE) {
            return { minX: 0, minY: 0, maxX: 800, maxY: 600, width: 800, height: 600 };
        }
        
        return {
            minX,
            minY,
            maxX,
            maxY,
            width: maxX - minX,
            height: maxY - minY
        };
    };

    // 为MindMap类添加一个加载数据的方法
    MindMapProto.loadData = function(data) {
        try {
            console.log('正在加载思维导图数据...');
            
            // 首先清除现有节点
            // 使用一个副本防止在遍历过程中修改数组
            const nodesToRemove = [...this.nodes];
            for (const node of nodesToRemove) {
                if (node.parent) {
                    this.deleteNode(node);
                } else {
                    // 保留根节点但清除其子节点
                    node.children = [];
                    const childElements = node.element.querySelectorAll('.children');
                    childElements.forEach(el => {
                        if (el.parentNode) el.parentNode.removeChild(el);
                    });
                }
            }
            
            // 清除所有连接器
            const connectors = document.querySelectorAll('.connector');
            connectors.forEach(connector => {
                if (connector.parentNode) connector.parentNode.removeChild(connector);
            });
            
            // 恢复缩放和平移状态
            if (typeof data.scale === 'number') this.scale = data.scale;
            if (typeof data.centerX === 'number') this.translateX = -data.centerX * this.scale + this.container.clientWidth / 2;
            if (typeof data.centerY === 'number') this.translateY = -data.centerY * this.scale + this.container.clientHeight / 2;
            
            // 应用缩放和平移
            this.container.style.transform = `scale(${this.scale}) translate(${this.translateX / this.scale}px, ${this.translateY / this.scale}px)`;
            
            // 检查数据中的节点
            if (Array.isArray(data.nodes) && data.nodes.length > 0) {
                // 首先创建一个节点ID映射，以便我们可以重建父子关系
                const nodeMap = {};
                
                // 找到根节点
                const rootNodeData = data.nodes.find(n => !n.parentId) || data.nodes[0];
                let rootNode;
                
                // 完全清除所有节点，确保DOM干净
                this.nodes = [];
                
                // 创建新的根节点
                rootNode = this.createNode(rootNodeData.text || '主题', null, rootNodeData.x, rootNodeData.y);
                rootNode.element.classList.add('root');
                rootNode.colorIndex = 'root';
                this.nodes.push(rootNode);
                
                // 设置根节点ID与保存的数据一致，确保引用关系正确
                rootNode.id = rootNodeData.id;
                rootNode.element.setAttribute('data-id', rootNode.id);
                
                // 将根节点添加到映射中
                nodeMap[rootNodeData.id] = rootNode;
                
                // 创建非根节点
                // 首先按父子关系排序，确保父节点先创建
                const sortedNodes = [...data.nodes];
                sortedNodes.sort((a, b) => {
                    if (!a.parentId) return -1;
                    if (!b.parentId) return 1;
                    return 0;
                });
                
                // 第一遍创建所有节点
                for (const nodeData of sortedNodes) {
                    // 跳过根节点，我们已经处理过它了
                    if (!nodeData.parentId || nodeData.id === rootNodeData.id) continue;
                    
                    // 如果父节点已经在映射中，创建子节点
                    if (nodeMap[nodeData.parentId]) {
                        const parent = nodeMap[nodeData.parentId];
                        
                        // 创建子节点但不使用addChildNode方法，我们需要更多控制
                        const node = this.createCustomNode(
                            nodeData.text || '新节点',
                            parent,
                            nodeData.x || (parent.x + 150), // 默认位置如果未指定
                            nodeData.y || parent.y
                        );
                        
                        // 设置节点ID与保存的数据一致
                        node.id = nodeData.id;
                        node.element.setAttribute('data-id', node.id);
                        
                        // 建立父子关系
                        parent.children.push(node);
                        
                        // 设置颜色索引
                        if (nodeData.colorIndex) {
                            node.colorIndex = nodeData.colorIndex;
                            node.element.setAttribute('data-color-index', node.colorIndex);
                        }
                        
                        // 设置折叠状态
                        if (nodeData.collapsed) {
                            node.isCollapsed = true;
                        }
                        
                        // 添加到全局节点列表
                        this.nodes.push(node);
                        
                        // 添加到映射中
                        nodeMap[nodeData.id] = node;
                    }
                }
                
                // 第二遍，创建所有连接线
                // 这样能确保所有节点都已创建，且父子关系正确
                for (const node of this.nodes) {
                    if (node.parent) {
                        // 为每个有父节点的节点创建连接线
                        this.createConnector(node.parent, node);
                    }
                }
                
                // 第三遍，处理折叠状态
                for (const node of this.nodes) {
                    if (node.isCollapsed) {
                        this.toggleNodeChildren(node);
                    }
                }
                
                // 重新绑定拖动事件
                this.rebindDragEvents();
                
                // 更新所有连接器
                this.updateAllConnectors();
                
                console.log('思维导图数据加载成功! 已恢复 ' + this.nodes.length + ' 个节点');
            }
            
            // 触发窗口大小调整事件，以确保正确显示
            window.dispatchEvent(new Event('resize'));
            
            return true;
        } catch (error) {
            console.error('加载思维导图数据失败:', error);
            alert('加载失败: ' + error.message);
            return false;
        }
    };

    // 获取思维导图的数据
    MindMapProto.getData = function() {
        const data = {
            nodes: [],
            scale: this.scale,
            centerX: 0,
            centerY: 0,
            darkMode: document.body.classList.contains('dark-mode')
        };
        
        // 计算思维导图中心点
        const mapCenter = this.calculateMapCenter();
        data.centerX = mapCenter.x;
        data.centerY = mapCenter.y;
        
        // 收集所有节点的数据
        for (const node of this.nodes) {
            const nodeData = {
                id: node.id,
                text: node.text,
                x: node.x,
                y: node.y,
                parentId: node.parent ? node.parent.id : null,
                colorIndex: node.colorIndex,
                collapsed: node.isCollapsed
            };
            data.nodes.push(nodeData);
        }
        
        return data;
    };

    // 计算思维导图的中心点
    MindMapProto.calculateMapCenter = function() {
        const bounds = this.calculateBounds();
        return {
            x: bounds.minX + bounds.width / 2,
            y: bounds.minY + bounds.height / 2
        };
    };
})();

// 在页面加载时初始化主题
document.addEventListener('DOMContentLoaded', function() {
    // 初始化主题
    initTheme();
    
    // 其他初始化代码...
});

// 初始化主题
function initTheme() {
    // 获取保存的主题设置
    const savedTheme = localStorage.getItem('mindMapTheme') || 'rainbow';
    
    // 移除所有主题相关类
    document.body.classList.remove('rainbow-theme', 'blue-theme', 'deep-sea', 'neon');
    
    // 应用保存的主题
    switch(savedTheme) {
        case 'rainbow':
            document.body.classList.add('rainbow-theme');
            break;
        case 'blue':
            document.body.classList.add('blue-theme');
            break;
        case 'blue-deep-sea':
            document.body.classList.add('blue-theme');
            document.body.classList.add('deep-sea');
            break;
        case 'blue-neon':
            document.body.classList.add('blue-theme');
            document.body.classList.add('neon');
            break;
        default:
            // 默认使用彩虹主题
            document.body.classList.add('rainbow-theme');
            localStorage.setItem('mindMapTheme', 'rainbow');
            break;
    }
    
    console.log('主题初始化完成:', savedTheme);
}

// 初始化思维导图
document.addEventListener('DOMContentLoaded', () => {
    window.mindMap = new MindMap('mindMap');
    
    // 清除可能存在的蓝色主题设置，确保彩虹主题优先级
    const savedTheme = localStorage.getItem('mindMapTheme') || 'rainbow';
    if (savedTheme === 'rainbow') {
        // 禁用蓝色主题的自动加载
        localStorage.setItem('blueThemePrefs', JSON.stringify({
            enabled: false,
            variant: 'classic',
            crystalNodesEnabled: false
        }));
        
        // 确保应用彩虹主题
        document.body.classList.add('rainbow-theme');
    } else if (savedTheme === 'blue') {
        document.body.classList.add('blue-theme');
    } else if (savedTheme === 'blue-deep-sea') {
        document.body.classList.add('blue-theme');
        document.body.classList.add('deep-sea');
    } else if (savedTheme === 'blue-neon') {
        document.body.classList.add('blue-theme');
        document.body.classList.add('neon');
    } else {
        // 默认使用彩虹主题
        document.body.classList.add('rainbow-theme');
        localStorage.setItem('mindMapTheme', 'rainbow');
    }
    
    // 加载自定义节点位置
    setTimeout(() => {
        if (window.mindMap) {
            window.mindMap.applyNodePositions();
        }
    }, 300);
}); 