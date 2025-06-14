// 保存思维导图功能

// 监听键盘事件，捕获Ctrl+S组合键
document.addEventListener('keydown', async function(event) {
    // 检查是否按下了Ctrl+S (Windows) 或 Command+S (Mac)
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        // 阻止浏览器默认的保存行为
        event.preventDefault();
        
        // 调用保存函数 (函数内部会显示通知)
        await saveMindMap();
    }
});

// 保存思维导图数据为HTML
async function saveMindMap() {
    try {
        // 获取当前思维导图的完整状态
        const mindMapData = getMindMapData();
        
        // 创建新的HTML文档
        const htmlContent = generateMindMapHTML(mindMapData);
        
        // 生成文件名
        const fileName = generateFileName();
        
        // 尝试使用不同的方式保存文件
        await saveFile(htmlContent, fileName);
        
        // 显示保存成功提示
        showSaveNotification();
        
        return true;
    } catch (error) {
        console.error('保存思维导图失败:', error);
        alert('保存失败: ' + error.message);
        return false;
    }
}

// 使用可用的API保存文件
async function saveFile(content, fileName) {
    try {
        // 优先尝试使用File System Access API（最新的文件系统访问API）
        if ('showDirectoryPicker' in window) {
            await saveUsingFileSystemAccessAPI(content, fileName);
        } else {
            // 回退到下载方式
            downloadFile(content, fileName);
        }
    } catch (error) {
        console.error('保存文件出错:', error);
        // 回退到下载方式
        downloadFile(content, fileName);
    }
}

// 使用File System Access API保存文件（更现代的API，支持直接访问文件系统）
async function saveUsingFileSystemAccessAPI(content, fileName) {
    try {
        // 创建文件选择器
        const options = {
            suggestedName: fileName,
            types: [{
                description: 'HTML Files',
                accept: {'text/html': ['.html']}
            }]
        };

        try {
            // 让用户选择保存位置和文件名
            const handle = await window.showSaveFilePicker(options);
            
            // 获取可写流
            const writable = await handle.createWritable();
            
            // 写入内容
            await writable.write(content);
            
            // 关闭流
            await writable.close();
            
            console.log('文件已保存到:', handle.name);
            return true;
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('使用File System Access API保存失败:', error);
                throw error;
            } else {
                console.log('用户取消了文件保存操作');
                return false;
            }
        }
    } catch (error) {
        console.error('使用File System Access API保存失败:', error);
        throw error;
    }
}

// 下载文件（兼容性方案）
function downloadFile(content, fileName) {
    // 创建Blob对象
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // 创建下载链接
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    
    // 添加到页面并模拟点击
    document.body.appendChild(a);
    a.click();
    
    // 清理
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
    
    console.log('思维导图已下载为HTML文件');
    return true;
}

// 生成思维导图HTML文件
function generateMindMapHTML(mindMapData) {
    // 获取当前页面的HTML，不做任何修改直接作为模板
    const originalHtml = document.documentElement.outerHTML;
    
    // 提取当前页面的全部HTML结构，确保完全一致
    const newHtml = originalHtml.replace('</body>', `
    <script>
    // 保存的思维导图数据
    window.savedMindMapData = ${JSON.stringify(mindMapData)};
    
    // 在页面完全加载后恢复数据
    document.addEventListener('DOMContentLoaded', function() {
        console.log('页面已加载，准备恢复思维导图数据...');
        
        // 等待mindMap对象初始化完成
        function checkMindMapReady() {
            if (window.mindMap && typeof window.mindMap.loadData === 'function') {
                console.log('思维导图对象已就绪，开始恢复数据');
                try {
                    // 恢复深色/浅色模式
                    if (window.savedMindMapData.darkMode) {
                        document.body.classList.add('dark-mode');
                        localStorage.setItem('darkMode', 'true');
                    } else {
                        document.body.classList.remove('dark-mode');
                        localStorage.setItem('darkMode', 'false');
                    }
                    
                    // 短暂延迟以确保DOM完全渲染
                    setTimeout(function() {
                        // 恢复数据
                        const success = window.mindMap.loadData(window.savedMindMapData);
                        
                        if (success) {
                            console.log('思维导图数据已恢复');
                            
                            // 重新绑定连接器更新事件，确保拖动时连线正确更新
                            const nodes = window.mindMap.nodes || [];
                            nodes.forEach(node => {
                                if (node.element) {
                                    // 为每个节点强制更新一次连接器
                                    window.mindMap.updateNodeConnectors(node);
                                }
                            });
                            
                            // 强制更新一次所有连接器
                            window.mindMap.updateAllConnectors();
                            
                            // 触发resize事件以确保布局正确
                            window.dispatchEvent(new Event('resize'));
                        }
                    }, 300);
                } catch (e) {
                    console.error('恢复思维导图失败:', e);
                }
            } else {
                console.log('等待思维导图对象初始化...');
                setTimeout(checkMindMapReady, 100);
            }
        }
        
        // 开始检查思维导图对象是否准备好
        setTimeout(checkMindMapReady, 100);
    });
    </script>
</body>`);
    
    return newHtml;
}

// 生成文件名
function generateFileName() {
    const date = new Date();
    const timestamp = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}-${date.getMinutes().toString().padStart(2, '0')}`;
    return `mindmap_${timestamp}.html`;
}

// 获取思维导图数据
function getMindMapData() {
    // 如果mindMap是一个全局对象，可以直接获取它的数据
    if (window.mindMap && typeof window.mindMap.getData === 'function') {
        return window.mindMap.getData();
    }
    
    // 如果有专门的函数来获取数据
    if (typeof getMindMapDataFromDOM === 'function') {
        return getMindMapDataFromDOM();
    }
    
    // 如果以上方法都不可用，尝试从DOM中提取数据
    // 这是一个备选方案，实际实现应该根据思维导图的具体结构来定
    const mindMapElement = document.getElementById('mindMap');
    if (!mindMapElement) {
        throw new Error('找不到思维导图元素');
    }
    
    // 尝试获取节点位置、文本内容等关键信息
    return {
        nodes: extractNodesFromDOM(mindMapElement),
        // 其他数据如连线、全局样式等
        scale: window.mindMap ? window.mindMap.scale : 1,
        centerX: window.mindMap ? window.mindMap.centerX : 0,
        centerY: window.mindMap ? window.mindMap.centerY : 0,
        darkMode: document.body.classList.contains('dark-mode')
    };
}

// 从DOM中提取节点数据（示例函数，具体实现需要根据实际DOM结构调整）
function extractNodesFromDOM(element) {
    // 实际逻辑应该根据思维导图的DOM结构来实现
    // 这里只是一个示例框架
    const nodes = [];
    const nodeElements = element.querySelectorAll('.node');
    
    nodeElements.forEach((nodeEl, index) => {
        // 提取节点数据
        const textEl = nodeEl.querySelector('.text');
        const text = textEl ? textEl.textContent : '';
        
        // 获取位置信息
        const x = parseFloat(nodeEl.style.left || '0');
        const y = parseFloat(nodeEl.style.top || '0');
        
        // 获取节点ID
        const id = nodeEl.id || `node-${index}`;
        
        // 获取父节点ID
        const parentEl = nodeEl.closest('.children')?.parentElement;
        const parentId = parentEl && parentEl.classList.contains('node') ? parentEl.id : null;
        
        // 创建节点数据对象
        nodes.push({
            id,
            text,
            x,
            y,
            parentId,
            collapsed: !nodeEl.classList.contains('open')
        });
    });
    
    return nodes;
}

// 在页面加载时添加恢复功能
document.addEventListener('DOMContentLoaded', function() {
    // 检查URL中是否有恢复参数
    if (window.savedMindMapData) {
        console.log('检测到保存的思维导图数据，准备恢复...');
        
        // 添加一个延时，确保mindMap对象已经初始化
        setTimeout(function() {
            if (window.mindMap && typeof window.mindMap.loadData === 'function') {
                try {
                    window.mindMap.loadData(window.savedMindMapData);
                    console.log('思维导图已恢复');
                    
                    // 如果有深色模式设置，也恢复它
                    if (window.savedMindMapData.darkMode) {
                        document.body.classList.add('dark-mode');
                        localStorage.setItem('darkMode', 'true');
                    } else {
                        document.body.classList.remove('dark-mode');
                        localStorage.setItem('darkMode', 'false');
                    }
                } catch (e) {
                    console.error('恢复思维导图失败:', e);
                }
            } else {
                console.log('mindMap对象未就绪，再次尝试...');
                // 如果mindMap对象还没准备好，再试一次
                setTimeout(function() {
                    if (window.mindMap && typeof window.mindMap.loadData === 'function') {
                        try {
                            window.mindMap.loadData(window.savedMindMapData);
                        } catch (e) {
                            console.error('再次尝试恢复失败:', e);
                        }
                    }
                }, 500);
            }
        }, 300);
    }
});

// 显示保存成功的通知
function showSaveNotification() {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = 'save-notification';
    notification.innerHTML = '<i class="fas fa-check-circle"></i> 思维导图已成功保存';
    
    // 添加到文档中
    document.body.appendChild(notification);
    
    // 添加样式
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = 'rgba(46, 204, 113, 0.9)';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    notification.style.zIndex = '9999';
    notification.style.transition = 'opacity 0.3s';
    
    // 显示通知，然后淡出
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}
