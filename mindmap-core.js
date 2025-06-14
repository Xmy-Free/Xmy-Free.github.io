// 思维导图核心类
class MindMap {
    constructor(container) {
        this.container = document.getElementById(container);
        this.nodes = []; // 存储所有节点
        this.selectedNode = null; // 当前选中的节点
        this.editingNode = null; // 当前正在编辑的节点
        this.editBox = null; // 编辑框
        this.dragNode = null; // 当前拖拽的节点
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.scale = 1; // 缩放比例
        this.translateX = 0; // 平移X
        this.translateY = 0; // 平移Y
        this.dragThreshold = 5; // 拖动阈值，防止误触
        this.autoArrangeMode = false; // 自动布局模式
        this.nodePositions = {}; // 保存节点位置
        this.dragMoveCounter = 0; // 用于跟踪拖动移动次数，用于性能优化
        this.updateInterval = 2; // 拖动时，每2次移动更新一次连接线，提高流畅度
        this.isPanning = false; // 是否正在平移
        this.lastPanX = 0;
        this.lastPanY = 0;
        this.panSpeed = 1.2; // 平移速度倍数
        this.isSmartLayoutEnabled = true; // 是否启用智能布局
        this.exportScale = 1.5; // 导出图像的缩放比例
        
        // 尝试从本地存储恢复节点位置
        this.loadNodePositions();
        
        // 初始化根节点
        this.init();
        
        // 绑定事件
        this.bindEvents();

        // 优化动画性能
        this.setupRAF();
    }
    
    // 设置requestAnimationFrame优化
    setupRAF() {
        this.rafId = null;
        this.pendingUpdates = false;
        this.rafUpdateConnectors = null;
        this.lastViewportCheck = 0;
        
        // 使用RAF优化连接线更新
        this.updateConnectionsRAF = () => {
            if (!this.pendingUpdates) {
                this.pendingUpdates = true;
                this.rafId = requestAnimationFrame(() => {
                    this.updateAllConnectors();
                    this.pendingUpdates = false;
                });
            }
        };
        
        // 添加节点虚拟化逻辑
        this.checkNodesInViewport();
        
        // 定期检查哪些节点在视口内
        setInterval(() => this.checkNodesInViewport(), 1000);
    }
    
    // 检查节点是否在视口内，优化渲染性能
    checkNodesInViewport() {
        const now = Date.now();
        // 每200ms检查一次，避免频繁计算
        if (now - this.lastViewportCheck < 200) return;
        this.lastViewportCheck = now;
        
        const viewportLeft = -this.translateX / this.scale;
        const viewportTop = -this.translateY / this.scale;
        const viewportRight = viewportLeft + this.container.clientWidth / this.scale;
        const viewportBottom = viewportTop + this.container.clientHeight / this.scale;
        
        // 扩展视口范围，加入更大的缓冲区，允许无限延伸
        const bufferSize = 2000; // 增加缓冲区大小
        const expandedLeft = viewportLeft - bufferSize;
        const expandedTop = viewportTop - bufferSize;
        const expandedRight = viewportRight + bufferSize;
        const expandedBottom = viewportBottom + bufferSize;
        
        // 检查每个节点，但不隐藏任何节点，保持所有节点可见
        this.nodes.forEach(node => {
            // 确保所有节点都是可见的
            if (node.element.style.display === 'none') {
                node.element.style.display = '';
            }
        });
    }
    
    // 初始化思维导图
    init() {
        // 创建根节点
        const rootNode = this.createNode('主题', null, this.container.clientWidth / 2, this.container.clientHeight / 2);
        rootNode.element.classList.add('root');
        rootNode.colorIndex = 'root'; // 根节点使用特殊颜色
        this.nodes.push(rootNode);
        
        // 保存初始位置
        this.saveNodePosition(rootNode);
    }
    
    // 加载保存的节点位置
    loadNodePositions() {
        try {
            const savedPositions = localStorage.getItem('mindMapNodePositions');
            if (savedPositions) {
                this.nodePositions = JSON.parse(savedPositions);
            }
        } catch (error) {
            console.error('Error loading node positions:', error);
            this.nodePositions = {};
        }
    }
    
    // 保存节点位置
    saveNodePosition(node) {
        if (!node) return;
        
        this.nodePositions[node.id] = {
            x: node.x,
            y: node.y
        };
        
        // 保存到本地存储
        try {
            localStorage.setItem('mindMapNodePositions', JSON.stringify(this.nodePositions));
        } catch (error) {
            console.error('Error saving node positions:', error);
        }
    }
    
    // 保存所有节点位置
    saveAllNodePositions() {
        for (const node of this.nodes) {
            this.saveNodePosition(node);
        }
    }
    
    // 应用保存的节点位置
    applyNodePositions() {
        for (const node of this.nodes) {
            if (this.nodePositions[node.id]) {
                node.x = this.nodePositions[node.id].x;
                node.y = this.nodePositions[node.id].y;
                node.element.style.left = `${node.x}px`;
                node.element.style.top = `${node.y}px`;
            }
        }
        this.updateConnectionsRAF();
    }
    
    // 通过ID查找节点
    findNodeById(id) {
        return this.nodes.find(node => node.id === id);
    }
    
    // 选中节点
    selectNode(node) {
        if (this.selectedNode) {
            this.selectedNode.element.classList.remove('selected');
        }
        this.selectedNode = node;
        if (node) {
            node.element.classList.add('selected');
            
            // 高亮显示与该节点相关的连接线
            const connectors = this.container.querySelectorAll(`.connector[data-parent="${node.id}"], .connector[data-child="${node.id}"]`);
            connectors.forEach(connector => {
                connector.classList.add('highlighted');
            });
            
            // 显示工具提示
            this.showTooltip(`已选中节点: ${node.text.substring(0, 25)}${node.text.length > 25 ? '...' : ''}`, 
                             node.x + node.element.offsetWidth / 2, 
                             node.y - 30);
        } else {
            // 取消所有高亮连接线
            const highlightedConnectors = this.container.querySelectorAll('.connector.highlighted');
            highlightedConnectors.forEach(connector => {
                connector.classList.remove('highlighted');
            });
        }
    }
    
    // 显示工具提示
    showTooltip(text, x, y, duration = 2000) {
        // 函数保留但不执行任何操作，禁用所有提示弹窗
        return;
        
        /*
        const tooltip = document.getElementById('tooltip');
        if (!tooltip) return;
        
        tooltip.textContent = text;
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
        tooltip.classList.add('show');
        
        // 自动隐藏提示
        setTimeout(() => {
            tooltip.classList.remove('show');
        }, duration);
        */
    }
    
    // 缩放思维导图
    zoom(delta, x, y) {
        // 保存旧缩放
        const oldScale = this.scale;
        
        // 计算新缩放
        this.scale += delta * 0.1;
        
        // 限制缩放范围
        this.scale = Math.max(0.2, Math.min(3, this.scale));
        
        if (oldScale !== this.scale) {
            // 缩放点为鼠标位置
            const mouseX = (x - this.translateX) / oldScale;
            const mouseY = (y - this.translateY) / oldScale;
            
            // 调整平移以保持鼠标下的点不变
            this.translateX = x - mouseX * this.scale;
            this.translateY = y - mouseY * this.scale;
            
            // 使用transform更新视图，一次性更新所有节点位置
            requestAnimationFrame(() => {
                const transformValue = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
                this.container.style.transform = transformValue;
                
                // GPU加速
                this.container.style.willChange = 'transform';
                
                // 检查视口内节点
                this.checkNodesInViewport();
                
                // 节流重置willChange
                clearTimeout(this.willChangeTimeout);
                this.willChangeTimeout = setTimeout(() => {
                    this.container.style.willChange = 'auto';
                }, 200);
            });
        }
    }
    
    // 平移思维导图
    pan(dx, dy) {
        // 添加平移速度倍数，使移动更流畅
        dx *= this.panSpeed;
        dy *= this.panSpeed;
        
        // 无边界限制地更新平移坐标
        this.translateX += dx;
        this.translateY += dy;
        
        // 使用transform而不是更新每个节点位置，提高性能
        requestAnimationFrame(() => {
            const transformValue = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
            this.container.style.transform = transformValue;
            
            // 添加GPU加速
            this.container.style.willChange = 'transform';
            
            // 更新后检查视口内节点
            this.checkNodesInViewport();
            
            // 节流重置willChange以释放GPU资源
            clearTimeout(this.willChangeTimeout);
            this.willChangeTimeout = setTimeout(() => {
                this.container.style.willChange = 'auto';
            }, 200);
        });
    }
}

// 导出MindMap类
window.MindMap = MindMap; 