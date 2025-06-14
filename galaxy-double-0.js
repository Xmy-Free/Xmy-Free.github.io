/**
 * 银河系双击特效 - 宇宙奇迹
 * 双击鼠标左键时触发壮观的宇宙特效
 */

// 确保THREE对象可用
(function() {
    if (typeof THREE === 'undefined') {
        console.error('THREE.js未加载，特效将无法运行');
        return;
    }
    console.log('THREE.js已加载，版本:', THREE.REVISION);
})();

// 宏大宇宙特效状态管理
const cosmicMiracleState = {
    active: false,            // 特效是否激活
    startTime: 0,             // 开始时间
    duration: 20000,          // 持续时间（毫秒）
    phase: 'none',            // 当前阶段：none, initialize, expand, peak, contract, finish
    effectElements: [],       // 特效元素集合
    originalScene: null,      // 原始场景状态
    particleSystems: [],      // 粒子系统集合
    energyFields: [],         // 能量场集合
    dimensionRifts: [],       // 次元裂缝集合
    timeDistortions: [],      // 时间扭曲集合
    cosmicVortices: [],       // 宇宙漩涡集合
    nebulaFormations: [],     // 星云形态集合
    stellarTransformations: [],// 恒星变换集合
    quantumFluctuations: [],  // 量子涨落集合
    darkMatterWebs: [],       // 暗物质网络集合
    galaxyCollisions: []      // 星系碰撞集合
};

// 增强型双击检测变量
let doubleClickTimer = null;
let doubleClickDelay = 300; // 毫秒
let isInitialized = false;

/**
 * 立即自执行初始化函数 - 强制立即设置事件监听
 */
(function() {
    console.log('立即执行初始化双击特效监听');
    setupAllEventListeners();
})();

/**
 * 设置所有事件监听器
 * 使用多种方式确保双击能被捕获
 */
function setupAllEventListeners() {
    console.log('设置所有双击事件监听器');
    
    // 方法1: 使用原生双击事件 - 全局
    document.addEventListener('dblclick', function(event) {
        console.log('捕获到全局双击事件(dblclick)');
        triggerCosmicMiracle();
    });
    
    // 方法2: 使用自定义双击检测 - 全局
    let lastClickTime = 0;
    document.addEventListener('click', function(event) {
        const currentTime = Date.now();
        if (currentTime - lastClickTime < 400) {
            console.log('捕获到全局双击事件(自定义检测)');
            triggerCosmicMiracle();
        }
        lastClickTime = currentTime;
    });
    
    // 方法3: 监听canvas元素(three.js渲染目标)
    const canvasElements = document.getElementsByTagName('canvas');
    for (let i = 0; i < canvasElements.length; i++) {
        const canvas = canvasElements[i];
        console.log('为Canvas元素添加双击监听器', i);
        
        // 原生双击
        canvas.addEventListener('dblclick', function(event) {
            console.log('捕获到Canvas双击事件(dblclick)');
            event.preventDefault();
            triggerCosmicMiracle();
        });
        
        // 自定义双击
        let canvasLastClick = 0;
        canvas.addEventListener('click', function(event) {
            const currentTime = Date.now();
            if (currentTime - canvasLastClick < 400) {
                console.log('捕获到Canvas双击事件(自定义检测)');
                event.preventDefault();
                triggerCosmicMiracle();
            }
            canvasLastClick = currentTime;
        });
    }
    
    // 方法4: 直接监听键盘触发(用于测试)
    document.addEventListener('keydown', function(event) {
        // 按下D键也触发特效(用于测试)
        if (event.key === 'd' || event.key === 'D') {
            console.log('按下D键触发特效(测试用)');
            triggerCosmicMiracle();
        }
    });
    
    // 方法5: 定期检查galaxy对象并添加监听
    const findGalaxyInterval = setInterval(function() {
        const foundGalaxy = findAndSetupGalaxy();
        if (foundGalaxy) {
            console.log('成功找到并设置了galaxy对象的事件监听');
            clearInterval(findGalaxyInterval);
        }
    }, 500);
    
    console.log('所有事件监听器设置完成');
}

/**
 * 查找galaxy对象并设置事件
 * 尝试多种方式查找galaxy对象
 */
function findAndSetupGalaxy() {
    console.log('尝试查找galaxy对象...');
    
    // 查找方法1: 通过window.galaxy
    if (window.galaxy) {
        console.log('通过window.galaxy找到galaxy对象');
        setupGalaxyEvents(window.galaxy);
        return true;
    }
    
    // 查找方法2: 通过ID
    const galaxyById = document.getElementById('galaxy');
    if (galaxyById) {
        console.log('通过ID找到galaxy对象');
        setupGalaxyEvents(galaxyById);
        return true;
    }
    
    // 查找方法3: 查找场景中的对象
    if (window.scene && window.scene.children) {
        console.log('在场景中查找galaxy对象');
        for (let i = 0; i < window.scene.children.length; i++) {
            const obj = window.scene.children[i];
            if (obj.isGroup && obj.children && obj.children.length > 3) {
                console.log('在场景中找到可能的galaxy对象');
                setupGalaxyEvents(obj);
                return true;
            }
        }
    }
    
    console.log('未找到galaxy对象，将继续尝试');
    return false;
}

/**
 * 为galaxy对象设置事件
 */
function setupGalaxyEvents(galaxyObj) {
    console.log('为galaxy对象设置事件监听器');
    
    // 将对象ID设为galaxy以便日后查找
    if (!galaxyObj.id) {
        galaxyObj.id = 'galaxy';
    }
    
    // 如果是DOM元素，直接添加事件监听
    if (galaxyObj.addEventListener) {
        galaxyObj.addEventListener('dblclick', function(event) {
            console.log('galaxy对象双击事件触发');
            event.preventDefault();
            triggerCosmicMiracle();
        });
    }
    
    // 如果是THREE.js对象，记录它以便后续使用
    window.galaxyObject = galaxyObj;
    console.log('galaxy对象已保存到window.galaxyObject');
}

/**
 * 触发宇宙奇迹特效
 * 此函数是特效的主入口点，会初始化并启动特效
 */
function triggerCosmicMiracle() {
    console.log('尝试触发宇宙奇迹特效');
    
    // 如果特效已经在运行中，则不重复触发
    if (cosmicMiracleState.active) {
        console.log('宇宙奇迹特效已在运行中，不重复触发');
        return;
    }
    
    console.log('启动宇宙奇迹特效');
    
    try {
        // 更新状态
        cosmicMiracleState.active = true;
        cosmicMiracleState.startTime = Date.now();
        cosmicMiracleState.phase = 'initialize';
        
        console.log('特效状态已更新，准备初始化');
        
        // 初始化特效
        initializeCosmicMiracle();
        
        // 设置自动清理计时器
        setTimeout(() => {
            if (cosmicMiracleState.active) {
                console.log('特效持续时间到达上限，准备清理');
                cleanupCosmicMiracle();
            }
        }, cosmicMiracleState.duration);
        
        console.log('特效成功触发，预计持续时间：', cosmicMiracleState.duration / 1000, '秒');
        
        // 显示一个测试信息，确认特效被触发
        showTestMessage();
    } catch (error) {
        console.error('触发宇宙奇迹特效时发生错误:', error);
        // 出错时清理，防止状态不一致
        cosmicMiracleState.active = false;
    }
}

/**
 * 显示测试消息
 * 创建一个简单的DOM元素显示特效已触发
 */
function showTestMessage() {
    // 创建测试消息元素
    const messageDiv = document.createElement('div');
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '20px';
    messageDiv.style.left = '20px';
    messageDiv.style.padding = '10px';
    messageDiv.style.backgroundColor = 'rgba(0, 0, 255, 0.5)';
    messageDiv.style.color = 'white';
    messageDiv.style.fontSize = '20px';
    messageDiv.style.zIndex = '9999';
    messageDiv.style.borderRadius = '5px';
    messageDiv.textContent = '特效已触发！';
    
    // 添加到页面
    document.body.appendChild(messageDiv);
    
    // 3秒后移除
    setTimeout(() => {
        if (document.body.contains(messageDiv)) {
            document.body.removeChild(messageDiv);
        }
    }, 3000);
}

/**
 * 初始化宇宙奇迹特效模块
 * 确保只初始化一次
 */
function initCosmicMiracleModule() {
    if (isInitialized) return;
    
    console.log('初始化宇宙奇迹特效模块');
    isInitialized = true;
    
    // 调用setupEventListeners以设置事件监听器
    setupEventListeners();
}

/**
 * 设置事件监听器
 * 同时支持直接双击和基于计时的双击检测
 */
function setupEventListeners() {
    // 使用dblclick事件确保双击能被识别
    window.addEventListener('dblclick', function(event) {
        console.log('检测到原生双击事件');
        // 仅响应鼠标左键
        if (event.button === 0) {
            console.log('检测到双击事件（dblclick），触发宇宙奇迹特效');
            triggerCosmicMiracle();
        }
    });
    
    // 同时使用自定义双击检测逻辑作为备份机制
    let lastClickTime = 0;
    let clickCount = 0;
    
    window.addEventListener('mousedown', function(event) {
        // 仅响应鼠标左键
        if (event.button === 0) {
            const currentTime = Date.now();
            
            // 如果当前点击与上次点击时间间隔小于400ms，视为双击
            if (currentTime - lastClickTime < 400) {
                clickCount++;
                
                // 双击检测
                if (clickCount === 2) {
                    console.log('检测到双击事件（自定义检测），触发宇宙奇迹特效');
                    triggerCosmicMiracle();
                    clickCount = 0;
                }
            } else {
                // 重置点击计数
                clickCount = 1;
            }
            
            // 更新上次点击时间
            lastClickTime = currentTime;
        }
    });
    
    // 尝试获取galaxy元素并添加专门的事件监听器
    function addListenersToGalaxy() {
        const galaxyElement = window.galaxy || document.getElementById('galaxy') || document.querySelector('.galaxy');
        if (galaxyElement) {
            console.log('找到galaxy元素，添加双击监听器');
            
            // 添加双击事件监听
            galaxyElement.addEventListener('dblclick', function(event) {
                console.log('检测到galaxy元素上的双击事件，触发宇宙奇迹特效');
                event.preventDefault(); // 防止事件冒泡
                triggerCosmicMiracle();
            });
            
            // 添加自定义双击检测
            let galaxyLastClickTime = 0;
            galaxyElement.addEventListener('mousedown', function(event) {
                // 仅响应鼠标左键
                if (event.button === 0) {
                    const currentTime = Date.now();
                    if (currentTime - galaxyLastClickTime < 400) {
                        console.log('检测到galaxy元素上的双击事件（自定义检测），触发宇宙奇迹特效');
                        event.preventDefault(); // 防止事件冒泡
                        triggerCosmicMiracle();
                    }
                    galaxyLastClickTime = currentTime;
                }
            });
            
            return true;
        }
        return false;
    }
    
    // 尝试立即查找galaxy元素
    if (!addListenersToGalaxy()) {
        // 如果没找到，在DOM加载完成后再次尝试
        window.addEventListener('DOMContentLoaded', function() {
            console.log('DOM加载完成，尝试查找galaxy元素');
            addListenersToGalaxy();
        });
        
        // 同时设置一个延迟尝试，以防DOMContentLoaded已经触发过了
        setTimeout(function() {
            addListenersToGalaxy();
        }, 1000);
    }
    
    // 在window加载完成后再次尝试
    window.addEventListener('load', function() {
        console.log('Window加载完成，尝试查找galaxy元素');
        addListenersToGalaxy();
    });
    
    console.log('所有事件监听器设置完成');
}

/**
 * 初始化宇宙奇迹特效
 * 创建必要的场景元素和初始状态
 */
function initializeCosmicMiracle() {
    console.log('初始化宇宙奇迹特效');
    
    // 保存原始场景状态以便稍后恢复
    saveOriginalSceneState();
    
    // 创建各种宇宙奇迹特效元素
    createCosmicMiracleElements();
    
    // 启动动画循环
    requestAnimationFrame(animateCosmicMiracle);
}

/**
 * 保存原始场景状态
 * 存储银河系的位置、旋转、可见性等属性
 */
function saveOriginalSceneState() {
    // 保存银河系当前状态
    if (window.galaxy) {
        cosmicMiracleState.originalScene = {
            galaxyVisible: window.galaxy.visible,
            galaxyPosition: window.galaxy.position.clone(),
            galaxyRotation: {
                x: window.galaxy.rotation.x,
                y: window.galaxy.rotation.y,
                z: window.galaxy.rotation.z
            },
            galaxyScale: window.galaxy.scale.clone(),
            cameraPosition: window.camera.position.clone(),
            cameraRotation: window.camera.rotation.clone(),
            controlsEnabled: window.controls.enabled,
            controlsAutoRotate: window.controls.autoRotate
        };
        
        console.log('已保存原始场景状态');
    }
}

/**
 * 创建宇宙奇迹特效元素
 * 构建各种粒子系统、能量场、次元裂缝等元素
 */
function createCosmicMiracleElements() {
    console.log('创建宇宙奇迹特效元素');
    
    // 创建中央能量核心
    createEnergyCoreSystem();
    
    // 创建能量波动场
    createEnergyWaveField();
    
    // 创建时空扭曲漩涡
    createSpaceTimeVortex();
    
    // 创建星际传送门
    createStarGateSystem();
    
    // 创建星云爆发
    createNebulaBurst();
    
    // 创建次元裂缝
    createDimensionalRift();
    
    // 创建量子波动粒子场
    createQuantumFluctuationField();
    
    // 创建暗物质网络
    createDarkMatterWeb();
    
    // 创建恒星转化效果
    createStellarTransformation();
    
    // 创建宇宙辐射环
    createCosmicRadiationRings();
    
    // 创建时空桥接
    createSpaceTimeBridge();
}

/**
 * 创建中央能量核心系统
 * 在银河系中心创建强大的能量汇聚核心
 */
function createEnergyCoreSystem() {
    console.log('创建中央能量核心系统');
    
    // 获取银河系中心位置
    const corePosition = getGalaxyCorePosition();
    
    // 创建核心几何体 - 使用多层几何体创建复杂形状
    const coreGeometry = new THREE.IcosahedronGeometry(100, 4);
    
    // 创建核心材质 - 使用自定义着色器获得更好的视觉效果
    const coreMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color1: { value: new THREE.Color(0x0055ff) },
            color2: { value: new THREE.Color(0x00ddff) },
            color3: { value: new THREE.Color(0x0099aa) }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vPosition;
            varying vec3 vNormal;
            
            void main() {
                vUv = uv;
                vPosition = position;
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 color1;
            uniform vec3 color2;
            uniform vec3 color3;
            varying vec2 vUv;
            varying vec3 vPosition;
            varying vec3 vNormal;
            
            // 噪声函数
            float noise(vec3 p) {
                return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
            }
            
            // 分形噪声
            float fbm(vec3 p) {
                float sum = 0.0;
                float amp = 1.0;
                float freq = 1.0;
                for (int i = 0; i < 6; i++) {
                    sum += amp * noise(p * freq);
                    amp *= 0.5;
                    freq *= 2.0;
                    p = p + vec3(time * 0.01, time * 0.015, time * 0.007);
                }
                return sum;
            }
            
            void main() {
                // 创建基于位置和时间的动态纹理
                float n = fbm(vPosition * 0.01 + time * 0.01);
                
                // 根据法线和视线夹角创建边缘光晕
                vec3 viewDir = normalize(vPosition);
                float rim = 1.0 - max(dot(vNormal, viewDir), 0.0);
                rim = smoothstep(0.4, 1.0, rim);
                
                // 基于噪声和边缘效果混合颜色
                vec3 color = mix(color1, color2, n);
                color = mix(color, color3, rim);
                
                // 应用边缘光晕
                color += rim * 0.3 * color2;
                
                // 动态脉冲效果
                float pulse = 0.5 + 0.5 * sin(time * 3.0);
                color *= 0.8 + 0.2 * pulse;
                
                gl_FragColor = vec4(color, 0.85);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        wireframe: false,
        depthWrite: false
    });
    
    // 创建核心网格
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    core.position.copy(corePosition);
    core.scale.set(0.1, 0.1, 0.1); // 初始很小，会在动画中变大
    
    // 添加到场景
    window.scene.add(core);
    
    // 存储到状态中
    cosmicMiracleState.energyCore = core;
    cosmicMiracleState.effectElements.push(core);
    
    // 创建核心光辉粒子
    createCoreGlowParticles(corePosition);
    
    // 创建能量流粒子
    createEnergyStreamParticles(corePosition);
    
    console.log('中央能量核心系统创建完成');
}

/**
 * 创建核心光辉粒子
 * 围绕能量核心的光辉粒子效果
 * @param {THREE.Vector3} position - 粒子系统中心位置
 */
function createCoreGlowParticles(position) {
    // 创建粒子几何体
    const particleCount = 5000;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    
    // 在球体范围内分布粒子
    const radius = 500;
    for (let i = 0; i < particleCount; i++) {
        // 球坐标分布
        const phi = Math.acos(-1 + (2 * i) / particleCount);
        const theta = Math.sqrt(particleCount * Math.PI) * phi;
        
        // 添加随机性
        const r = radius * (0.6 + Math.random() * 0.4);
        
        // 转换为笛卡尔坐标
        particlePositions[i * 3] = position.x + r * Math.sin(phi) * Math.cos(theta);
        particlePositions[i * 3 + 1] = position.y + r * Math.sin(phi) * Math.sin(theta);
        particlePositions[i * 3 + 2] = position.z + r * Math.cos(phi);
        
        // 设置颜色 - 从蓝色到青色渐变
        const hue = 0.5 + Math.random() * 0.1; // 青色范围
        const saturation = 0.7 + Math.random() * 0.3;
        const lightness = 0.5 + Math.random() * 0.3;
        
        const color = new THREE.Color().setHSL(hue, saturation, lightness);
        particleColors[i * 3] = color.r;
        particleColors[i * 3 + 1] = color.g;
        particleColors[i * 3 + 2] = color.b;
        
        // 设置大小 - 变化范围较大
        particleSizes[i] = 10 + Math.random() * 30;
    }
    
    // 设置属性
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
    
    // 创建材质
    const particleMaterial = new THREE.PointsMaterial({
        size: 20,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        depthWrite: false
    });
    
    // 创建粒子系统
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    
    // 添加到场景
    window.scene.add(particleSystem);
    
    // 存储到状态中
    const particleData = {
        system: particleSystem,
        geometry: particleGeometry,
        initialPositions: particlePositions.slice(),
        type: 'coreGlow'
    };
    
    cosmicMiracleState.particleSystems.push(particleData);
    cosmicMiracleState.effectElements.push(particleSystem);
    
    console.log('核心光辉粒子创建完成');
}

/**
 * 创建能量流粒子
 * 从能量核心辐射出的能量流
 * @param {THREE.Vector3} position - 粒子系统起始位置
 */
function createEnergyStreamParticles(position) {
    // 创建多条能量流
    const streamCount = 12;
    const particlesPerStream = 500;
    const totalParticles = streamCount * particlesPerStream;
    
    // 创建粒子几何体
    const streamGeometry = new THREE.BufferGeometry();
    const streamPositions = new Float32Array(totalParticles * 3);
    const streamColors = new Float32Array(totalParticles * 3);
    const streamSizes = new Float32Array(totalParticles);
    const streamData = new Float32Array(totalParticles * 3); // 存储额外的数据：流索引、位置比例、随机值
    
    // 为每条能量流创建粒子
    for (let s = 0; s < streamCount; s++) {
        // 每条流的方向
        const phi = Math.acos(-1 + (2 * s) / streamCount);
        const theta = Math.sqrt(streamCount * Math.PI) * phi;
        
        const dirX = Math.sin(phi) * Math.cos(theta);
        const dirY = Math.sin(phi) * Math.sin(theta);
        const dirZ = Math.cos(phi);
        
        // 流的最大长度
        const streamLength = 1500 + Math.random() * 1500;
        
        // 每条流的基础色调
        const baseHue = 0.5 + (Math.random() * 0.2 - 0.1); // 青色-蓝色范围
        
        // 创建流中的每个粒子
        for (let i = 0; i < particlesPerStream; i++) {
            const index = s * particlesPerStream + i;
            
            // 沿流方向的位置
            const t = i / particlesPerStream;
            const distance = t * streamLength;
            
            // 添加随机扰动
            const jitter = 50 * (1 - t); // 越靠近起点扰动越大
            const offsetX = (Math.random() - 0.5) * jitter;
            const offsetY = (Math.random() - 0.5) * jitter;
            const offsetZ = (Math.random() - 0.5) * jitter;
            
            // 设置位置
            streamPositions[index * 3] = position.x + dirX * distance + offsetX;
            streamPositions[index * 3 + 1] = position.y + dirY * distance + offsetY;
            streamPositions[index * 3 + 2] = position.z + dirZ * distance + offsetZ;
            
            // 设置颜色 - 沿流渐变
            const hue = baseHue + t * 0.05; // 沿流轻微变化色相
            const saturation = 0.8 - t * 0.3; // 越远越不饱和
            const lightness = 0.6 - t * 0.3; // 越远越暗
            
            const color = new THREE.Color().setHSL(hue, saturation, lightness);
            streamColors[index * 3] = color.r;
            streamColors[index * 3 + 1] = color.g;
            streamColors[index * 3 + 2] = color.b;
            
            // 设置大小 - 越远越小
            streamSizes[index] = 30 * (1 - t * 0.7);
            
            // 存储额外数据
            streamData[index * 3] = s; // 流索引
            streamData[index * 3 + 1] = t; // 位置比例
            streamData[index * 3 + 2] = Math.random(); // 随机值，用于动画
        }
    }
    
    // 设置属性
    streamGeometry.setAttribute('position', new THREE.BufferAttribute(streamPositions, 3));
    streamGeometry.setAttribute('color', new THREE.BufferAttribute(streamColors, 3));
    streamGeometry.setAttribute('size', new THREE.BufferAttribute(streamSizes, 1));
    streamGeometry.setAttribute('streamData', new THREE.BufferAttribute(streamData, 3));
    
    // 创建材质
    const streamMaterial = new THREE.PointsMaterial({
        size: 20,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        depthWrite: false
    });
    
    // 创建粒子系统
    const streamSystem = new THREE.Points(streamGeometry, streamMaterial);
    
    // 添加到场景
    window.scene.add(streamSystem);
    
    // 存储到状态中
    const streamParticleData = {
        system: streamSystem,
        geometry: streamGeometry,
        initialPositions: streamPositions.slice(),
        type: 'energyStream'
    };
    
    cosmicMiracleState.particleSystems.push(streamParticleData);
    cosmicMiracleState.effectElements.push(streamSystem);
    
    console.log('能量流粒子创建完成');
}

/**
 * 创建能量波动场
 * 在银河系周围创建能量波纹场效果
 */
function createEnergyWaveField() {
    console.log('创建能量波动场');
    
    // 获取银河系中心位置
    const corePosition = getGalaxyCorePosition();
    
    // 创建波动场几何体
    const waveGeometry = new THREE.RingGeometry(1000, 3000, 64, 8);
    
    // 创建波动场材质 - 使用自定义着色器
    const waveMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color1: { value: new THREE.Color(0x0066ff) },
            color2: { value: new THREE.Color(0x00aadd) }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vPosition;
            
            void main() {
                vUv = uv;
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 color1;
            uniform vec3 color2;
            varying vec2 vUv;
            varying vec3 vPosition;
            
            // 简单噪声函数
            float noise(vec2 p) {
                return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
            }
            
            void main() {
                // 径向距离
                float dist = length(vPosition.xz) * 0.0003;
                
                // 波纹效果
                float wave1 = 0.5 + 0.5 * sin(dist * 20.0 - time * 1.0);
                float wave2 = 0.5 + 0.5 * sin(dist * 10.0 - time * 0.7);
                float waves = mix(wave1, wave2, 0.5);
                
                // 噪声效果
                float noiseVal = noise(vUv * 5.0 + time * 0.1);
                
                // 混合颜色
                vec3 color = mix(color1, color2, waves);
                
                // 透明度
                float alpha = waves * 0.2 + noiseVal * 0.05;
                alpha = smoothstep(0.0, 0.3, alpha) * 0.4; // 调整最大不透明度为0.4
                
                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    
    // 创建波动场网格
    const waveField = new THREE.Mesh(waveGeometry, waveMaterial);
    waveField.position.copy(corePosition);
    waveField.rotation.x = Math.PI / 2; // 水平放置
    
    // 添加到场景
    window.scene.add(waveField);
    
    // 存储到状态中
    cosmicMiracleState.energyFields.push({
        field: waveField,
        type: 'waveField',
        initialScale: new THREE.Vector3(1, 1, 1)
    });
    
    cosmicMiracleState.effectElements.push(waveField);
    
    // 创建多层波动场
    for (let i = 1; i <= 3; i++) {
        const innerRadius = 500 * i;
        const outerRadius = innerRadius + 800;
        const layerGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 64, 6);
        
        // 为每层设置不同的颜色
        const layerMaterial = waveMaterial.clone();
        layerMaterial.uniforms = {
            time: { value: 0 },
            color1: { value: new THREE.Color(i === 1 ? 0x0088ff : i === 2 ? 0x0066dd : 0x0044aa) },
            color2: { value: new THREE.Color(i === 1 ? 0x00ccff : i === 2 ? 0x0099cc : 0x0077aa) }
        };
        
        const layer = new THREE.Mesh(layerGeometry, layerMaterial);
        layer.position.copy(corePosition);
        layer.rotation.x = Math.PI / 2;
        layer.rotation.z = i * Math.PI / 6; // 旋转每一层
        
        // 添加到场景
        window.scene.add(layer);
        
        // 存储到状态中
        cosmicMiracleState.energyFields.push({
            field: layer,
            type: 'waveLayer',
            layer: i,
            initialScale: new THREE.Vector3(1, 1, 1)
        });
        
        cosmicMiracleState.effectElements.push(layer);
    }
    
    console.log('能量波动场创建完成');
}

/**
 * 创建时空扭曲漩涡
 * 在银河系外层创建漩涡状扭曲效果
 */
function createSpaceTimeVortex() {
    console.log('创建时空扭曲漩涡');
    
    // 获取银河系中心位置
    const corePosition = getGalaxyCorePosition();
    
    // 创建漩涡几何体 - 使用自定义螺旋线
    const vortexPoints = [];
    const segments = 1000;
    const loops = 5;
    const radius = 4000;
    
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const angle = t * Math.PI * 2 * loops;
        const r = t * radius;
        const x = r * Math.cos(angle);
        const z = r * Math.sin(angle);
        const y = (t - 0.5) * 400; // 垂直偏移
        
        vortexPoints.push(new THREE.Vector3(x, y, z));
    }
    
    // 创建曲线
    const curve = new THREE.CatmullRomCurve3(vortexPoints);
    const tubeGeometry = new THREE.TubeGeometry(curve, 500, 8, 12, false);
    
    // 创建漩涡材质 - 使用自定义着色器
    const vortexMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color1: { value: new THREE.Color(0x0088ff) },
            color2: { value: new THREE.Color(0x00ddff) }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 color1;
            uniform vec3 color2;
            varying vec2 vUv;
            
            void main() {
                // 螺旋纹理
                float pattern = fract(vUv.x * 10.0 - vUv.y * 20.0 + time * 0.5);
                
                // 波纹效果
                float wave = 0.5 + 0.5 * sin(vUv.x * 30.0 + time * 2.0);
                
                // 混合颜色
                vec3 color = mix(color1, color2, pattern * wave);
                
                // 沿管透明度渐变
                float alpha = smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.8, vUv.y);
                alpha *= 0.4 + wave * 0.2;
                
                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    
    // 创建漩涡
    const vortex = new THREE.Mesh(tubeGeometry, vortexMaterial);
    vortex.position.copy(corePosition);
    
    // 添加到场景
    window.scene.add(vortex);
    
    // 存储到状态中
    cosmicMiracleState.timeDistortions.push({
        distortion: vortex,
        type: 'vortex',
        initialScale: new THREE.Vector3(0.1, 0.1, 0.1) // 初始很小，会在动画中变大
    });
    
    cosmicMiracleState.effectElements.push(vortex);
    
    // 创建漩涡粒子效果
    createVortexParticles(corePosition);
    
    console.log('时空扭曲漩涡创建完成');
}

/**
 * 创建漩涡粒子效果
 * 在时空漩涡周围创建粒子效果
 * @param {THREE.Vector3} position - 漩涡中心位置
 */
function createVortexParticles(position) {
    // 创建粒子几何体
    const particleCount = 8000;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    const particleData = new Float32Array(particleCount * 3); // 存储额外数据：螺旋角度、半径比例、垂直位置
    
    // 创建漩涡状分布的粒子
    for (let i = 0; i < particleCount; i++) {
        // 螺旋分布
        const t = i / particleCount;
        const angle = t * Math.PI * 10 * (1 + Math.random() * 0.2);
        const radius = t * 4000 * (0.8 + Math.random() * 0.4);
        const height = (t - 0.5) * 800 * (0.5 + Math.random() * 1.0);
        
        // 位置
        particlePositions[i * 3] = position.x + radius * Math.cos(angle);
        particlePositions[i * 3 + 1] = position.y + height;
        particlePositions[i * 3 + 2] = position.z + radius * Math.sin(angle);
        
        // 颜色 - 从蓝到青的渐变
        const hue = 0.5 + t * 0.1; // 0.5=青色 到 0.6=蓝色
        const saturation = 0.7 + Math.random() * 0.3;
        const lightness = 0.5 + Math.random() * 0.3;
        
        const color = new THREE.Color().setHSL(hue, saturation, lightness);
        particleColors[i * 3] = color.r;
        particleColors[i * 3 + 1] = color.g;
        particleColors[i * 3 + 2] = color.b;
        
        // 粒子大小 - 范围更大
        particleSizes[i] = 10 + Math.random() * 40;
        
        // 额外数据
        particleData[i * 3] = angle; // 螺旋角度
        particleData[i * 3 + 1] = t; // 半径比例
        particleData[i * 3 + 2] = Math.random(); // 随机值
    }
    
    // 设置属性
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
    particleGeometry.setAttribute('particleData', new THREE.BufferAttribute(particleData, 3));
    
    // 创建材质
    const particleMaterial = new THREE.PointsMaterial({
        size: 20,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        depthWrite: false
    });
    
    // 创建粒子系统
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    
    // 添加到场景
    window.scene.add(particleSystem);
    
    // 存储到状态中
    const vortexParticleData = {
        system: particleSystem,
        geometry: particleGeometry,
        initialPositions: particlePositions.slice(),
        type: 'vortexParticles'
    };
    
    cosmicMiracleState.particleSystems.push(vortexParticleData);
    cosmicMiracleState.effectElements.push(particleSystem);
}

/**
 * 获取银河系中心位置
 * @returns {THREE.Vector3} 银河系中心位置
 */
function getGalaxyCorePosition() {
    // 检查银河系和相机是否存在
    if (!window.galaxy) {
        console.warn('无法获取银河系中心位置：银河系对象不存在');
        return new THREE.Vector3(0, 0, 0);
    }
    
    // 如果銀河系有黑洞或中心对象，取其位置
    let corePos;
    if (window.galaxy.children && window.galaxy.children.length > 0) {
        // 假设第一个子对象是银河系中心/黑洞
        const blackHole = window.galaxy.children[0];
        corePos = new THREE.Vector3();
        blackHole.getWorldPosition(corePos);
    } else {
        // 如果没有明确的中心对象，使用银河系对象的中心位置
        corePos = window.galaxy.position.clone();
    }
    
    return corePos;
}

/**
 * 动画宇宙奇迹特效
 * 在每一帧更新特效的视觉表现
 */
function animateCosmicMiracle(timestamp) {
    // 如果特效未激活，不继续动画
    if (!cosmicMiracleState.active) {
        return;
    }
    
    // 计算已经过去的时间
    const elapsedTime = Date.now() - cosmicMiracleState.startTime;
    const normalizedTime = Math.min(elapsedTime / cosmicMiracleState.duration, 1.0);
    
    // 根据不同阶段更新特效
    updateCosmicMiraclePhase(normalizedTime, elapsedTime);
    
    // 更新各种特效元素
    updateCosmicMiracleElements(normalizedTime, elapsedTime);
    
    // 继续下一帧
    requestAnimationFrame(animateCosmicMiracle);
}

/**
 * 更新宇宙奇迹特效阶段
 * 根据时间进度切换特效的不同阶段
 */
function updateCosmicMiraclePhase(normalizedTime, elapsedTime) {
    // 根据归一化时间更新当前阶段
    if (normalizedTime < 0.1) {
        if (cosmicMiracleState.phase !== 'initialize') {
            cosmicMiracleState.phase = 'initialize';
            console.log('进入初始化阶段');
        }
    } else if (normalizedTime < 0.3) {
        if (cosmicMiracleState.phase !== 'expand') {
            cosmicMiracleState.phase = 'expand';
            console.log('进入扩展阶段');
        }
    } else if (normalizedTime < 0.7) {
        if (cosmicMiracleState.phase !== 'peak') {
            cosmicMiracleState.phase = 'peak';
            console.log('进入巅峰阶段');
        }
    } else if (normalizedTime < 0.9) {
        if (cosmicMiracleState.phase !== 'contract') {
            cosmicMiracleState.phase = 'contract';
            console.log('进入收缩阶段');
        }
    } else {
        if (cosmicMiracleState.phase !== 'finish') {
            cosmicMiracleState.phase = 'finish';
            console.log('进入结束阶段');
            
            // 当到达结束阶段时，准备清理特效
            if (normalizedTime >= 0.99) {
                cleanupCosmicMiracle();
            }
        }
    }
}

/**
 * 更新宇宙奇迹特效元素
 * 根据当前阶段和时间进度更新各种特效元素
 */
function updateCosmicMiracleElements(normalizedTime, elapsedTime) {
    // 时间值（秒）
    const timeSeconds = elapsedTime * 0.001;
    
    // 更新粒子系统
    updateParticleSystems(normalizedTime, elapsedTime, timeSeconds);
    
    // 更新能量场
    updateEnergyFields(normalizedTime, elapsedTime, timeSeconds);
    
    // 更新时空扭曲
    updateTimeDistortions(normalizedTime, elapsedTime, timeSeconds);
    
    // 更新次元裂缝
    updateDimensionRifts(normalizedTime, elapsedTime, timeSeconds);
    
    // 更新量子波动
    updateQuantumFluctuations(normalizedTime, elapsedTime, timeSeconds);
    
    // 更新暗物质网络
    updateDarkMatterWeb(normalizedTime, elapsedTime, timeSeconds);
    
    // 更新恒星转化
    updateStellarTransformation(normalizedTime, elapsedTime, timeSeconds);
    
    // 更新宇宙辐射环
    updateCosmicRadiationRings(normalizedTime, elapsedTime, timeSeconds);
    
    // 更新时空桥接
    updateSpaceTimeBridge(normalizedTime, elapsedTime, timeSeconds);
    
    // 更新星际传送门
    updateStarGateSystems(normalizedTime, elapsedTime, timeSeconds);
    
    // 更新星云爆发
    updateNebulaBurst(normalizedTime, elapsedTime, timeSeconds);
    
    // 更新相机效果
    updateCameraEffects(normalizedTime, elapsedTime, timeSeconds);
}

/**
 * 清理宇宙奇迹特效
 * 移除所有特效元素并恢复原始场景
 */
function cleanupCosmicMiracle() {
    console.log('清理宇宙奇迹特效');
    
    // 如果特效未激活，不需要清理
    if (!cosmicMiracleState.active) {
        return;
    }
    
    // 恢复原始场景状态
    restoreOriginalSceneState();
    
    // 移除所有特效元素
    removeAllEffectElements();
    
    // 重置状态
    cosmicMiracleState.active = false;
    cosmicMiracleState.phase = 'none';
    cosmicMiracleState.effectElements = [];
    cosmicMiracleState.particleSystems = [];
    cosmicMiracleState.energyFields = [];
    cosmicMiracleState.dimensionRifts = [];
    cosmicMiracleState.timeDistortions = [];
    cosmicMiracleState.cosmicVortices = [];
    cosmicMiracleState.nebulaFormations = [];
    cosmicMiracleState.stellarTransformations = [];
    cosmicMiracleState.quantumFluctuations = [];
    cosmicMiracleState.darkMatterWebs = [];
    cosmicMiracleState.galaxyCollisions = [];
    
    console.log('宇宙奇迹特效已清理完毕');
}

/**
 * 恢复原始场景状态
 * 将银河系恢复到特效触发前的状态
 */
function restoreOriginalSceneState() {
    if (cosmicMiracleState.originalScene && window.galaxy) {
        // 恢复银河系属性
        window.galaxy.visible = cosmicMiracleState.originalScene.galaxyVisible;
        window.galaxy.position.copy(cosmicMiracleState.originalScene.galaxyPosition);
        window.galaxy.rotation.x = cosmicMiracleState.originalScene.galaxyRotation.x;
        window.galaxy.rotation.y = cosmicMiracleState.originalScene.galaxyRotation.y;
        window.galaxy.rotation.z = cosmicMiracleState.originalScene.galaxyRotation.z;
        window.galaxy.scale.copy(cosmicMiracleState.originalScene.galaxyScale);
        
        // 恢复相机属性
        window.camera.position.copy(cosmicMiracleState.originalScene.cameraPosition);
        window.camera.rotation.copy(cosmicMiracleState.originalScene.cameraRotation);
        
        // 恢复控制器属性
        window.controls.enabled = cosmicMiracleState.originalScene.controlsEnabled;
        window.controls.autoRotate = cosmicMiracleState.originalScene.controlsAutoRotate;
        
        // 恢复材质
        restoreMaterials();
        
        console.log('原始场景状态已恢复');
    }
}

/**
 * 恢复材质
 * 将所有修改过的材质恢复原状
 */
function restoreMaterials() {
    // 遍历银河系的所有子对象
    if (window.galaxy && window.galaxy.children) {
        window.galaxy.children.forEach(child => {
            restoreObjectMaterials(child);
            
            // 递归处理子对象
            if (child.children) {
                child.children.forEach(subChild => {
                    restoreObjectMaterials(subChild);
                });
            }
        });
    }
}

/**
 * 恢复对象的材质
 * @param {Object} obj - 要恢复材质的对象
 */
function restoreObjectMaterials(obj) {
    if (obj.material && obj.userData && obj.userData.originalMaterial) {
        obj.material = obj.userData.originalMaterial;
        delete obj.userData.originalMaterial;
    }
    
    if (obj.material && obj.userData && typeof obj.userData.originalOpacity !== 'undefined') {
        obj.material.opacity = obj.userData.originalOpacity;
        delete obj.userData.originalOpacity;
    }
}

/**
 * 移除所有特效元素
 * 从场景中删除所有添加的特效相关对象
 */
function removeAllEffectElements() {
    // 移除所有添加的特效元素
    cosmicMiracleState.effectElements.forEach(element => {
        if (element && element.parent) {
            element.parent.remove(element);
        } else if (window.scene && element) {
            window.scene.remove(element);
        }
        
        // 清理几何体和材质
        if (element.geometry) {
            element.geometry.dispose();
        }
        
        if (element.material) {
            if (Array.isArray(element.material)) {
                element.material.forEach(mat => mat.dispose());
            } else {
                element.material.dispose();
            }
        }
    });
    
    // 清空特效元素数组
    cosmicMiracleState.effectElements = [];
}

/**
 * 创建星际传送门系统
 * 在银河系中创建闪烁的空间门户
 */
function createStarGateSystem() {
    console.log('创建星际传送门系统');
    
    // 获取银河系中心位置
    const corePosition = getGalaxyCorePosition();
    
    // 创建多个传送门
    const gateCount = 5;
    for (let i = 0; i < gateCount; i++) {
        createStarGate(corePosition, i);
    }
    
    console.log('星际传送门系统创建完成');
}

/**
 * 创建单个星际传送门
 * @param {THREE.Vector3} centerPosition - 中心参考位置
 * @param {number} index - 传送门索引
 */
function createStarGate(centerPosition, index) {
    // 在银河系周围随机位置
    const angle = index * (Math.PI * 2 / 5) + Math.random() * 0.3;
    const distance = 6000 + Math.random() * 2000;
    
    const position = new THREE.Vector3(
        centerPosition.x + Math.cos(angle) * distance,
        centerPosition.y + (Math.random() - 0.5) * 1000,
        centerPosition.z + Math.sin(angle) * distance
    );
    
    // 创建传送门环几何体
    const ringGeometry = new THREE.TorusGeometry(300, 50, 32, 100);
    
    // 创建传送门材质 - 使用自定义着色器
    const gateMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color1: { value: new THREE.Color(0x0077ff) },
            color2: { value: new THREE.Color(0x00ffff) }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vPosition;
            varying vec3 vNormal;
            
            void main() {
                vUv = uv;
                vPosition = position;
                vNormal = normal;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 color1;
            uniform vec3 color2;
            varying vec2 vUv;
            varying vec3 vPosition;
            varying vec3 vNormal;
            
            // 噪声函数
            float noise(vec2 p) {
                return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
            }
            
            void main() {
                // 环形波纹
                float wave = 0.5 + 0.5 * sin(vUv.x * 30.0 - time * 2.0);
                
                // 脉冲效果
                float pulse = 0.5 + 0.5 * sin(time * 3.0);
                
                // 边缘光晕
                vec3 viewDir = normalize(vPosition);
                float rim = 1.0 - max(dot(normalize(vNormal), viewDir), 0.0);
                rim = smoothstep(0.5, 1.0, rim);
                
                // 噪声纹理
                float noiseVal = noise(vUv * 10.0 + time * 0.1);
                
                // 混合颜色
                vec3 color = mix(color1, color2, wave * pulse);
                color += rim * 0.3 * color2;
                
                // 最终颜色
                float alpha = 0.7 * rim + 0.3 * wave + 0.1 * noiseVal;
                alpha = smoothstep(0.1, 0.9, alpha) * 0.7;
                
                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    
    // 创建传送门环
    const gate = new THREE.Mesh(ringGeometry, gateMaterial);
    gate.position.copy(position);
    
    // 随机旋转
    gate.rotation.x = Math.random() * Math.PI * 2;
    gate.rotation.y = Math.random() * Math.PI * 2;
    gate.rotation.z = Math.random() * Math.PI * 2;
    
    // 添加到场景
    window.scene.add(gate);
    
    // 存储到状态中
    const gateData = {
        gate: gate,
        initialPosition: position.clone(),
        initialRotation: gate.rotation.clone(),
        rotationSpeed: {
            x: (Math.random() - 0.5) * 0.001,
            y: (Math.random() - 0.5) * 0.001,
            z: (Math.random() - 0.5) * 0.001
        },
        oscillation: {
            amplitude: 50 + Math.random() * 30,
            speed: 0.5 + Math.random() * 0.5,
            phase: Math.random() * Math.PI * 2
        }
    };
    
    cosmicMiracleState.effectElements.push(gate);
    
    // 创建传送门中心特效
    createStarGateCenter(position, index);
    
    // 创建传送门粒子流
    createStarGateParticleStream(position, index);
}

/**
 * 创建星际传送门中心特效
 * @param {THREE.Vector3} position - 中心位置
 * @param {number} index - 传送门索引
 */
function createStarGateCenter(position, index) {
    // 创建中心平面几何体
    const planeGeometry = new THREE.CircleGeometry(250, 32);
    
    // 创建中心平面材质 - 使用自定义着色器
    const planeMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color1: { value: new THREE.Color(0x0066ff) },
            color2: { value: new THREE.Color(0x00ddff) },
            color3: { value: new THREE.Color(0x0022aa) }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vPosition;
            
            void main() {
                vUv = uv;
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 color1;
            uniform vec3 color2;
            uniform vec3 color3;
            varying vec2 vUv;
            varying vec3 vPosition;
            
            // 噪声函数
            float noise(vec2 p) {
                return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
            }
            
            // 分形噪声
            float fbm(vec2 p) {
                float sum = 0.0;
                float amp = 1.0;
                float freq = 1.0;
                for (int i = 0; i < 6; i++) {
                    sum += amp * noise(p * freq);
                    amp *= 0.5;
                    freq *= 2.0;
                    p = p * 1.1 + vec2(time * 0.05, time * 0.07);
                }
                return sum;
            }
            
            void main() {
                // 到中心的距离
                vec2 center = vec2(0.5, 0.5);
                float dist = length(vUv - center) * 2.0;
                
                // 涟漪效果
                float ripple = 0.5 + 0.5 * sin(dist * 20.0 - time * 2.0);
                
                // 旋转效果
                float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
                float spiral = 0.5 + 0.5 * sin(angle * 10.0 + dist * 20.0 - time * 3.0);
                
                // 分形噪声效果
                float noise = fbm((vUv - 0.5) * 5.0 + time * 0.1);
                
                // 混合效果
                float pattern = mix(ripple, spiral, 0.5) + noise * 0.3;
                
                // 混合颜色
                vec3 color = mix(color1, color2, pattern);
                color = mix(color, color3, smoothstep(0.0, 1.0, dist));
                
                // 透明度 - 中心更透明，边缘更不透明
                float alpha = (1.0 - dist * dist) * 0.7;
                alpha = smoothstep(0.0, 0.5, alpha);
                
                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    
    // 创建中心平面
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.copy(position);
    
    // 随机旋转，但面向相机
    plane.lookAt(window.camera.position);
    
    // 添加到场景
    window.scene.add(plane);
    
    // 存储到状态中
    const planeData = {
        plane: plane,
        initialPosition: position.clone(),
        index: index,
        lookAtCamera: true
    };
    
    cosmicMiracleState.effectElements.push(plane);
    
    // 创建光晕
    createStarGateGlow(position, index);
}

/**
 * 创建星际传送门光晕
 * @param {THREE.Vector3} position - 中心位置
 * @param {number} index - 传送门索引
 */
function createStarGateGlow(position, index) {
    // 创建光晕几何体
    const glowGeometry = new THREE.CircleGeometry(350, 32);
    
    // 创建光晕材质
    const glowMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color: { value: new THREE.Color(0x00ddff) }
        },
        vertexShader: `
            varying vec2 vUv;
            
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 color;
            varying vec2 vUv;
            
            void main() {
                vec2 center = vec2(0.5, 0.5);
                float dist = length(vUv - center) * 2.0;
                
                // 柔和的光晕
                float glow = 1.0 - dist;
                glow = pow(glow, 3.0);
                
                // 脉冲效果
                float pulse = 0.7 + 0.3 * sin(time * 1.2);
                glow *= pulse;
                
                // 透明度渐变
                float alpha = smoothstep(0.0, 1.0, glow) * 0.3;
                
                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    
    // 创建光晕
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.copy(position);
    
    // 面向相机
    glow.lookAt(window.camera.position);
    
    // 添加到场景
    window.scene.add(glow);
    
    // 存储到状态中
    const glowData = {
        glow: glow,
        initialPosition: position.clone(),
        index: index,
        lookAtCamera: true
    };
    
    cosmicMiracleState.effectElements.push(glow);
}

/**
 * 创建星际传送门粒子流
 * @param {THREE.Vector3} position - 中心位置
 * @param {number} index - 传送门索引
 */
function createStarGateParticleStream(position, index) {
    // 创建粒子几何体
    const particleCount = 2000;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    const particleData = new Float32Array(particleCount * 3); // 存储额外数据：角度、距离、随机值
    
    // 在传送门周围分布粒子
    const centerPos = position.clone();
    for (let i = 0; i < particleCount; i++) {
        // 计算粒子的圆盘分布
        const angle = Math.random() * Math.PI * 2;
        const distance = 250 + Math.random() * 150;
        
        // 随机偏移
        const posX = centerPos.x + Math.cos(angle) * distance;
        const posY = centerPos.y + (Math.random() - 0.5) * 50;
        const posZ = centerPos.z + Math.sin(angle) * distance;
        
        // 设置位置
        particlePositions[i * 3] = posX;
        particlePositions[i * 3 + 1] = posY;
        particlePositions[i * 3 + 2] = posZ;
        
        // 设置颜色 - 蓝到青色渐变
        const hue = 0.5 + Math.random() * 0.1; // 青色范围
        const saturation = 0.7 + Math.random() * 0.3;
        const lightness = 0.5 + Math.random() * 0.4;
        
        const color = new THREE.Color().setHSL(hue, saturation, lightness);
        particleColors[i * 3] = color.r;
        particleColors[i * 3 + 1] = color.g;
        particleColors[i * 3 + 2] = color.b;
        
        // 设置大小
        particleSizes[i] = 10 + Math.random() * 40;
        
        // 额外数据
        particleData[i * 3] = angle; // 角度
        particleData[i * 3 + 1] = distance; // 距离
        particleData[i * 3 + 2] = Math.random(); // 随机值
    }
    
    // 设置属性
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
    particleGeometry.setAttribute('particleData', new THREE.BufferAttribute(particleData, 3));
    
    // 创建材质
    const particleMaterial = new THREE.PointsMaterial({
        size: 20,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        depthWrite: false
    });
    
    // 创建粒子系统
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    
    // 添加到场景
    window.scene.add(particleSystem);
    
    // 存储到状态中
    const streamData = {
        system: particleSystem,
        geometry: particleGeometry,
        initialPositions: particlePositions.slice(),
        centerPosition: centerPos.clone(),
        type: 'starGateStream',
        index: index
    };
    
    cosmicMiracleState.particleSystems.push(streamData);
    cosmicMiracleState.effectElements.push(particleSystem);
}

/**
 * 创建星云爆发
 * 在银河系周围创建绚丽的星云爆发效果
 */
function createNebulaBurst() {
    console.log('创建星云爆发');
    
    // 获取银河系中心位置
    const corePosition = getGalaxyCorePosition();
    
    // 创建多个星云爆发
    const burstCount = 3;
    for (let i = 0; i < burstCount; i++) {
        createSingleNebulaBurst(corePosition, i);
    }
    
    console.log('星云爆发创建完成');
}

/**
 * 创建单个星云爆发
 * @param {THREE.Vector3} centerPosition - 中心参考位置
 * @param {number} index - 星云索引
 */
function createSingleNebulaBurst(centerPosition, index) {
    // 在银河系周围随机位置
    const angle = index * (Math.PI * 2 / 3) + Math.random() * 0.5;
    const distance = 8000 + Math.random() * 3000;
    
    const position = new THREE.Vector3(
        centerPosition.x + Math.cos(angle) * distance,
        centerPosition.y + (Math.random() - 0.5) * 2000,
        centerPosition.z + Math.sin(angle) * distance
    );
    
    // 创建星云粒子
    createNebulaBurstParticles(position, index);
    
    // 创建星云核心
    createNebulaBurstCore(position, index);
    
    // 创建星云光晕
    createNebulaBurstGlow(position, index);
}

/**
 * 创建星云爆发粒子
 * @param {THREE.Vector3} position - 中心位置
 * @param {number} index - 星云索引
 */
function createNebulaBurstParticles(position, index) {
    // 创建粒子几何体
    const particleCount = 10000;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    const particleData = new Float32Array(particleCount * 3); // 存储额外数据
    
    // 星云颜色基调 - 每个星云有不同的颜色
    let baseHue, accentHue;
    switch (index % 3) {
        case 0: // 蓝色系
            baseHue = 0.6;
            accentHue = 0.5;
            break;
        case 1: // 青紫色系
            baseHue = 0.7;
            accentHue = 0.65;
            break;
        case 2: // 绿蓝色系
            baseHue = 0.45;
            accentHue = 0.5;
            break;
    }
    
    // 在球体范围内分布粒子
    const radius = 1500;
    for (let i = 0; i < particleCount; i++) {
        // 使用极坐标创建非均匀分布
        const r = Math.pow(Math.random(), 3) * radius;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        // 扭曲分布
        const twist = Math.sin(phi * 10) * 0.2;
        const finalTheta = theta + twist;
        
        // 转换为笛卡尔坐标
        particlePositions[i * 3] = position.x + r * Math.sin(phi) * Math.cos(finalTheta);
        particlePositions[i * 3 + 1] = position.y + r * Math.sin(phi) * Math.sin(finalTheta) * 0.7; // 扁平化
        particlePositions[i * 3 + 2] = position.z + r * Math.cos(phi);
        
        // 距离中心的归一化距离
        const distRatio = r / radius;
        
        // 设置颜色 - 从中心到边缘渐变
        const useAccentColor = Math.random() < 0.3; // 30%使用点缀色
        const hue = useAccentColor ? accentHue : baseHue;
        const hueVariation = (Math.random() - 0.5) * 0.1;
        const saturation = 0.7 + Math.random() * 0.3;
        const lightness = 0.5 + Math.random() * 0.3 - distRatio * 0.2; // 边缘略暗
        
        const color = new THREE.Color().setHSL(hue + hueVariation, saturation, lightness);
        particleColors[i * 3] = color.r;
        particleColors[i * 3 + 1] = color.g;
        particleColors[i * 3 + 2] = color.b;
        
        // 设置大小 - 中心粒子更大
        particleSizes[i] = 30 * (1 - distRatio * 0.7) + Math.random() * 20;
        
        // 额外数据
        particleData[i * 3] = r / radius; // 归一化半径
        particleData[i * 3 + 1] = theta; // 角度
        particleData[i * 3 + 2] = Math.random(); // 随机值
    }
    
    // 设置属性
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
    particleGeometry.setAttribute('particleData', new THREE.BufferAttribute(particleData, 3));
    
    // 创建材质
    const particleMaterial = new THREE.PointsMaterial({
        size: 40,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        depthWrite: false
    });
    
    // 创建粒子系统
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    
    // 添加到场景
    window.scene.add(particleSystem);
    
    // 存储到状态中
    const nebulaData = {
        system: particleSystem,
        geometry: particleGeometry,
        initialPositions: particlePositions.slice(),
        centerPosition: position.clone(),
        type: 'nebulaBurst',
        index: index
    };
    
    cosmicMiracleState.nebulaFormations.push(nebulaData);
    cosmicMiracleState.effectElements.push(particleSystem);
}

/**
 * 创建星云爆发核心
 * @param {THREE.Vector3} position - 中心位置
 * @param {number} index - 星云索引
 */
function createNebulaBurstCore(position, index) {
    // 星云核心颜色
    let coreColor1, coreColor2;
    switch (index % 3) {
        case 0: // 蓝色系
            coreColor1 = new THREE.Color(0x0088ff);
            coreColor2 = new THREE.Color(0x00ccff);
            break;
        case 1: // 青紫色系
            coreColor1 = new THREE.Color(0x8866ff);
            coreColor2 = new THREE.Color(0xaa99ff);
            break;
        case 2: // 绿蓝色系
            coreColor1 = new THREE.Color(0x00ccaa);
            coreColor2 = new THREE.Color(0x00ffdd);
            break;
    }
    
    // 创建核心几何体
    const coreGeometry = new THREE.SphereGeometry(400, 32, 32);
    
    // 创建核心材质
    const coreMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color1: { value: coreColor1 },
            color2: { value: coreColor2 }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vPosition;
            varying vec3 vNormal;
            
            void main() {
                vUv = uv;
                vPosition = position;
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 color1;
            uniform vec3 color2;
            varying vec2 vUv;
            varying vec3 vPosition;
            varying vec3 vNormal;
            
            // 噪声函数
            float noise(vec3 p) {
                return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
            }
            
            // 分形噪声
            float fbm(vec3 p) {
                float sum = 0.0;
                float amp = 1.0;
                float freq = 1.0;
                for (int i = 0; i < 5; i++) {
                    sum += amp * noise(p * freq);
                    amp *= 0.5;
                    freq *= 2.0;
                    p = p + vec3(time * 0.01, time * 0.015, time * 0.007);
                }
                return sum;
            }
            
            void main() {
                // 创建动态噪声纹理
                float n = fbm(vPosition * 0.01 + time * 0.01);
                
                // 边缘效果
                vec3 viewDir = normalize(vPosition);
                float rim = 1.0 - max(dot(vNormal, viewDir), 0.0);
                rim = smoothstep(0.0, 1.0, rim);
                
                // 纹理混合
                vec3 color = mix(color1, color2, n + rim * 0.5);
                
                // 脉冲效果
                float pulse = 0.7 + 0.3 * sin(time * 1.5);
                
                // 最终颜色
                vec4 finalColor = vec4(color * pulse, 0.7 * (0.5 + n * 0.5));
                
                gl_FragColor = finalColor;
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.FrontSide,
        depthWrite: false
    });
    
    // 创建核心
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    core.position.copy(position);
    
    // 添加到场景
    window.scene.add(core);
    
    // 存储到状态中
    const coreData = {
        mesh: core,
        initialPosition: position.clone(),
        initialScale: new THREE.Vector3(1, 1, 1),
        type: 'nebulaBurstCore',
        index: index
    };
    
    cosmicMiracleState.nebulaFormations.push(coreData);
    cosmicMiracleState.effectElements.push(core);
}

/**
 * 创建星云爆发光晕
 * @param {THREE.Vector3} position - 中心位置
 * @param {number} index - 星云索引
 */
function createNebulaBurstGlow(position, index) {
    // 星云光晕颜色
    let glowColor;
    switch (index % 3) {
        case 0: // 蓝色系
            glowColor = new THREE.Color(0x0066ff);
            break;
        case 1: // 青紫色系
            glowColor = new THREE.Color(0x6655ee);
            break;
        case 2: // 绿蓝色系
            glowColor = new THREE.Color(0x00aa88);
            break;
    }
    
    // 创建光晕几何体
    const glowGeometry = new THREE.CircleGeometry(1800, 32);
    
    // 创建光晕材质
    const glowMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color: { value: glowColor }
        },
        vertexShader: `
            varying vec2 vUv;
            
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 color;
            varying vec2 vUv;
            
            void main() {
                vec2 center = vec2(0.5, 0.5);
                float dist = length(vUv - center) * 2.0;
                
                // 柔和的光晕
                float glow = 1.0 - dist;
                glow = pow(glow, 3.0);
                
                // 脉冲效果
                float pulse = 0.7 + 0.3 * sin(time * 1.2);
                glow *= pulse;
                
                // 透明度渐变
                float alpha = smoothstep(0.0, 1.0, glow) * 0.3;
                
                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    
    // 创建光晕
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.copy(position);
    
    // 面向相机
    glow.lookAt(window.camera.position);
    
    // 添加到场景
    window.scene.add(glow);
    
    // 存储到状态中
    const glowData = {
        mesh: glow,
        initialPosition: position.clone(),
        type: 'nebulaBurstGlow',
        index: index,
        lookAtCamera: true
    };
    
    cosmicMiracleState.nebulaFormations.push(glowData);
    cosmicMiracleState.effectElements.push(glow);
}

/**
 * 创建次元裂缝
 * 在银河系周围创建空间裂缝效果
 */
function createDimensionalRift() {
    console.log('创建次元裂缝');
    
    // 获取银河系中心位置
    const corePosition = getGalaxyCorePosition();
    
    // 创建裂缝形状
    const riftPoints = createRiftPath(corePosition);
    
    // 创建裂缝几何体
    const riftGeometry = new THREE.BufferGeometry();
    
    // 使用线段表示裂缝
    const positions = [];
    const colors = [];
    
    // 创建裂缝分段
    for (let i = 0; i < riftPoints.length - 1; i++) {
        positions.push(
            riftPoints[i].x, riftPoints[i].y, riftPoints[i].z,
            riftPoints[i+1].x, riftPoints[i+1].y, riftPoints[i+1].z
        );
        
        // 颜色 - 深蓝到青色渐变
        const t = i / (riftPoints.length - 2);
        const color1 = new THREE.Color().setHSL(0.55 + t * 0.15, 0.8, 0.5 + t * 0.2);
        const color2 = new THREE.Color().setHSL(0.55 + (t + 0.01) * 0.15, 0.8, 0.5 + (t + 0.01) * 0.2);
        
        colors.push(
            color1.r, color1.g, color1.b,
            color2.r, color2.g, color2.b
        );
    }
    
    riftGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    riftGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    // 创建裂缝材质
    const riftMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        linewidth: 2,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });
    
    // 创建裂缝线段
    const riftLines = new THREE.LineSegments(riftGeometry, riftMaterial);
    
    // 添加到场景
    window.scene.add(riftLines);
    
    // 存储到状态中
    cosmicMiracleState.dimensionRifts.push({
        rift: riftLines,
        points: riftPoints,
        type: 'mainRift'
    });
    
    cosmicMiracleState.effectElements.push(riftLines);
    
    // 创建裂缝辉光
    createRiftGlow(riftPoints);
    
    // 创建裂缝粒子
    createRiftParticles(riftPoints);
    
    // 创建周围的小裂缝
    createSmallRifts(corePosition, riftPoints);
    
    console.log('次元裂缝创建完成');
}

/**
 * 创建裂缝路径
 * @param {THREE.Vector3} centerPosition - 中心参考位置
 * @returns {Array<THREE.Vector3>} 裂缝路径点
 */
function createRiftPath(centerPosition) {
    // 创建一条曲折的裂缝路径
    const points = [];
    const pointCount = 200;
    
    // 裂缝起点
    const startPoint = new THREE.Vector3(
        centerPosition.x + (Math.random() - 0.5) * 5000,
        centerPosition.y + (Math.random() - 0.5) * 3000,
        centerPosition.z + (Math.random() - 0.5) * 5000
    );
    
    // 裂缝终点
    const endPoint = new THREE.Vector3(
        centerPosition.x + (Math.random() - 0.5) * 5000,
        centerPosition.y + (Math.random() - 0.5) * 3000,
        centerPosition.z + (Math.random() - 0.5) * 5000
    );
    
    // 控制点 - 使用多个控制点创建更自然的曲线
    const controlPoints = [];
    const controlPointCount = 5;
    
    for (let i = 0; i < controlPointCount; i++) {
        const t = (i + 1) / (controlPointCount + 1);
        
        // 在起点和终点之间插值，并添加随机偏移
        const point = new THREE.Vector3().lerpVectors(startPoint, endPoint, t);
        
        // 添加随机偏移
        point.x += (Math.random() - 0.5) * 4000;
        point.y += (Math.random() - 0.5) * 2000;
        point.z += (Math.random() - 0.5) * 4000;
        
        controlPoints.push(point);
    }
    
    // 创建曲线 - 起点、所有控制点和终点构成一条平滑曲线
    const curvePoints = [startPoint, ...controlPoints, endPoint];
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    
    // 对曲线取样得到更多点
    const pathPoints = curve.getPoints(pointCount);
    
    // 添加蜿蜒效果
    const finalPoints = [];
    const wiggleScale = 300;
    const wiggleFreq = 0.2;
    
    // 获取曲线的切线、法线和副法线
    for (let i = 0; i < pathPoints.length; i++) {
        const t = i / (pathPoints.length - 1);
        const point = pathPoints[i];
        
        let tangent, normal, binormal;
        
        if (i < pathPoints.length - 1) {
            // 计算切线
            tangent = new THREE.Vector3().subVectors(pathPoints[i + 1], point).normalize();
            
            // 创建一个临时向上的向量
            const up = new THREE.Vector3(0, 1, 0);
            
            // 如果切线与向上向量基本平行，使用另一个方向
            if (Math.abs(tangent.dot(up)) > 0.9) {
                up.set(1, 0, 0);
            }
            
            // 计算副法线和法线
            binormal = new THREE.Vector3().crossVectors(tangent, up).normalize();
            normal = new THREE.Vector3().crossVectors(binormal, tangent).normalize();
        } else {
            // 最后一个点使用前一个点的方向
            tangent = new THREE.Vector3().subVectors(point, pathPoints[i - 1]).normalize();
            
            // 创建一个临时向上的向量
            const up = new THREE.Vector3(0, 1, 0);
            
            // 如果切线与向上向量基本平行，使用另一个方向
            if (Math.abs(tangent.dot(up)) > 0.9) {
                up.set(1, 0, 0);
            }
            
            // 计算副法线和法线
            binormal = new THREE.Vector3().crossVectors(tangent, up).normalize();
            normal = new THREE.Vector3().crossVectors(binormal, tangent).normalize();
        }
        
        // 沿法线和副法线添加扰动
        const wiggle1 = Math.sin(t * Math.PI * 10 * wiggleFreq) * wiggleScale;
        const wiggle2 = Math.cos(t * Math.PI * 15 * wiggleFreq) * wiggleScale;
        
        // 添加蜿蜒效果
        const wigglePoint = point.clone()
            .add(normal.clone().multiplyScalar(wiggle1))
            .add(binormal.clone().multiplyScalar(wiggle2));
        
        finalPoints.push(wigglePoint);
    }
    
    return finalPoints;
}

/**
 * 创建裂缝辉光
 * @param {Array<THREE.Vector3>} riftPoints - 裂缝路径点
 */
function createRiftGlow(riftPoints) {
    // 对裂缝路径点进行简化，每隔几个点取一个
    const simplifiedPoints = [];
    const step = 5;
    
    for (let i = 0; i < riftPoints.length; i += step) {
        if (i < riftPoints.length) {
            simplifiedPoints.push(riftPoints[i]);
        }
    }
    
    // 确保有终点
    if (simplifiedPoints[simplifiedPoints.length - 1] !== riftPoints[riftPoints.length - 1]) {
        simplifiedPoints.push(riftPoints[riftPoints.length - 1]);
    }
    
    // 为每个简化点创建一个光晕平面
    for (let i = 0; i < simplifiedPoints.length; i++) {
        const point = simplifiedPoints[i];
        
        // 创建辉光几何体
        const glowGeometry = new THREE.PlaneGeometry(500 + Math.random() * 300, 500 + Math.random() * 300);
        
        // 创建辉光材质
        const glowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0x00aaff) }
            },
            vertexShader: `
                varying vec2 vUv;
                
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec2 vUv;
                
                void main() {
                    vec2 center = vec2(0.5, 0.5);
                    float dist = length(vUv - center) * 2.0;
                    
                    // 圆形光晕
                    float glow = 1.0 - dist;
                    glow = pow(glow, 2.0);
                    
                    // 脉冲效果
                    float pulse = 0.7 + 0.3 * sin(time * 3.0 + dist * 5.0);
                    glow *= pulse;
                    
                    float alpha = smoothstep(0.0, 1.0, glow) * 0.5;
                    
                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
            depthWrite: false
        });
        
        // 创建辉光平面
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.copy(point);
        
        // 让平面面向相机
        glow.lookAt(window.camera.position);
        
        // 添加到场景
        window.scene.add(glow);
        
        // 存储到状态中
        cosmicMiracleState.dimensionRifts.push({
            glow: glow,
            position: point.clone(),
            type: 'riftGlow',
            lookAtCamera: true
        });
        
        cosmicMiracleState.effectElements.push(glow);
    }
}

/**
 * 创建裂缝粒子
 * @param {Array<THREE.Vector3>} riftPoints - 裂缝路径点
 */
function createRiftParticles(riftPoints) {
    // 创建粒子几何体
    const particleCount = 5000;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    
    // 沿裂缝路径分布粒子
    for (let i = 0; i < particleCount; i++) {
        // 随机选择裂缝上的一点
        const pathIndex = Math.floor(Math.random() * (riftPoints.length - 1));
        const point1 = riftPoints[pathIndex];
        const point2 = riftPoints[pathIndex + 1];
        
        // 在两点之间插值
        const t = Math.random();
        const pos = new THREE.Vector3().lerpVectors(point1, point2, t);
        
        // 添加随机偏移
        const offset = 200 + 300 * Math.random();
        pos.x += (Math.random() - 0.5) * offset;
        pos.y += (Math.random() - 0.5) * offset;
        pos.z += (Math.random() - 0.5) * offset;
        
        // 设置位置
        particlePositions[i * 3] = pos.x;
        particlePositions[i * 3 + 1] = pos.y;
        particlePositions[i * 3 + 2] = pos.z;
        
        // 设置颜色 - 蓝色到青色渐变
        const hue = 0.5 + Math.random() * 0.1; // 青色范围
        const saturation = 0.7 + Math.random() * 0.3;
        const lightness = 0.5 + Math.random() * 0.3;
        
        const color = new THREE.Color().setHSL(hue, saturation, lightness);
        particleColors[i * 3] = color.r;
        particleColors[i * 3 + 1] = color.g;
        particleColors[i * 3 + 2] = color.b;
        
        // 设置大小
        particleSizes[i] = 20 + Math.random() * 40;
    }
    
    // 设置属性
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
    
    // 创建材质
    const particleMaterial = new THREE.PointsMaterial({
        size: 30,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        depthWrite: false
    });
    
    // 创建粒子系统
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    
    // 添加到场景
    window.scene.add(particleSystem);
    
    // 存储到状态中
    const particleData = {
        system: particleSystem,
        geometry: particleGeometry,
        initialPositions: particlePositions.slice(),
        type: 'riftParticles'
    };
    
    cosmicMiracleState.particleSystems.push(particleData);
    cosmicMiracleState.effectElements.push(particleSystem);
}

/**
 * 创建周围的小裂缝
 * @param {THREE.Vector3} centerPosition - 中心参考位置
 * @param {Array<THREE.Vector3>} mainRiftPoints - 主裂缝路径点
 */
function createSmallRifts(centerPosition, mainRiftPoints) {
    // 创建几条小裂缝
    const smallRiftCount = 8;
    
    for (let i = 0; i < smallRiftCount; i++) {
        // 随机选择主裂缝上的一点作为小裂缝的起点
        const startIndex = Math.floor(Math.random() * mainRiftPoints.length);
        const startPoint = mainRiftPoints[startIndex].clone();
        
        // 创建小裂缝终点 - 朝随机方向延伸
        const direction = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
        ).normalize();
        
        const length = 500 + Math.random() * 1500;
        const endPoint = startPoint.clone().add(direction.multiplyScalar(length));
        
        // 创建小裂缝
        createSmallRift(startPoint, endPoint, i);
    }
}

/**
 * 创建单个小裂缝
 * @param {THREE.Vector3} startPoint - 起点
 * @param {THREE.Vector3} endPoint - 终点
 * @param {number} index - 索引
 */
function createSmallRift(startPoint, endPoint, index) {
    // 创建路径点
    const pointCount = 50;
    const points = [];
    
    // 在起点和终点之间创建一条曲折的路径
    for (let i = 0; i <= pointCount; i++) {
        const t = i / pointCount;
        
        // 线性插值基础位置
        const pos = new THREE.Vector3().lerpVectors(startPoint, endPoint, t);
        
        // 添加噪声
        const noiseScale = 100 + 200 * (1 - t); // 靠近起点的扰动更大
        pos.x += (Math.random() - 0.5) * noiseScale;
        pos.y += (Math.random() - 0.5) * noiseScale;
        pos.z += (Math.random() - 0.5) * noiseScale;
        
        points.push(pos);
    }
    
    // 创建几何体
    const riftGeometry = new THREE.BufferGeometry();
    
    // 使用线段表示裂缝
    const positions = [];
    const colors = [];
    
    // 创建裂缝分段
    for (let i = 0; i < points.length - 1; i++) {
        positions.push(
            points[i].x, points[i].y, points[i].z,
            points[i+1].x, points[i+1].y, points[i+1].z
        );
        
        // 颜色 - 蓝色到青色渐变
        const t = i / (points.length - 2);
        const color1 = new THREE.Color().setHSL(0.5 + t * 0.1, 0.7, 0.5 + t * 0.1);
        const color2 = new THREE.Color().setHSL(0.5 + (t + 0.01) * 0.1, 0.7, 0.5 + (t + 0.01) * 0.1);
        
        colors.push(
            color1.r, color1.g, color1.b,
            color2.r, color2.g, color2.b
        );
    }
    
    riftGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    riftGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    // 创建材质
    const riftMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        linewidth: 2,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    // 创建线段
    const riftLines = new THREE.LineSegments(riftGeometry, riftMaterial);
    
    // 添加到场景
    window.scene.add(riftLines);
    
    // 存储到状态中
    cosmicMiracleState.dimensionRifts.push({
        rift: riftLines,
        points: points,
        type: 'smallRift',
        index: index
    });
    
    cosmicMiracleState.effectElements.push(riftLines);
    
    // 添加一些粒子
    createSmallRiftParticles(points);
}

/**
 * 创建小裂缝粒子
 * @param {Array<THREE.Vector3>} points - 裂缝路径点
 */
function createSmallRiftParticles(points) {
    // 创建粒子几何体
    const particleCount = 500;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    
    // 沿裂缝路径分布粒子
    for (let i = 0; i < particleCount; i++) {
        // 随机选择裂缝上的一点
        const pathIndex = Math.floor(Math.random() * (points.length - 1));
        const point1 = points[pathIndex];
        const point2 = points[pathIndex + 1];
        
        // 在两点之间插值
        const t = Math.random();
        const pos = new THREE.Vector3().lerpVectors(point1, point2, t);
        
        // 添加随机偏移
        const offset = 50 + 100 * Math.random();
        pos.x += (Math.random() - 0.5) * offset;
        pos.y += (Math.random() - 0.5) * offset;
        pos.z += (Math.random() - 0.5) * offset;
        
        // 设置位置
        particlePositions[i * 3] = pos.x;
        particlePositions[i * 3 + 1] = pos.y;
        particlePositions[i * 3 + 2] = pos.z;
        
        // 设置颜色 - 蓝色到青色渐变
        const hue = 0.5 + Math.random() * 0.1; // 青色范围
        const saturation = 0.7 + Math.random() * 0.3;
        const lightness = 0.5 + Math.random() * 0.3;
        
        const color = new THREE.Color().setHSL(hue, saturation, lightness);
        particleColors[i * 3] = color.r;
        particleColors[i * 3 + 1] = color.g;
        particleColors[i * 3 + 2] = color.b;
        
        // 设置大小
        particleSizes[i] = 10 + Math.random() * 20;
    }
    
    // 设置属性
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
    
    // 创建材质
    const particleMaterial = new THREE.PointsMaterial({
        size: 15,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        depthWrite: false
    });
    
    // 创建粒子系统
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    
    // 添加到场景
    window.scene.add(particleSystem);
    
    // 存储到状态中
    const particleData = {
        system: particleSystem,
        geometry: particleGeometry,
        initialPositions: particlePositions.slice(),
        type: 'smallRiftParticles'
    };
    
    cosmicMiracleState.particleSystems.push(particleData);
    cosmicMiracleState.effectElements.push(particleSystem);
}

/**
 * 创建量子波动粒子场
 * 在整个场景中创建量子波动粒子效果
 */
function createQuantumFluctuationField() {
    console.log('创建量子波动粒子场');
    
    // 获取银河系中心位置
    const corePosition = getGalaxyCorePosition();
    
    // 创建量子粒子几何体
    const particleCount = 20000;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    const particleData = new Float32Array(particleCount * 3); // 存储额外数据
    
    // 在大范围空间中随机分布粒子
    const distributionRadius = 15000;
    for (let i = 0; i < particleCount; i++) {
        // 随机球体分布
        const radius = distributionRadius * Math.pow(Math.random(), 0.5);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        // 转换为笛卡尔坐标
        particlePositions[i * 3] = corePosition.x + radius * Math.sin(phi) * Math.cos(theta);
        particlePositions[i * 3 + 1] = corePosition.y + radius * Math.sin(phi) * Math.sin(theta);
        particlePositions[i * 3 + 2] = corePosition.z + radius * Math.cos(phi);
        
        // 设置颜色 - 多种颜色混合
        let hue;
        const colorGroup = Math.random();
        
        if (colorGroup < 0.3) {
            // 蓝色系
            hue = 0.6 + Math.random() * 0.1;
        } else if (colorGroup < 0.6) {
            // 青色系
            hue = 0.5 + Math.random() * 0.1;
        } else if (colorGroup < 0.9) {
            // 紫色系
            hue = 0.7 + Math.random() * 0.1;
        } else {
            // 随机点缀色
            hue = Math.random();
        }
        
        const saturation = 0.7 + Math.random() * 0.3;
        const lightness = 0.5 + Math.random() * 0.3;
        
        const color = new THREE.Color().setHSL(hue, saturation, lightness);
        particleColors[i * 3] = color.r;
        particleColors[i * 3 + 1] = color.g;
        particleColors[i * 3 + 2] = color.b;
        
        // 设置大小 - 变化范围大
        particleSizes[i] = 5 + Math.random() * 15;
        
        // 额外数据 - 用于动画
        particleData[i * 3] = Math.random() * Math.PI * 2; // 初始相位
        particleData[i * 3 + 1] = 0.5 + Math.random() * 2; // 频率变化
        particleData[i * 3 + 2] = Math.random(); // 随机值
    }
    
    // 设置属性
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
    particleGeometry.setAttribute('particleData', new THREE.BufferAttribute(particleData, 3));
    
    // 创建材质 - 使用自定义着色器
    const particleMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 }
        },
        vertexShader: `
            attribute vec3 color;
            attribute float size;
            attribute vec3 particleData;
            
            varying vec3 vColor;
            
            void main() {
                vColor = color;
                
                // 使用粒子数据中的随机相位和频率
                float phase = particleData.x;
                float frequency = particleData.y;
                float random = particleData.z;
                
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                
                // 根据时间调整点大小
                float pulse = 0.8 + 0.2 * sin(phase + frequency * time);
                gl_PointSize = size * pulse * (300.0 / -mvPosition.z);
                
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            
            void main() {
                // 创建柔和的圆形粒子
                float dist = length(gl_PointCoord - vec2(0.5, 0.5)) * 2.0;
                float alpha = 1.0 - smoothstep(0.8, 1.0, dist);
                
                gl_FragColor = vec4(vColor, alpha * 0.6);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    // 创建粒子系统
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    
    // 添加到场景
    window.scene.add(particleSystem);
    
    // 存储到状态中
    const quantumData = {
        system: particleSystem,
        geometry: particleGeometry,
        initialPositions: particlePositions.slice(),
        type: 'quantumFluctuation'
    };
    
    cosmicMiracleState.quantumFluctuations.push(quantumData);
    cosmicMiracleState.effectElements.push(particleSystem);
    
    // 创建量子场能量波
    createQuantumEnergyWaves(corePosition);
    
    console.log('量子波动粒子场创建完成');
}

/**
 * 创建量子场能量波
 * @param {THREE.Vector3} centerPosition - 中心参考位置
 */
function createQuantumEnergyWaves(centerPosition) {
    // 创建多个能量波
    const waveCount = 5;
    
    for (let i = 0; i < waveCount; i++) {
        // 创建波动面几何体
        const radius = 1000 + i * 2000;
        const waveGeometry = new THREE.CircleGeometry(radius, 64);
        
        // 创建波动材质
        const waveMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(i % 2 === 0 ? 0x0088ff : 0x00aadd) }
            },
            vertexShader: `
                varying vec2 vUv;
                
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec2 vUv;
                
                void main() {
                    vec2 center = vec2(0.5, 0.5);
                    float dist = length(vUv - center) * 2.0;
                    
                    // 波纹效果
                    float wave = 0.5 + 0.5 * sin(dist * 20.0 - time * 0.5);
                    
                    // 透明度
                    float alpha = (1.0 - dist) * wave * 0.1;
                    alpha = smoothstep(0.0, 0.1, alpha);
                    
                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
            depthWrite: false
        });
        
        // 创建波动面
        const wave = new THREE.Mesh(waveGeometry, waveMaterial);
        wave.position.copy(centerPosition);
        
        // 随机旋转
        wave.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.4;
        wave.rotation.y = (Math.random() - 0.5) * 0.4;
        wave.rotation.z = (Math.random() - 0.5) * 0.4;
        
        // 添加到场景
        window.scene.add(wave);
        
        // 存储到状态中
        cosmicMiracleState.quantumFluctuations.push({
            wave: wave,
            initialPosition: centerPosition.clone(),
            radius: radius,
            index: i
        });
        
        cosmicMiracleState.effectElements.push(wave);
    }
}

/**
 * 更新粒子系统
 * @param {number} normalizedTime - 归一化时间（0-1）
 * @param {number} elapsedTime - 已过去的毫秒数
 * @param {number} timeSeconds - 已过去的秒数
 */
function updateParticleSystems(normalizedTime, elapsedTime, timeSeconds) {
    // 遍历所有粒子系统
    cosmicMiracleState.particleSystems.forEach(particleSystem => {
        if (!particleSystem.system || !particleSystem.system.geometry) return;
        
        const geometry = particleSystem.system.geometry;
        const positions = geometry.attributes.position.array;
        
        // 根据粒子系统类型应用不同的更新逻辑
        switch (particleSystem.type) {
            case 'coreGlow':
                updateCoreGlowParticles(particleSystem, positions, normalizedTime, timeSeconds);
                break;
            case 'energyStream':
                updateEnergyStreamParticles(particleSystem, positions, normalizedTime, timeSeconds);
                break;
            case 'vortexParticles':
                updateVortexParticles(particleSystem, positions, normalizedTime, timeSeconds);
                break;
            case 'starGateStream':
                updateStarGateStreamParticles(particleSystem, positions, normalizedTime, timeSeconds);
                break;
            case 'nebulaBurst':
                updateNebulaBurstParticles(particleSystem, positions, normalizedTime, timeSeconds);
                break;
            case 'riftParticles':
            case 'smallRiftParticles':
                updateRiftParticles(particleSystem, positions, normalizedTime, timeSeconds);
                break;
            case 'quantumFluctuation':
                updateQuantumParticles(particleSystem, positions, normalizedTime, timeSeconds);
                break;
        }
        
        // 更新位置缓冲区
        geometry.attributes.position.needsUpdate = true;
        
        // 更新不透明度 - 根据阶段变化
        if (particleSystem.system.material) {
            // 在初始化和结束阶段应用淡入淡出效果
            if (normalizedTime < 0.1) {
                // 淡入效果
                particleSystem.system.material.opacity = normalizedTime * 10 * 0.7;
            } else if (normalizedTime > 0.9) {
                // 淡出效果
                particleSystem.system.material.opacity = (1 - (normalizedTime - 0.9) * 10) * 0.7;
            } else {
                // 正常显示
                particleSystem.system.material.opacity = 0.7;
            }
            
            // 如果材质有自定义着色器，更新时间uniform
            if (particleSystem.system.material.uniforms && particleSystem.system.material.uniforms.time) {
                particleSystem.system.material.uniforms.time.value = timeSeconds;
            }
        }
    });
}

/**
 * 更新核心光辉粒子
 * @param {Object} particleSystem - 粒子系统对象
 * @param {Float32Array} positions - 位置数组
 * @param {number} normalizedTime - 归一化时间（0-1）
 * @param {number} timeSeconds - 已过去的秒数
 */
function updateCoreGlowParticles(particleSystem, positions, normalizedTime, timeSeconds) {
    const initialPositions = particleSystem.initialPositions;
    
    // 计算当前阶段的动画程度
    let animationFactor;
    if (normalizedTime < 0.3) {
        // 扩展阶段 - 粒子从初始位置向外膨胀
        animationFactor = normalizedTime / 0.3;
    } else if (normalizedTime > 0.7) {
        // 收缩阶段 - 粒子回到初始位置
        animationFactor = 1 - (normalizedTime - 0.7) / 0.3;
        if (animationFactor < 0) animationFactor = 0;
    } else {
        // 巅峰阶段 - 完全膨胀
        animationFactor = 1;
    }
    
    // 更新每个粒子位置
    for (let i = 0; i < positions.length; i += 3) {
        // 获取初始位置
        const initialX = initialPositions[i];
        const initialY = initialPositions[i + 1];
        const initialZ = initialPositions[i + 2];
        
        // 计算到中心的向量
        const dx = initialX - particleSystem.centerPosition?.x || 0;
        const dy = initialY - particleSystem.centerPosition?.y || 0;
        const dz = initialZ - particleSystem.centerPosition?.z || 0;
        
        // 计算距离
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        // 添加基于时间的脉动
        const pulsePhase = (i / 3) % 10 / 10;
        const pulse = Math.sin(timeSeconds * 2 + pulsePhase * Math.PI * 2);
        const pulseFactor = 1 + pulse * 0.2;
        
        // 设置新位置：原始位置 + 膨胀方向 * 膨胀系数 * 脉动因子
        positions[i] = initialX + dx * 0.5 * animationFactor * pulseFactor;
        positions[i + 1] = initialY + dy * 0.5 * animationFactor * pulseFactor;
        positions[i + 2] = initialZ + dz * 0.5 * animationFactor * pulseFactor;
        
        // 添加旋转效果
        const rotationSpeed = 0.1;
        const angle = timeSeconds * rotationSpeed;
        const cosAngle = Math.cos(angle);
        const sinAngle = Math.sin(angle);
        
        // 应用旋转（绕Y轴）
        const xRot = positions[i] * cosAngle - positions[i + 2] * sinAngle;
        const zRot = positions[i] * sinAngle + positions[i + 2] * cosAngle;
        positions[i] = xRot;
        positions[i + 2] = zRot;
    }
}

/**
 * 更新能量流粒子
 * @param {Object} particleSystem - 粒子系统对象
 * @param {Float32Array} positions - 位置数组
 * @param {number} normalizedTime - 归一化时间（0-1）
 * @param {number} timeSeconds - 已过去的秒数
 */
function updateEnergyStreamParticles(particleSystem, positions, normalizedTime, timeSeconds) {
    const initialPositions = particleSystem.initialPositions;
    const streamData = particleSystem.geometry.attributes.streamData;
    
    // 计算当前阶段的动画程度
    let animationFactor;
    if (normalizedTime < 0.3) {
        // 扩展阶段
        animationFactor = normalizedTime / 0.3;
    } else if (normalizedTime > 0.7) {
        // 收缩阶段
        animationFactor = 1 - (normalizedTime - 0.7) / 0.3;
        if (animationFactor < 0) animationFactor = 0;
    } else {
        // 巅峰阶段
        animationFactor = 1;
    }
    
    // 更新每个粒子位置
    for (let i = 0; i < positions.length; i += 3) {
        // 获取流数据
        const streamIndex = streamData.array[i / 3 * 3]; // 流索引
        const streamT = streamData.array[i / 3 * 3 + 1]; // 流位置比例
        const randomValue = streamData.array[i / 3 * 3 + 2]; // 随机值
        
        // 获取初始位置
        const initialX = initialPositions[i];
        const initialY = initialPositions[i + 1];
        const initialZ = initialPositions[i + 2];
        
        // 添加基于时间和流索引的脉动
        const pulseFrequency = 1 + streamIndex * 0.2;
        const pulsePhase = streamT * Math.PI * 2;
        const pulse = Math.sin(timeSeconds * pulseFrequency + pulsePhase) * 0.3 + 0.7;
        
        // 添加流动效果 - 沿流方向移动
        const flowSpeed = 300; // 流动速度
        const flowOffset = (timeSeconds * flowSpeed) % 1000; // 位移长度
        const flowDirection = -1; // 向内流动
        
        // 计算到中心的方向向量
        const centerX = particleSystem.centerPosition?.x || 0;
        const centerY = particleSystem.centerPosition?.y || 0;
        const centerZ = particleSystem.centerPosition?.z || 0;
        
        const dx = initialX - centerX;
        const dy = initialY - centerY;
        const dz = initialZ - centerZ;
        
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        // 如果距离为0，避免除以0
        if (distance === 0) continue;
        
        // 归一化方向向量
        const dirX = dx / distance;
        const dirY = dy / distance;
        const dirZ = dz / distance;
        
        // 计算流动位移
        const displacement = flowDirection * flowOffset * streamT;
        
        // 设置新位置：原始位置 + 流动偏移 + 膨胀效果
        positions[i] = initialX + dirX * displacement * animationFactor * pulse;
        positions[i + 1] = initialY + dirY * displacement * animationFactor * pulse;
        positions[i + 2] = initialZ + dirZ * displacement * animationFactor * pulse;
        
        // 添加横向波动
        const waveAmplitude = 20 * streamT;
        const waveFrequency = 0.005;
        const wavePhase = randomValue * Math.PI * 2;
        
        // 创建横向方向向量（垂直于流动方向）
        let crossX, crossY, crossZ;
        if (Math.abs(dirY) < 0.9) {
            // 如果y方向分量不是主要分量，使用y轴作为叉积的一个方向
            crossX = dirY;
            crossY = -dirX;
            crossZ = 0;
        } else {
            // 如果y是主要分量，使用z轴
            crossX = 0;
            crossY = dirZ;
            crossZ = -dirY;
        }
        
        // 归一化横向向量
        const crossLength = Math.sqrt(crossX * crossX + crossY * crossY + crossZ * crossZ);
        crossX /= crossLength;
        crossY /= crossLength;
        crossZ /= crossLength;
        
        // 应用横向波动
        const waveValue = Math.sin(timeSeconds * 2 + wavePhase) * waveAmplitude;
        positions[i] += crossX * waveValue;
        positions[i + 1] += crossY * waveValue;
        positions[i + 2] += crossZ * waveValue;
    }
}

/**
 * 更新漩涡粒子
 * @param {Object} particleSystem - 粒子系统对象
 * @param {Float32Array} positions - 位置数组
 * @param {number} normalizedTime - 归一化时间（0-1）
 * @param {number} timeSeconds - 已过去的秒数
 */
function updateVortexParticles(particleSystem, positions, normalizedTime, timeSeconds) {
    const initialPositions = particleSystem.initialPositions;
    const particleData = particleSystem.geometry.attributes.particleData;
    
    // 计算当前阶段的动画程度
    let animationFactor;
    if (normalizedTime < 0.3) {
        // 扩展阶段
        animationFactor = normalizedTime / 0.3;
    } else if (normalizedTime > 0.7) {
        // 收缩阶段
        animationFactor = 1 - (normalizedTime - 0.7) / 0.3;
        if (animationFactor < 0) animationFactor = 0;
    } else {
        // 巅峰阶段
        animationFactor = 1;
    }
    
    // 更新每个粒子位置
    for (let i = 0; i < positions.length; i += 3) {
        // 获取粒子数据
        const angle = particleData.array[i / 3 * 3]; // 螺旋角度
        const t = particleData.array[i / 3 * 3 + 1]; // 半径比例
        const randomValue = particleData.array[i / 3 * 3 + 2]; // 随机值
        
        // 获取初始位置
        const initialX = initialPositions[i];
        const initialY = initialPositions[i + 1];
        const initialZ = initialPositions[i + 2];
        
        // 计算到中心的向量
        const centerX = particleSystem.centerPosition?.x || 0;
        const centerY = particleSystem.centerPosition?.y || 0;
        const centerZ = particleSystem.centerPosition?.z || 0;
        
        const dx = initialX - centerX;
        const dy = initialY - centerY;
        const dz = initialZ - centerZ;
        
        // 计算在XZ平面上的角度
        const initialAngle = Math.atan2(dz, dx);
        
        // 应用旋转效果 - 旋转速度与半径成反比（内圈转得快）
        const rotationSpeed = 0.2 * (1 - 0.7 * t);
        const rotationAngle = initialAngle + timeSeconds * rotationSpeed * animationFactor;
        
        // 计算旋转后的XZ坐标
        const radius = Math.sqrt(dx * dx + dz * dz);
        const newX = centerX + radius * Math.cos(rotationAngle);
        const newZ = centerZ + radius * Math.sin(rotationAngle);
        
        // 应用脉动效果
        const pulseFrequency = 1 + t * 2;
        const pulsePhase = randomValue * Math.PI * 2;
        const pulseAmplitude = 100 * (1 - t * 0.7); // 中心脉动更强
        const pulse = Math.sin(timeSeconds * pulseFrequency + pulsePhase) * pulseAmplitude;
        
        // 设置新位置：旋转 + 脉动 + 缩放
        positions[i] = newX + (newX - centerX) * 0.3 * animationFactor;
        positions[i + 1] = initialY + pulse * animationFactor;
        positions[i + 2] = newZ + (newZ - centerZ) * 0.3 * animationFactor;
    }
}

/**
 * 创建暗物质网络
 * 在银河系周围创建暗物质网络结构
 */
function createDarkMatterWeb() {
    console.log('创建暗物质网络');
    
    // 获取银河系中心位置
    const corePosition = getGalaxyCorePosition();
    
    // 创建暗物质节点和连接
    createDarkMatterNodes(corePosition);
    
    console.log('暗物质网络创建完成');
}

/**
 * 创建暗物质节点
 * @param {THREE.Vector3} centerPosition - 中心参考位置
 */
function createDarkMatterNodes(centerPosition) {
    // 创建暗物质节点
    const nodeCount = 150;
    const nodes = [];
    
    // 节点位置
    for (let i = 0; i < nodeCount; i++) {
        // 随机球体分布，稍微压扁
        const radius = 10000 + Math.random() * 10000;
        const theta = Math.random() * Math.PI * 2;
        const phi = (Math.random() * 0.8 + 0.1) * Math.PI; // 限制在赤道区域附近
        
        const position = new THREE.Vector3(
            centerPosition.x + radius * Math.sin(phi) * Math.cos(theta),
            centerPosition.y + radius * Math.sin(phi) * Math.sin(theta) * 0.4, // 压扁
            centerPosition.z + radius * Math.cos(phi)
        );
        
        // 创建节点几何体
        const nodeGeometry = new THREE.SphereGeometry(30 + Math.random() * 70, 16, 16);
        
        // 创建节点材质
        const nodeMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0x1a3366) } // 深蓝色，暗物质
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;
                
                void main() {
                    vUv = uv;
                    vPosition = position;
                    vNormal = normal;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;
                
                void main() {
                    // 边缘发光效果
                    vec3 viewDir = normalize(vPosition);
                    float rim = 1.0 - max(dot(normalize(vNormal), viewDir), 0.0);
                    rim = pow(rim, 2.0);
                    
                    // 脉冲效果
                    float pulse = 0.8 + 0.2 * sin(time * 1.5);
                    
                    vec3 finalColor = color + vec3(0.1, 0.2, 0.4) * rim * pulse;
                    float alpha = 0.6 * rim + 0.2;
                    
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.FrontSide,
            depthWrite: false
        });
        
        // 创建节点
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.copy(position);
        
        // 添加到场景
        window.scene.add(node);
        
        // 存储节点信息
        const nodeData = {
            mesh: node,
            position: position.clone(),
            connections: []
        };
        
        nodes.push(nodeData);
        cosmicMiracleState.darkMatterWebs.push({
            node: node,
            position: position.clone(),
            type: 'node'
        });
        
        cosmicMiracleState.effectElements.push(node);
    }
    
    // 创建节点间的连接
    for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        
        // 为每个节点创建到最近几个节点的连接
        const nearestNodes = findNearestNodes(nodeA, nodes, 3);
        
        for (const nodeB of nearestNodes) {
            // 检查连接是否已存在
            if (connectionExists(nodeA, nodeB)) continue;
            
            // 创建连接
            createDarkMatterConnection(nodeA, nodeB);
        }
    }
}

/**
 * 查找最近的节点
 * @param {Object} sourceNode - 源节点
 * @param {Array} allNodes - 所有节点
 * @param {number} count - 要找的最近节点数量
 * @returns {Array} 最近的节点数组
 */
function findNearestNodes(sourceNode, allNodes, count) {
    // 计算到其他所有节点的距离
    const distances = [];
    
    for (let i = 0; i < allNodes.length; i++) {
        const targetNode = allNodes[i];
        
        // 跳过自身
        if (targetNode === sourceNode) continue;
        
        // 计算距离
        const distance = sourceNode.position.distanceTo(targetNode.position);
        
        distances.push({
            node: targetNode,
            distance: distance
        });
    }
    
    // 按距离排序
    distances.sort((a, b) => a.distance - b.distance);
    
    // 返回最近的几个
    return distances.slice(0, count).map(entry => entry.node);
}

/**
 * 检查两个节点间是否已经存在连接
 * @param {Object} nodeA - 节点A
 * @param {Object} nodeB - 节点B
 * @returns {boolean} 是否存在连接
 */
function connectionExists(nodeA, nodeB) {
    // 检查nodeA的连接中是否有nodeB
    for (const connection of nodeA.connections) {
        if (connection === nodeB) return true;
    }
    
    // 检查nodeB的连接中是否有nodeA
    for (const connection of nodeB.connections) {
        if (connection === nodeA) return true;
    }
    
    return false;
}

/**
 * 创建暗物质连接
 * @param {Object} nodeA - 节点A
 * @param {Object} nodeB - 节点B
 */
function createDarkMatterConnection(nodeA, nodeB) {
    // 创建连接的几何体
    const curve = new THREE.LineCurve3(nodeA.position, nodeB.position);
    const geometry = new THREE.TubeGeometry(curve, 20, 10, 8, false);
    
    // 创建连接的材质
    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color: { value: new THREE.Color(0x112244) } // 深蓝色，暗物质
        },
        vertexShader: `
            varying vec2 vUv;
            
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 color;
            varying vec2 vUv;
            
            void main() {
                // 流动效果
                float flow = fract(vUv.x - time * 0.2);
                
                // 淡入淡出
                float alpha = flow * (1.0 - flow) * 4.0; // 0->1->0
                alpha = smoothstep(0.0, 1.0, alpha) * 0.3;
                
                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    
    // 创建连接
    const connection = new THREE.Mesh(geometry, material);
    
    // 添加到场景
    window.scene.add(connection);
    
    // 记录连接关系
    nodeA.connections.push(nodeB);
    nodeB.connections.push(nodeA);
    
    // 存储连接信息
    cosmicMiracleState.darkMatterWebs.push({
        connection: connection,
        nodeA: nodeA,
        nodeB: nodeB,
        type: 'connection'
    });
    
    cosmicMiracleState.effectElements.push(connection);
}

// 确保在DOM加载完成后初始化模块
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCosmicMiracleModule);
} else {
    // DOMContentLoaded 已经触发
    initCosmicMiracleModule();
}

// 同时设置一个延迟初始化，以防万一
setTimeout(initCosmicMiracleModule, 500);

// 监听脚本加载完成事件
window.addEventListener('load', initCosmicMiracleModule);
