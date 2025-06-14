/**
 * 超级增强版主题选择器交互效果 - 鼠标跟踪、粒子效果和3D视差
 * 为主题选择器提供动态视觉效果和增强的用户体验
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化函数
    initThemeSelector();
});

// 初始化主题选择器
function initThemeSelector() {
    // 当打开主题选择器时（通过主题按钮触发）
    document.addEventListener('themeSelector:opened', function(e) {
        if (!e.detail || !e.detail.themeSelector) return;
        
        const themeSelector = e.detail.themeSelector;
        
        // 创建粒子效果容器
        createParticles(themeSelector);
        
        // 添加鼠标跟踪效果
        addMouseTracking(themeSelector);
        
        // 为选项添加3D视差效果
        add3DParallaxEffect(themeSelector);
        
        // 添加光束效果
        addLightBeams(themeSelector);
        
        // 添加触感反馈
        addTactileFeedback(themeSelector);
        
        // 为蓝色主题添加特殊效果
        if (document.body.classList.contains('blue-theme-classic') || 
            document.body.classList.contains('blue-theme-deep-sea') || 
            document.body.classList.contains('blue-theme-neon')) {
            addDeepSeaEffects(themeSelector);
        }
        
        // 为深海蓝主题添加特殊效果
        if (document.body.classList.contains('deepsea-theme')) {
            addDeepSeaEffects(themeSelector);
        }
    });
}

/**
 * 创建动态粒子效果
 */
function createParticles(container) {
    // 检查是否已有粒子容器
    let particlesContainer = container.querySelector('.particles');
    if (!particlesContainer) {
        particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        container.appendChild(particlesContainer);
    } else {
        // 清除现有粒子
        particlesContainer.innerHTML = '';
    }
    
    // 创建粒子
    const particleCount = container.classList.contains('rainbow-theme') ? 30 : 20;
    const colors = container.classList.contains('rainbow-theme') ? 
        ['#ff0080', '#ff8000', '#ffff00', '#00ff80', '#0080ff', '#8000ff'] :
        ['#00c6ff', '#0088ff', '#0044ff', '#0066cc', '#00ddff'];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // 随机大小
        const size = Math.random() * 6 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // 随机位置
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // 随机颜色
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.backgroundColor = color;
        particle.style.boxShadow = `0 0 ${size*2}px ${color}`;
        
        // 随机延迟
        particle.style.animationDelay = Math.random() * 5 + 's';
        
        particlesContainer.appendChild(particle);
    }
    
    // 添加鼠标移动时的粒子生成效果
    container.addEventListener('mousemove', function(e) {
        if (Math.random() > 0.7) { // 30%几率生成粒子
            const mouseX = e.clientX - container.getBoundingClientRect().left;
            const mouseY = e.clientY - container.getBoundingClientRect().top;
            
            createMouseParticle(particlesContainer, mouseX, mouseY, container.classList.contains('rainbow-theme'));
        }
    });
}

/**
 * 创建鼠标跟踪粒子
 */
function createMouseParticle(container, x, y, isRainbow) {
    const particle = document.createElement('div');
    particle.className = 'mouse-particle';
    
    // 应用样式
    const size = Math.random() * 10 + 4;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    
    // 彩虹或蓝色主题的颜色
    const colors = isRainbow ? 
        ['#ff0080', '#ff8000', '#ffff00', '#00ff80', '#0080ff', '#8000ff'] :
        ['#00c6ff', '#0088ff', '#0044ff', '#0066cc', '#00ddff'];
    
    const color = colors[Math.floor(Math.random() * colors.length)];
    particle.style.backgroundColor = color;
    particle.style.boxShadow = `0 0 ${size*2}px ${color}`;
    
    // 添加到容器
    container.appendChild(particle);
    
    // 动画结束后移除
    setTimeout(() => {
        if (particle.parentNode === container) {
            container.removeChild(particle);
        }
    }, 2000);
}

/**
 * 添加鼠标跟踪光效
 */
function addMouseTracking(container) {
    // 创建光标跟踪元素
    let cursorEffect = container.querySelector('.cursor-effect');
    if (!cursorEffect) {
        cursorEffect = document.createElement('div');
        cursorEffect.className = 'cursor-effect';
        container.appendChild(cursorEffect);
    }
    
    // 为主题选择器添加鼠标移动事件
    container.addEventListener('mousemove', function(e) {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 更新光标效果位置
        cursorEffect.style.left = x + 'px';
        cursorEffect.style.top = y + 'px';
        
        // 应用类以显示效果
        cursorEffect.classList.add('active');
        
        // 添加鼠标位置数据属性，用于视差计算
        container.setAttribute('data-mouse-x', (x / rect.width).toFixed(2));
        container.setAttribute('data-mouse-y', (y / rect.height).toFixed(2));
    });
    
    container.addEventListener('mouseleave', function() {
        // 隐藏光标效果
        cursorEffect.classList.remove('active');
    });
}

/**
 * 为主题选项添加3D视差效果
 */
function add3DParallaxEffect(container) {
    const options = container.querySelectorAll('.theme-option');
    
    // 鼠标移动时计算3D变换
    container.addEventListener('mousemove', function(e) {
        const rect = container.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // 计算鼠标到中心点的偏移比例
        const ratioX = (mouseX - centerX) / centerX;
        const ratioY = (mouseY - centerY) / centerY;
        
        // 应用到选项上，产生视差效果
        options.forEach(option => {
            if (!option.classList.contains('selected')) {
                // 悬停状态下有更强的3D效果
                if (option.matches(':hover')) {
                    option.style.transform = `
                        translateX(12px) 
                        scale(1.05) 
                        translateZ(8px) 
                        rotateX(${-ratioY * 10}deg) 
                        rotateY(${ratioX * 10}deg)
                    `;
                } else {
                    // 非悬停状态下的微妙3D效果
                    option.style.transform = `
                        translateX(0) 
                        scale(1) 
                        translateZ(0) 
                        rotateX(${-ratioY * 3}deg) 
                        rotateY(${ratioX * 3}deg)
                    `;
                }
            }
        });
    });
    
    // 鼠标移出时重置变换
    container.addEventListener('mouseleave', function() {
        options.forEach(option => {
            if (!option.classList.contains('selected')) {
                option.style.transform = '';
            }
        });
    });
}

/**
 * 添加光束效果
 */
function addLightBeams(container) {
    // 创建光束容器
    let beamsContainer = container.querySelector('.light-beams');
    if (!beamsContainer) {
        beamsContainer = document.createElement('div');
        beamsContainer.className = 'light-beams';
        container.appendChild(beamsContainer);
    } else {
        beamsContainer.innerHTML = '';
    }
    
    // 判断主题
    const isRainbow = container.classList.contains('rainbow-theme');
    
    // 创建光束
    const beamCount = 3;
    for (let i = 0; i < beamCount; i++) {
        const beam = document.createElement('div');
        beam.className = 'light-beam';
        
        // 设置光束的颜色和位置
        if (isRainbow) {
            beam.style.background = `
                linear-gradient(90deg, 
                transparent, 
                rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.15), 
                transparent)
            `;
        } else {
            beam.style.background = `
                linear-gradient(90deg, 
                transparent, 
                rgba(100, 200, 255, 0.15), 
                transparent)
            `;
        }
        
        // 随机旋转角度
        beam.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        // 随机动画延迟
        beam.style.animationDelay = `${Math.random() * 5}s`;
        
        beamsContainer.appendChild(beam);
    }
}

/**
 * 添加触感反馈效果
 */
function addTactileFeedback(container) {
    const options = container.querySelectorAll('.theme-option');
    
    options.forEach(option => {
        // 鼠标进入选项
        option.addEventListener('mouseenter', function() {
            if (!option.classList.contains('selected')) {
                // 添加进入动画类
                option.classList.add('option-enter');
                
                // 移除其他状态类
                option.classList.remove('option-leave');
                
                // 一段时间后移除动画类
                setTimeout(() => {
                    option.classList.remove('option-enter');
                }, 300);
                
                // 添加波纹效果
                createRippleEffect(option);
            }
        });
        
        // 鼠标离开选项
        option.addEventListener('mouseleave', function() {
            if (!option.classList.contains('selected')) {
                // 添加离开动画类
                option.classList.add('option-leave');
                
                // 一段时间后移除动画类
                setTimeout(() => {
                    option.classList.remove('option-leave');
                }, 300);
            }
        });
        
        // 点击选项时的波纹效果
        option.addEventListener('click', function(e) {
            createClickRipple(option, e.clientX, e.clientY);
        });
    });
}

/**
 * 为选项创建鼠标悬停波纹效果
 */
function createRippleEffect(element) {
    const ripple = document.createElement('div');
    ripple.className = 'option-ripple';
    element.appendChild(ripple);
    
    // 一段时间后移除波纹
    setTimeout(() => {
        if (ripple.parentNode === element) {
            element.removeChild(ripple);
        }
    }, 1000);
}

/**
 * 创建点击波纹效果
 */
function createClickRipple(element, clientX, clientY) {
    const rect = element.getBoundingClientRect();
    
    const ripple = document.createElement('div');
    ripple.className = 'option-click-ripple';
    
    // 设置波纹起始位置为鼠标点击位置
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    element.appendChild(ripple);
    
    // 一段时间后移除波纹
    setTimeout(() => {
        if (ripple.parentNode === element) {
            element.removeChild(ripple);
        }
    }, 1000);
}

/**
 * 为深海蓝主题添加特殊效果
 */
function addDeepSeaEffects(container) {
    // 检查是否为深海蓝主题
    if (!document.body.classList.contains('deep-sea')) return;
    
    // 添加深海蓝发光边框
    addDeepSeaGlowBorder(container);
    
    // 添加海底微粒
    addWaterParticles(container);
    
    // 添加气泡效果
    addBubbleEffect(container);
    
    // 添加水下光线效果
    addUnderwaterLightRays(container);
    
    // 添加动态水波纹效果
    addDynamicWaterRipples(container);
    
    // 添加深海蓝背景渲染效果
    addDeepSeaBackground(container);
    
    // 添加水下3D深度效果
    addUnderwater3DDepth(container);
    
    // 添加闪光效果到选项
    addShineEffectToOptions(container);
    
    // 添加水下闪光点效果
    addUnderwaterGlowingParticles(container);
    
    // 添加深度阴影效果
    addDepthShadowEffects(container);
    
    // 添加水下深度层效果
    addUnderwaterDepthLayers(container);
    
    // 添加水下折射效果
    addWaterRefractionEffect(container);
    
    // 初始化深海主题的交互动态效果
    initDeepSeaInteractiveEffects(container);
}

/**
 * 添加深海蓝发光边框
 */
function addDeepSeaGlowBorder(container) {
    let glowBorder = container.querySelector('.deep-sea-glow-border');
    if (!glowBorder) {
        glowBorder = document.createElement('div');
        glowBorder.className = 'deep-sea-glow-border';
        container.appendChild(glowBorder);
    }
}

/**
 * 添加海底微粒
 */
function addWaterParticles(container) {
    // 创建微粒容器
    let particlesContainer = container.querySelector('.water-dots');
    if (!particlesContainer) {
        particlesContainer = document.createElement('div');
        particlesContainer.className = 'water-dots';
        container.appendChild(particlesContainer);
    } else {
        particlesContainer.innerHTML = '';
    }
    
    // 创建微粒
    const particleCount = 70; // 增加微粒数量
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'water-particle';
        
        // 随机大小
        const size = Math.random() * 3 + 0.8;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // 随机位置
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // 随机亮度
        const brightness = Math.random() * 80 + 160; // 160-240
        particle.style.backgroundColor = `rgba(${brightness}, ${brightness + 20}, 255, ${Math.random() * 0.3 + 0.2})`;
        
        // 随机动画延迟
        particle.style.animationDelay = Math.random() * 10 + 's';
        
        // 随机动画持续时间
        particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
        
        particlesContainer.appendChild(particle);
    }
}

/**
 * 添加气泡效果
 */
function addBubbleEffect(container) {
    // 创建气泡容器
    let bubblesContainer = container.querySelector('.bubbles');
    if (!bubblesContainer) {
        bubblesContainer = document.createElement('div');
        bubblesContainer.className = 'bubbles';
        container.appendChild(bubblesContainer);
    } else {
        bubblesContainer.innerHTML = '';
    }
    
    // 创建气泡
    const bubbleCount = 30; // 增加气泡数量，提供更丰富的视觉效果
    for (let i = 0; i < bubbleCount; i++) {
        createBubble(bubblesContainer);
    }
    
    // 定期创建新气泡
    setInterval(() => {
        if (container.isConnected && document.body.classList.contains('deep-sea')) {
            createBubble(bubblesContainer);
            
            // 随机移除一些旧气泡以控制总数
            if (Math.random() > 0.7 && bubblesContainer.children.length > 35) {
                if (bubblesContainer.firstChild) {
                    bubblesContainer.removeChild(bubblesContainer.firstChild);
                }
            }
        }
    }, 600); // 更频繁地创建气泡
}

/**
 * 创建单个气泡
 */
function createBubble(container) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    // 随机大小 - 增加更多变化
    const size = Math.random() * 22 + 4;
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';
    
    // 随机位置
    bubble.style.left = Math.random() * 100 + '%';
    bubble.style.bottom = -size + 'px';
    
    // 随机延迟和速度 - 让气泡更自然
    const speed = Math.random() * 6 + 5;
    const delay = Math.random() * 4;
    bubble.style.animationDuration = speed + 's';
    bubble.style.animationDelay = delay + 's';
    
    // 随机透明度
    bubble.style.opacity = Math.random() * 0.6 + 0.3;
    
    // 添加反光效果
    const highlight = document.createElement('div');
    highlight.className = 'bubble-highlight';
    highlight.style.width = 40 + Math.random() * 20 + '%';
    highlight.style.height = 40 + Math.random() * 20 + '%';
    highlight.style.top = Math.random() * 40 + 10 + '%';
    highlight.style.left = Math.random() * 40 + 10 + '%';
    bubble.appendChild(highlight);
    
    container.appendChild(bubble);
    
    // 动画结束后移除
    setTimeout(() => {
        if (bubble.parentNode === container) {
            container.removeChild(bubble);
        }
    }, (speed + delay + 1) * 1000);
}

/**
 * 添加水下光线效果
 */
function addUnderwaterLightRays(container) {
    // 创建光线容器
    let raysContainer = container.querySelector('.light-rays');
    if (!raysContainer) {
        raysContainer = document.createElement('div');
        raysContainer.className = 'light-rays';
        container.appendChild(raysContainer);
    } else {
        raysContainer.innerHTML = '';
    }
    
    // 创建光线
    const rayCount = 10; // 增加光线数量
    for (let i = 0; i < rayCount; i++) {
        const ray = document.createElement('div');
        ray.className = 'light-ray';
        
        // 随机旋转角度
        ray.style.transform = `rotate(${Math.random() * 70 - 35}deg)`;
        
        // 随机位置
        ray.style.left = `${Math.random() * 120 - 10}%`;
        ray.style.top = `${Math.random() * 20 - 10}%`;
        
        // 随机延迟
        ray.style.animationDelay = Math.random() * 10 + 's';
        
        // 随机动画持续时间
        ray.style.animationDuration = (Math.random() * 8 + 8) + 's';
        
        // 随机宽度
        ray.style.width = `${Math.random() * 80 + 120}%`;
        
        // 随机透明度
        ray.style.opacity = Math.random() * 0.3 + 0.1;
        
        raysContainer.appendChild(ray);
    }
    
    // 定期刷新光线效果
    setInterval(() => {
        if (container.isConnected && document.body.classList.contains('deep-sea')) {
            // 随机重置一些光线的位置和角度
            const rays = raysContainer.querySelectorAll('.light-ray');
            rays.forEach(ray => {
                if (Math.random() > 0.7) {
                    ray.style.transform = `rotate(${Math.random() * 70 - 35}deg)`;
                    ray.style.left = `${Math.random() * 120 - 10}%`;
                    ray.style.top = `${Math.random() * 20 - 10}%`;
                    ray.style.opacity = Math.random() * 0.3 + 0.1;
                }
            });
        }
    }, 5000);
}

/**
 * 添加动态水波纹效果
 */
function addDynamicWaterRipples(container) {
    // 创建水波纹容器
    let ripplesContainer = container.querySelector('.water-ripples');
    if (!ripplesContainer) {
        ripplesContainer = document.createElement('div');
        ripplesContainer.className = 'water-ripples';
        container.appendChild(ripplesContainer);
    } else {
        ripplesContainer.innerHTML = '';
    }
    
    // 监听鼠标移动来创建水波纹 - 增强交互性
    container.addEventListener('mousemove', function(e) {
        if (Math.random() > 0.85) { // 15%概率创建波纹
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            createWaterRipple(ripplesContainer, x, y);
        }
    });
    
    // 监听点击创建波纹
    container.addEventListener('click', function(e) {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 点击时创建更大更显眼的波纹
        const ripple = createWaterRipple(ripplesContainer, x, y);
        ripple.classList.add('ripple-large');
    });
    
    // 随机位置创建波纹
    setInterval(() => {
        if (container.isConnected && document.body.classList.contains('deep-sea')) {
            const x = Math.random() * container.offsetWidth;
            const y = Math.random() * container.offsetHeight;
            
            if (Math.random() > 0.5) {
                createWaterRipple(ripplesContainer, x, y);
            }
        }
    }, 2000);
}

/**
 * 创建水波纹
 */
function createWaterRipple(container, x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'water-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    // 随机大小和透明度
    const opacity = Math.random() * 0.3 + 0.2;
    ripple.style.opacity = opacity.toString();
    
    container.appendChild(ripple);
    
    // 动画结束后移除
    setTimeout(() => {
        if (ripple.parentNode === container) {
            container.removeChild(ripple);
        }
    }, 3000);
    
    return ripple;
}

/**
 * 添加深海蓝背景渲染效果
 */
function addDeepSeaBackground(container) {
    // 检查背景容器
    let bgContainer = container.querySelector('.deep-sea-bg');
    if (!bgContainer) {
        bgContainer = document.createElement('div');
        bgContainer.className = 'deep-sea-bg';
        container.insertBefore(bgContainer, container.firstChild);
    }
    
    // 添加深海梯度背景
    const gradientOverlay = document.createElement('div');
    gradientOverlay.className = 'deep-sea-gradient';
    bgContainer.appendChild(gradientOverlay);
    
    // 添加深海噪点纹理
    const noiseTexture = document.createElement('div');
    noiseTexture.className = 'deep-sea-noise';
    bgContainer.appendChild(noiseTexture);
    
    // 添加海底流动效果
    const currentFlow = document.createElement('div');
    currentFlow.className = 'deep-sea-current';
    bgContainer.appendChild(currentFlow);
    
    // 添加深度模糊效果
    const depthBlur = document.createElement('div');
    depthBlur.className = 'deep-sea-depth-blur';
    bgContainer.appendChild(depthBlur);
}

/**
 * 添加水下3D深度效果
 */
function addUnderwater3DDepth(container) {
    // 添加深度感层
    const depthLayer = document.createElement('div');
    depthLayer.className = 'underwater-depth-layer';
    container.appendChild(depthLayer);
    
    // 为所有主题选项添加深度效果
    const options = container.querySelectorAll('.theme-option');
    options.forEach((option, index) => {
        // 设置不同的z-index来创建深度感
        option.style.zIndex = 10 + index;
        
        // 添加水中折射效果
        const refraction = document.createElement('div');
        refraction.className = 'underwater-refraction';
        option.appendChild(refraction);
        
        // 根据选项类型设置不同的深度
        if (option.classList.contains('blue-deep-sea')) {
            option.style.transform = 'translateZ(15px)';
            
            // 为深海选项添加特殊发光边框
            const glowBorder = document.createElement('div');
            glowBorder.className = 'deep-sea-glow-border';
            option.appendChild(glowBorder);
        } else {
            option.style.transform = `translateZ(${5 + index * 3}px)`;
        }
    });
    
    // 添加视差效果增强
    container.addEventListener('mousemove', function(e) {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 计算鼠标位置相对于容器中心的偏移
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const offsetX = (x - centerX) / centerX;
        const offsetY = (y - centerY) / centerY;
        
        // 应用视差效果
        options.forEach((option, index) => {
            const depth = option.classList.contains('blue-deep-sea') ? 25 : (5 + index * 3);
            const moveX = offsetX * depth * -0.2; // 反向移动增加深度感
            const moveY = offsetY * depth * -0.2;
            
            option.style.transform = `translateZ(${depth}px) translateX(${moveX}px) translateY(${moveY}px)`;
        });
        
        // 移动光线和背景层来增强3D感
        const rays = container.querySelectorAll('.light-ray');
        rays.forEach(ray => {
            const moveX = offsetX * 10;
            ray.style.transform = `rotate(${ray.rotation || 0}deg) translateX(${moveX}px)`;
        });
        
        // 移动深度层
        depthLayer.style.transform = `translateX(${offsetX * -15}px) translateY(${offsetY * -15}px)`;
    });
}

/**
 * 为选项添加闪光效果
 */
function addShineEffectToOptions(container) {
    const options = container.querySelectorAll('.theme-option');
    
    options.forEach(option => {
        // 创建闪光效果元素
        const shine = document.createElement('div');
        shine.className = 'shine-effect';
        option.appendChild(shine);
        
        // 创建光晕效果元素
        const halo = document.createElement('div');
        halo.className = 'halo-effect';
        option.appendChild(halo);
    });
}

/**
 * 添加水下闪光点效果
 */
function addUnderwaterGlowingParticles(container) {
    // 创建闪光点容器
    let glowPointsContainer = container.querySelector('.underwater-glow-points');
    if (!glowPointsContainer) {
        glowPointsContainer = document.createElement('div');
        glowPointsContainer.className = 'underwater-glow-points';
        container.appendChild(glowPointsContainer);
    } else {
        glowPointsContainer.innerHTML = '';
    }
    
    // 创建闪光点
    const pointCount = 20; // 增加点数量
    for (let i = 0; i < pointCount; i++) {
        const point = document.createElement('div');
        point.className = 'glow-point';
        
        // 随机大小
        const size = Math.random() * 4 + 1;
        point.style.width = size + 'px';
        point.style.height = size + 'px';
        
        // 随机位置
        point.style.left = Math.random() * 100 + '%';
        point.style.top = Math.random() * 100 + '%';
        
        // 随机延迟
        point.style.animationDelay = Math.random() * 8 + 's';
        
        glowPointsContainer.appendChild(point);
    }
    
    // 定期随机闪烁某些点
    setInterval(() => {
        if (container.isConnected && document.body.classList.contains('deep-sea')) {
            const points = glowPointsContainer.querySelectorAll('.glow-point');
            points.forEach(point => {
                if (Math.random() > 0.9) {
                    point.classList.add('glow-flash');
                    setTimeout(() => {
                        if (point.isConnected) {
                            point.classList.remove('glow-flash');
                        }
                    }, 1000);
                }
            });
        }
    }, 1000);
    
    // 定期添加新的闪光点和移除一些旧点，保持新鲜感
    setInterval(() => {
        if (container.isConnected && document.body.classList.contains('deep-sea')) {
            if (Math.random() > 0.5) {
                // 添加新点
                const point = document.createElement('div');
                point.className = 'glow-point';
                
                const size = Math.random() * 4 + 1;
                point.style.width = size + 'px';
                point.style.height = size + 'px';
                
                point.style.left = Math.random() * 100 + '%';
                point.style.top = Math.random() * 100 + '%';
                
                point.style.animationDelay = Math.random() * 8 + 's';
                
                glowPointsContainer.appendChild(point);
                
                // 随机移除一个旧点，保持总数平衡
                if (glowPointsContainer.children.length > 25 && Math.random() > 0.5) {
                    if (glowPointsContainer.firstChild) {
                        glowPointsContainer.removeChild(glowPointsContainer.firstChild);
                    }
                }
            }
        }
    }, 3000);
}

/**
 * 添加深度阴影效果
 */
function addDepthShadowEffects(container) {
    // 创建深度阴影容器
    let shadowContainer = container.querySelector('.depth-shadow-container');
    if (!shadowContainer) {
        shadowContainer = document.createElement('div');
        shadowContainer.className = 'depth-shadow-container';
        container.appendChild(shadowContainer);
    } else {
        shadowContainer.innerHTML = '';
    }
    
    // 创建不同层次的阴影
    const shadowLayers = 3;
    for (let i = 0; i < shadowLayers; i++) {
        const shadowLayer = document.createElement('div');
        shadowLayer.className = 'depth-shadow-layer';
        
        // 根据层次设置不同的透明度和位置
        shadowLayer.style.opacity = 0.1 + (i * 0.1);
        shadowLayer.style.bottom = `${i * 20}%`;
        
        shadowContainer.appendChild(shadowLayer);
    }
    
    // 添加四角深度阴影
    const cornerShadow = document.createElement('div');
    cornerShadow.className = 'corner-shadow';
    shadowContainer.appendChild(cornerShadow);
}

/**
 * 添加水下深度层效果
 */
function addUnderwaterDepthLayers(container) {
    // 创建深度层容器
    let depthLayersContainer = container.querySelector('.underwater-depth-layers');
    if (!depthLayersContainer) {
        depthLayersContainer = document.createElement('div');
        depthLayersContainer.className = 'underwater-depth-layers';
        container.appendChild(depthLayersContainer);
    } else {
        depthLayersContainer.innerHTML = '';
    }
    
    // 添加多层深度效果
    for (let i = 0; i < 3; i++) {
        const depthLayer = document.createElement('div');
        depthLayer.className = 'depth-layer';
        depthLayersContainer.appendChild(depthLayer);
    }
}

/**
 * 添加水下折射效果
 */
function addWaterRefractionEffect(container) {
    // 创建折射效果容器
    let refractionContainer = container.querySelector('.underwater-refraction');
    if (!refractionContainer) {
        refractionContainer = document.createElement('div');
        refractionContainer.className = 'underwater-refraction';
        container.appendChild(refractionContainer);
    }
}

/**
 * 初始化深海主题的交互动态效果
 */
function initDeepSeaInteractiveEffects(container) {
    // 主题选择器鼠标移动时的水流效果
    container.addEventListener('mousemove', function(e) {
        if (!document.body.classList.contains('deep-sea')) return;
        
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = container.offsetWidth / 2;
        const centerY = container.offsetHeight / 2;
        
        // 计算鼠标位置相对于中心的偏移，用于创建动态水流效果
        const offsetX = (x - centerX) / centerX;
        const offsetY = (y - centerY) / centerY;
        
        // 移动深度阴影层，增加3D深度感
        const depthLayers = container.querySelectorAll('.depth-layer');
        if (depthLayers.length > 0) {
            depthLayers[0].style.transform = `translate(${offsetX * -5}px, ${offsetY * -5}px)`;
            if (depthLayers[1]) {
                depthLayers[1].style.transform = `translate(${offsetX * -10}px, ${offsetY * -10}px)`;
            }
            if (depthLayers[2]) {
                depthLayers[2].style.transform = `translate(${offsetX * -15}px, ${offsetY * -15}px)`;
            }
        }
        
        // 光线随鼠标移动轻微偏转
        const rays = container.querySelectorAll('.light-ray');
        rays.forEach(ray => {
            const baseAngle = parseFloat(ray.dataset.baseAngle || 0);
            if (!ray.dataset.baseAngle) {
                ray.dataset.baseAngle = baseAngle.toString();
            }
            const newAngle = baseAngle + offsetX * 10;
            ray.style.transform = `rotate(${newAngle}deg)`;
        });
        
        // 为鼠标添加跟随的海流效果
        if (Math.random() > 0.9) { // 10%概率生成海流粒子
            const currentParticle = document.createElement('div');
            currentParticle.className = 'mouse-current-particle';
            currentParticle.style.left = `${x}px`;
            currentParticle.style.top = `${y}px`;
            
            // 随机大小
            const size = Math.random() * 10 + 5;
            currentParticle.style.width = `${size}px`;
            currentParticle.style.height = `${size}px`;
            
            // 随机颜色和透明度
            const opacity = Math.random() * 0.5 + 0.2;
            currentParticle.style.background = `radial-gradient(circle at center, rgba(255,255,255,${opacity}), rgba(100,200,255,${opacity/2}), transparent)`;
            
            // 随机运动方向，跟随鼠标移动方向
            const angle = Math.atan2(e.movementY, e.movementX);
            const distance = Math.random() * 80 + 40;
            const destinationX = x + Math.cos(angle) * distance;
            const destinationY = y + Math.sin(angle) * distance;
            
            currentParticle.animate([
                { left: `${x}px`, top: `${y}px`, opacity: opacity, transform: 'scale(0.8)' },
                { left: `${destinationX}px`, top: `${destinationY}px`, opacity: 0, transform: 'scale(0.1)' }
            ], {
                duration: 1000 + Math.random() * 1000,
                easing: 'cubic-bezier(0.1, 0.9, 0.2, 1)'
            });
            
            container.appendChild(currentParticle);
            
            // 动画结束后移除粒子
            setTimeout(() => {
                if (currentParticle.parentNode === container) {
                    container.removeChild(currentParticle);
                }
            }, 2000);
        }
    });
    
    // 为选项添加波纹点击效果
    const options = container.querySelectorAll('.theme-option');
    options.forEach(option => {
        option.addEventListener('click', function(e) {
            if (!document.body.classList.contains('deep-sea')) return;
            
            const rect = option.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const x = e.clientX - containerRect.left;
            const y = e.clientY - containerRect.top;
            
            // 创建水波纹
            const ripple = createWaterRipple(container.querySelector('.water-ripples'), x, y);
            ripple.classList.add('ripple-click'); // 添加点击特效类
            
            // 创建气泡爆发效果
            for (let i = 0; i < 5; i++) {
                const bubble = document.createElement('div');
                bubble.className = 'bubble bubble-burst';
                
                // 随机大小
                const size = Math.random() * 15 + 5;
                bubble.style.width = `${size}px`;
                bubble.style.height = `${size}px`;
                
                // 点击位置为起点
                bubble.style.left = `${x - containerRect.left}px`;
                bubble.style.top = `${y - containerRect.top}px`;
                
                // 随机方向爆发
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 60 + 20;
                const destinationX = x - containerRect.left + Math.cos(angle) * distance;
                const destinationY = y - containerRect.top + Math.sin(angle) * distance;
                
                bubble.animate([
                    { left: `${x - containerRect.left}px`, top: `${y - containerRect.top}px`, opacity: 0.8, transform: 'scale(0.1)' },
                    { left: `${destinationX}px`, top: `${destinationY}px`, opacity: 0, transform: 'scale(1)' }
                ], {
                    duration: 800 + Math.random() * 500,
                    easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)'
                });
                
                container.querySelector('.bubbles').appendChild(bubble);
                
                // 动画结束后移除
                setTimeout(() => {
                    if (bubble.parentNode === container.querySelector('.bubbles')) {
                        container.querySelector('.bubbles').removeChild(bubble);
                    }
                }, 1300);
            }
        });
    });
}

/**
 * 创建主题选择器项
 * @param {Object} themeSelector - 主题选择器容器元素
 * @param {String} name - 主题名称
 * @param {String} description - 主题描述
 * @param {Function} onClickHandler - 点击处理函数
 * @param {String} className - 主题CSS类名
 */
function createThemeOption(themeSelector, name, description, onClickHandler, className) {
    // 创建主题选项容器
    const themeOption = document.createElement('div');
    themeOption.className = 'theme-option';
    if (className) {
        themeOption.classList.add(className);
    }
    
    // 添加主题名称
    const themeName = document.createElement('h4');
    themeName.textContent = name;
    themeOption.appendChild(themeName);
    
    // 添加主题描述
    const themeDescription = document.createElement('p');
    themeDescription.textContent = description;
    themeOption.appendChild(themeDescription);
    
    // 添加点击事件
    themeOption.addEventListener('click', onClickHandler);
    
    // 添加到主题选择器
    themeSelector.appendChild(themeOption);
    
    return themeOption;
}

/**
 * 打开主题选择器
 */
function openThemeSelector() {
    // 检查是否已存在主题选择器
    let themeSelector = document.querySelector('.theme-selector');
    
    if (themeSelector) {
        themeSelector.style.display = 'block';
        return;
    }
    
    // 创建主题选择器容器
    themeSelector = document.createElement('div');
    themeSelector.className = 'theme-selector';
    
    // 添加标题
    const title = document.createElement('h3');
    title.textContent = '选择思维导图主题';
    themeSelector.appendChild(title);
    
    // 添加关闭按钮
    const closeButton = document.createElement('button');
    closeButton.className = 'close-button';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = function() {
        themeSelector.style.display = 'none';
    };
    themeSelector.appendChild(closeButton);
    
    // 创建主题选项
    
    // 默认主题
    createThemeOption(
        themeSelector, 
        '默认主题', 
        '简洁清晰的基础主题', 
        function() {
            // 移除所有主题相关类
            document.body.className = document.body.className
                .replace(/blue-theme\S*/g, '')
                .replace(/rainbow-theme\S*/g, '')
                .replace(/deepsea-theme\S*/g, '')
                .replace(/sci-fi-theme\S*/g, '')
                .replace(/sci-fi-theme-only/g, '')
                .trim();
            
            // 关闭选择器
            themeSelector.style.display = 'none';
        }
    );
    
    // 蓝色主题
    if (typeof window.blueTheme !== 'undefined') {
        const blueThemeOption = createThemeOption(
            themeSelector, 
            '蓝色主题', 
            '优雅深邃的蓝色主题系列', 
            function() {
                // 先移除所有主题相关类
                document.body.className = document.body.className
                    .replace(/blue-theme-\S*/g, '')
                    .replace(/rainbow-theme\S*/g, '')
                    .replace(/deepsea-theme\S*/g, '')
                    .replace(/sci-fi-theme\S*/g, '')
                    .replace(/sci-fi-theme-only/g, '')
                    .trim();
                
                // 切换蓝色主题
                if (typeof toggleBlueTheme === 'function') {
                    toggleBlueTheme();
                }
                
                // 显示蓝色主题变体选项
                if (typeof showThemeOptions === 'function') {
                    showThemeOptions();
                }
                
                // 关闭选择器
                themeSelector.style.display = 'none';
            },
            'blue-theme-option'
        );
    }
    
    // 深海蓝主题
    if (typeof window.deepseaTheme !== 'undefined') {
        const deepseaThemeOption = createThemeOption(
            themeSelector, 
            '深海蓝主题', 
            '神秘深邃的海洋视觉体验', 
            function() {
                // 先移除所有主题相关类
                document.body.className = document.body.className
                    .replace(/blue-theme-\S*/g, '')
                    .replace(/rainbow-theme\S*/g, '')
                    .replace(/deepsea-theme\S*/g, '')
                    .replace(/sci-fi-theme\S*/g, '')
                    .replace(/sci-fi-theme-only/g, '')
                    .trim();
                
                // 切换深海蓝主题
                if (typeof window.deepseaTheme.toggle === 'function') {
                    window.deepseaTheme.toggle();
                }
                
                // 显示深海蓝主题变体选项
                if (typeof window.deepseaTheme.showOptions === 'function') {
                    window.deepseaTheme.showOptions();
                }
                
                // 关闭选择器
                themeSelector.style.display = 'none';
            },
            'deepsea-theme-option'
        );
    }
    
    // 彩虹主题
    if (typeof window.rainbowTheme !== 'undefined') {
        const rainbowThemeOption = createThemeOption(
            themeSelector, 
            '彩虹主题', 
            '缤纷多彩的炫丽视觉效果', 
            function() {
                // 先移除其他主题
                document.body.className = document.body.className
                    .replace(/blue-theme\S*/g, '')
                    .replace(/rainbow-theme\S*/g, '')
                    .replace(/deepsea-theme\S*/g, '')
                    .replace(/sci-fi-theme\S*/g, '')
                    .replace(/sci-fi-theme-only/g, '')
                    .trim();
                    
                // 切换彩虹主题
                if (typeof toggleRainbowTheme === 'function') {
                    toggleRainbowTheme();
                }
                
                // 关闭选择器
                themeSelector.style.display = 'none';
            },
            'rainbow-theme-option'
        );
    }
    
    // 科幻主题
    if (typeof window.scifiTheme !== 'undefined') {
        const scifiThemeOption = createThemeOption(
            themeSelector, 
            '科幻主题', 
            '未来感十足的高科技视觉效果', 
            function() {
                // 切换科幻主题
                if (typeof window.scifiTheme.toggle === 'function') {
                    // 先移除其他主题
                    document.body.className = document.body.className
                        .replace(/blue-theme\S*/g, '')
                        .replace(/rainbow-theme\S*/g, '')
                        .replace(/deepsea-theme\S*/g, '')
                        .replace(/sci-fi-theme\S*/g, '')
                        .replace(/sci-fi-theme-only/g, '')
                        .trim();
                    
                    // 然后切换科幻主题
                    window.scifiTheme.toggle();
                }
                
                // 关闭选择器
                themeSelector.style.display = 'none';
            },
            'sci-fi-theme-option'
        );
    }
    
    // 添加到页面
    document.body.appendChild(themeSelector);
    
    // 触发主题选择器打开事件
    const openEvent = new CustomEvent('themeSelector:opened', {
        detail: {
            themeSelector: themeSelector
        }
    });
    document.dispatchEvent(openEvent);
}

// 将主题选择器公开给全局
window.themeSelector = {
    open: openThemeSelector
};
