// 节点创建、编辑、删除和管理的功能扩展
(function() {
    // 获取主类的引用
    const MindMapProto = MindMap.prototype;
    
    // 创建节点
    MindMapProto.createNode = function(text, parent, x, y) {
        // 计算颜色索引 - 从父节点继承或者新分配
        let colorIndex = 'root';
        if (parent) {
            // 继承父节点的颜色索引
            colorIndex = parent.colorIndex;
        } else {
            // 如果没有父节点且不是根节点，分配新的颜色索引
            const nodeCount = this.nodes.length;
            colorIndex = ((nodeCount % 7) + 1).toString();
        }
        
        const node = {
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            text: text,
            parent: parent,
            children: [],
            x: x,
            y: y,
            element: document.createElement('div'),
            colorIndex: colorIndex,
            isCollapsed: false  // 添加折叠状态属性
        };
        
        // 创建节点元素
        node.element.className = 'node';
        node.element.style.left = `${x}px`;
        node.element.style.top = `${y}px`;
        node.element.setAttribute('data-id', node.id);
        node.element.setAttribute('data-color-index', colorIndex);
        
        // 添加拖动指示器
        const dragIndicator = document.createElement('div');
        dragIndicator.className = 'drag-indicator';
        dragIndicator.innerHTML = '<i class="fas fa-arrows-alt"></i>';
        node.element.appendChild(dragIndicator);
        
        // 创建文本元素
        const textElement = document.createElement('div');
        textElement.className = 'node-text';
        textElement.textContent = text;
        node.element.appendChild(textElement);
        
        // 如果是根节点，设置固定宽度
        if (!parent) {
            node.element.classList.add('root');
            node.element.style.width = '250px';
            node.element.style.maxWidth = '250px';
            node.element.style.textAlign = 'center';
        }
        
        // 添加折叠/展开按钮 (仅当有子节点时才会显示)
        const toggleBtn = document.createElement('div');
        toggleBtn.className = 'node-toggle';
        toggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
        toggleBtn.style.display = 'none';  // 初始隐藏
        node.element.appendChild(toggleBtn);
        
        // 绑定折叠/展开事件
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleNodeChildren(node);
        });
        
        // 将节点添加到容器
        this.container.appendChild(node.element);
        
        // 如果有父节点，建立关系
        if (parent) {
            parent.children.push(node);
            this.createConnector(parent, node);
            
            // 添加新增节点动画
            node.element.classList.add('newly-added');
            setTimeout(() => {
                node.element.classList.remove('newly-added');
            }, 1500);
            
            // 当父节点有了子节点，显示折叠/展开按钮
            this.updateNodeToggleButton(parent);
        }
        
        return node;
    };
    
    // 创建自定义节点(不自动创建连接线，便于更好控制恢复过程)
    MindMapProto.createCustomNode = function(text, parent, x, y) {
        // 计算颜色索引 - 从父节点继承或者新分配
        let colorIndex = 'root';
        if (parent) {
            // 继承父节点的颜色索引
            colorIndex = parent.colorIndex;
        } else {
            // 如果没有父节点且不是根节点，分配新的颜色索引
            const nodeCount = this.nodes.length;
            colorIndex = ((nodeCount % 7) + 1).toString();
        }
        
        const node = {
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            text: text,
            parent: parent,
            children: [],
            x: x,
            y: y,
            element: document.createElement('div'),
            colorIndex: colorIndex,
            isCollapsed: false  // 添加折叠状态属性
        };
        
        // 创建节点元素
        node.element.className = 'node';
        node.element.style.left = `${x}px`;
        node.element.style.top = `${y}px`;
        node.element.setAttribute('data-id', node.id);
        node.element.setAttribute('data-color-index', colorIndex);
        
        // 添加拖动指示器
        const dragIndicator = document.createElement('div');
        dragIndicator.className = 'drag-indicator';
        dragIndicator.innerHTML = '<i class="fas fa-arrows-alt"></i>';
        node.element.appendChild(dragIndicator);
        
        // 创建文本元素
        const textElement = document.createElement('div');
        textElement.className = 'node-text';
        textElement.textContent = text;
        node.element.appendChild(textElement);
        
        // 添加折叠/展开按钮 (仅当有子节点时才会显示)
        const toggleBtn = document.createElement('div');
        toggleBtn.className = 'node-toggle';
        toggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
        toggleBtn.style.display = 'none';  // 初始隐藏
        node.element.appendChild(toggleBtn);
        
        // 绑定折叠/展开事件
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleNodeChildren(node);
        });
        
        // 将节点添加到容器
        this.container.appendChild(node.element);
        
        return node;
    };
    
    // 添加子节点
    MindMapProto.addChildNode = function(parent, text = '新节点') {
        if (!parent) return;
        
        const parentRect = parent.element.getBoundingClientRect();
        
        // 计算新节点位置，基于智能布局
        let x, y;
        const childCount = parent.children.length;
        const spacing = 100; // 子节点间距
        
        if (this.isSmartLayoutEnabled) {
            // 智能布局逻辑
            if (parent.parent) { // 非根节点
                // 超级优化：使用8方向分析替代简单的4方向分析
                const directions = this.analyzeDirectionalDensity(parent);
                
                // 找出最佳方向（密度最低）
                let bestDirection = 0; // 默认方向为右侧 (0度)
                let minDensity = Infinity;
                
                for (let dir = 0; dir < directions.length; dir++) {
                    if (directions[dir] < minDensity) {
                        minDensity = directions[dir];
                        bestDirection = dir;
                    }
                }
                
                // 计算父节点和祖父节点的连线方向
                const grandparent = parent.parent;
                const parentDx = parent.x - grandparent.x;
                const parentDy = parent.y - grandparent.y;
                const parentAngle = Math.atan2(parentDy, parentDx);
                const parentDir = Math.floor((parentAngle + 2 * Math.PI) % (2 * Math.PI) / (Math.PI / 4));
                
                // 如果最佳方向与父节点连线方向不同，尝试使用相同方向
                const angleDiff = Math.min(
                    Math.abs(bestDirection - parentDir),
                    8 - Math.abs(bestDirection - parentDir)
                );
                
                // 增强方向选择：有95%的概率强制使用与父节点连线相同的方向或相邻方向
                if (Math.random() < 0.95) {
                    if (Math.random() < 0.8) {
                        // 80%的概率直接使用完全相同的方向
                        bestDirection = parentDir;
                    } else {
                        // 15%的概率使用相邻方向
                        bestDirection = Math.random() < 0.5 ? 
                            (parentDir + 1) % 8 : 
                            (parentDir + 7) % 8;
                    }
                }
                
                // 根据最佳方向计算角度（8个主方向，每个45度）
                const angle = bestDirection * Math.PI / 4;
                
                // 设置基本距离
                const baseDistance = Math.max(parentRect.width, parentRect.height) + 150;
                
                // 计算新节点位置，基于角度和距离
                const mainX = Math.cos(angle) * baseDistance;
                const mainY = Math.sin(angle) * baseDistance;
                
                // 主方向位置
                const mainPosX = parent.x + mainX;
                const mainPosY = parent.y + mainY;
                
                // 找到在这个主方向上已存在的子节点
                const sameDirectionChildren = parent.children.filter(child => {
                    // 计算子节点相对于父节点的角度
                    const childAngle = Math.atan2(child.y - parent.y, child.x - parent.x);
                    // 归一化到0-2π
                    const normalizedChildAngle = childAngle < 0 ? childAngle + 2 * Math.PI : childAngle;
                    const normalizedTargetAngle = angle < 0 ? angle + 2 * Math.PI : angle;
                    
                    // 检查子节点是否在目标方向的扇区内（±22.5度）
                    const angleDiff = Math.abs(normalizedChildAngle - normalizedTargetAngle);
                    return angleDiff < Math.PI / 8 || angleDiff > 2 * Math.PI - Math.PI / 8;
                });
                
                // 计算这个方向上的偏移量
                const directionCount = sameDirectionChildren.length;
                
                // 计算垂直于主方向的偏移
                // 90度旋转: (x,y) -> (-y,x)
                const perpX = -Math.sin(angle);
                const perpY = Math.cos(angle);
                
                // 改进的偏移计算
                // 奇数个子节点时中心对齐，偶数个子节点时错开排列
                let offset;
                if (directionCount % 2 === 0) {
                    // 偶数个子节点：0,1=-0.5,0.5; 2,3=-1.5,-0.5,0.5,1.5...
                    offset = ((directionCount / 2) - 0.5) * (directionCount % 4 === 0 ? -1 : 1) * spacing;
                } else {
                    // 奇数个子节点：0=0; 1,2=-1,0,1; 3,4=-2,-1,0,1,2...
                    offset = Math.floor(directionCount / 2) * (directionCount % 4 <= 1 ? -1 : 1) * spacing;
                }
                
                // 应用偏移
                x = mainPosX + perpX * offset;
                y = mainPosY + perpY * offset;
                
                // 避免节点重叠
                x += (Math.random() - 0.5) * 20;
                y += (Math.random() - 0.5) * 20;
            } else { // 根节点
                // 分析根节点周围的十个方向，选择节点密度最低的区域
                const sectors = this.analyzeSectorDensity(parent);
                
                // 找出节点最少的区域
                let minDensity = Infinity;
                let bestSector = 0;
                
                for (let i = 0; i < 10; i++) {
                    if (sectors[i] < minDensity) {
                        minDensity = sectors[i];
                        bestSector = i;
                    }
                }
                
                // 根据最佳区域计算角度，确保所有方向均匀分布
                let angle;
                
                // 每个扇区代表36度(2π/10)
                const sectorAngle = Math.PI / 5;
                
                // 计算均匀分布的角度，添加一个小的随机偏移以避免节点重叠
                angle = bestSector * sectorAngle + sectorAngle / 2;
                
                // 特别处理右侧的两个扇区(0和9)，以确保分布更均匀
                if (bestSector === 0 || bestSector === 9) {
                    // 调整角度，使得右侧区域不会太靠近
                    if (bestSector === 0) {
                        angle = Math.PI * 0.1; // 略微向下偏移
                    } else { // bestSector === 9
                        angle = Math.PI * 1.9; // 略微向上偏移
                    }
                }
                
                // 使用统一的半径，确保所有方向的连线长度一致
                // 对于水平方向(接近0或π)的节点，需要稍微增加半径
                let radius = 300; // 基础半径
                
                // 根据角度调整半径，确保视觉上连线长度一致
                const horizontalFactor = Math.abs(Math.cos(angle));
                if (horizontalFactor > 0.85) {
                    // 水平方向需要更大的半径
                    radius = 380; // 增加右侧节点的半径，使连线长度更一致
                } else if (horizontalFactor > 0.5) {
                    // 斜向方向需要中等半径
                    radius = 330;
                }
                
                // 特别处理右侧扇区(0和9)，进一步增加半径
                if (bestSector === 0 || bestSector === 9) {
                    radius += 30; // 额外增加右侧节点的半径
                }
                
                // 添加少量随机性，避免节点完全重叠
                radius += Math.random() * 20;
                
                x = parent.x + Math.cos(angle) * radius;
                y = parent.y + Math.sin(angle) * radius;
            }
        } else {
            // 传统布局逻辑（向右布局）- 也增加了垂直间距
            x = parent.x + parentRect.width + 150;
            y = parent.y + childCount * spacing;
        }
        
        const childNode = this.createNode(text, parent, x, y);
        this.nodes.push(childNode);
        
        // 保存节点位置
        this.saveNodePosition(childNode);
        
        // 选中新创建的节点并开始编辑
        this.selectNode(childNode);
        this.startEdit(childNode);
        
        return childNode;
    };
    
    // 分析节点周围八个主方向的节点密度
    MindMapProto.analyzeDirectionalDensity = function(node) {
        // 8个方向的节点密度: 右、右下、下、左下、左、左上、上、右上
        const directions = [0, 0, 0, 0, 0, 0, 0, 0];
        
        // 设置检测距离
        const distance = 350;
        
        // 遍历所有节点，计算八个方向的密度
        for (const otherNode of this.nodes) {
            // 跳过自身和直接子节点
            if (otherNode === node || otherNode.parent === node) continue;
            
            const dx = otherNode.x - node.x;
            const dy = otherNode.y - node.y;
            
            // 计算到节点的距离
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // 只考虑一定距离内的节点
            if (dist > distance) continue;
            
            // 计算节点的角度（0到2π）
            let angle = Math.atan2(dy, dx);
            if (angle < 0) angle += 2 * Math.PI;
            
            // 确定节点所在的方向（0-7，每个45度）
            const dirIndex = Math.floor(angle / (Math.PI / 4));
            
            // 计算节点贡献的权重（越近影响越大）
            const weight = 1 - (dist / distance) * 0.8;
            
            // 增加该方向的密度
            directions[dirIndex] += weight;
            
            // 影响相邻方向（平滑过渡）
            const prevDir = (dirIndex + 7) % 8; // 上一个方向
            const nextDir = (dirIndex + 1) % 8; // 下一个方向
            directions[prevDir] += weight * 0.4;
            directions[nextDir] += weight * 0.4;
        }
        
        // 考虑画布边界，如果节点靠近边界，增加该方向的密度权重
        const viewportWidth = this.container.clientWidth;
        const viewportHeight = this.container.clientHeight;
        const margin = 150; // 边界边距
        
        // 检查右边界
        if (node.x > viewportWidth - margin) {
            directions[0] += 3; // 右
            directions[7] += 2; // 右上
            directions[1] += 2; // 右下
        }
        
        // 检查左边界
        if (node.x < margin) {
            directions[4] += 3; // 左
            directions[3] += 2; // 左下
            directions[5] += 2; // 左上
        }
        
        // 检查下边界
        if (node.y > viewportHeight - margin) {
            directions[2] += 3; // 下
            directions[1] += 2; // 右下
            directions[3] += 2; // 左下
        }
        
        // 检查上边界
        if (node.y < margin) {
            directions[6] += 3; // 上
            directions[5] += 2; // 左上
            directions[7] += 2; // 右上
        }
        
        // 考虑父子节点的连线方向，避免新节点与现有连线重叠
        if (node.parent) {
            // 计算父节点连线的角度
            const parentAngle = Math.atan2(node.y - node.parent.y, node.x - node.parent.x);
            // 计算父节点连线的方向索引
            const parentDir = Math.floor((parentAngle + 2 * Math.PI) % (2 * Math.PI) / (Math.PI / 4));
            
            // 计算与父节点连线相同的方向（我们希望在这个方向添加子节点）
            // 不再使用相反方向
            
            // 显著降低父节点连接方向的权重，使其更容易被选中
            directions[parentDir] -= 6;
            directions[(parentDir + 1) % 8] -= 3;
            directions[(parentDir + 7) % 8] -= 3;
            
            // 显著增加其他方向的权重，避免在这些方向添加子节点
            // 计算相反方向
            const oppositeDir = (parentDir + 4) % 8;
            directions[oppositeDir] += 8;
            directions[(oppositeDir + 1) % 8] += 5;
            directions[(oppositeDir + 7) % 8] += 5;
            
            // 增加对角方向的权重，进一步强化直线延伸效果
            directions[(parentDir + 2) % 8] += 3;
            directions[(parentDir + 6) % 8] += 3;
        }
        
        // 考虑已有子节点的分布，尽量避免在已有较多子节点的方向再添加
        const childDirectionCount = Array(8).fill(0); // 记录每个方向上的子节点数量
        
        for (const child of node.children) {
            const childAngle = Math.atan2(child.y - node.y, child.x - node.x);
            // 归一化角度到0-2π
            const normalizedAngle = childAngle < 0 ? childAngle + 2 * Math.PI : childAngle;
            // 确定子节点所在的方向
            const childDir = Math.floor(normalizedAngle / (Math.PI / 4));
            
            // 累计每个方向的子节点数
            childDirectionCount[childDir]++;
            
            // 该方向已有子节点，增加权重
            directions[childDir] += 1.5; 
            
            // 相邻方向也略微增加
            const prevDir = (childDir + 7) % 8;
            const nextDir = (childDir + 1) % 8;
            directions[prevDir] += 0.7;
            directions[nextDir] += 0.7;
        }
        
        // 优化：偏向于选择子节点较少的方向
        // 找到子节点数量最少的方向组
        if (node.children.length > 0) {
            let minChildCount = Math.min(...childDirectionCount);
            
            // 如果某些方向没有子节点，减少其密度值以提高优先级
            for (let i = 0; i < 8; i++) {
                if (childDirectionCount[i] === minChildCount) {
                    // 如果这个方向的子节点数是最少的，降低其密度权重
                    directions[i] -= 1.0;
                }
            }
        }
        
        return directions;
    };
    
    // 分析根节点周围十个方向的节点密度
    MindMapProto.analyzeSectorDensity = function(node) {
        // 十个方向的节点密度（10分圆）
        const sectors = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        
        // 设置检测距离
        const distance = 400;
        
        // 已使用的扇区计数
        const usedSectorCount = Array(10).fill(0);
        
        // 首先统计该节点的直接子节点所在的扇区，将其标记为高密度区域
        for (const child of node.children) {
            const dx = child.x - node.x;
            const dy = child.y - node.y;
            
            // 计算节点的角度（0到2π）
            let angle = Math.atan2(dy, dx);
            if (angle < 0) angle += 2 * Math.PI;
            
            // 确定节点所在的十分区域（0-9）
            const sector = Math.floor(angle / (Math.PI / 5));
            
            // 记录该扇区已有的节点数量
            usedSectorCount[sector]++;
            
            // 显著增加该扇区的权重
            sectors[sector] += 3;
            
            // 轻微增加相邻扇区的权重
            sectors[(sector + 1) % 10] += 1;
            sectors[(sector + 9) % 10] += 1;
        }
        
        // 遍历所有其他节点，计算十个区域的密度
        for (const otherNode of this.nodes) {
            // 跳过自身和直接子节点
            if (otherNode === node || otherNode.parent === node) continue;
            
            const dx = otherNode.x - node.x;
            const dy = otherNode.y - node.y;
            
            // 计算到节点的距离
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // 只考虑一定距离内的节点
            if (dist > distance) continue;
            
            // 计算节点的角度（0到2π）
            let angle = Math.atan2(dy, dx);
            if (angle < 0) angle += 2 * Math.PI;
            
            // 确定节点所在的十分区域（0-9）
            const sector = Math.floor(angle / (Math.PI / 5));
            
            // 权重根据距离计算（越近权重越大）
            const weight = 1 - (dist / distance) * 0.7;
            sectors[sector] += weight;
        }
        
        // 优先选择空白区域：为了使节点更均匀分布，给未使用的扇区大幅降低权重
        const maxUsedCount = Math.max(...usedSectorCount);
        for (let i = 0; i < 10; i++) {
            // 降低已有节点的扇区权重，增加空白扇区的选中概率
            // 权重调整与该扇区已有节点数量成正比
            sectors[i] += usedSectorCount[i] * 2;
            
            // 如果该扇区没有节点，给予额外的优先级
            if (usedSectorCount[i] === 0) {
                sectors[i] -= 2;
            }
        }
        
        // 平衡左右分布：确保节点在整个圆周上均匀分布
        // 计算左右半圆的节点数量差异
        const leftSideCount = usedSectorCount[3] + usedSectorCount[4] + usedSectorCount[5] + usedSectorCount[6];
        const rightSideCount = usedSectorCount[0] + usedSectorCount[1] + usedSectorCount[8] + usedSectorCount[9];
        
        // 如果左右不平衡，调整权重促进平衡
        if (Math.abs(leftSideCount - rightSideCount) > 2) {
            // 哪边节点多，增加那边的权重
            const sideToAdjust = leftSideCount > rightSideCount ? [3, 4, 5, 6] : [0, 1, 8, 9];
            for (const sector of sideToAdjust) {
                sectors[sector] += 1.5;
            }
        }
        
        return sectors;
    };
    
    // 开始编辑节点文本
    MindMapProto.startEdit = function(node) {
        if (!node) return;
        
        // 如果已有编辑框，先移除
        this.removeEditBox();
        
        // 创建编辑框
        this.editBox = document.createElement('div');
        this.editBox.className = 'node-edit-box';
        this.editBox.contentEditable = true;
        this.editBox.textContent = node.text;
        
        // 定位编辑框
        const nodeRect = node.element.getBoundingClientRect();
        this.editBox.style.left = `${node.x}px`;
        this.editBox.style.top = `${node.y}px`;
        this.editBox.style.minWidth = `${Math.max(nodeRect.width, 180)}px`;
        this.editBox.style.minHeight = `${Math.max(nodeRect.height, 40)}px`;
        
        this.container.appendChild(this.editBox);
        this.editingNode = node;
        
        // 聚焦并选中所有文本
        this.editBox.focus();
        document.execCommand('selectAll', false, null);
        
        // 阻止编辑框点击事件冒泡
        this.editBox.addEventListener('mousedown', e => e.stopPropagation());
        this.editBox.addEventListener('click', e => e.stopPropagation());
        
        // 编辑框内容变化时自动调整大小
        this.editBox.addEventListener('input', () => {
            this.editBox.style.width = 'auto';
            this.editBox.style.height = 'auto';
        });
    };
    
    // 完成编辑
    MindMapProto.finishEdit = function() {
        if (!this.editBox || !this.editingNode) return;
        
        // 更新节点文本
        const newText = this.editBox.textContent.trim() || '新节点';
        this.editingNode.text = newText;
        this.editingNode.element.querySelector('.node-text').textContent = newText;
        
        // 移除编辑框
        this.removeEditBox();
        this.editingNode = null;
    };
    
    // 移除编辑框
    MindMapProto.removeEditBox = function() {
        if (this.editBox && this.editBox.parentNode) {
            this.editBox.parentNode.removeChild(this.editBox);
            this.editBox = null;
        }
    };
    
    // 删除节点及其子节点
    MindMapProto.deleteNode = function(node) {
        if (!node || !node.parent) return; // 不能删除根节点
        
        // 递归删除所有子节点
        const deleteChildren = (node) => {
            if (node.children && node.children.length > 0) {
                [...node.children].forEach(child => {
                    deleteChildren(child);
                });
            }
            
            // 删除连接线
            const connectors = this.container.querySelectorAll(`[data-child="${node.id}"], [data-parent="${node.id}"]`);
            connectors.forEach(connector => {
                connector.parentNode.removeChild(connector);
            });
            
            // 淡出动画
            node.element.style.transition = 'all 0.3s ease-out';
            node.element.style.opacity = '0';
            node.element.style.transform = 'scale(0.8)';
            
            // 延迟删除DOM元素
            setTimeout(() => {
                if (node.element.parentNode) {
                    node.element.parentNode.removeChild(node.element);
                }
                
                // 从nodes数组中移除
                const index = this.nodes.indexOf(node);
                if (index !== -1) {
                    this.nodes.splice(index, 1);
                }
                
                // 删除存储的位置信息
                if (this.nodePositions[node.id]) {
                    delete this.nodePositions[node.id];
                }
                
                // 更新本地存储
                this.saveAllNodePositions();
            }, 300);
        };
        
        // 从父节点的children数组中移除
        const parentChildren = node.parent.children;
        const index = parentChildren.indexOf(node);
        if (index !== -1) {
            parentChildren.splice(index, 1);
        }
        
        // 删除连接线
        const connectors = this.container.querySelectorAll(`[data-child="${node.id}"]`);
        connectors.forEach(connector => {
            connector.parentNode.removeChild(connector);
        });
        
        // 删除节点及其子节点
        deleteChildren(node);
        
        // 取消选中
        this.selectNode(null);
        
        // 显示删除成功提示
        this.showTooltip('节点已删除', this.container.clientWidth / 2, this.container.clientHeight / 2);
    };
    
    // 更新节点的折叠/展开按钮显示状态
    MindMapProto.updateNodeToggleButton = function(node) {
        if (!node) return;
        
        const toggleBtn = node.element.querySelector('.node-toggle');
        if (!toggleBtn) return;
        
        if (node.children.length > 0) {
            toggleBtn.style.display = 'block';
            toggleBtn.innerHTML = node.isCollapsed ? 
                '<i class="fas fa-chevron-right"></i>' : 
                '<i class="fas fa-chevron-down"></i>';
        } else {
            toggleBtn.style.display = 'none';
        }
    };
    
    // 切换节点子元素的显示/隐藏
    MindMapProto.toggleNodeChildren = function(node) {
        if (!node || node.children.length === 0) return;
        
        // 切换折叠状态
        node.isCollapsed = !node.isCollapsed;
        
        // 更新折叠/展开图标
        this.updateNodeToggleButton(node);
        
        // 递归显示/隐藏所有子节点及其连接线
        this.toggleChildrenVisibility(node.children, !node.isCollapsed);
        
        // 立即更新所有连接线，确保正确显示
        setTimeout(() => {
            this.updateAllConnectors();
        }, 10);
        
        // 添加折叠/展开动画效果
        node.element.classList.add('toggle-animation');
        setTimeout(() => {
            node.element.classList.remove('toggle-animation');
        }, 500);
        
        // 显示提示信息
        const actionText = node.isCollapsed ? '折叠' : '展开';
        this.showTooltip(`${actionText}子节点 (${node.children.length}个)`, 
                         node.x + node.element.offsetWidth / 2, 
                         node.y - 30,
                         1500);
    };
    
    // 递归切换子节点可见性
    MindMapProto.toggleChildrenVisibility = function(children, isVisible) {
        for (const child of children) {
            // 设置节点可见性 - 使用更强的方式确保节点隐藏
            if (isVisible) {
                child.element.style.display = '';
                child.element.style.visibility = 'visible';
                child.element.style.opacity = '1';
            } else {
                child.element.style.display = 'none';
                child.element.style.visibility = 'hidden';
                child.element.style.opacity = '0';
            }
            
            // 设置连接线可见性 - 确保所有连接线都被处理
            const connectors = document.querySelectorAll(`.connector[data-parent="${child.parent.id}"][data-child="${child.id}"]`);
            for (const connector of connectors) {
                connector.style.display = isVisible ? '' : 'none';
                connector.style.visibility = isVisible ? 'visible' : 'hidden';
            }
            
            // 递归处理所有层级的子节点
            if (child.children && child.children.length > 0) {
                // 如果显示操作，且当前节点未折叠，则显示其子节点
                // 如果是隐藏操作，无条件隐藏所有子节点
                const shouldShowChildren = isVisible && !child.isCollapsed;
                this.toggleChildrenVisibility(child.children, shouldShowChildren);
            }
        }
    };
    
    // 重新绑定拖动事件，确保在恢复数据后连接线正常更新
    MindMapProto.rebindDragEvents = function() {
        // 查找所有节点元素
        for (const node of this.nodes) {
            if (!node.element) continue;
            
            // 移除可能已存在的鼠标按下事件监听器
            const newElement = node.element.cloneNode(true);
            if (node.element.parentNode) {
                node.element.parentNode.replaceChild(newElement, node.element);
            }
            node.element = newElement;
            
            // 为节点添加点击事件
            node.element.addEventListener('mousedown', (e) => {
                // 完成编辑
                if (this.editingNode) {
                    this.finishEdit();
                }
                
                // 右键点击不处理
                if (e.button === 2) return;
                
                // 选中节点
                this.selectNode(node);
                
                // 记录开始拖拽的位置
                this.dragStartX = e.clientX;
                this.dragStartY = e.clientY;
                this.offsetX = e.clientX - node.x;
                this.offsetY = e.clientY - node.y;
                
                // 不立即设置拖拽节点，等待判断是否超过阈值
                this.dragNode = null;
                this.potentialDragNode = node;
                
                e.stopPropagation();
            });
            
            // 为折叠按钮绑定事件
            const toggleBtn = node.element.querySelector('.node-toggle');
            if (toggleBtn) {
                toggleBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleNodeChildren(node);
                });
            }
            
            // 更新折叠按钮显示状态
            this.updateNodeToggleButton(node);
        }
    };
})(); 