// 连接线创建、更新和管理功能
(function() {
    // 获取主类的引用
    const MindMapProto = MindMap.prototype;
    
    // 创建连接线
    MindMapProto.createConnector = function(parent, child) {
        const connector = document.createElement('div');
        connector.className = 'connector';
        
        // 添加颜色类 - 使用父节点的颜色
        const colorIndex = parent.colorIndex;
        connector.classList.add(`connector-color-${colorIndex}`);
        
        connector.setAttribute('data-parent', parent.id);
        connector.setAttribute('data-child', child.id);
        connector.setAttribute('data-color-index', colorIndex);
        
        this.container.appendChild(connector);
        this.updateConnector(connector, parent, child);
    };
    
    // 更新连接线
    MindMapProto.updateConnector = function(connector, parent, child) {
        // 获取父节点和子节点的中心坐标
        const parentRect = parent.element.getBoundingClientRect();
        const childRect = child.element.getBoundingClientRect();
        
        const parentCenterX = parent.x + parentRect.width / 2;
        const parentCenterY = parent.y + parentRect.height / 2;
        const childCenterX = child.x + childRect.width / 2;
        const childCenterY = child.y + childRect.height / 2;
        
        // 计算连接线的起点和终点（根据节点的边缘而不是中心）
        let startX, startY, endX, endY;
        
        // 针对根节点的特殊处理
        if (parent.element.classList.contains('root')) {
            // 计算子节点相对于根节点中心的角度
            const dx = childCenterX - parentCenterX;
            const dy = childCenterY - parentCenterY;
            const angle = Math.atan2(dy, dx);
            
            // 根节点边缘的坐标（基于角度）
            const halfWidth = parentRect.width / 2;
            const halfHeight = parentRect.height / 2;
            
            // 根据角度确定起点位置，确保视觉上连线长度一致
            // 计算根节点边缘上的点
            const cosAngle = Math.cos(angle);
            const sinAngle = Math.sin(angle);
            const absX = Math.abs(cosAngle);
            const absY = Math.abs(sinAngle);
            
            // 检查是否是右侧区域的节点（水平方向）
            const isRightSide = Math.abs(angle) < Math.PI * 0.15;
            
            // 确定连接线起点，使用椭圆方程计算更精确的边缘点
            if (absX > absY) {
                // 水平方向为主
                const signX = cosAngle > 0 ? 1 : -1;
                startX = parentCenterX + signX * halfWidth;
                
                // 对右侧节点特殊处理，确保连线长度一致
                if (isRightSide && signX > 0) {
                    // 右侧节点起点稍微向内调整
                    startX = parentCenterX + signX * (halfWidth - 5);
                    startY = parentCenterY + sinAngle * halfHeight * (absY / absX);
                } else {
                    startY = parentCenterY + sinAngle * halfHeight * (absY / absX);
                }
            } else {
                // 垂直方向为主
                const signY = sinAngle > 0 ? 1 : -1;
                startY = parentCenterY + signY * halfHeight;
                startX = parentCenterX + cosAngle * halfWidth * (absX / absY);
            }
            
            // 子节点边缘的坐标
            // 这个角度是从子节点指向父节点的反方向
            const oppositeAngle = angle + Math.PI;
            const oppositeCos = Math.cos(oppositeAngle);
            const oppositeSin = Math.sin(oppositeAngle);
            const oppositeAbsX = Math.abs(oppositeCos);
            const oppositeAbsY = Math.abs(oppositeSin);
            
            const childHalfWidth = childRect.width / 2;
            const childHalfHeight = childRect.height / 2;
            
            // 确定连接线终点
            if (oppositeAbsX > oppositeAbsY) {
                // 水平方向为主
                const signX = oppositeCos > 0 ? 1 : -1;
                
                // 对右侧节点特殊处理
                if (isRightSide && signX < 0) {
                    // 右侧节点终点稍微向外调整
                    endX = childCenterX + signX * (childHalfWidth + 5);
                    endY = childCenterY + oppositeSin * childHalfHeight * (oppositeAbsY / oppositeAbsX);
                } else {
                    endX = childCenterX + signX * childHalfWidth;
                    endY = childCenterY + oppositeSin * childHalfHeight * (oppositeAbsY / oppositeAbsX);
                }
            } else {
                // 垂直方向为主
                const signY = oppositeSin > 0 ? 1 : -1;
                endY = childCenterY + signY * childHalfHeight;
                endX = childCenterX + oppositeCos * childHalfWidth * (oppositeAbsX / oppositeAbsY);
            }
        }
        // 普通节点连接线逻辑
        else if (Math.abs(childCenterX - parentCenterX) > Math.abs(childCenterY - parentCenterY)) {
            // 水平方向距离更远
            if (childCenterX > parentCenterX) {
                startX = parent.x + parentRect.width;
                startY = parent.y + parentRect.height / 2;
                endX = child.x;
                endY = child.y + childRect.height / 2;
            } 
            // 子节点在父节点左侧
            else {
                startX = parent.x;
                startY = parent.y + parentRect.height / 2;
                endX = child.x + childRect.width;
                endY = child.y + childRect.height / 2;
            }
        }
        // 垂直方向距离更远
        else {
            // 子节点在父节点下方
            if (childCenterY > parentCenterY) {
                startX = parent.x + parentRect.width / 2;
                startY = parent.y + parentRect.height;
                endX = child.x + childRect.width / 2;
                endY = child.y;
            } 
            // 子节点在父节点上方
            else {
                startX = parent.x + parentRect.width / 2;
                startY = parent.y;
                endX = child.x + childRect.width / 2;
                endY = child.y + childRect.height;
            }
        }
        
        // 计算连接线的长度和角度
        const dx = endX - startX;
        const dy = endY - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        
        // 设置连接线的位置和旋转
        connector.style.width = `${distance}px`;
        connector.style.left = `${startX}px`;
        connector.style.top = `${startY}px`;
        connector.style.transform = `rotate(${angle}rad)`;
    };
    
    // 更新所有连接线
    MindMapProto.updateAllConnectors = function() {
        // 使用requestAnimationFrame提高性能
        if (this.rafUpdateConnectors) return;
        
        this.rafUpdateConnectors = requestAnimationFrame(() => {
            const connectors = document.querySelectorAll('.connector');
            
            // 批量处理DOM操作，减少重排重绘
            for (const connector of connectors) {
                const parentId = connector.getAttribute('data-parent');
                const childId = connector.getAttribute('data-child');
                
                const parent = this.findNodeById(parentId);
                const child = this.findNodeById(childId);
                
                if (parent && child) {
                    this.updateConnector(connector, parent, child);
                }
            }
            
            this.rafUpdateConnectors = null;
        });
    };
    
    // 更新特定节点的所有连接线
    MindMapProto.updateNodeConnectors = function(node) {
        if (!node) return;
        
        // 使用requestAnimationFrame优化性能
        // 但针对拖动的情况，我们需要更实时的更新，减少动画帧延迟
        const updateConnectors = () => {
            try {
                // 更新以该节点为父节点的连接线
                const parentConnectors = this.container.querySelectorAll(`.connector[data-parent="${node.id}"]`);
                parentConnectors.forEach(connector => {
                    const childId = connector.getAttribute('data-child');
                    const child = this.findNodeById(childId);
                    if (child) {
                        this.updateConnector(connector, node, child);
                    }
                });
                
                // 更新以该节点为子节点的连接线
                const childConnectors = this.container.querySelectorAll(`.connector[data-child="${node.id}"]`);
                childConnectors.forEach(connector => {
                    const parentId = connector.getAttribute('data-parent');
                    const parent = this.findNodeById(parentId);
                    if (parent) {
                        this.updateConnector(connector, parent, node);
                    }
                });
            } catch (error) {
                console.error("连接线更新错误:", error);
            }
        };

        // 优化性能：普通情况下使用动画帧，拖动时直接更新
        if (this.dragNode === node) {
            // 如果是正在拖动的节点，立即更新连接线而不使用RAF
            updateConnectors();
        } else {
            requestAnimationFrame(updateConnectors);
        }
    };
})(); 