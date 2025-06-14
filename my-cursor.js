        // === 自定义鼠标三层同步与 trail 逻辑 ===
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        
        // 可调整的光标位置修正值（根据需要调整）
        const cursorOffsetX = 0; // 可根据需要修改，正值向右偏移，负值向左偏移
        const cursorOffsetY = 0; // 可根据需要修改，正值向下偏移，负值向上偏移
        
        // 更新所有鼠标元素的位置
        function setCursorElementsCenter(x, y) {
            // custom-cursor
            const cursor = document.getElementById('custom-cursor');
            if (cursor) {
                // 添加页面滚动偏移量和位置修正
                cursor.style.left = `${x + window.scrollX + cursorOffsetX}px`;
                cursor.style.top = `${y + window.scrollY + cursorOffsetY}px`;
                
                // 确保transform始终包含translate(-50%, -50%)
                const currentTransform = cursor.style.transform || '';
                if (!currentTransform.includes('translate(-50%, -50%)')) {
                    cursor.style.transform = `translate(-50%, -50%) ${currentTransform.replace('translate(-50%, -50%)', '')}`;
                }
            }
            
            // 所有 trail
            document.querySelectorAll('.cursor-trail').forEach(trail => {
                trail.style.left = `${x + window.scrollX + cursorOffsetX}px`;
                trail.style.top = `${y + window.scrollY + cursorOffsetY}px`;
                trail.style.transform = 'translate(-50%, -50%)';
            });
        }
        
        function syncCursorCenters() {
            setCursorElementsCenter(mouseX, mouseY);
            requestAnimationFrame(syncCursorCenters);
        }
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            setCursorElementsCenter(mouseX, mouseY);
            
            const cursorTrails = document.getElementById('cursor-trails');
            if (cursorTrails) {
                const trail = document.createElement('div');
                trail.className = 'cursor-trail';
                trail.style.position = 'fixed';
                trail.style.left = `${mouseX + window.scrollX + cursorOffsetX}px`;
                trail.style.top = `${mouseY + window.scrollY + cursorOffsetY}px`;
                trail.style.transform = 'translate(-50%, -50%)';
                cursorTrails.appendChild(trail);
                setTimeout(() => {
                    trail.style.opacity = '0';
                    setTimeout(() => {
                        if (trail.parentNode) trail.parentNode.removeChild(trail);
                    }, 300);
                }, 100);
            }
        });
        
        document.addEventListener('mousedown', (e) => {
            if (e.button === 0) {
                mouseX = e.clientX;
                mouseY = e.clientY;
                setCursorElementsCenter(mouseX, mouseY);
                
                const cursor = document.getElementById('custom-cursor');
                if (cursor) {
                    // 确保缩放时保持translate(-50%, -50%)
                    cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
                }
            }
        });
        
        document.addEventListener('mouseup', (e) => {
            if (e.button === 0) {
                const cursor = document.getElementById('custom-cursor');
                if (cursor) {
                    // 确保还原时保持translate(-50%, -50%)
                    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                }
            }
        });
        
        function initCustomCursor() {
            const cursor = document.getElementById('custom-cursor');
            if (cursor) {
                // 初始化时确保cursor-core和cursor-ring在DOM中存在
                if (!cursor.querySelector('.cursor-core')) {
                    const core = document.createElement('div');
                    core.className = 'cursor-core';
                    cursor.appendChild(core);
                }
                
                if (!cursor.querySelector('.cursor-ring')) {
                    const ring = document.createElement('div');
                    ring.className = 'cursor-ring';
                    cursor.appendChild(ring);
                }
            }
            
            document.querySelectorAll('button, a, input, select').forEach(el => {
                el.addEventListener('mouseenter', () => {
                    if (cursor) {
                        cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                        const core = cursor.querySelector('.cursor-core');
                        if (core) core.style.backgroundColor = '#ff00aa';
                    }
                });
                
                el.addEventListener('mouseleave', () => {
                    if (cursor) {
                        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                        const core = cursor.querySelector('.cursor-core');
                        if (core) core.style.backgroundColor = '#00f7ff';
                    }
                });
            });
        }
        
        document.addEventListener('DOMContentLoaded', function () {
            // 确保光标元素在页面加载时创建
            const customCursor = document.getElementById('custom-cursor');
            if (!customCursor) {
                const cursorEl = document.createElement('div');
                cursorEl.id = 'custom-cursor';
                cursorEl.className = 'custom-cursor';
                
                const core = document.createElement('div');
                core.className = 'cursor-core';
                
                const ring = document.createElement('div');
                ring.className = 'cursor-ring';
                
                cursorEl.appendChild(core);
                cursorEl.appendChild(ring);
                document.body.appendChild(cursorEl);
            }
            
            // 确保cursor-trails容器存在
            if (!document.getElementById('cursor-trails')) {
                const trailsContainer = document.createElement('div');
                trailsContainer.id = 'cursor-trails';
                document.body.appendChild(trailsContainer);
            }
            
            requestAnimationFrame(syncCursorCenters);
            initCustomCursor();
        });