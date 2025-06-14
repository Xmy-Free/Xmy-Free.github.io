// 事件处理和交互功能
(function() {
    // 获取主类的引用
    const MindMapProto = MindMap.prototype;
    
    // 绑定事件
    MindMapProto.bindEvents = function() {
        // 容器点击事件
        this.container.addEventListener('mousedown', e => {
            // 完成编辑
            if (this.editingNode) {
                this.finishEdit();
            }
            
            // 右键点击不处理
            if (e.button === 2) return;
            
            // 查找点击的节点
            const target = e.target.closest('.node');
            if (!target) {
                this.selectNode(null);
                
                // 如果不是点击节点，都启动平移功能
                this.isPanning = true;
                this.lastPanX = e.clientX;
                this.lastPanY = e.clientY;
                this.container.style.cursor = 'grabbing';
                return;
            }
            
            const nodeId = target.getAttribute('data-id');
            const clickedNode = this.findNodeById(nodeId);
            
            if (!clickedNode) return;
            
            // 左键点击
            if (e.button === 0) {
                // 选中节点
                this.selectNode(clickedNode);
                
                // 记录开始拖拽的位置
                this.dragStartX = e.clientX;
                this.dragStartY = e.clientY;
                this.offsetX = e.clientX - clickedNode.x;
                this.offsetY = e.clientY - clickedNode.y;
                
                // 不立即设置拖拽节点，等待判断是否超过阈值
                this.dragNode = null;
                this.potentialDragNode = clickedNode;
            }
        });
        
        // 双击节点开始编辑
        this.container.addEventListener('dblclick', e => {
            // 如果点击的是节点文本，开始编辑
            if (e.target.classList.contains('node-text') || e.target.closest('.node')) {
                const target = e.target.closest('.node');
                if (!target) return;
                
                const nodeId = target.getAttribute('data-id');
                const clickedNode = this.findNodeById(nodeId);
                
                if (clickedNode) {
                    this.selectNode(clickedNode);
                    this.startEdit(clickedNode);
                    
                    // 双击时不触发拖拽
                    this.dragNode = null;
                    this.potentialDragNode = null;
                }
            }
        });
        
        // 右键菜单
        this.container.addEventListener('contextmenu', e => {
            e.preventDefault(); // 阻止默认右键菜单
            
            const target = e.target.closest('.node');
            if (!target) return;
            
            const nodeId = target.getAttribute('data-id');
            const clickedNode = this.findNodeById(nodeId);
            
            if (clickedNode) {
                this.selectNode(clickedNode);
                
                // 检测是否是右键双击（使用自定义计时器）
                if (!clickedNode.lastRightClick || Date.now() - clickedNode.lastRightClick < 300) {
                    // 双击右键，添加子节点
                    this.addChildNode(clickedNode);
                }
                clickedNode.lastRightClick = Date.now();
            }
        });
        
        // 添加右键长按事件处理
        this.container.addEventListener('mousedown', e => {
            // 只处理右键按下
            if (e.button !== 2) return;
            
            const target = e.target.closest('.node');
            if (!target) return;
            
            const nodeId = target.getAttribute('data-id');
            const clickedNode = this.findNodeById(nodeId);
            
            if (!clickedNode) return;
            
            // 设置右键长按计时器
            clickedNode.rightPressTimer = setTimeout(() => {
                // 长按右键 - 隐藏/显示子节点
                if (clickedNode.children.length > 0) {
                    // 切换子节点显示状态
                    clickedNode.isCollapsed = !clickedNode.isCollapsed;
                    
                    // 更新折叠/展开图标
                    this.updateNodeToggleButton(clickedNode);
                    
                    // 递归显示/隐藏所有子节点及其连接线
                    this.toggleChildrenVisibility(clickedNode.children, !clickedNode.isCollapsed);
                    
                    // 立即更新连接线以确保正确渲染
                    setTimeout(() => {
                        this.updateAllConnectors();
                    }, 10);
                    
                    // 显示提示
                    const actionText = clickedNode.isCollapsed ? '隐藏' : '显示';
                    this.showTooltip(`${actionText}子节点 (${clickedNode.children.length}个)`, 
                                   clickedNode.x + clickedNode.element.offsetWidth / 2, 
                                   clickedNode.y - 30,
                                   2000);
                    
                    // 添加动画效果
                    clickedNode.element.classList.add('toggle-animation');
                    setTimeout(() => {
                        clickedNode.element.classList.remove('toggle-animation');
                    }, 500);
                }
            }, 500); // 设置500毫秒的长按时间
        });
        
        // 鼠标移动事件处理
        document.addEventListener('mousemove', e => this.handleMouseMove(e));
        
        // 鼠标松开事件处理 - 使用document而不是容器
        document.addEventListener('mouseup', e => {
            // 清除所有节点的长按计时器
            for (const node of this.nodes) {
                if (node.rightPressTimer) {
                    clearTimeout(node.rightPressTimer);
                    node.rightPressTimer = null;
                }
            }
            
            // 处理拖拽结束
            if (this.dragNode) {
                // 清除移动状态
                this.dragNode.isMoving = false;
                
                // 保存节点位置
                this.saveNodePosition(this.dragNode);
                
                // 移除拖拽样式
                this.dragNode.element.classList.remove('dragging');
                this.dragNode.element.classList.remove('smooth-drag');
                
                // 最后更新一次连接线，确保最终位置正确
                // 使用setTimeout确保在DOM更新后执行
                setTimeout(() => {
                    this.updateNodeConnectors(this.dragNode);
                    // 延迟再次更新，确保连接线正确显示
                    setTimeout(() => {
                        this.updateAllConnectors();
                    }, 50);
                }, 0);
                
                // 重置拖拽状态
                this.dragNode = null;
                this.dragMoveCounter = 0;
            }
            
            // 重置潜在拖拽节点
            this.potentialDragNode = null;
            
            // 结束平移
            if (this.isPanning) {
                this.isPanning = false;
                this.container.style.cursor = 'default';
            }
        });
        
        // 阻止编辑框失焦时触发点击事件
        document.addEventListener('mousedown', e => {
            if (this.editBox && !this.editBox.contains(e.target) && !e.target.closest('.node')) {
                this.finishEdit();
            }
        });
        
        // 键盘事件
        document.addEventListener('keydown', e => {
            // ESC键取消编辑
            if (e.key === 'Escape' && this.editingNode) {
                this.removeEditBox();
                this.editingNode = null;
                return;
            }
            
            // Delete键删除选中的节点
            if (e.key === 'Delete' && this.selectedNode && this.selectedNode.parent) {
                this.deleteNode(this.selectedNode);
                return;
            }
            
            // 按下Ctrl+鼠标滚轮缩放
            if (e.ctrlKey && e.key === '+') {
                e.preventDefault();
                const center = {
                    x: this.container.clientWidth / 2,
                    y: this.container.clientHeight / 2
                };
                this.zoom(1, center.x, center.y);
                return;
            }
            
            if (e.ctrlKey && e.key === '-') {
                e.preventDefault();
                const center = {
                    x: this.container.clientWidth / 2,
                    y: this.container.clientHeight / 2
                };
                this.zoom(-1, center.x, center.y);
                return;
            }
            
            // 方向键微调选中节点位置
            if (this.selectedNode && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                
                const moveStep = e.shiftKey ? 10 : 5;
                let dx = 0, dy = 0;
                
                switch (e.key) {
                    case 'ArrowUp': dy = -moveStep; break;
                    case 'ArrowDown': dy = moveStep; break;
                    case 'ArrowLeft': dx = -moveStep; break;
                    case 'ArrowRight': dx = moveStep; break;
                }
                
                // 更新节点位置
                this.selectedNode.x += dx;
                this.selectedNode.y += dy;
                this.selectedNode.element.style.left = `${this.selectedNode.x}px`;
                this.selectedNode.element.style.top = `${this.selectedNode.y}px`;
                
                // 保存节点位置
                this.saveNodePosition(this.selectedNode);
                
                // 更新连接线
                this.updateConnectionsRAF();
            }
            
            // 自动布局快捷键 (Ctrl+L)
            if (e.ctrlKey && e.key.toLowerCase() === 'l') {
                e.preventDefault();
                this.autoArrangeNodes();
            }
        });
        
        // 鼠标滚轮事件 - 缩放或滚动
        this.container.addEventListener('wheel', e => {
            if (e.ctrlKey) {
                e.preventDefault();
                const delta = e.deltaY < 0 ? 1 : -1;
                this.zoom(delta, e.clientX, e.clientY);
            } else if (e.shiftKey) {
                // Shift+滚轮水平滚动
                e.preventDefault();
                // 水平方向无限制滚动
                this.pan(-e.deltaY * 1.2, 0);
            } else {
                // 普通滚轮垂直滚动
                e.preventDefault(); // 阻止默认滚动行为以启用自定义平移
                // 垂直方向无限制滚动
                this.pan(0, -e.deltaY * 1.2);
            }
        });
        
        // 窗口大小变化时更新连接线
        window.addEventListener('resize', () => {
            this.updateConnectionsRAF();
        });
    };
    
    // 鼠标移动事件处理
    MindMapProto.handleMouseMove = function(e) {
        // 处理潜在的拖拽启动
        if (this.potentialDragNode && !this.dragNode) {
            const dx = e.clientX - this.dragStartX;
            const dy = e.clientY - this.dragStartY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // 如果移动距离超过阈值，开始拖拽
            if (distance > this.dragThreshold) {
                this.dragNode = this.potentialDragNode;
                this.dragNode.element.classList.add('dragging');
                
                // 显示拖拽开始提示
                this.showTooltip('正在拖动节点', e.clientX, e.clientY - 30, 1000);
            }
        }
        
        // 拖拽节点
        if (this.dragNode) {
            // 计算新位置
            const newX = e.clientX - this.offsetX;
            const newY = e.clientY - this.offsetY;
            
            // 更新节点位置
            this.dragNode.x = newX;
            this.dragNode.y = newY;
            this.dragNode.element.style.left = `${newX}px`;
            this.dragNode.element.style.top = `${newY}px`;
            
            // 保存节点移动状态，以便优化连接线更新
            this.dragNode.isMoving = true;
            
            // 在拖动时更频繁地更新连接线
            this.dragMoveCounter++;
            // 降低更新频率阈值，使连接线更平滑
            if (this.dragMoveCounter % 1 === 0) {  // 每次移动都更新
                this.updateNodeConnectors(this.dragNode);
            }
            
            // 添加平滑拖动效果
            this.dragNode.element.classList.add('smooth-drag');
        }
        
        // 平移整个思维导图 - 即使鼠标移到容器外部也能继续平移
        if (this.isPanning) {
            // 计算鼠标位移
            const dx = e.clientX - this.lastPanX;
            const dy = e.clientY - this.lastPanY;
            this.lastPanX = e.clientX;
            this.lastPanY = e.clientY;
            
            if (dx !== 0 || dy !== 0) {
                this.pan(dx, dy);
            }
        }
    };
})(); 