document.addEventListener('DOMContentLoaded', () => {


    // 禁用右键菜单
    window.addEventListener('contextmenu', (event) => {
        event.preventDefault();
    });

    // 定义长按右键检测相关变量
    let rightButtonPressed = false;
    let rightButtonPressTimer = null;
    let rightButtonPressStartTime = 0;
    let longPressThreshold = 500; // 调整为500毫秒，更快触发
    let isEffectActive = false; // 特效是否已激活
    let longPressIndicator = null; // 长按指示器
    
    // 新增：为区分单击/双击/长按定义变量
    let rightClickTimer = null;
    let rightClickCount = 0;
    const doubleClickThreshold = 400; // 两次点击的间隔
    
    // 定义特效动画相关变量
    let cosmicEffectElements = []; // 存储所有特效元素
    let animationFrameId = null; // 动画帧ID
    let effectStartTime = 0; // 特效开始时间
    
    // 超级宇宙特效相关变量
    let superCosmicEffectActive = false; // 超级特效是否激活
    let superCosmicAnimationId = null; // 超级特效动画帧ID
    let superCosmicStartTime = 0; // 超级特效开始时间
    let superCosmicElements = []; // 存储超级特效元素
    let galaxyCanvas = null; // 星系Canvas
    let galaxyCtx = null; // 星系Canvas上下文
    let starfields = []; // 星域数组
    let nebulae = []; // 星云数组
    let wormholes = []; // 虫洞数组
    let supernovaTime = 0; // 超新星计时器
    let dimensionalRifts = []; // 维度裂缝数组
    let cosmicStrings = []; // 宇宙弦数组
    let quantumFluctuations = []; // 量子波动
    let celestialBodies = []; // 天体
    let timeDistortions = []; // 时间扭曲
    let gravityWaves = []; // 引力波
    let interstellarClouds = []; // 星际云
    let darkMatterNodes = []; // 暗物质节点
    
    // 创建长按指示器
    function createLongPressIndicator() {
        longPressIndicator = document.createElement('div');
        longPressIndicator.className = 'long-press-indicator';
        longPressIndicator.style.position = 'fixed';
        longPressIndicator.style.width = '40px';
        longPressIndicator.style.height = '40px';
        longPressIndicator.style.borderRadius = '50%';
        longPressIndicator.style.border = '2px solid rgba(100,180,255,0.8)';
        longPressIndicator.style.borderTop = '2px solid transparent';
        longPressIndicator.style.animation = 'spin 1s linear infinite';
        longPressIndicator.style.display = 'none';
        longPressIndicator.style.zIndex = '2000';
        longPressIndicator.style.pointerEvents = 'none';
        
        // 添加旋转动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: translate(-50%, -50%) rotate(0deg); }
                100% { transform: translate(-50%, -50%) rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(longPressIndicator);
    }
    
    // 创建长按指示器
    createLongPressIndicator();
    
    // 监听鼠标按下事件
    window.addEventListener('mousedown', (event) => {
        if (event.button !== 2) return;

        rightButtonPressed = true;
        rightButtonPressStartTime = Date.now();
        showLongPressIndicator(event.clientX, event.clientY);

        // 启动长按计时器
        rightButtonPressTimer = setTimeout(() => {
            if (rightButtonPressed) { // 如果此时右键还按着，确认为长按
                rightClickCount = 0; // 长按覆盖了点击行为
                clearTimeout(rightClickTimer);
                if (!isEffectActive) {
                    startCosmicEffect();
                }
                hideLongPressIndicator();
            }
        }, longPressThreshold);
    });
    
    // 监听鼠标移动事件，更新长按指示器位置
    window.addEventListener('mousemove', (event) => {
        if (rightButtonPressed && !isEffectActive) {
            updateLongPressIndicator(event.clientX, event.clientY);
        }
    });
    
    // 监听鼠标松开事件
    window.addEventListener('mouseup', (event) => {
        if (event.button !== 2) return;

        hideLongPressIndicator();
        rightButtonPressed = false;

        // 如果松开时间在长按阈值之内，说明这是一次 "短按" (click)
        if (Date.now() - rightButtonPressStartTime < longPressThreshold) {
            clearTimeout(rightButtonPressTimer); // 取消长按

            rightClickCount++;

            if (rightClickCount === 1) {
                // 这是第一次点击，启动一个计时器，看是否有第二次点击跟上
                rightClickTimer = setTimeout(() => {
                    // 时间到了，没有第二次点击，所以这就是一次单击
                    // (此处可以添加单击事件)
                    rightClickCount = 0;
                }, doubleClickThreshold);
            } else if (rightClickCount === 2) {
                // 这是第二次点击，确认是双击
                clearTimeout(rightClickTimer); // 取消单击计时器
                rightClickCount = 0;

                // 直接尝试调用galaxy.html中定义的triggerGalaxyLightRays函数
                console.log("右键双击触发激光特效");
                try {
                    // 先检查全局对象中是否存在triggerGalaxyLightRays函数
                    if (typeof triggerGalaxyLightRays === 'function') {
                        triggerGalaxyLightRays();
                    } else {
                        // 如果不存在，尝试从window对象中获取
                        if (typeof window.triggerGalaxyLightRays === 'function') {
                            window.triggerGalaxyLightRays();
                        } else {
                            console.error("无法找到triggerGalaxyLightRays函数");
                        }
                    }
                } catch (error) {
                    console.error("调用激光特效失败:", error);
                }
            }
        }
    });
    
    // 监听鼠标离开窗口事件，防止边缘情况
    window.addEventListener('mouseout', () => {
        rightButtonPressed = false;
        clearTimeout(rightButtonPressTimer);
        clearTimeout(rightClickTimer);
        hideLongPressIndicator();
    });
    
    // 显示长按指示器
    function showLongPressIndicator(x, y) {
        if (!longPressIndicator) return;
        
        longPressIndicator.style.display = 'block';
        longPressIndicator.style.left = `${x}px`;
        longPressIndicator.style.top = `${y}px`;
        longPressIndicator.style.transform = 'translate(-50%, -50%)';
    }
    
    // 更新长按指示器位置
    function updateLongPressIndicator(x, y) {
        if (!longPressIndicator || longPressIndicator.style.display === 'none') return;
        
        longPressIndicator.style.left = `${x}px`;
        longPressIndicator.style.top = `${y}px`;
    }
    
    // 隐藏长按指示器
    function hideLongPressIndicator() {
        if (!longPressIndicator) return;
        
        longPressIndicator.style.display = 'none';
    }
    
    // 启动宇宙特效
    function startCosmicEffect() {
        if (isEffectActive) return; // 防止重复触发
        
        isEffectActive = true;
        effectStartTime = Date.now();
        
        // 创建主特效容器
        const effectContainer = document.createElement('div');
        effectContainer.className = 'cosmic-effect-container';
        effectContainer.style.position = 'fixed';
        effectContainer.style.top = '0';
        effectContainer.style.left = '0';
        effectContainer.style.width = '100%';
        effectContainer.style.height = '100%';
        effectContainer.style.zIndex = '1000';
        effectContainer.style.pointerEvents = 'none';
        effectContainer.style.overflow = 'hidden';
        document.body.appendChild(effectContainer);
        cosmicEffectElements.push(effectContainer);
        
        // 先创建初始爆炸效果
        createCosmicExplosion(effectContainer);
        
        // 延迟添加其他特效，形成连锁反应
        setTimeout(() => {
            // 创建星际漩涡
            createCosmicVortex(effectContainer);
            
            // 创建能量波动
            createEnergyWaves(effectContainer);
            
            // 创建星际光束
            createCosmicBeams(effectContainer);
            
            // 创建时空扭曲
            createSpaceDistortion(effectContainer);
            
            // 创建量子粒子
            createQuantumParticles(effectContainer);
            
            // 创建星际网络
            createCosmicWeb(effectContainer);
            
            // 创建星际尘埃
            createCosmicDust(effectContainer);
        }, 500);
        
        // 启动动画循环
        animateCosmicEffect();
    }
    
    // 创建宇宙爆炸特效
    function createCosmicExplosion(container) {
        // 创建爆炸中心点
        const explosion = document.createElement('div');
        explosion.className = 'cosmic-explosion';
        explosion.style.position = 'absolute';
        explosion.style.width = '10px';
        explosion.style.height = '10px';
        explosion.style.borderRadius = '50%';
        explosion.style.background = 'rgba(200, 240, 255, 0.95)';
        explosion.style.boxShadow = '0 0 30px rgba(100, 180, 255, 0.8), 0 0 60px rgba(50, 120, 255, 0.6)';
        explosion.style.top = '50%';
        explosion.style.left = '50%';
        explosion.style.transform = 'translate(-50%, -50%)';
        explosion.style.transition = 'all 0.6s cubic-bezier(0.1, 0.9, 0.2, 1)';
        explosion.style.zIndex = '1001';
        
        container.appendChild(explosion);
        cosmicEffectElements.push(explosion);
        
        // 爆炸效果
        setTimeout(() => {
            explosion.style.width = '200vw';
            explosion.style.height = '200vw';
            explosion.style.background = 'transparent';
            explosion.style.boxShadow = 'none';
        }, 50);
        
        // 创建爆炸波纹
        const waveCount = 5;
        for (let i = 0; i < waveCount; i++) {
            const wave = document.createElement('div');
            wave.className = 'explosion-wave';
            wave.style.position = 'absolute';
            wave.style.width = '5px';
            wave.style.height = '5px';
            wave.style.borderRadius = '50%';
            wave.style.border = `2px solid rgba(100, 180, 255, ${0.8 - i * 0.15})`;
            wave.style.top = '50%';
            wave.style.left = '50%';
            wave.style.transform = 'translate(-50%, -50%)';
            wave.style.transition = `all ${0.8 + i * 0.2}s cubic-bezier(0.1, 0.9, 0.2, 1)`;
            wave.style.opacity = '0.9';
            
            container.appendChild(wave);
            cosmicEffectElements.push(wave);
            
            setTimeout(() => {
                wave.style.width = `${100 + i * 30}vw`;
                wave.style.height = `${100 + i * 30}vw`;
                wave.style.opacity = '0';
                wave.style.border = `2px solid rgba(100, 180, 255, ${0.3 - i * 0.05})`;
            }, 100 + i * 120);
        }
        
        // 创建爆炸粒子
        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'explosion-particle';
            particle.style.position = 'absolute';
            particle.style.width = `${2 + Math.random() * 4}px`;
            particle.style.height = `${10 + Math.random() * 20}px`;
            particle.style.backgroundColor = `rgba(150, 220, 255, ${0.7 + Math.random() * 0.3})`;
            particle.style.boxShadow = '0 0 10px rgba(100, 180, 255, 0.8)';
            particle.style.borderRadius = '50%';
            particle.style.top = '50%';
            particle.style.left = '50%';
            particle.style.transform = 'translate(-50%, -50%)';
            particle.style.opacity = '1';
            
            container.appendChild(particle);
            cosmicEffectElements.push(particle);
            
            // 粒子爆炸轨迹
            const angle = Math.random() * Math.PI * 2;
            const distance = 20 + Math.random() * 60;
            const duration = 0.8 + Math.random() * 1.2;
            
            setTimeout(() => {
                particle.style.transition = `all ${duration}s cubic-bezier(0.1, 0.9, 0.2, 1)`;
                particle.style.transform = `translate(calc(-50% + ${Math.cos(angle) * distance}vw), calc(-50% + ${Math.sin(angle) * distance}vh)) rotate(${Math.random() * 360}deg)`;
                particle.style.opacity = '0';
            }, 50);
        }
        
        // 创建爆炸光芒
        const rayCount = 20;
        for (let i = 0; i < rayCount; i++) {
            const ray = document.createElement('div');
            ray.className = 'explosion-ray';
            ray.style.position = 'absolute';
            ray.style.width = '2px';
            ray.style.height = '10px';
            ray.style.backgroundColor = 'rgba(150, 220, 255, 0.9)';
            ray.style.boxShadow = '0 0 10px rgba(100, 180, 255, 0.8)';
            ray.style.top = '50%';
            ray.style.left = '50%';
            ray.style.transformOrigin = 'center bottom';
            ray.style.opacity = '1';
            
            const angle = (i / rayCount) * Math.PI * 2;
            ray.style.transform = `translate(-50%, -50%) rotate(${angle}rad)`;
            
            container.appendChild(ray);
            cosmicEffectElements.push(ray);
            
            // 光芒延展
            setTimeout(() => {
                ray.style.transition = `all 1s cubic-bezier(0.1, 0.9, 0.2, 1)`;
                ray.style.height = `${30 + Math.random() * 40}vh`;
                ray.style.opacity = '0';
            }, 100 + Math.random() * 300);
        }
    }
    
    // 创建星际漩涡
    function createCosmicVortex(container) {
        const vortexCount = 3;
        
        for (let i = 0; i < vortexCount; i++) {
            const vortex = document.createElement('div');
            vortex.className = 'cosmic-vortex';
            vortex.style.position = 'absolute';
            vortex.style.width = '100vh';
            vortex.style.height = '100vh';
            vortex.style.borderRadius = '50%';
            vortex.style.background = `radial-gradient(circle, rgba(0,190,255,0.15) 0%, rgba(10,30,180,0.1) 40%, rgba(0,10,60,0.05) 60%, transparent 70%)`;
            vortex.style.boxShadow = '0 0 100px rgba(0,150,255,0.1) inset';
            vortex.style.transform = 'translate(-50%, -50%) scale(0)';
            vortex.style.top = '50%';
            vortex.style.left = '50%';
            vortex.style.opacity = '0';
            vortex.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
            
            // 使用CSS动画创建旋转效果
            vortex.style.animation = `spin-${i} ${8 + i * 4}s linear infinite`;
            
            // 创建关键帧动画
            const styleSheet = document.styleSheets[0];
            const keyframes = `
                @keyframes spin-${i} {
                    0% { transform: translate(-50%, -50%) scale(${0.5 + i * 0.5}) rotate(0deg); }
                    100% { transform: translate(-50%, -50%) scale(${0.5 + i * 0.5}) rotate(${i % 2 === 0 ? 360 : -360}deg); }
                }
            `;
            
            // 添加关键帧到样式表
            try {
                styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
            } catch (e) {
                // 如果无法直接插入，创建新的样式标签
                const style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = keyframes;
                document.head.appendChild(style);
            }
            
            container.appendChild(vortex);
            cosmicEffectElements.push(vortex);
            
            // 延迟显示，创造层次感
            setTimeout(() => {
                vortex.style.opacity = '1';
                vortex.style.transform = `translate(-50%, -50%) scale(${0.5 + i * 0.5})`;
            }, 200 * i);
        }
    }
    
    // 创建星际尘埃
    function createCosmicDust(container) {
        // 使用Canvas创建星际尘埃
        const canvas = document.createElement('canvas');
        canvas.className = 'cosmic-dust';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.opacity = '0';
        canvas.style.transition = 'opacity 1s ease-out';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        container.appendChild(canvas);
        cosmicEffectElements.push(canvas);
        
        const ctx = canvas.getContext('2d');
        
        // 创建尘埃粒子
        const dustCount = 800;
        const dustParticles = [];
        
        for (let i = 0; i < dustCount; i++) {
            dustParticles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5,
                color: `rgba(${150 + Math.random() * 100}, ${180 + Math.random() * 75}, ${200 + Math.random() * 55}, ${0.1 + Math.random() * 0.3})`,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                angle: Math.random() * Math.PI * 2,
                angularVelocity: (Math.random() - 0.5) * 0.01,
                distance: 10 + Math.random() * 5
            });
        }
        
        // 延迟显示
        setTimeout(() => {
            canvas.style.opacity = '1';
            
            // 动画函数
            function animateDust() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // 绘制尘埃
                for (let i = 0; i < dustParticles.length; i++) {
                    const dust = dustParticles[i];
                    
                    // 更新位置和角度
                    dust.x += dust.vx;
                    dust.y += dust.vy;
                    dust.angle += dust.angularVelocity;
                    
                    // 边界检查
                    if (dust.x < 0) dust.x = canvas.width;
                    if (dust.x > canvas.width) dust.x = 0;
                    if (dust.y < 0) dust.y = canvas.height;
                    if (dust.y > canvas.height) dust.y = 0;
                    
                    // 绘制尘埃
                    ctx.beginPath();
                    ctx.arc(dust.x, dust.y, dust.radius, 0, Math.PI * 2);
                    ctx.fillStyle = dust.color;
                    ctx.fill();
                    
                    // 绘制光轨 (对10%的尘埃)
                    if (Math.random() < 0.1) {
                        ctx.beginPath();
                        ctx.moveTo(dust.x, dust.y);
                        const trailX = dust.x - dust.vx * dust.distance;
                        const trailY = dust.y - dust.vy * dust.distance;
                        ctx.lineTo(trailX, trailY);
                        ctx.strokeStyle = dust.color.replace(/[\d\.]+\)$/g, '0.05)');
                        ctx.stroke();
                    }
                }
                
                if (isEffectActive) {
                    requestAnimationFrame(animateDust);
                }
            }
            
            animateDust();
        }, 800);
    }
    
    // 创建能量波动
    function createEnergyWaves(container) {
        const waveCount = 7;
        
        for (let i = 0; i < waveCount; i++) {
            const wave = document.createElement('div');
            wave.className = 'cosmic-wave';
            wave.style.position = 'absolute';
            wave.style.width = `${10 + i * 10}vh`;
            wave.style.height = `${10 + i * 10}vh`;
            wave.style.borderRadius = '50%';
            wave.style.border = `1px solid rgba(80,130,255,${0.2 - i * 0.02})`;
            wave.style.boxShadow = `0 0 20px rgba(0,100,255,${0.15 - i * 0.015})`;
            wave.style.transform = 'translate(-50%, -50%) scale(0)';
            wave.style.top = '50%';
            wave.style.left = '50%';
            wave.style.opacity = '0';
            
            container.appendChild(wave);
            cosmicEffectElements.push(wave);
            
            // 设置波纹扩散动画
            setTimeout(() => {
                wave.style.transition = `all ${2 + i * 0.5}s cubic-bezier(0, 0.55, 0.45, 1)`;
                wave.style.opacity = '1';
                wave.style.transform = 'translate(-50%, -50%) scale(3)';
                
                // 周期性重置波纹
                setInterval(() => {
                    wave.style.opacity = '0';
                    wave.style.transform = 'translate(-50%, -50%) scale(0.1)';
                    
                    // 延迟后重新开始波纹扩散
                    setTimeout(() => {
                        wave.style.opacity = '1';
                        wave.style.transform = 'translate(-50%, -50%) scale(3)';
                    }, 100);
                }, (2 + i * 0.5) * 1000);
            }, 300 * i);
        }
    }
    
    // 创建星际光束
    function createCosmicBeams(container) {
        const beamCount = 15;
        const colors = [
            'rgba(0,150,255,0.2)', 
            'rgba(50,100,255,0.15)', 
            'rgba(100,80,255,0.18)',
            'rgba(0,200,255,0.15)', 
            'rgba(80,140,220,0.12)'
        ];
        
        for (let i = 0; i < beamCount; i++) {
            const beam = document.createElement('div');
            beam.className = 'cosmic-beam';
            beam.style.position = 'absolute';
            beam.style.width = `${0.5 + Math.random() * 1.5}px`;
            beam.style.height = `${20 + Math.random() * 30}vh`;
            beam.style.background = colors[Math.floor(Math.random() * colors.length)];
            beam.style.boxShadow = '0 0 8px rgba(100,180,255,0.6)';
            beam.style.borderRadius = '50px';
            
            // 随机位置
            const angle = Math.random() * Math.PI * 2;
            const distance = 15 + Math.random() * 30;
            const x = 50 + Math.cos(angle) * distance;
            const y = 50 + Math.sin(angle) * distance;
            
            beam.style.top = '50%';
            beam.style.left = '50%';
            beam.style.transform = `translate(-50%, -50%) rotate(${angle}rad) translateY(${distance}vh)`;
            beam.style.transformOrigin = 'center bottom';
            beam.style.opacity = '0';
            
            container.appendChild(beam);
            cosmicEffectElements.push(beam);
            
            // 延迟显示
            setTimeout(() => {
                beam.style.transition = `opacity 0.5s ease-out, transform ${1 + Math.random() * 2}s ease-out`;
                beam.style.opacity = Math.random() * 0.4 + 0.1;
                
                // 添加轻微的摆动动画
                const swayAnimation = `sway-${i} ${3 + Math.random() * 4}s ease-in-out infinite alternate`;
                beam.style.animation = swayAnimation;
                
                // 创建关键帧动画
                const swayKeyframes = `
                    @keyframes sway-${i} {
                        0% { transform: translate(-50%, -50%) rotate(${angle - 0.05}rad) translateY(${distance}vh); }
                        100% { transform: translate(-50%, -50%) rotate(${angle + 0.05}rad) translateY(${distance}vh); }
                    }
                `;
                
                // 添加关键帧到样式表
                try {
                    document.styleSheets[0].insertRule(swayKeyframes, document.styleSheets[0].cssRules.length);
                } catch (e) {
                    const style = document.createElement('style');
                    style.type = 'text/css';
                    style.innerHTML = swayKeyframes;
                    document.head.appendChild(style);
                }
            }, 500 + Math.random() * 1000);
        }
    }
    
    // 创建时空扭曲
    function createSpaceDistortion(container) {
        const distortion = document.createElement('div');
        distortion.className = 'space-distortion';
        distortion.style.position = 'absolute';
        distortion.style.top = '0';
        distortion.style.left = '0';
        distortion.style.width = '100%';
        distortion.style.height = '100%';
        distortion.style.backdropFilter = 'blur(0px)';
        distortion.style.transition = 'backdrop-filter 3s ease-in-out';
        distortion.style.pointerEvents = 'none';
        
        container.appendChild(distortion);
        cosmicEffectElements.push(distortion);
        
        // 逐渐增加模糊效果
        setTimeout(() => {
            distortion.style.backdropFilter = 'blur(2px) hue-rotate(10deg)';
            
            // 周期性变化
            let phase = 0;
            setInterval(() => {
                phase = (phase + 1) % 4;
                switch(phase) {
                    case 0:
                        distortion.style.backdropFilter = 'blur(2px) hue-rotate(10deg)';
                        break;
                    case 1:
                        distortion.style.backdropFilter = 'blur(1px) hue-rotate(-5deg)';
                        break;
                    case 2:
                        distortion.style.backdropFilter = 'blur(3px) hue-rotate(5deg)';
                        break;
                    case 3:
                        distortion.style.backdropFilter = 'blur(1.5px) hue-rotate(0deg)';
                        break;
                }
            }, 2000);
        }, 500);
    }
    
    // 创建量子粒子
    function createQuantumParticles(container) {
        const particleCount = 150;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'quantum-particle';
            particle.style.position = 'absolute';
            particle.style.width = `${1 + Math.random() * 3}px`;
            particle.style.height = `${1 + Math.random() * 3}px`;
            
            // 随机颜色
            const hue = Math.random() * 60 + 200; // 蓝色到紫色范围
            particle.style.backgroundColor = `hsla(${hue}, 100%, 70%, ${0.3 + Math.random() * 0.5})`;
            particle.style.boxShadow = `0 0 ${2 + Math.random() * 4}px hsla(${hue}, 100%, 70%, 0.8)`;
            particle.style.borderRadius = '50%';
            
            // 随机位置（聚集在中心周围）
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.pow(Math.random(), 0.5) * 40; // 更聚集在中心
            const x = 50 + Math.cos(angle) * distance;
            const y = 50 + Math.sin(angle) * distance;
            
            particle.style.top = `${y}%`;
            particle.style.left = `${x}%`;
            particle.style.opacity = '0';
            
            container.appendChild(particle);
            cosmicEffectElements.push(particle);
            
            // 延迟出现，创造层次感
            setTimeout(() => {
                particle.style.transition = `opacity 1s ease-out, transform 2s ease-out`;
                particle.style.opacity = Math.random() * 0.4 + 0.2;
                
                // 添加随机运动动画
                const moveX = (Math.random() - 0.5) * 10;
                const moveY = (Math.random() - 0.5) * 10;
                const duration = 3 + Math.random() * 7;
                
                // 创建关键帧动画
                const moveKeyframes = `
                    @keyframes move-${i} {
                        0%, 100% { transform: translate(0, 0) scale(1); opacity: ${Math.random() * 0.4 + 0.2}; }
                        50% { transform: translate(${moveX}px, ${moveY}px) scale(${0.8 + Math.random() * 0.4}); opacity: ${Math.random() * 0.7 + 0.3}; }
                    }
                `;
                
                // 添加关键帧到样式表
                try {
                    document.styleSheets[0].insertRule(moveKeyframes, document.styleSheets[0].cssRules.length);
                } catch (e) {
                    const style = document.createElement('style');
                    style.type = 'text/css';
                    style.innerHTML = moveKeyframes;
                    document.head.appendChild(style);
                }
                
                particle.style.animation = `move-${i} ${duration}s ease-in-out infinite`;
            }, 1000 + Math.random() * 2000);
        }
    }
    
    // 创建星际网络
    function createCosmicWeb(container) {
        const canvas = document.createElement('canvas');
        canvas.className = 'cosmic-web';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.opacity = '0';
        canvas.style.transition = 'opacity 2s ease-out';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        container.appendChild(canvas);
        cosmicEffectElements.push(canvas);
        
        const ctx = canvas.getContext('2d');
        
        // 创建节点
        const nodeCount = 50;
        const nodes = [];
        
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: 1 + Math.random() * 2
            });
        }
        
        // 延迟显示
        setTimeout(() => {
            canvas.style.opacity = '0.6';
            
            // 动画函数
            function drawWeb() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // 绘制连线
                ctx.strokeStyle = 'rgba(80, 130, 255, 0.1)';
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                
                for (let i = 0; i < nodes.length; i++) {
                    for (let j = i + 1; j < nodes.length; j++) {
                        const dx = nodes[i].x - nodes[j].x;
                        const dy = nodes[i].y - nodes[j].y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance < 150) {
                            ctx.moveTo(nodes[i].x, nodes[i].y);
                            ctx.lineTo(nodes[j].x, nodes[j].y);
                            
                            // 距离越近，连线越亮
                            ctx.strokeStyle = `rgba(80, 130, 255, ${0.2 - distance / 150 * 0.18})`;
                        }
                    }
                }
                ctx.stroke();
                
                // 绘制节点
                for (let i = 0; i < nodes.length; i++) {
                    const node = nodes[i];
                    
                    // 移动节点
                    node.x += node.vx;
                    node.y += node.vy;
                    
                    // 边界检查
                    if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
                    if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
                    
                    // 绘制节点
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(150, 200, 255, 0.8)';
                    ctx.fill();
                    
                    // 绘制光晕
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, node.radius * 2, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(100, 150, 255, 0.2)';
                    ctx.fill();
                }
                
                if (isEffectActive) {
                    requestAnimationFrame(drawWeb);
                }
            }
            
            drawWeb();
        }, 1000);
    }
    
    // 动画控制函数
    function animateCosmicEffect() {
        const now = Date.now();
        const elapsed = now - effectStartTime;
        
        // 控制特效持续时间
        if (elapsed > 15000) { // 延长到15秒
            stopCosmicEffect();
            return;
        }
        
        // 检查是否应该触发宇宙折叠特效
        if (elapsed > 11000 && !cosmicEffectElements.some(el => el.classList && el.classList.contains('space-fold'))) {
            createSpaceFoldEffect();
        }
        
        // 检查是否应该触发最终能量收束特效
        if (elapsed > 13500 && !cosmicEffectElements.some(el => el.classList && el.classList.contains('energy-convergence'))) {
            createEnergyConvergence();
        }
        
        // 更新特效动画
        updateCosmicEffect(elapsed);
        
        // 继续下一帧
        animationFrameId = requestAnimationFrame(animateCosmicEffect);
    }
    
    // 更新特效动画
    function updateCosmicEffect(elapsed) {
        // 在这里可以根据elapsed时间更新各种特效的属性
        // 例如亮度、大小、位置等
    }
    
    // 停止宇宙特效
    function stopCosmicEffect() {
        if (!isEffectActive) return;
        
        isEffectActive = false;
        
        // 取消动画帧
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        
        // 逐渐移除所有特效元素
        cosmicEffectElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.transition = 'opacity 1s ease-out';
                element.style.opacity = '0';
                
                // 完全消失后从DOM中移除
                setTimeout(() => {
                    if (element.parentNode) {
                        element.parentNode.removeChild(element);
                    }
                }, 1000);
            }, index * 50); // 错开消失时间，创造渐进效果
        });
        
        // 清空特效元素数组
        setTimeout(() => {
            cosmicEffectElements = [];
        }, 1500);
    }
    
    // 创建宇宙折叠特效
    function createSpaceFoldEffect() {
        // 创建折叠特效容器
        const foldContainer = document.createElement('div');
        foldContainer.className = 'space-fold';
        foldContainer.style.position = 'absolute';
        foldContainer.style.top = '0';
        foldContainer.style.left = '0';
        foldContainer.style.width = '100%';
        foldContainer.style.height = '100%';
        foldContainer.style.zIndex = '1002';
        foldContainer.style.pointerEvents = 'none';
        foldContainer.style.opacity = '0';
        foldContainer.style.transition = 'opacity 1s ease-in';
        
        // 将折叠特效添加到当前特效容器
        const mainContainer = cosmicEffectElements.find(el => el.className === 'cosmic-effect-container');
        if (mainContainer) {
            mainContainer.appendChild(foldContainer);
            cosmicEffectElements.push(foldContainer);
            
            // 创建折叠层
            createFoldLayers(foldContainer);
            
            // 逐渐显示折叠特效
            setTimeout(() => {
                foldContainer.style.opacity = '1';
                
                // 添加脉冲光波
                createPulseWave(mainContainer);
            }, 100);
        }
    }
    
    // 创建折叠层
    function createFoldLayers(container) {
        // 创建多层时空折叠，每层有不同的视觉效果
        const layerCount = 5;
        const colors = [
            'rgba(0, 100, 255, 0.08)',
            'rgba(50, 150, 255, 0.06)',
            'rgba(100, 200, 255, 0.07)',
            'rgba(150, 220, 255, 0.05)',
            'rgba(200, 230, 255, 0.04)'
        ];
        
        for (let i = 0; i < layerCount; i++) {
            // 创建折叠层
            const layer = document.createElement('div');
            layer.className = 'fold-layer';
            layer.style.position = 'absolute';
            layer.style.top = '0';
            layer.style.left = '0';
            layer.style.width = '100%';
            layer.style.height = '100%';
            layer.style.background = `radial-gradient(circle at 50% 50%, transparent 0%, ${colors[i]} 50%, transparent 100%)`;
            layer.style.transform = 'scale(0.1)';
            layer.style.opacity = '0';
            layer.style.transition = `all ${1.5 + i * 0.3}s cubic-bezier(0.1, 0.8, 0.2, 1)`;
            
            container.appendChild(layer);
            
            // 设置层的动画
            setTimeout(() => {
                layer.style.transform = 'scale(1.5)';
                layer.style.opacity = '1';
            }, 200 * i);
            
            // 创建折叠线（空间裂痕）
            createFoldLines(layer, 20 + i * 10);
        }
    }
    
    // 创建折叠线（空间裂痕）
    function createFoldLines(layer, count) {
        for (let i = 0; i < count; i++) {
            const line = document.createElement('div');
            line.className = 'fold-line';
            line.style.position = 'absolute';
            line.style.backgroundColor = `rgba(150, 220, 255, ${0.1 + Math.random() * 0.4})`;
            line.style.boxShadow = '0 0 8px rgba(100, 180, 255, 0.6)';
            line.style.borderRadius = '50px';
            
            // 随机位置和尺寸
            const width = 0.5 + Math.random() * 1;
            const height = 5 + Math.random() * 40;
            const top = Math.random() * 100;
            const left = Math.random() * 100;
            const angle = Math.random() * 180;
            
            line.style.width = `${width}px`;
            line.style.height = `${height}vh`;
            line.style.top = `${top}%`;
            line.style.left = `${left}%`;
            line.style.transform = `rotate(${angle}deg)`;
            line.style.opacity = '0';
            line.style.transition = `opacity ${0.5 + Math.random()}s ease-in-out`;
            
            layer.appendChild(line);
            
            // 延迟显示
            setTimeout(() => {
                line.style.opacity = `${0.2 + Math.random() * 0.3}`;
                
                // 周期性闪烁
                setInterval(() => {
                    const newOpacity = 0.1 + Math.random() * 0.4;
                    line.style.opacity = `${newOpacity}`;
                }, 1000 + Math.random() * 2000);
            }, 300 + Math.random() * 500);
        }
    }
    
    // 创建脉冲光波
    function createPulseWave(container) {
        // 创建一个脉冲光波容器
        const pulseContainer = document.createElement('div');
        pulseContainer.className = 'pulse-wave-container';
        pulseContainer.style.position = 'absolute';
        pulseContainer.style.top = '50%';
        pulseContainer.style.left = '50%';
        pulseContainer.style.transform = 'translate(-50%, -50%)';
        pulseContainer.style.zIndex = '1003';
        pulseContainer.style.pointerEvents = 'none';
        
        container.appendChild(pulseContainer);
        cosmicEffectElements.push(pulseContainer);
        
        // 创建多个脉冲波
        const waveCount = 3;
        for (let i = 0; i < waveCount; i++) {
            const wave = document.createElement('div');
            wave.className = 'pulse-wave';
            wave.style.position = 'absolute';
            wave.style.top = '50%';
            wave.style.left = '50%';
            wave.style.width = '10vmin';
            wave.style.height = '10vmin';
            wave.style.borderRadius = '50%';
            wave.style.transform = 'translate(-50%, -50%) scale(0.1)';
            wave.style.boxShadow = `0 0 50px 20px rgba(100, 200, 255, ${0.3 - i * 0.05})`;
            wave.style.opacity = '0';
            
            pulseContainer.appendChild(wave);
            
            // 设置周期性脉冲
            setTimeout(() => {
                // 创建脉冲动画
                const pulseKeyframes = `
                    @keyframes pulse-wave-${i} {
                        0% { transform: translate(-50%, -50%) scale(0.1); opacity: 0.8; }
                        100% { transform: translate(-50%, -50%) scale(8); opacity: 0; }
                    }
                `;
                
                // 添加关键帧到样式表
                try {
                    document.styleSheets[0].insertRule(pulseKeyframes, document.styleSheets[0].cssRules.length);
                } catch (e) {
                    const style = document.createElement('style');
                    style.type = 'text/css';
                    style.innerHTML = pulseKeyframes;
                    document.head.appendChild(style);
                }
                
                // 应用动画
                wave.style.animation = `pulse-wave-${i} ${2 + i * 0.5}s ease-out infinite`;
                wave.style.animationDelay = `${i * 0.7}s`;
                wave.style.opacity = '1';
            }, 500 + i * 200);
        }
    }
    
    // 创建能量收束特效
    function createEnergyConvergence() {
        // 获取主容器
        const mainContainer = cosmicEffectElements.find(el => el.className === 'cosmic-effect-container');
        if (!mainContainer) return;
        
        // 创建能量收束容器
        const convergenceContainer = document.createElement('div');
        convergenceContainer.className = 'energy-convergence';
        convergenceContainer.style.position = 'absolute';
        convergenceContainer.style.top = '0';
        convergenceContainer.style.left = '0';
        convergenceContainer.style.width = '100%';
        convergenceContainer.style.height = '100%';
        convergenceContainer.style.zIndex = '1005';
        convergenceContainer.style.pointerEvents = 'none';
        
        mainContainer.appendChild(convergenceContainer);
        cosmicEffectElements.push(convergenceContainer);
        
        // 创建中心能量球
        createEnergyCore(convergenceContainer);
        
        // 创建能量射线
        createEnergyRays(convergenceContainer, 40);
        
        // 创建聚集粒子
        createConvergingParticles(convergenceContainer, 200);
    }
    
    // 创建中心能量球
    function createEnergyCore(container) {
        const core = document.createElement('div');
        core.className = 'energy-core';
        core.style.position = 'absolute';
        core.style.top = '50%';
        core.style.left = '50%';
        core.style.width = '5vmin';
        core.style.height = '5vmin';
        core.style.borderRadius = '50%';
        core.style.background = 'rgba(150, 230, 255, 0.9)';
        core.style.boxShadow = '0 0 20px 5px rgba(100, 200, 255, 0.8), 0 0 40px 15px rgba(80, 150, 255, 0.6)';
        core.style.transform = 'translate(-50%, -50%) scale(0)';
        core.style.opacity = '0';
        core.style.transition = 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
        
        container.appendChild(core);
        
        // 激活能量球
        setTimeout(() => {
            core.style.opacity = '1';
            core.style.transform = 'translate(-50%, -50%) scale(1)';
            
            // 脉动效果
            core.style.animation = 'energy-core-pulse 1.5s ease-in-out infinite alternate';
            
            // 添加脉动动画关键帧
            const pulseKeyframes = `
                @keyframes energy-core-pulse {
                    0% { transform: translate(-50%, -50%) scale(0.9); box-shadow: 0 0 20px 5px rgba(100, 200, 255, 0.7), 0 0 40px 15px rgba(80, 150, 255, 0.5); }
                    100% { transform: translate(-50%, -50%) scale(1.1); box-shadow: 0 0 30px 10px rgba(100, 200, 255, 0.9), 0 0 60px 25px rgba(80, 150, 255, 0.7); }
                }
            `;
            
            try {
                document.styleSheets[0].insertRule(pulseKeyframes, document.styleSheets[0].cssRules.length);
            } catch (e) {
                const style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = pulseKeyframes;
                document.head.appendChild(style);
            }
        }, 100);
        
        // 最后的爆发效果
        setTimeout(() => {
            core.style.transform = 'translate(-50%, -50%) scale(1.5)';
            core.style.opacity = '0.95';
            core.style.boxShadow = '0 0 50px 20px rgba(150, 230, 255, 0.9), 0 0 100px 40px rgba(100, 200, 255, 0.8)';
            core.style.background = 'rgba(200, 240, 255, 0.95)';
            core.style.animation = 'none';
            
            // 添加最终闪光
            setTimeout(() => {
                const finalFlash = document.createElement('div');
                finalFlash.className = 'final-flash';
                finalFlash.style.position = 'absolute';
                finalFlash.style.top = '0';
                finalFlash.style.left = '0';
                finalFlash.style.width = '100%';
                finalFlash.style.height = '100%';
                finalFlash.style.background = 'rgba(200, 240, 255, 0)';
                finalFlash.style.zIndex = '1006';
                finalFlash.style.transition = 'background 0.5s ease-out';
                
                container.appendChild(finalFlash);
                
                // 闪光效果
                setTimeout(() => {
                    finalFlash.style.background = 'rgba(200, 240, 255, 0.9)';
                    
                    // 闪光消失
                    setTimeout(() => {
                        finalFlash.style.transition = 'background 1s ease-out';
                        finalFlash.style.background = 'rgba(200, 240, 255, 0)';
                    }, 200);
                }, 50);
            }, 700);
        }, 900);
    }
    
    // 创建能量射线
    function createEnergyRays(container, count) {
        for (let i = 0; i < count; i++) {
            const ray = document.createElement('div');
            ray.className = 'energy-ray';
            ray.style.position = 'absolute';
            ray.style.top = '50%';
            ray.style.left = '50%';
            ray.style.transformOrigin = '0 0';
            ray.style.pointerEvents = 'none';
            
            // 随机角度
            const angle = (i / count) * 360 + Math.random() * (360 / count);
            
            // 随机长度和宽度
            const length = 30 + Math.random() * 50; // vmin单位
            const width = 0.5 + Math.random() * 1.5;
            
            ray.style.width = `${width}px`;
            ray.style.height = `${length}vmin`;
            ray.style.backgroundColor = `rgba(150, 230, 255, ${0.3 + Math.random() * 0.4})`;
            ray.style.boxShadow = '0 0 8px rgba(100, 180, 255, 0.6)';
            ray.style.borderRadius = '2px';
            ray.style.transform = `rotate(${angle}deg) translateX(5vmin)`;
            ray.style.opacity = '0';
            ray.style.transition = `all ${0.5 + Math.random() * 0.5}s ease-out`;
            
            container.appendChild(ray);
            
            // 延迟出现
            setTimeout(() => {
                ray.style.opacity = '1';
                ray.style.transform = `rotate(${angle}deg) translateX(2vmin)`;
                
                // 脉动效果
                setTimeout(() => {
                    const pulseKeyframes = `
                        @keyframes ray-pulse-${i} {
                            0% { transform: rotate(${angle}deg) translateX(2vmin); opacity: ${0.3 + Math.random() * 0.4}; }
                            50% { transform: rotate(${angle}deg) translateX(1vmin); opacity: ${0.5 + Math.random() * 0.4}; }
                            100% { transform: rotate(${angle}deg) translateX(2vmin); opacity: ${0.3 + Math.random() * 0.4}; }
                        }
                    `;
                    
                    try {
                        document.styleSheets[0].insertRule(pulseKeyframes, document.styleSheets[0].cssRules.length);
                    } catch (e) {
                        const style = document.createElement('style');
                        style.type = 'text/css';
                        style.innerHTML = pulseKeyframes;
                        document.head.appendChild(style);
                    }
                    
                    ray.style.animation = `ray-pulse-${i} ${1 + Math.random()}s ease-in-out infinite`;
                }, 500);
                
                // 为最终效果准备：光线收缩
                setTimeout(() => {
                    ray.style.animation = 'none';
                    ray.style.transition = 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
                    ray.style.transform = `rotate(${angle}deg) translateX(0)`;
                    ray.style.width = `${width * 1.5}px`;
                    ray.style.opacity = '0.9';
                    ray.style.backgroundColor = `rgba(180, 240, 255, ${0.7 + Math.random() * 0.3})`;
                    ray.style.boxShadow = '0 0 12px rgba(150, 220, 255, 0.8)';
                }, 900);
            }, 200 + Math.random() * 300);
        }
    }
    
    // 创建聚集粒子
    function createConvergingParticles(container, count) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'converging-particle';
            particle.style.position = 'absolute';
            particle.style.width = `${1 + Math.random() * 3}px`;
            particle.style.height = `${1 + Math.random() * 3}px`;
            particle.style.backgroundColor = `rgba(150, 230, 255, ${0.6 + Math.random() * 0.4})`;
            particle.style.boxShadow = `0 0 ${2 + Math.random() * 4}px rgba(100, 180, 255, 0.7)`;
            particle.style.borderRadius = '50%';
            particle.style.zIndex = '1004';
            particle.style.opacity = '0';
            particle.style.transition = `all ${0.5 + Math.random() * 1}s cubic-bezier(0.2, 0.9, 0.1, 1)`;
            
            // 随机起始位置（在屏幕边缘）
            const side = Math.floor(Math.random() * 4); // 0: 上, 1: 右, 2: 下, 3: 左
            let x, y;
            
            switch (side) {
                case 0: // 上边
                    x = Math.random() * 100;
                    y = -5;
                    break;
                case 1: // 右边
                    x = 105;
                    y = Math.random() * 100;
                    break;
                case 2: // 下边
                    x = Math.random() * 100;
                    y = 105;
                    break;
                case 3: // 左边
                    x = -5;
                    y = Math.random() * 100;
                    break;
            }
            
            particle.style.left = `${x}%`;
            particle.style.top = `${y}%`;
            
            container.appendChild(particle);
            
            // 使粒子可见
            setTimeout(() => {
                particle.style.opacity = '1';
            }, 100 + Math.random() * 200);
            
            // 向中心移动
            setTimeout(() => {
                particle.style.left = `${50 + (Math.random() - 0.5) * 10}%`;
                particle.style.top = `${50 + (Math.random() - 0.5) * 10}%`;
                
                // 最终收缩
                setTimeout(() => {
                    particle.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    particle.style.left = '50%';
                    particle.style.top = '50%';
                    particle.style.width = '1px';
                    particle.style.height = '1px';
                    
                    // 消失
                    setTimeout(() => {
                        particle.style.opacity = '0';
                    }, 300);
                }, 700);
            }, 200 + Math.random() * 300);
        }
    }
}); 