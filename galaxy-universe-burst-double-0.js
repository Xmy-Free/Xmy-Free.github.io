const canvasZero = document.getElementById('canvasZero');
const ctx = canvasZero.getContext('2d');
let isMouseDown = false;
let activeGlows = [];
let particles = [];
let effects = [];
let animationId;
// 性能优化：最大粒子和特效数量
const MAX_PARTICLES = 2000;
const MAX_EFFECTS = 600;

// 设置canvasZero尺寸
function resizeCanvasZero() {
    canvasZero.width = window.innerWidth;
    canvasZero.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvasZero);
resizeCanvasZero();

// 粒子类 - 优化后的粒子系统
class Particle {
    constructor(x, y, size, color, angle, distance, duration) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.angle = angle;
        this.distance = distance;
        this.duration = duration;
        this.startTime = Date.now();
        this.endTime = this.startTime + duration;
        this.opacity = 1;
        this.velocity = Math.random() * 0.5 + 0.5; // 随机速度
        this.flicker = Math.random() * 0.3 + 0.7; // 闪烁效果
        this.flickerSpeed = Math.random() * 0.05 + 0.01; // 闪烁速度
        this.currentX = x;
        this.currentY = y;
    }
    
    update() {
        const now = Date.now();
        const progress = Math.min(1, (now - this.startTime) / this.duration);
        const currentDistance = progress * this.distance * this.velocity;
        this.currentX = this.x + Math.cos(this.angle) * currentDistance;
        this.currentY = this.y + Math.sin(this.angle) * currentDistance;
        this.opacity = (1 - progress) * this.flicker;
        
        // 更新闪烁效果
        this.flicker = 0.7 + Math.sin(now * this.flickerSpeed) * 0.3;
        
        return now < this.endTime;
    }
    
    draw() {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.currentX, this.currentY, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// 光晕类 - 全面优化光晕效果
class Glow {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.startTime = Date.now();
        this.duration = 3000;
        this.endTime = this.startTime + this.duration;
        this.opacity = 0.8;
        this.currentSize = size;
        this.dissolved = false;
        this.pulseSpeed = Math.random() * 0.002 + 0.001;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.hue = 200 + Math.random() * 40; // 蓝色调为主
        this.saturation = 80 + Math.random() * 20;
        this.lightness = 50 + Math.random() * 20;
        this.dissolveEffectsCreated = false;
        // 新增：消散阶段动画参数
        this.collapseStart = null;
        this.collapseDuration = 1800;
        this.collapseProgress = 0;
        this.collapseParticles = [];
        this.ultimateCollapseStartTime = null;
        this.finalUltimateCollapseStartTime = null;
        this.superCollapseStartTime = null;
        this.finalSuperCollapseStartTime = null;
        this.superCollapseTriggered = false;
        this.finalSuperCollapseUniverseTriggered = false;
    }
    
    update() {
        const now = Date.now();
        if (this.dissolved) {
            // 塌缩动画进行中
            if (this.collapseStart && now - this.collapseStart < this.collapseDuration) {
                this.collapseProgress = (now - this.collapseStart) / this.collapseDuration;
                // 更新塌缩粒子
                this.collapseParticles.forEach(p => p.updateCollapse(this.x, this.y, this.collapseProgress));
                return true;
            }
            return false;
        }
        if (now > this.endTime) {
            this.dissolved = true;
            if (!this.dissolveEffectsCreated) {
                this.createDissolveEffects();
                this.dissolveEffectsCreated = true;
                // 启动塌缩动画
                this.collapseStart = Date.now();
                this.collapseProgress = 0;
                // 生成塌缩粒子
                for (let i = 0; i < 120; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const distance = Math.random() * this.size * 2.5 + 30;
                    const size = Math.random() * 1.5 + 0.5;
                    const color = `hsla(${this.hue + 180 + Math.random()*60}, 80%, 60%, 0.7)`;
                    this.collapseParticles.push(new CollapseParticle(
                        this.x + Math.cos(angle) * distance,
                        this.y + Math.sin(angle) * distance,
                        size, color, angle, distance, this.collapseDuration
                    ));
                }
            }
            return true;
        }
        // 脉冲、色彩变化
        const pulseProgress = (now - this.startTime) * this.pulseSpeed + this.pulsePhase;
        this.currentSize = this.size * (1 + Math.sin(pulseProgress) * 0.1);
        const fadeProgress = (now - this.startTime) / this.duration;
        this.opacity = 0.8 * Math.pow(1 - fadeProgress, 0.7);
        this.hue = 200 + Math.sin(now * 0.0005) * 20;
        return true;
    }
    
    draw() {
        if (this.dissolved) {
            // 塌缩动画
            if (this.collapseStart && this.collapseProgress < 1) {
                drawCollapseCosmos(this.x, this.y, this.size, this.collapseProgress, this.collapseParticles);
            } else if (this.collapseStart && this.collapseProgress >= 1) {
                // 终极宇宙坍缩消散动画
                if (!this.ultimateCollapseStartTime) this.ultimateCollapseStartTime = Date.now();
                drawUltimateCollapse(this.x, this.y, this.size, this.ultimateCollapseStartTime);
                // 新增：终极终极宇宙消散动画
                if (!this.finalUltimateCollapseStartTime) this.finalUltimateCollapseStartTime = Date.now();
                drawFinalUltimateCollapse(this.x, this.y, this.size*1.2, this.finalUltimateCollapseStartTime);
                // 新增：超级无敌宇宙坍缩动画（只触发一次）
                if (!this.superCollapseTriggered) {
                    this.superCollapseTriggered = true;
                    setTimeout(()=>{
                        if (!this.superCollapseStartTime) this.superCollapseStartTime = Date.now();
                        drawSuperCollapseUniverse(this.x, this.y, this.size*2.2, this.superCollapseStartTime, this);
                    }, 3500); // 等待终极终极动画结束后再触发
                }
            }
            return;
        }
        // 多层光晕效果 - 更丰富的层次
        for (let i = 0; i < 5; i++) {
            const ratio = 1 - i * 0.15;
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.currentSize * ratio
            );
            
            // 根据层次设置不同颜色
            const hueVariation = i * 5;
            const opacityMultiplier = 1 - i * 0.15;
            
            // 核心光晕 - 明亮区域
            if (i === 0) {
                gradient.addColorStop(0, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness + 20}%, ${this.opacity * 0.9 * opacityMultiplier})`);
                gradient.addColorStop(0.3, `hsla(${this.hue + 10}, ${this.saturation - 10}%, ${this.lightness}%, ${this.opacity * 0.6 * opacityMultiplier})`);
                gradient.addColorStop(0.6, `hsla(${this.hue + 20}, ${this.saturation - 20}%, ${this.lightness - 10}%, ${this.opacity * 0.3 * opacityMultiplier})`);
            } 
            // 次级光晕 - 过渡区域
            else if (i === 1) {
                gradient.addColorStop(0, `hsla(${this.hue + 5}, ${this.saturation - 5}%, ${this.lightness + 15}%, ${this.opacity * 0.7 * opacityMultiplier})`);
                gradient.addColorStop(0.4, `hsla(${this.hue + 15}, ${this.saturation - 15}%, ${this.lightness - 5}%, ${this.opacity * 0.4 * opacityMultiplier})`);
            }
            // 外层光晕 - 扩散区域
            else {
                gradient.addColorStop(0, `hsla(${this.hue + i * 3}, ${this.saturation - i * 5}%, ${this.lightness - i * 5}%, ${this.opacity * 0.5 * opacityMultiplier})`);
                gradient.addColorStop(0.2, `hsla(${this.hue + 25}, ${this.saturation - 25}%, ${this.lightness - 15}%, ${this.opacity * 0.2 * opacityMultiplier})`);
            }
            
            gradient.addColorStop(1, 'transparent');
            
            ctx.globalAlpha = this.opacity * (1 - i * 0.1);
            ctx.fillStyle = gradient;
            ctx.beginPath();
            
            // 添加微妙的变形效果，使光晕更有机
            if (i > 1) {
                ctx.beginPath();
                for (let a = 0; a <= Math.PI * 2; a += Math.PI / 20) {
                    const r = this.currentSize * ratio * (1 + Math.sin(a * 5 + Date.now() * 0.001) * 0.05);
                    const x = this.x + Math.cos(a) * r;
                    const y = this.y + Math.sin(a) * r;
                    
                    if (a === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.closePath();
            } else {
                ctx.arc(this.x, this.y, this.currentSize * ratio, 0, Math.PI * 2);
            }
            
            ctx.fill();
        }
        
        // 添加核心亮点
        ctx.globalAlpha = this.opacity * 0.9;
        const coreGradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.currentSize * 0.2
        );
        coreGradient.addColorStop(0, `hsla(${this.hue}, ${this.saturation}%, 95%, 0.9)`);
        coreGradient.addColorStop(1, `hsla(${this.hue + 10}, ${this.saturation - 10}%, 80%, 0)`);
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentSize * 0.2, 0, Math.PI * 2);
        ctx.fill();
        
        // 添加能量波纹
        if (Math.random() < 0.1) {
            ctx.globalAlpha = this.opacity * 0.3;
            ctx.strokeStyle = `hsla(${this.hue + 20}, ${this.saturation}%, 70%, 0.5)`;
            ctx.lineWidth = 1 + Math.random() * 2;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.currentSize * (0.7 + Math.random() * 0.2), 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // 添加随机光点
        if (Math.random() < 0.2) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * this.currentSize * 0.8;
            const size = 1 + Math.random() * 3;
            
            ctx.globalAlpha = this.opacity * (0.5 + Math.random() * 0.3);
            ctx.fillStyle = `hsla(${this.hue + Math.random() * 20}, ${this.saturation}%, 90%, 0.8)`;
            ctx.beginPath();
            ctx.arc(
                this.x + Math.cos(angle) * dist,
                this.y + Math.sin(angle) * dist,
                size, 0, Math.PI * 2
            );
            ctx.fill();
        }
        
        ctx.globalAlpha = 1;
    }
    
    createDissolveEffects() {
        // 量子泡沫效果 - 优化
        effects.push({
            type: 'quantumFoam',
            x: this.x,
            y: this.y,
            size: this.size * 2.5,
            startTime: Date.now(),
            duration: 2500,
            opacity: 0,
            detail: 30 + Math.floor(this.size / 10)
        });
        
        // 能量漩涡效果 - 优化
        for (let i = 0; i < 5; i++) {
            effects.push({
                type: 'energyVortex',
                x: this.x,
                y: this.y,
                size: this.size * (0.4 + i * 0.15),
                startTime: Date.now(),
                duration: 2000 + i * 600,
                rotation: 0,
                speed: 0.5 + i * 0.2
            });
        }
        
        // 暗物质波纹 - 优化
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                effects.push({
                    type: 'darkMatterWave',
                    x: this.x,
                    y: this.y,
                    size: this.size * (0.8 + i * 0.1),
                    startTime: Date.now(),
                    duration: 1800 + i * 400,
                    borderWidth: 1 + i * 0.3,
                    color: `hsla(${200 + i * 10}, ${80 - i * 5}%, 70%, 0.5)`
                });
            }, i * 150);
        }
        
        // 量子弦效果 - 优化
        for (let i = 0; i < 30; i++) {
            effects.push({
                type: 'quantumString',
                x: this.x,
                y: this.y,
                length: Math.random() * 250 + 150,
                angle: Math.random() * Math.PI * 2,
                startTime: Date.now(),
                duration: Math.random() * 1200 + 800,
                thickness: Math.random() * 0.5 + 0.5,
                wave: Math.random() * 20 + 10
            });
        }
        
        // 时空裂缝效果 - 优化
        effects.push({
            type: 'spaceFracture',
            x: this.x,
            y: this.y,
            size: this.size * 2.5,
            startTime: Date.now(),
            duration: 2500,
            gridSize: 15 + Math.floor(this.size / 20)
        });
        
        // 引力透镜效果 - 优化
        effects.push({
            type: 'gravitationalLens',
            x: this.x,
            y: this.y,
            size: this.size * 1.2,
            startTime: Date.now(),
            duration: 2500,
            layers: 5
        });
        
        // 超新星爆发效果 - 优化
        effects.push({
            type: 'supernova',
            x: this.x,
            y: this.y,
            size: this.size * 1.5,
            startTime: Date.now(),
            duration: 1800,
            intensity: 1.2
        });
        
        // 黑洞效果 - 优化
        effects.push({
            type: 'blackHole',
            x: this.x,
            y: this.y,
            size: this.size * 0.8,
            startTime: Date.now(),
            duration: 2500,
            gravity: 1.5
        });
        
        // 等离子体云 - 优化
        effects.push({
            type: 'plasmaCloud',
            x: this.x,
            y: this.y,
            size: this.size * 1.3,
            startTime: Date.now(),
            duration: 2200,
            turbulence: 0.7
        });
        
        // 宇宙弦振动效果 - 优化
        for (let i = 0; i < 12; i++) {
            effects.push({
                type: 'cosmicString',
                x: this.x,
                y: this.y,
                length: Math.random() * 350 + 250,
                angle: Math.random() * Math.PI * 2,
                startTime: Date.now(),
                duration: Math.random() * 1800 + 1200,
                vibration: Math.random() * 15 + 10
            });
        }
        
        // 星云扩散效果 - 优化
        effects.push({
            type: 'nebula',
            x: this.x,
            y: this.y,
            size: this.size * 1.8,
            startTime: Date.now(),
            duration: 3000,
            layers: 4
        });
        
        // 极光效果 - 优化
        effects.push({
            type: 'aurora',
            x: this.x,
            y: this.y,
            size: this.size * 3,
            startTime: Date.now(),
            duration: 3500,
            bands: 5,
            hue: this.hue
        });
        
        // 新增：星际尘埃效果
        for (let i = 0; i < 100; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * this.size * 3;
            const duration = Math.random() * 3000 + 2000;
            const size = Math.random() * 0.5 + 0.1;
            
            particles.push(new Particle(
                this.x, this.y,
                size,
                `hsla(${this.hue + Math.random() * 20}, ${30 + Math.random() * 30}%, 70%, ${Math.random() * 0.2 + 0.1})`,
                angle, distance, duration
            ));
        }
        
        // 新增：微光粒子
        for (let i = 0; i < 50; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * this.size * 2;
            const duration = Math.random() * 2500 + 1500;
            const size = Math.random() * 1 + 0.5;
            
            particles.push(new Particle(
                this.x, this.y,
                size,
                `hsla(${this.hue + Math.random() * 20}, ${70 + Math.random() * 20}%, 80%, 0.8)`,
                angle, distance, duration
            ));
        }
        
        // 新增：多层冲击波
        for (let i = 0; i < 6; i++) {
            effects.push({
                type: 'ripple',
                x: this.x,
                y: this.y,
                size: this.size * (1.5 + i * 0.5),
                startTime: Date.now(),
                duration: 1200 + i * 400,
                borderWidth: 2 + i,
                color: `hsla(${30 + i * 40},100%,70%,0.7)`
            });
        }
        
        // 新增：中心爆发
        effects.push({
            type: 'supernova',
            x: this.x,
            y: this.y,
            size: this.size * 2.5,
            startTime: Date.now(),
            duration: 1200,
            intensity: 2.5
        });
        
        // 新增：多色星云
        for (let i = 0; i < 3; i++) {
            effects.push({
                type: 'nebula',
                x: this.x,
                y: this.y,
                size: this.size * (2 + i),
                startTime: Date.now(),
                duration: 2000 + i * 800,
                layers: 5,
                hue: 200 + i * 60
            });
        }
        
        // 新增：高能粒子爆发
        for (let i = 0; i < 200; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * this.size * 3;
            const duration = Math.random() * 2000 + 1000;
            const size = Math.random() * 2 + 0.5;
            particles.push(new Particle(
                this.x, this.y,
                size,
                `hsla(${Math.random() * 360},100%,80%,0.9)`,
                angle, distance, duration
            ));
        }
        
        // 新增：宇宙塌缩特效
        effects.push({
            type: 'collapse',
            x: this.x,
            y: this.y,
            size: this.size * 3,
            startTime: Date.now(),
            duration: 2200,
            color: `hsla(${this.hue}, 100%, 90%, 1)`
        });
        // 新增：吸积盘粒子
        for (let i = 0; i < 120; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * this.size * 2 + 30;
            const duration = Math.random() * 1800 + 1200;
            const size = Math.random() * 1.5 + 0.5;
            particles.push(new Particle(
                this.x + Math.cos(angle) * distance,
                this.y + Math.sin(angle) * distance,
                size,
                `hsla(${this.hue + 180}, 80%, 60%, 0.7)`,
                Math.atan2(this.y - (this.y + Math.sin(angle) * distance), this.x - (this.x + Math.cos(angle) * distance)),
                distance,
                duration
            ));
        }
    }
}

// 绘制量子泡沫效果 - 优化
function drawQuantumFoam(effect) {
    const progress = (Date.now() - effect.startTime) / effect.duration;
    if (progress > 1) return false;
    
    effect.opacity = 0.4 * (1 - progress);
    
    ctx.save();
    ctx.globalAlpha = effect.opacity;
    
    // 绘制径向渐变背景
    const gradient = ctx.createRadialGradient(
        effect.x, effect.y, 0,
        effect.x, effect.y, effect.size
    );
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(0.7, 'hsla(200, 80%, 70%, 0.02)');
    gradient.addColorStop(1, 'hsla(200, 80%, 70%, 0.05)');
    ctx.fillStyle = gradient;
    ctx.fillRect(effect.x - effect.size, effect.y - effect.size, effect.size * 2, effect.size * 2);
    
    // 添加随机点阵
    for (let i = 0; i < effect.detail * 10; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * effect.size;
        const px = effect.x + Math.cos(angle) * dist;
        const py = effect.y + Math.sin(angle) * dist;
        const size = Math.random() * 0.5;
        
        ctx.fillStyle = `hsla(200, 80%, 80%, ${Math.random() * 0.1})`;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.restore();
    return true;
}

// 绘制能量漩涡效果 - 优化
function drawEnergyVortex(effect) {
    const progress = (Date.now() - effect.startTime) / effect.duration;
    if (progress > 1) return false;
    
    effect.rotation = progress * 360 * (effect.speed || 1);
    const currentSize = effect.size * (1 + progress * 0.7);
    const opacity = 0.8 * (1 - progress);
    
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(effect.x, effect.y);
    ctx.rotate(effect.rotation * Math.PI / 180);
    
    // 多层漩涡效果
    for (let i = 0; i < 3; i++) {
        const ratio = 1 - i * 0.2;
        const gradient = ctx.createConicGradient(
            effect.rotation, effect.x, effect.y
        );
        
        if (i === 0) {
            gradient.addColorStop(0, 'hsla(200, 80%, 70%, 0.8)');
            gradient.addColorStop(0.3, 'hsla(210, 70%, 65%, 0.6)');
        } else if (i === 1) {
            gradient.addColorStop(0, 'hsla(210, 85%, 75%, 0.7)');
            gradient.addColorStop(0.4, 'hsla(220, 75%, 70%, 0.5)');
        } else {
            gradient.addColorStop(0, 'hsla(220, 90%, 80%, 0.6)');
            gradient.addColorStop(0.5, 'hsla(230, 80%, 75%, 0.4)');
        }
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, currentSize * ratio, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.restore();
    return true;
}

// 绘制暗物质波纹 - 优化
function drawDarkMatterWave(effect) {
    const progress = (Date.now() - effect.startTime) / effect.duration;
    if (progress > 1) return false;
    
    const currentSize = effect.size * 0.5 * (1 + progress * 6);
    const opacity = 0.8 * (1 - progress);
    const borderWidth = effect.borderWidth * (1 - progress * 0.5);
    
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.strokeStyle = effect.color || `hsla(200, 80%, 70%, ${0.3 * (1 - progress)})`;
    ctx.lineWidth = borderWidth;
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, currentSize, 0, Math.PI * 2);
    ctx.stroke();
    
    // 添加发光效果
    ctx.shadowColor = effect.color || 'hsla(200, 80%, 70%, 0.2)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, currentSize, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowColor = 'transparent';
    
    // 添加内部波纹
    if (progress < 0.5) {
        ctx.globalAlpha = opacity * 0.6;
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, currentSize * 0.7, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    ctx.restore();
    return true;
}

// 绘制量子弦效果 - 优化
function drawQuantumString(effect) {
    const progress = (Date.now() - effect.startTime) / effect.duration;
    if (progress > 1) return false;
    
    let opacity;
    if (progress < 0.1) {
        opacity = progress * 10 * 0.8;
    } else if (progress > 0.9) {
        opacity = (1 - progress) * 10 * 0.8;
    } else {
        opacity = 0.8;
    }
    
    // 波动效果
    const wave = effect.wave || 0;
    const waveOffset = wave ? Math.sin(Date.now() * 0.005) * wave : 0;
    
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(effect.x, effect.y);
    ctx.rotate(effect.angle);
    
    const gradient = ctx.createLinearGradient(0, 0, effect.length, 0);
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(0.2, 'hsla(200, 80%, 80%, 0.8)');
    gradient.addColorStop(0.5, 'hsla(210, 80%, 75%, 0.9)');
    gradient.addColorStop(0.8, 'hsla(200, 80%, 80%, 0.8)');
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    
    // 绘制波动弦
    if (wave) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        for (let x = 0; x <= effect.length; x += 5) {
            const y = Math.sin(x * 0.05 + Date.now() * 0.005) * waveOffset;
            ctx.lineTo(x, y);
        }
        ctx.lineTo(effect.length, 0);
        ctx.lineWidth = effect.thickness || 1;
        ctx.strokeStyle = gradient;
        ctx.stroke();
    } else {
        ctx.fillRect(0, -(effect.thickness || 0.5) / 2, effect.length, effect.thickness || 0.5);
    }
    
    ctx.restore();
    return true;
}

// 绘制时空裂缝效果 - 已去除网格线
function drawSpaceFracture(effect) {
    const progress = (Date.now() - effect.startTime) / effect.duration;
    if (progress > 1) return false;
    
    const opacity = 0.6 * (1 - progress);
    const scale = 1 + progress * 0.7;
    
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(effect.x, effect.y);
    ctx.scale(scale, scale);
    ctx.translate(-effect.x, -effect.y);
    
    // 添加随机断裂效果
    for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * effect.size * 0.8;
        const px = effect.x + Math.cos(angle) * dist;
        const py = effect.y + Math.sin(angle) * dist;
        const length = Math.random() * 30 + 10;
        const breakAngle = Math.random() * Math.PI;
        
        ctx.strokeStyle = 'hsla(200, 80%, 80%, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(
            px + Math.cos(breakAngle) * length,
            py + Math.sin(breakAngle) * length
        );
        ctx.stroke();
    }
    
    ctx.restore();
    return true;
}

// 绘制引力透镜效果 - 优化
function drawGravitationalLens(effect) {
    const progress = (Date.now() - effect.startTime) / effect.duration;
    if (progress > 1) return false;
    
    let currentSize;
    let opacity;
    
    if (progress < 0.5) {
        currentSize = effect.size * 0.5 * (1 + progress * 2);
        opacity = 0.4 * (progress * 2);
    } else {
        currentSize = effect.size * 0.5 * (1 + (1 - (progress - 0.5) * 2) * 2);
        opacity = 0.4 * (1 - (progress - 0.5) * 2);
    }
    
    ctx.save();
    
    // 多层透镜效果
    const layers = effect.layers || 3;
    for (let i = 0; i < layers; i++) {
        const ratio = 1 - i * 0.2;
        ctx.globalAlpha = opacity * (1 - i * 0.2);
        
        const gradient = ctx.createRadialGradient(
            effect.x, effect.y, 0,
            effect.x, effect.y, currentSize * ratio
        );
        
        if (i === 0) {
            gradient.addColorStop(0, 'hsla(200, 80%, 70%, 0.25)');
            gradient.addColorStop(0.5, 'hsla(210, 70%, 60%, 0.15)');
        } else if (i === 1) {
            gradient.addColorStop(0, 'hsla(210, 85%, 75%, 0.2)');
            gradient.addColorStop(0.6, 'hsla(220, 75%, 65%, 0.1)');
        } else {
            gradient.addColorStop(0, 'hsla(220, 90%, 80%, 0.15)');
            gradient.addColorStop(0.7, 'hsla(230, 80%, 70%, 0.05)');
        }
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, currentSize * ratio, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.restore();
    return true;
}

// 绘制超新星爆发效果 - 优化
function drawSupernova(effect) {
    const progress = (Date.now() - effect.startTime) / effect.duration;
    if (progress > 1) return false;
    
    let currentSize;
    let opacity;
    
    if (progress < 0.2) {
        currentSize = effect.size * 0.5 * (progress * 5);
        opacity = progress * 5;
    } else if (progress < 0.8) {
        currentSize = effect.size * 0.5 * (1 + (progress - 0.2) * 1.67 * (effect.intensity || 1));
        opacity = 1 - (progress - 0.2) * 0.33;
    } else {
        currentSize = effect.size * 0.5 * (2 + (progress - 0.8) * 5);
        opacity = 0.8 - (progress - 0.8) * 4;
    }
    
    ctx.save();
    ctx.globalAlpha = opacity;
    
    // 多层爆发效果
    for (let i = 0; i < 3; i++) {
        const ratio = 1 + i * 0.3;
        const gradient = ctx.createRadialGradient(
            effect.x, effect.y, 0,
            effect.x, effect.y, currentSize * ratio
        );
        
        if (i === 0) {
            gradient.addColorStop(0, 'hsla(40, 100%, 90%, 0.9)');
            gradient.addColorStop(0.2, 'hsla(30, 100%, 80%, 0.8)');
            gradient.addColorStop(0.4, 'hsla(20, 100%, 70%, 0.7)');
        } else if (i === 1) {
            gradient.addColorStop(0, 'hsla(45, 100%, 85%, 0.7)');
            gradient.addColorStop(0.3, 'hsla(35, 100%, 75%, 0.6)');
            gradient.addColorStop(0.6, 'hsla(25, 100%, 65%, 0.5)');
        } else {
            gradient.addColorStop(0, 'hsla(50, 100%, 80%, 0.5)');
            gradient.addColorStop(0.4, 'hsla(40, 100%, 70%, 0.4)');
            gradient.addColorStop(0.8, 'hsla(30, 100%, 60%, 0.3)');
        }
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, currentSize * ratio, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 发光效果
    ctx.shadowColor = 'hsla(40, 100%, 80%, 0.8)';
    ctx.shadowBlur = 80;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, currentSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    
    // 添加随机粒子
    if (progress < 0.7 && Math.random() < 0.3) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * currentSize * 0.8;
        const px = effect.x + Math.cos(angle) * dist;
        const py = effect.y + Math.sin(angle) * dist;
        
        ctx.fillStyle = `hsla(${30 + Math.random() * 30}, 100%, 70%, ${0.5 + Math.random() * 0.4})`;
        ctx.beginPath();
        ctx.arc(px, py, 1 + Math.random() * 3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.restore();
    return true;
}

// 绘制黑洞效果 - 优化
function drawBlackHole(effect) {
    const progress = (Date.now() - effect.startTime) / effect.duration;
    if (progress > 1) return false;
    
    let currentSize;
    let opacity;
    
    if (progress < 0.3) {
        currentSize = effect.size * 0.5 * (progress / 0.3);
        opacity = (progress / 0.3) * 0.9;
    } else if (progress < 0.7) {
        currentSize = effect.size * 0.5 * (1 + (progress - 0.3) * 0.5);
        opacity = 0.9 - (progress - 0.3) * 0.5;
    } else {
        currentSize = effect.size * 0.5 * (1.2 + (progress - 0.7) * 0.5);
        opacity = 0.7 - (progress - 0.7) * 2.33;
    }
    
    ctx.save();
    ctx.globalAlpha = opacity;
    
    // 多层黑洞效果
    for (let i = 0; i < 3; i++) {
        const ratio = 1 - i * 0.15;
        const gradient = ctx.createRadialGradient(
            effect.x, effect.y, 0,
            effect.x, effect.y, currentSize * ratio
        );
        
        if (i === 0) {
            gradient.addColorStop(0, 'hsla(240, 80%, 10%, 0.95)');
            gradient.addColorStop(0.3, 'hsla(230, 70%, 20%, 0.8)');
        } else if (i === 1) {
            gradient.addColorStop(0, 'hsla(235, 75%, 15%, 0.85)');
            gradient.addColorStop(0.4, 'hsla(225, 65%, 25%, 0.6)');
        } else {
            gradient.addColorStop(0, 'hsla(230, 70%, 20%, 0.7)');
            gradient.addColorStop(0.5, 'hsla(220, 60%, 30%, 0.4)');
        }
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, currentSize * ratio, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 发光效果
    ctx.shadowColor = 'hsla(210, 80%, 50%, 0.5)';
    ctx.shadowBlur = 50;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, currentSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    
    // 引力效果 - 扭曲周围空间
    if (effect.gravity && progress > 0.2 && progress < 0.8) {
        ctx.globalAlpha = opacity * 0.3;
        ctx.strokeStyle = 'hsla(210, 80%, 70%, 0.2)';
        ctx.lineWidth = 1;
        
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
            ctx.beginPath();
            ctx.moveTo(effect.x, effect.y);
            
            for (let r = currentSize; r < currentSize * 3; r += 10) {
                const distortion = Math.sin(r * 0.1 - Date.now() * 0.005) * 5 * effect.gravity;
                const x = effect.x + Math.cos(a) * r + distortion;
                const y = effect.y + Math.sin(a) * r + distortion;
                ctx.lineTo(x, y);
            }
            
            ctx.stroke();
        }
    }
    
    ctx.restore();
    return true;
}

// 绘制等离子体云 - 优化
function drawPlasmaCloud(effect) {
    const progress = (Date.now() - effect.startTime) / effect.duration;
    if (progress > 1) return false;
    
    let currentSize;
    let opacity;
    
    if (progress < 0.2) {
        currentSize = effect.size * 0.5 * (progress * 5);
        opacity = progress * 5 * 0.8;
    } else {
        currentSize = effect.size * 0.5 * (1 + (progress - 0.2) * 2.5);
        opacity = 0.8 * (1 - (progress - 0.2) * 1.25);
    }
    
    ctx.save();
    ctx.globalAlpha = opacity;
    
    // 湍流效果
    const turbulence = effect.turbulence || 0;
    const time = Date.now() * 0.001;
    
    // 多层等离子体
    for (let i = 0; i < 3; i++) {
        const ratio = 1 - i * 0.2;
        const gradient = ctx.createRadialGradient(
            effect.x, effect.y, 0,
            effect.x, effect.y, currentSize * ratio
        );
        
        if (i === 0) {
            gradient.addColorStop(0, 'hsla(200, 80%, 70%, 0.7)');
            gradient.addColorStop(0.3, 'hsla(220, 70%, 70%, 0.6)');
        } else if (i === 1) {
            gradient.addColorStop(0, 'hsla(210, 85%, 75%, 0.6)');
            gradient.addColorStop(0.4, 'hsla(230, 75%, 70%, 0.5)');
        } else {
            gradient.addColorStop(0, 'hsla(220, 90%, 80%, 0.5)');
            gradient.addColorStop(0.5, 'hsla(240, 80%, 75%, 0.4)');
        }
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        
        // 添加湍流变形
        if (turbulence > 0) {
            ctx.beginPath();
            for (let a = 0; a <= Math.PI * 2; a += Math.PI / 20) {
                const r = currentSize * ratio * (1 + Math.sin(a * 5 + time) * turbulence * 0.1);
                const x = effect.x + Math.cos(a) * r;
                const y = effect.y + Math.sin(a) * r;
                
                if (a === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.closePath();
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(effect.x, effect.y, currentSize * ratio, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // 添加随机电浆
    if (progress < 0.7 && Math.random() < 0.2) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * currentSize * 0.7;
        const px = effect.x + Math.cos(angle) * dist;
        const py = effect.y + Math.sin(angle) * dist;
        const size = 1 + Math.random() * 3;
        
        ctx.fillStyle = `hsla(${200 + Math.random() * 40}, ${70 + Math.random() * 20}%, 70%, ${0.5 + Math.random() * 0.4})`;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
        
        // 电浆发光
        ctx.shadowColor = `hsla(${200 + Math.random() * 40}, 80%, 70%, 0.7)`;
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowColor = 'transparent';
    }
    
    ctx.restore();
    return true;
}

// 绘制宇宙弦振动效果 - 优化
function drawCosmicString(effect) {
    const progress = (Date.now() - effect.startTime) / effect.duration;
    if (progress > 1) return false;
    
    let opacity;
    let scaleY = 1;
    
    if (progress < 0.1) {
        opacity = progress * 10 * 0.8;
    } else if (progress > 0.9) {
        opacity = (1 - progress) * 10 * 0.8;
    } else {
        opacity = 0.8;
    }
    
    // 振动效果
    const vibration = effect.vibration || 10;
    const time = (Date.now() - effect.startTime) / 1000;
    scaleY = 1 + Math.sin(time * 10) * (vibration / 20);
    
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(effect.x, effect.y);
    ctx.rotate(effect.angle);
    ctx.scale(1, scaleY);
    
    const gradient = ctx.createLinearGradient(0, 0, effect.length, 0);
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(0.2, 'hsla(200, 80%, 85%, 0.9)');
    gradient.addColorStop(0.5, 'hsla(210, 80%, 80%, 1)');
    gradient.addColorStop(0.8, 'hsla(200, 80%, 85%, 0.9)');
    gradient.addColorStop(1, 'transparent');
    
    // 绘制弦体
    ctx.fillStyle = gradient;
    ctx.fillRect(0, -1.5, effect.length, 3);
    
    // 绘制核心光带
    const coreGradient = ctx.createLinearGradient(0, 0, effect.length, 0);
    coreGradient.addColorStop(0, 'transparent');
    coreGradient.addColorStop(0.4, 'hsla(200, 100%, 95%, 0.9)');
    coreGradient.addColorStop(0.6, 'hsla(200, 100%, 95%, 0.9)');
    coreGradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = coreGradient;
    ctx.fillRect(0, -0.5, effect.length, 1);
    
    // 发光效果
    ctx.shadowColor = 'hsla(200, 80%, 70%, 0.8)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillRect(0, -1.5, effect.length, 3);
    ctx.shadowColor = 'transparent';
    
    // 添加振动节点
    if (vibration > 5) {
        for (let x = 0; x < effect.length; x += effect.length / 10) {
            const y = Math.sin(x * 0.05 + time * 5) * (vibration / 5);
            ctx.fillStyle = 'hsla(200, 100%, 95%, 0.9)';
            ctx.beginPath();
            ctx.arc(x, y, 1 + Math.sin(time * 3 + x * 0.1) * 0.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    ctx.restore();
    return true;
}

// 绘制星云扩散效果 - 优化
function drawNebula(effect) {
    const progress = (Date.now() - effect.startTime) / effect.duration;
    if (progress > 1) return false;
    
    let currentSize;
    let opacity;
    
    if (progress < 0.3) {
        currentSize = effect.size * 0.5 * (progress / 0.3);
        opacity = (progress / 0.3) * 0.6;
    } else {
        currentSize = effect.size * 0.5 * (1 + (progress - 0.3) * 1.43);
        opacity = 0.6 * (1 - (progress - 0.3) * 1.43);
    }
    
    ctx.save();
    
    // 多层星云效果
    const layers = effect.layers || 3;
    for (let i = 0; i < layers; i++) {
        const ratio = 1 - i * 0.15;
        ctx.globalAlpha = opacity * (1 - i * 0.2);
        
        const gradient = ctx.createRadialGradient(
            effect.x, effect.y, 0,
            effect.x, effect.y, currentSize * ratio
        );
        
        if (i === 0) {
            gradient.addColorStop(0, 'hsla(200, 80%, 70%, 0.5)');
            gradient.addColorStop(0.3, 'hsla(220, 70%, 70%, 0.4)');
        } else if (i === 1) {
            gradient.addColorStop(0, 'hsla(210, 85%, 75%, 0.4)');
            gradient.addColorStop(0.4, 'hsla(230, 75%, 70%, 0.3)');
        } else {
            gradient.addColorStop(0, 'hsla(220, 90%, 80%, 0.3)');
            gradient.addColorStop(0.5, 'hsla(240, 80%, 75%, 0.2)');
        }
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, currentSize * ratio, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 添加星云细节
    if (progress < 0.8) {
        ctx.globalAlpha = opacity * 0.5;
        for (let j = 0; j < 20; j++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * currentSize * 0.8;
            const px = effect.x + Math.cos(angle) * dist;
            const py = effect.y + Math.sin(angle) * dist;
            const size = Math.random() * 10 + 5;
            const hue = 200 + Math.random() * 40;
            
            const cloudGradient = ctx.createRadialGradient(
                px, py, 0,
                px, py, size
            );
            cloudGradient.addColorStop(0, `hsla(${hue}, 70%, 70%, 0.3)`);
            cloudGradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = cloudGradient;
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    ctx.restore();
    return true;
}

// 绘制极光效果 - 优化
function drawAurora(effect) {
    const progress = (Date.now() - effect.startTime) / effect.duration;
    if (progress > 1) return false;
    
    const opacity = 0.7 * (1 - progress);
    const currentSize = effect.size * (0.5 + progress * 0.7);
    const bands = effect.bands || 5;
    const hue = effect.hue || 200;
    
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(effect.x, effect.y);
    
    // 绘制极光带
    for (let i = 0; i < bands; i++) {
        const bandHeight = currentSize * 0.1;
        const bandWidth = currentSize * (0.8 - i * 0.1);
        const yOffset = (i - bands / 2) * bandHeight * 1.5;
        const waveFactor = Math.sin(Date.now() * 0.001 + i) * 0.2;
        
        ctx.beginPath();
        ctx.moveTo(-bandWidth / 2, yOffset);
        
        // 波浪形路径
        for (let x = -bandWidth / 2; x <= bandWidth / 2; x += 10) {
            const wave = Math.sin(x * 0.02 + Date.now() * 0.001) * bandHeight * waveFactor;
            ctx.lineTo(x, yOffset + wave);
        }
        
        ctx.lineTo(bandWidth / 2, yOffset);
        
        // 渐变填充
        const gradient = ctx.createLinearGradient(-bandWidth / 2, yOffset, bandWidth / 2, yOffset);
        gradient.addColorStop(0, `hsla(${hue + i * 5}, 80%, 70%, 0)`);
        gradient.addColorStop(0.3, `hsla(${hue + 10 + i * 5}, 90%, 70%, ${0.3 - i * 0.05})`);
        gradient.addColorStop(0.7, `hsla(${hue + 20 + i * 5}, 90%, 70%, ${0.3 - i * 0.05})`);
        gradient.addColorStop(1, `hsla(${hue + 30 + i * 5}, 80%, 70%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // 发光效果
        ctx.shadowColor = `hsla(${hue + 10 + i * 5}, 80%, 70%, 0.5)`;
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.fill();
        ctx.shadowColor = 'transparent';
    }
    
    // 添加微光粒子
    if (progress < 0.7) {
        for (let i = 0; i < 10; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * currentSize * 0.7;
            const size = Math.random() * 1 + 0.5;
            
            ctx.globalAlpha = opacity * (0.3 + Math.random() * 0.2);
            ctx.fillStyle = `hsla(${hue + Math.random() * 20}, ${70 + Math.random() * 20}%, 80%, 0.8)`;
            ctx.beginPath();
            ctx.arc(
                Math.cos(angle) * dist,
                Math.sin(angle) * dist,
                size, 0, Math.PI * 2
            );
            ctx.fill();
        }
    }
    
    ctx.restore();
    return true;
}

// 创建曲速航行特效 - 优化
function createWarpEffect(x, y) {
    // 性能优化：超出最大数量时不再新建
    if (particles.length > MAX_PARTICLES * 0.95 || effects.length > MAX_EFFECTS * 0.95) return;
    // 清除旧粒子
    particles = particles.filter(p => p.update());
    // 创建中心光晕 - 使用优化后的光晕类
    if (activeGlows.length < 10) activeGlows.push(new Glow(x, y, 60));
    // 创建时空扭曲波纹
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            if (effects.length < MAX_EFFECTS) {
                effects.push({
                    type: 'ripple',
                    x: x,
                    y: y,
                    size: 15,
                    startTime: Date.now(),
                    duration: 1200 + i * 600,
                    borderWidth: Math.random() * 2 + 1,
                    color: `hsla(${200 + Math.random() * 40}, 80%, 70%, 0.5)`
                });
            }
        }, i * 200);
    }
    // 创建星际尘埃 - 优化：分批创建避免卡顿
    const batchSize = 40;
    const totalParticles = 200;
    const createDustParticles = (start, end) => {
        for (let i = start; i < end && i < totalParticles; i++) {
            if (particles.length < MAX_PARTICLES) {
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 150 + 50;
                const duration = Math.random() * 2500 + 1000;
                particles.push(new Particle(
                    x, y,
                    Math.random() * 0.3 + 0.2,
                    `hsla(200, 80%, 80%, ${Math.random() * 0.2 + 0.1})`,
                    angle, distance, duration
                ));
            }
        }
    };
    for (let i = 0; i < totalParticles; i += batchSize) {
        setTimeout(() => createDustParticles(i, i + batchSize), i / batchSize * 50);
    }
    // 创建星轨效果 - 优化
    for (let i = 0; i < 200; i++) {
        if (effects.length < MAX_EFFECTS) {
            const angle = Math.random() * Math.PI * 2;
            const length = Math.random() * 400 + 200;
            const opacity = Math.random() * 0.7 + 0.1;
            effects.push({
                type: 'starTrail',
                x: x,
                y: y,
                length: length,
                angle: angle,
                opacity: opacity,
                startTime: Date.now(),
                duration: 1800,
                speed: Math.random() * 0.5 + 0.5
            });
        }
    }
    // 创建曲率光束 - 优化
    for (let i = 0; i < 50; i++) {
        if (effects.length < MAX_EFFECTS) {
            const angle = Math.random() * Math.PI * 2;
            const length = Math.random() * 800 + 500;
            const height = Math.random() * 2 + 0.5;
            effects.push({
                type: 'warpBeam',
                x: x,
                y: y,
                length: length,
                angle: angle,
                height: height,
                startTime: Date.now(),
                duration: 1000,
                hue: 200 + Math.random() * 40
            });
        }
    }
    // 创建高能粒子 - 优化：分批创建
    const totalEnergyParticles = 800;
    const createEnergyParticles = (start, end) => {
        for (let i = start; i < end && i < totalEnergyParticles; i++) {
            if (particles.length < MAX_PARTICLES) {
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 500 + 200;
                const duration = Math.random() * 3000 + 1000;
                const size = Math.random() * 2 + 0.5;
                const hue = Math.random() * 40 + 180;
                const saturation = Math.random() * 30 + 70;
                particles.push(new Particle(
                    x, y,
                    size,
                    `hsla(${hue}, ${saturation}%, 70%, 0.9)`,
                    angle, distance, duration
                ));
            }
        }
    };
    for (let i = 0; i < totalEnergyParticles; i += batchSize) {
        setTimeout(() => createEnergyParticles(i, i + batchSize), i / batchSize * 30);
    }
    // 延迟粒子爆发 - 优化
    setTimeout(() => {
        const totalBurstParticles = 500;
        const createBurstParticles = (start, end) => {
            for (let i = start; i < end && i < totalBurstParticles; i++) {
                if (particles.length < MAX_PARTICLES) {
                    const angle = Math.random() * Math.PI * 2;
                    const distance = Math.random() * 600 + 150;
                    const duration = Math.random() * 3500 + 1500;
                    const size = Math.random() * 2 + 0.3;
                    const hue = Math.random() * 360;
                    particles.push(new Particle(
                        x, y,
                        size,
                        `hsla(${hue}, 80%, 70%, 0.8)`,
                        angle, distance, duration
                    ));
                }
            }
        };
        for (let i = 0; i < totalBurstParticles; i += batchSize) {
            setTimeout(() => createBurstParticles(i, i + batchSize), i / batchSize * 20);
        }
    }, 300);
    // 新增：星尘漩涡
    setTimeout(() => {
        const totalSwirlParticles = 300;
        const createSwirlParticles = (start, end) => {
            for (let i = start; i < end && i < totalSwirlParticles; i++) {
                if (particles.length < MAX_PARTICLES) {
                    const angle = Math.random() * Math.PI * 2;
                    const distance = Math.random() * 400 + 100;
                    const duration = Math.random() * 4000 + 2000;
                    const size = Math.random() * 0.5 + 0.1;
                    particles.push(new Particle(
                        x, y,
                        size,
                        `hsla(200, 30%, 80%, ${Math.random() * 0.2 + 0.1})`,
                        angle, distance, duration
                    ));
                }
            }
        };
        for (let i = 0; i < totalSwirlParticles; i += batchSize) {
            setTimeout(() => createSwirlParticles(i, i + batchSize), i / batchSize * 15);
        }
    }, 500);
}

// 绘制星轨效果 - 优化
function drawStarTrail(effect) {
    const progress = (Date.now() - effect.startTime) / effect.duration;
    if (progress > 1) return false;
    
    const opacity = effect.opacity * (1 - progress);
    const currentLength = effect.length * (1 + progress * 1.5 * (effect.speed || 1));
    
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(effect.x, effect.y);
    ctx.rotate(effect.angle);
    
    // 更精细的渐变
    const gradient = ctx.createLinearGradient(0, 0, currentLength, 0);
    gradient.addColorStop(0, 'hsla(200, 80%, 90%, 0.95)');
    gradient.addColorStop(0.2, 'hsla(210, 80%, 85%, 0.8)');
    gradient.addColorStop(0.5, 'hsla(220, 80%, 80%, 0.7)');
    gradient.addColorStop(0.8, 'hsla(210, 80%, 85%, 0.5)');
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    
    // 绘制星轨主体
    ctx.fillRect(0, -0.3, currentLength, 0.6);
    
    // 绘制核心光带
    const coreGradient = ctx.createLinearGradient(0, 0, currentLength, 0);
    coreGradient.addColorStop(0, 'hsla(200, 100%, 95%, 0.9)');
    coreGradient.addColorStop(0.5, 'hsla(210, 100%, 90%, 0.8)');
    coreGradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = coreGradient;
    ctx.fillRect(0, -0.1, currentLength, 0.2);
    
    // 发光效果
    ctx.shadowColor = 'hsla(200, 80%, 70%, 0.8)';
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillRect(0, -0.3, currentLength, 0.6);
    ctx.shadowColor = 'transparent';
    
    // 添加闪烁节点
    if (Math.random() < 0.1) {
        const pos = Math.random() * currentLength * 0.8;
        ctx.fillStyle = 'hsla(200, 100%, 95%, 0.9)';
        ctx.beginPath();
        ctx.arc(pos, 0, 0.5 + Math.random() * 1, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.restore();
    return true;
}

// 绘制曲率光束 - 优化
function drawWarpBeam(effect) {
    const progress = (Date.now() - effect.startTime) / effect.duration;
    if (progress > 1) return false;
    
    const opacity = 1 - progress * progress;
    const currentLength = effect.length * (1 + progress * 2);
    
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(effect.x, effect.y);
    ctx.rotate(effect.angle);
    
    // 使用多色渐变
    const gradient = ctx.createLinearGradient(0, 0, currentLength, 0);
    gradient.addColorStop(0, 'hsla(280,100%,80%,0.95)'); // 紫
    gradient.addColorStop(0.2, 'hsla(220,100%,80%,0.9)'); // 蓝
    gradient.addColorStop(0.4, 'hsla(180,100%,70%,0.8)'); // 青
    gradient.addColorStop(0.6, 'hsla(320,100%,90%,0.7)'); // 粉
    gradient.addColorStop(0.8, 'hsla(60,100%,95%,0.8)');  // 金
    gradient.addColorStop(1, 'white');
    
    ctx.fillStyle = gradient;
    
    // 绘制光束主体
    const height = effect.height * (1 + Math.sin(Date.now() * 0.01) * 0.2);
    ctx.fillRect(0, -height / 2, currentLength, height);
    
    // 绘制核心光带
    const coreGradient = ctx.createLinearGradient(0, 0, currentLength, 0);
    coreGradient.addColorStop(0, `hsla(${200 + Math.random() * 40}, 100%, 90%, 0.9)`);
    coreGradient.addColorStop(0.5, `hsla(${200 + Math.random() * 40}, 100%, 90%, 0.7)`);
    coreGradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = coreGradient;
    ctx.fillRect(0, -height / 4, currentLength, height / 2);
    
    // 发光效果
    ctx.shadowColor = `hsla(${200 + Math.random() * 40}, 100%, 70%, 0.8)`;
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillRect(0, -height / 2, currentLength, height);
    ctx.shadowColor = 'transparent';
    
    // 添加能量节点
    if (Math.random() < 0.2) {
        const pos = Math.random() * currentLength * 0.9;
        ctx.fillStyle = `hsla(${200 + Math.random() * 20}, 100%, 90%, 0.9)`;
        ctx.beginPath();
        ctx.arc(pos, 0, 1 + Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 增加射线波动
    for (let y = -height / 2; y < height / 2; y += 10) {
        ctx.beginPath();
        for (let x = 0; x <= currentLength; x += 10) {
            const offset = Math.sin(x * 0.02 + Date.now() * 0.01 + y) * 2;
            ctx.lineTo(x, y + offset);
        }
        ctx.strokeStyle = gradient;
        ctx.globalAlpha = opacity * (0.7 + Math.random() * 0.3);
        ctx.stroke();
    }
    
    ctx.restore();
    return true;
}

// 绘制时空扭曲波纹 - 优化
function drawRipple(effect) {
    const progress = (Date.now() - effect.startTime) / effect.duration;
    if (progress > 1) return false;
    
    const currentSize = effect.size * (1 + progress * 25);
    const opacity = 1 - progress * progress;
    
    ctx.save();
    ctx.globalAlpha = opacity;
    
    // 多层波纹效果
    for (let i = 0; i < 2; i++) {
        const ratio = 1 - i * 0.3;
        ctx.strokeStyle = effect.color || `hsla(${
            200 + Math.random() * 20}, ${
            80 + Math.random() * 10}%, 70%, ${0.4 * (1 - i * 0.5)})`;
        ctx.lineWidth = effect.borderWidth * (1 - progress) * ratio;
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, currentSize * ratio, 0, Math.PI * 2);
        ctx.stroke();
        
        // 发光效果
        ctx.shadowColor = effect.color || 'hsla(200, 80%, 70%, 0.4)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, currentSize * ratio, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowColor = 'transparent';
    }
    
    ctx.restore();
    return true;
}

// 绘制collapse宇宙塌缩特效
function drawCollapseEffect(effect) {
    const progress = (Date.now() - effect.startTime) / effect.duration;
    if (progress > 1) return false;
    const collapseSize = effect.size * (1 - progress * 0.95);
    const opacity = 1 - progress * 0.9;

    ctx.save();
    // 扭曲的黑洞核心
    const gradient = ctx.createRadialGradient(
        effect.x, effect.y, 0,
        effect.x, effect.y, collapseSize
    );
    gradient.addColorStop(0, `hsla(260,100%,10%,${opacity})`);
    gradient.addColorStop(0.5, `hsla(260,80%,30%,${opacity * 0.7})`);
    gradient.addColorStop(1, 'transparent');
    ctx.globalAlpha = opacity;
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, collapseSize, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // 扭曲的吸积盘
    for (let i = 0; i < 3; i++) {
        ctx.save();
        ctx.globalAlpha = opacity * 0.3;
        ctx.translate(effect.x, effect.y);
        ctx.rotate(progress * Math.PI * 2 * (i + 1));
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 60) {
            const r = collapseSize * 1.2 + Math.sin(a * 8 + progress * 10) * 10 * (1 - progress);
            ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.closePath();
        ctx.strokeStyle = `hsla(220,100%,80%,${0.2 + 0.1 * i})`;
        ctx.lineWidth = 2 - i * 0.5;
        ctx.stroke();
        ctx.restore();
    }
    ctx.restore();
    return true;
}

// CollapseParticle类：用于塌缩粒子
class CollapseParticle {
    constructor(x, y, size, color, angle, distance, duration) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.angle = angle;
        this.distance = distance;
        this.duration = duration;
        this.startX = x;
        this.startY = y;
        this.opacity = 1;
    }
    updateCollapse(cx, cy, progress) {
        // 反向流向中心
        const t = Math.pow(progress, 0.7);
        this.x = this.startX + (cx - this.startX) * t + Math.sin(progress * 10 + this.angle) * 8 * (1-t);
        this.y = this.startY + (cy - this.startY) * t + Math.cos(progress * 10 + this.angle) * 8 * (1-t);
        this.opacity = 1 - progress * 0.9;
    }
    draw(ctx) {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// 新增：drawCollapseCosmos函数，极具宇宙感的塌缩动画
function drawCollapseCosmos(x, y, size, progress, particles) {
    // 阶段划分
    // 0~0.25：宇宙爆炸膨胀  0.25~0.85：塌缩  0.85~1：奇点
    let phase;
    if (progress < 0.25) phase = 'expand';
    else if (progress < 0.85) phase = 'collapse';
    else phase = 'singularity';

    // 色彩与尺寸
    let collapseSize, colorPhase, opacity;
    if (phase === 'expand') {
        collapseSize = size * (1 + progress * 2.5); // 爆炸膨胀
        colorPhase = 60 + progress * 200; // 金-蓝-紫
        opacity = 1 - progress * 0.5;
    } else if (phase === 'collapse') {
        collapseSize = size * (1.6 - (progress-0.25)/0.6 * 1.5); // 快速收缩
        colorPhase = 260 - (progress-0.25)/0.6 * 180; // 蓝-紫-黑
        opacity = 0.7 - (progress-0.25)/0.6 * 0.5;
    } else {
        collapseSize = size * 0.1 * (1 - (progress-0.85)/0.15 * 0.7); // 极小奇点
        colorPhase = 220 + (progress-0.85)/0.15 * 60; // 深蓝-白
        opacity = 0.3 + (progress-0.85)/0.15 * 0.7;
    }
    ctx.save();

    // 1. 爆炸膨胀阶段
    if (phase === 'expand') {
        // 爆炸核心
        const grad = ctx.createRadialGradient(x, y, 0, x, y, collapseSize);
        grad.addColorStop(0, `hsla(${colorPhase},100%,98%,${opacity})`);
        grad.addColorStop(0.3, `hsla(${colorPhase+30},100%,80%,${opacity*0.7})`);
        grad.addColorStop(0.7, `hsla(${colorPhase+60},80%,60%,${opacity*0.4})`);
        grad.addColorStop(1, 'transparent');
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(x, y, collapseSize, 0, Math.PI*2);
        ctx.fillStyle = grad;
        ctx.fill();
        // 爆炸能量波纹
        for(let i=0;i<3;i++){
            ctx.save();
            ctx.globalAlpha = 0.15 * (1-progress) * (1-i*0.3);
            ctx.strokeStyle = `hsla(${colorPhase+60},100%,90%,0.5)`;
            ctx.lineWidth = 3-i;
            ctx.beginPath();
            ctx.arc(x, y, collapseSize*(1.2+i*0.3), 0, Math.PI*2);
            ctx.stroke();
            ctx.restore();
        }
        // 爆炸粒子
        for(let i=0;i<12;i++){
            const angle = Math.PI*2*i/12 + Math.random()*0.2;
            const dist = collapseSize*0.7 + Math.random()*collapseSize*0.3;
            ctx.save();
            ctx.globalAlpha = 0.5+Math.random()*0.3;
            ctx.fillStyle = `hsla(${colorPhase+120+Math.random()*60},100%,90%,0.8)`;
            ctx.beginPath();
            ctx.arc(x+Math.cos(angle)*dist, y+Math.sin(angle)*dist, 3+Math.random()*4, 0, Math.PI*2);
            ctx.fill();
            ctx.restore();
        }
    }

    // 2. 塌缩阶段
    if (phase === 'collapse') {
        // 扭曲的黑洞核心
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, collapseSize);
        gradient.addColorStop(0, `hsla(${colorPhase},100%,10%,${opacity})`);
        gradient.addColorStop(0.5, `hsla(${colorPhase+30},80%,30%,${opacity*0.7})`);
        gradient.addColorStop(1, 'transparent');
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(x, y, collapseSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        // 扭曲吸积盘
        for (let i = 0; i < 3; i++) {
            ctx.save();
            ctx.globalAlpha = opacity * 0.3;
            ctx.translate(x, y);
            ctx.rotate(progress * Math.PI * 2 * (i + 1));
            ctx.beginPath();
            for (let a = 0; a < Math.PI * 2; a += Math.PI / 60) {
                const r = collapseSize * 1.2 + Math.sin(a * 8 + progress * 10) * 10 * (1 - progress);
                ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
            }
            ctx.closePath();
            ctx.strokeStyle = `hsla(${colorPhase+60},100%,80%,${0.2 + 0.1 * i})`;
            ctx.lineWidth = 2 - i * 0.5;
            ctx.stroke();
            ctx.restore();
        }
        // 能量闪烁
        for (let i = 0; i < 10; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = collapseSize * (0.7 + Math.random() * 0.5);
            ctx.save();
            ctx.globalAlpha = opacity * (0.4 + Math.random() * 0.3);
            ctx.fillStyle = `hsla(${colorPhase+120+Math.random()*60},100%,90%,0.8)`;
            ctx.beginPath();
            ctx.arc(x + Math.cos(angle) * dist, y + Math.sin(angle) * dist, 2 + Math.random() * 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        // 空间波纹塌缩
        ctx.save();
        ctx.globalAlpha = 0.12 * (1 - progress);
        ctx.strokeStyle = `hsla(${colorPhase+60},100%,80%,0.3)`;
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(x, y, collapseSize * (1.5 + i * 0.3) * (1 - progress * 0.7), 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.restore();
        // 粒子回流
        particles.forEach(p => p.draw(ctx));
        // 空间拉伸光带
        for(let i=0;i<6;i++){
            ctx.save();
            ctx.globalAlpha = 0.08 + Math.random()*0.08;
            ctx.strokeStyle = `hsla(${colorPhase+180},100%,98%,0.7)`;
            ctx.lineWidth = 1+Math.random()*2;
            ctx.beginPath();
            const angle = Math.random()*Math.PI*2;
            for(let r=collapseSize*1.2;r<collapseSize*2.2;r+=8){
                const off = Math.sin(r*0.08+progress*10+i)*10*(1-progress);
                ctx.lineTo(x+Math.cos(angle)*r+off, y+Math.sin(angle)*r+off);
            }
            ctx.stroke();
            ctx.restore();
        }
    }

    // 3. 奇点阶段
    if (phase === 'singularity') {
        // 极亮奇点
        const grad = ctx.createRadialGradient(x, y, 0, x, y, collapseSize*2);
        grad.addColorStop(0, `hsla(${colorPhase+60},100%,98%,${opacity})`);
        grad.addColorStop(0.2, `hsla(${colorPhase+120},100%,90%,${opacity*0.7})`);
        grad.addColorStop(1, 'transparent');
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(x, y, collapseSize*2, 0, Math.PI*2);
        ctx.fillStyle = grad;
        ctx.fill();
        // 奇点高频闪烁
        if(Math.random()<0.7){
            ctx.save();
            ctx.globalAlpha = 0.7+Math.random()*0.3;
            ctx.fillStyle = `hsla(${colorPhase+180},100%,99%,1)`;
            ctx.beginPath();
            ctx.arc(x, y, 8+Math.random()*8, 0, Math.PI*2);
            ctx.fill();
            ctx.restore();
        }
        // 奇点空间波动
        for(let i=0;i<2;i++){
            ctx.save();
            ctx.globalAlpha = 0.18*(1-(progress-0.85)/0.15);
            ctx.strokeStyle = `hsla(${colorPhase+120},100%,90%,0.5)`;
            ctx.lineWidth = 2-i;
            ctx.beginPath();
            ctx.arc(x, y, collapseSize*2.5+i*8, 0, Math.PI*2);
            ctx.stroke();
            ctx.restore();
        }
    }
    ctx.restore();
}

// 在合适位置添加终极坍缩动画函数
function drawUltimateCollapse(x, y, size, startTime) {
    const duration = 2200;
    const now = Date.now();
    const progress = Math.min(1, (now - startTime) / duration);
    if (progress >= 1) return;
    // 1. 中心奇点极亮爆发
    let coreSize = size * (0.1 + progress * 2.5);
    let coreOpacity = 1 - progress * 0.7;
    let hue = 220 + progress * 120;
    ctx.save();
    // 爆发核心
    let grad = ctx.createRadialGradient(x, y, 0, x, y, coreSize);
    grad.addColorStop(0, `hsla(${hue+60},100%,98%,${coreOpacity})`);
    grad.addColorStop(0.3, `hsla(${hue+90},100%,80%,${coreOpacity*0.7})`);
    grad.addColorStop(0.7, `hsla(${hue+120},80%,60%,${coreOpacity*0.4})`);
    grad.addColorStop(1, 'transparent');
    ctx.globalAlpha = coreOpacity;
    ctx.beginPath();
    ctx.arc(x, y, coreSize, 0, Math.PI*2);
    ctx.fillStyle = grad;
    ctx.fill();
    // 2. 多重空间波动环
    for(let i=0;i<4;i++){
        ctx.save();
        ctx.globalAlpha = 0.18*(1-progress)*(1-i*0.2);
        ctx.strokeStyle = `hsla(${hue+120},100%,90%,0.5)`;
        ctx.lineWidth = 2-i*0.5;
        ctx.beginPath();
        ctx.arc(x, y, coreSize*(1.5+i*0.5), 0, Math.PI*2);
        ctx.stroke();
        ctx.restore();
    }
    // 3. 奇点高频闪烁
    if(Math.random()<0.7){
        ctx.save();
        ctx.globalAlpha = 0.7+Math.random()*0.3;
        ctx.fillStyle = `hsla(${hue+180},100%,99%,1)`;
        ctx.beginPath();
        ctx.arc(x, y, 8+Math.random()*8, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
    }
    // 4. 星云消散粒子
    for(let i=0;i<18;i++){
        const angle = Math.PI*2*i/18 + Math.random()*0.2;
        const dist = coreSize*0.7 + Math.random()*coreSize*1.2;
        ctx.save();
        ctx.globalAlpha = 0.3+Math.random()*0.3;
        ctx.fillStyle = `hsla(${hue+120+Math.random()*60},100%,90%,0.8)`;
        ctx.beginPath();
        ctx.arc(x+Math.cos(angle)*dist, y+Math.sin(angle)*dist, 3+Math.random()*6, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
    }
    // 5. 空间撕裂光带
    for(let i=0;i<8;i++){
        ctx.save();
        ctx.globalAlpha = 0.08 + Math.random()*0.08;
        ctx.strokeStyle = `hsla(${hue+180},100%,98%,0.7)`;
        ctx.lineWidth = 1+Math.random()*2;
        ctx.beginPath();
        const angle = Math.random()*Math.PI*2;
        for(let r=coreSize*1.2;r<coreSize*2.8;r+=8){
            const off = Math.sin(r*0.08+progress*10+i)*10*(1-progress);
            ctx.lineTo(x+Math.cos(angle)*r+off, y+Math.sin(angle)*r+off);
        }
        ctx.stroke();
        ctx.restore();
    }
    ctx.restore();
}

// 终极宇宙消散动画（超级无敌宇宙感）
function drawFinalUltimateCollapse(x, y, size, startTime) {
    const duration = 3200;
    const now = Date.now();
    const progress = Math.min(1, (now - startTime) / duration);
    if (progress >= 1) return;
    // 1. 中心超新星极亮爆发
    let coreSize = size * (0.2 + progress * 3.5);
    let coreOpacity = 1 - progress * 0.8;
    let hue = 220 + progress * 180;
    ctx.save();
    // 爆发核心
    let grad = ctx.createRadialGradient(x, y, 0, x, y, coreSize);
    grad.addColorStop(0, `hsla(${hue+60},100%,99%,${coreOpacity})`);
    grad.addColorStop(0.2, `hsla(${hue+120},100%,90%,${coreOpacity*0.7})`);
    grad.addColorStop(0.7, `hsla(${hue+180},80%,70%,${coreOpacity*0.4})`);
    grad.addColorStop(1, 'transparent');
    ctx.globalAlpha = coreOpacity;
    ctx.beginPath();
    ctx.arc(x, y, coreSize, 0, Math.PI*2);
    ctx.fillStyle = grad;
    ctx.fill();
    // 2. 多重空间波动环
    for(let i=0;i<6;i++){
        ctx.save();
        ctx.globalAlpha = 0.15*(1-progress)*(1-i*0.15);
        ctx.strokeStyle = `hsla(${hue+180},100%,95%,0.5)`;
        ctx.lineWidth = 2-i*0.3;
        ctx.beginPath();
        ctx.arc(x, y, coreSize*(1.5+i*0.5), 0, Math.PI*2);
        ctx.stroke();
        ctx.restore();
    }
    // 3. 奇点高频闪烁
    if(Math.random()<0.8){
        ctx.save();
        ctx.globalAlpha = 0.7+Math.random()*0.3;
        ctx.fillStyle = `hsla(${hue+240},100%,99%,1)`;
        ctx.beginPath();
        ctx.arc(x, y, 12+Math.random()*16, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
    }
    // 4. 星云消散粒子
    for(let i=0;i<32;i++){
        const angle = Math.PI*2*i/32 + Math.random()*0.2;
        const dist = coreSize*0.7 + Math.random()*coreSize*2.2;
        ctx.save();
        ctx.globalAlpha = 0.2+Math.random()*0.4;
        ctx.fillStyle = `hsla(${hue+120+Math.random()*120},100%,90%,0.8)`;
        ctx.beginPath();
        ctx.arc(x+Math.cos(angle)*dist, y+Math.sin(angle)*dist, 4+Math.random()*10, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
    }
    // 5. 空间撕裂光带
    for(let i=0;i<12;i++){
        ctx.save();
        ctx.globalAlpha = 0.06 + Math.random()*0.08;
        ctx.strokeStyle = `hsla(${hue+200},100%,98%,0.7)`;
        ctx.lineWidth = 1+Math.random()*2;
        ctx.beginPath();
        const angle = Math.random()*Math.PI*2;
        for(let r=coreSize*1.2;r<coreSize*3.8;r+=8){
            const off = Math.sin(r*0.08+progress*20+i)*18*(1-progress);
            ctx.lineTo(x+Math.cos(angle)*r+off, y+Math.sin(angle)*r+off);
        }
        ctx.stroke();
        ctx.restore();
    }
    // 6. 宇宙碎片流星
    for(let i=0;i<18;i++){
        ctx.save();
        ctx.globalAlpha = 0.12+Math.random()*0.18;
        ctx.strokeStyle = `hsla(${hue+180+Math.random()*60},100%,99%,0.8)`;
        ctx.lineWidth = 1+Math.random()*2;
        ctx.beginPath();
        const angle = Math.random()*Math.PI*2;
        ctx.moveTo(x+Math.cos(angle)*coreSize*1.2, y+Math.sin(angle)*coreSize*1.2);
        ctx.lineTo(x+Math.cos(angle)*coreSize*3.2, y+Math.sin(angle)*coreSize*3.2);
        ctx.stroke();
        ctx.restore();
    }
    ctx.restore();
}

// 终极宇宙消散动画（超级无敌宇宙感）
function drawSuperCollapseUniverse(x, y, size, startTime, glowInstance) {
    const duration = 8000;
    const now = Date.now();
    const progress = Math.min(1, (now - startTime) / duration);
    if (progress >= 1) {
        // 新增：所有动画彻底结束后，触发终极终极超级无敌宇宙坍缩动画
        if (glowInstance && !glowInstance.finalSuperCollapseUniverseTriggered) {
            glowInstance.finalSuperCollapseUniverseTriggered = true;
            setTimeout(() => {
                if (!glowInstance.finalSuperCollapseStartTime) glowInstance.finalSuperCollapseStartTime = Date.now();
                drawFinalSuperCollapseUniverse(x, y, size * 3.2, glowInstance.finalSuperCollapseStartTime);
            }, 10000); // 稍作延迟，体验更顺滑
        }
        return;
    }
    ctx.save();
    // 1. 超级奇点爆发
    let coreSize = size * (0.2 + progress * 6);
    let coreOpacity = 1 - progress * 0.9;
    let hue = 260 + progress * 300;
    let grad = ctx.createRadialGradient(x, y, 0, x, y, coreSize);
    grad.addColorStop(0, `hsla(${hue},100%,99%,${coreOpacity})`);
    grad.addColorStop(0.2, `hsla(${hue+60},100%,90%,${coreOpacity*0.7})`);
    grad.addColorStop(0.7, `hsla(${hue+120},80%,70%,${coreOpacity*0.4})`);
    grad.addColorStop(1, 'transparent');
    ctx.globalAlpha = coreOpacity;
    ctx.beginPath();
    ctx.arc(x, y, coreSize, 0, Math.PI*2);
    ctx.fillStyle = grad;
    ctx.fill();
    // 2. 多重空间波动环
    for(let i=0;i<10;i++){
        ctx.save();
        ctx.globalAlpha = 0.12*(1-progress)*(1-i*0.1);
        ctx.strokeStyle = `hsla(${hue+180},100%,95%,0.5)`;
        ctx.lineWidth = 2-i*0.15;
        ctx.beginPath();
        ctx.arc(x, y, coreSize*(1.5+i*0.5), 0, Math.PI*2);
        ctx.stroke();
        ctx.restore();
    }
    // 3. 超级奇点高频闪烁
    if(Math.random()<0.9){
        ctx.save();
        ctx.globalAlpha = 0.7+Math.random()*0.3;
        ctx.fillStyle = `hsla(${hue+240},100%,99%,1)`;
        ctx.beginPath();
        ctx.arc(x, y, 18+Math.random()*32, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
    }
    // 4. 星云消散粒子
    for(let i=0;i<64;i++){
        const angle = Math.PI*2*i/64 + Math.random()*0.2;
        const dist = coreSize*0.7 + Math.random()*coreSize*4.2;
        ctx.save();
        ctx.globalAlpha = 0.1+Math.random()*0.3;
        ctx.fillStyle = `hsla(${hue+120+Math.random()*180},100%,90%,0.8)`;
        ctx.beginPath();
        ctx.arc(x+Math.cos(angle)*dist, y+Math.sin(angle)*dist, 6+Math.random()*18, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
    }
    // 5. 空间撕裂光带
    for(let i=0;i<24;i++){
        ctx.save();
        ctx.globalAlpha = 0.04 + Math.random()*0.08;
        ctx.strokeStyle = `hsla(${hue+200},100%,98%,0.7)`;
        ctx.lineWidth = 1+Math.random()*2;
        ctx.beginPath();
        const angle = Math.random()*Math.PI*2;
        for(let r=coreSize*1.2;r<coreSize*6.8;r+=12){
            const off = Math.sin(r*0.08+progress*40+i)*28*(1-progress);
            ctx.lineTo(x+Math.cos(angle)*r+off, y+Math.sin(angle)*r+off);
        }
        ctx.stroke();
        ctx.restore();
    }
    // 6. 宇宙碎片流星
    for(let i=0;i<32;i++){
        ctx.save();
        ctx.globalAlpha = 0.08+Math.random()*0.18;
        ctx.strokeStyle = `hsla(${hue+180+Math.random()*120},100%,99%,0.8)`;
        ctx.lineWidth = 1+Math.random()*2;
        ctx.beginPath();
        const angle = Math.random()*Math.PI*2;
        ctx.moveTo(x+Math.cos(angle)*coreSize*1.2, y+Math.sin(angle)*coreSize*1.2);
        ctx.lineTo(x+Math.cos(angle)*coreSize*7.2, y+Math.sin(angle)*coreSize*7.2);
        ctx.stroke();
        ctx.restore();
    }
    ctx.restore();
    // 持续动画
    requestAnimationFrame(()=>drawSuperCollapseUniverse(x, y, size, startTime, glowInstance));
}

// 新增：终极终极超级无敌宇宙坍缩动画
function drawFinalSuperCollapseUniverse(x, y, size, startTime) {
    const duration = 5200;
    const now = Date.now();
    const progress = Math.min(1, (now - startTime) / duration);
    if (progress >= 1) {
        // 新增：所有动画彻底结束后，触发最后的最后宇宙无敌坍缩动画
        if (!window.finalFinalCollapseTriggered) {
            window.finalFinalCollapseTriggered = true;
            setTimeout(() => {
                if (!window.finalFinalCollapseStartTime) window.finalFinalCollapseStartTime = Date.now();
                drawFinalFinalCollapseUniverse(x, y, size * 4.5, window.finalFinalCollapseStartTime);
            }, 8000); // 终极终极动画后延迟触发
        }
        return;
    }
    ctx.save();
    // 1. 超级奇点极亮爆发
    let coreSize = size * (0.2 + progress * 10);
    let coreOpacity = 1 - progress * 0.95;
    let hue = 320 + progress * 320;
    let grad = ctx.createRadialGradient(x, y, 0, x, y, coreSize);
    grad.addColorStop(0, `hsla(${hue},100%,99%,${coreOpacity})`);
    grad.addColorStop(0.2, `hsla(${hue+60},100%,90%,${coreOpacity*0.7})`);
    grad.addColorStop(0.7, `hsla(${hue+120},80%,70%,${coreOpacity*0.4})`);
    grad.addColorStop(1, 'transparent');
    ctx.globalAlpha = coreOpacity;
    ctx.beginPath();
    ctx.arc(x, y, coreSize, 0, Math.PI*2);
    ctx.fillStyle = grad;
    ctx.fill();
    // 2. 多重空间波动环
    for(let i=0;i<16;i++){
        ctx.save();
        ctx.globalAlpha = 0.08*(1-progress)*(1-i*0.06);
        ctx.strokeStyle = `hsla(${hue+180},100%,95%,0.5)`;
        ctx.lineWidth = 2-i*0.09;
        ctx.beginPath();
        ctx.arc(x, y, coreSize*(1.5+i*0.5), 0, Math.PI*2);
        ctx.stroke();
        ctx.restore();
    }
    // 3. 超级奇点高频闪烁
    if(Math.random()<0.95){
        ctx.save();
        ctx.globalAlpha = 0.7+Math.random()*0.3;
        ctx.fillStyle = `hsla(${hue+480},100%,99%,1)`;
        ctx.beginPath();
        ctx.arc(x, y, 32+Math.random()*48, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
    }
    // 4. 星云消散粒子
    for(let i=0;i<128;i++){
        const angle = Math.PI*2*i/128 + Math.random()*0.2;
        const dist = coreSize*0.7 + Math.random()*coreSize*8.2;
        ctx.save();
        ctx.globalAlpha = 0.08+Math.random()*0.18;
        ctx.fillStyle = `hsla(${hue+120+Math.random()*240},100%,90%,0.8)`;
        ctx.beginPath();
        ctx.arc(x+Math.cos(angle)*dist, y+Math.sin(angle)*dist, 8+Math.random()*32, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
    }
    // 5. 空间撕裂光带
    for(let i=0;i<32;i++){
        ctx.save();
        ctx.globalAlpha = 0.03 + Math.random()*0.07;
        ctx.strokeStyle = `hsla(${hue+200},100%,98%,0.7)`;
        ctx.lineWidth = 1+Math.random()*2;
        ctx.beginPath();
        const angle = Math.random()*Math.PI*2;
        for(let r=coreSize*1.2;r<coreSize*12.8;r+=18){
            const off = Math.sin(r*0.08+progress*80+i)*48*(1-progress);
            ctx.lineTo(x+Math.cos(angle)*r+off, y+Math.sin(angle)*r+off);
        }
        ctx.stroke();
        ctx.restore();
    }
    // 6. 宇宙碎片流星
    for(let i=0;i<64;i++){
        ctx.save();
        ctx.globalAlpha = 0.04+Math.random()*0.12;
        ctx.strokeStyle = `hsla(${hue+180+Math.random()*240},100%,99%,0.8)`;
        ctx.lineWidth = 1+Math.random()*2;
        ctx.beginPath();
        const angle = Math.random()*Math.PI*2;
        ctx.moveTo(x+Math.cos(angle)*coreSize*1.2, y+Math.sin(angle)*coreSize*1.2);
        ctx.lineTo(x+Math.cos(angle)*coreSize*13.2, y+Math.sin(angle)*coreSize*13.2);
        ctx.stroke();
        ctx.restore();
    }
    // 7. 终极空间塌缩黑暗涌动
    let darkness = ctx.createRadialGradient(x, y, coreSize*2, x, y, coreSize*13.5);
    darkness.addColorStop(0, 'rgba(0,0,0,0)');
    darkness.addColorStop(0.2, 'rgba(0,0,0,0.1)');
    darkness.addColorStop(0.6, 'rgba(0,0,0,0.25)');
    darkness.addColorStop(1, 'rgba(0,0,0,0.85)');
    ctx.globalAlpha = 0.7 * (progress);
    ctx.beginPath();
    ctx.arc(x, y, coreSize*13.5, 0, Math.PI*2);
    ctx.fillStyle = darkness;
    ctx.fill();
    ctx.restore();
    // 持续动画
    requestAnimationFrame(()=>drawFinalSuperCollapseUniverse(x, y, size, startTime));
}

// 新增：最后的最后宇宙无敌坍缩动画（超级无敌宇宙感MAX）
function drawFinalFinalCollapseUniverse(x, y, size, startTime) {
    const duration = 12000;
    const now = Date.now();
    const progress = Math.min(1, (now - startTime) / duration);
    if (progress >= 1) return;
    ctx.save();
    // 1. 超级奇点极亮爆发
    let coreSize = size * (0.2 + progress * 18);
    let coreOpacity = 1 - progress * 0.98;
    let hue = 360 + progress * 720;
    let grad = ctx.createRadialGradient(x, y, 0, x, y, coreSize);
    grad.addColorStop(0, `hsla(${hue},100%,99%,${coreOpacity})`);
    grad.addColorStop(0.2, `hsla(${hue+120},100%,90%,${coreOpacity*0.7})`);
    grad.addColorStop(0.7, `hsla(${hue+240},80%,70%,${coreOpacity*0.4})`);
    grad.addColorStop(1, 'transparent');
    ctx.globalAlpha = coreOpacity;
    ctx.beginPath();
    ctx.arc(x, y, coreSize, 0, Math.PI*2);
    ctx.fillStyle = grad;
    ctx.fill();
    // 2. 多重空间波动环
    for(let i=0;i<32;i++){
        ctx.save();
        ctx.globalAlpha = 0.05*(1-progress)*(1-i*0.03);
        ctx.strokeStyle = `hsla(${hue+360},100%,95%,0.5)`;
        ctx.lineWidth = 2-i*0.05;
        ctx.beginPath();
        ctx.arc(x, y, coreSize*(1.5+i*0.5), 0, Math.PI*2);
        ctx.stroke();
        ctx.restore();
    }
    // 3. 超级奇点高频闪烁
    if(Math.random()<0.98){
        ctx.save();
        ctx.globalAlpha = 0.7+Math.random()*0.3;
        ctx.fillStyle = `hsla(${hue+480},100%,99%,1)`;
        ctx.beginPath();
        ctx.arc(x, y, 64+Math.random()*96, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
    }
    // 4. 星云消散粒子
    for(let i=0;i<256;i++){
        const angle = Math.PI*2*i/256 + Math.random()*0.2;
        const dist = coreSize*0.7 + Math.random()*coreSize*16.2;
        ctx.save();
        ctx.globalAlpha = 0.04+Math.random()*0.12;
        ctx.fillStyle = `hsla(${hue+240+Math.random()*480},100%,90%,0.8)`;
        ctx.beginPath();
        ctx.arc(x+Math.cos(angle)*dist, y+Math.sin(angle)*dist, 16+Math.random()*64, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
    }
    // 5. 空间撕裂光带
    for(let i=0;i<64;i++){
        ctx.save();
        ctx.globalAlpha = 0.01 + Math.random()*0.05;
        ctx.strokeStyle = `hsla(${hue+400},100%,98%,0.7)`;
        ctx.lineWidth = 1+Math.random()*2;
        ctx.beginPath();
        const angle = Math.random()*Math.PI*2;
        for(let r=coreSize*1.2;r<coreSize*24.8;r+=32){
            const off = Math.sin(r*0.08+progress*160+i)*96*(1-progress);
            ctx.lineTo(x+Math.cos(angle)*r+off, y+Math.sin(angle)*r+off);
        }
        ctx.stroke();
        ctx.restore();
    }
    // 6. 宇宙碎片流星
    for(let i=0;i<128;i++){
        ctx.save();
        ctx.globalAlpha = 0.01+Math.random()*0.08;
        ctx.strokeStyle = `hsla(${hue+360+Math.random()*480},100%,99%,0.8)`;
        ctx.lineWidth = 1+Math.random()*2;
        ctx.beginPath();
        const angle = Math.random()*Math.PI*2;
        ctx.moveTo(x+Math.cos(angle)*coreSize*1.2, y+Math.sin(angle)*coreSize*1.2);
        ctx.lineTo(x+Math.cos(angle)*coreSize*25.2, y+Math.sin(angle)*coreSize*25.2);
        ctx.stroke();
        ctx.restore();
    }
    // 7. 终极空间塌缩黑暗涌动
    let darkness = ctx.createRadialGradient(x, y, coreSize*2, x, y, coreSize*26.5);
    darkness.addColorStop(0, 'rgba(0,0,0,0)');
    darkness.addColorStop(0.2, 'rgba(0,0,0,0.1)');
    darkness.addColorStop(0.6, 'rgba(0,0,0,0.25)');
    darkness.addColorStop(1, 'rgba(0,0,0,0.98)');
    ctx.globalAlpha = 0.8 * (progress);
    ctx.beginPath();
    ctx.arc(x, y, coreSize*26.5, 0, Math.PI*2);
    ctx.fillStyle = darkness;
    ctx.fill();
    ctx.restore();
    // 持续动画
    requestAnimationFrame(()=>drawFinalFinalCollapseUniverse(x, y, size, startTime));
}

// 动画循环
function animate() {
    // 使用黑色半透明清除，创建拖尾效果
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvasZero.width, canvasZero.height);
    
    // 更新并绘制光晕
    activeGlows = activeGlows.filter(glow => {
        glow.update();
        glow.draw();
        return !glow.dissolved;
    });
    
    // 性能优化：粒子数量过多时降采样绘制
    let particleDrawStep = 1;
    if (particles.length > 1500) particleDrawStep = 2;
    if (particles.length > 2500) particleDrawStep = 3;
    let newParticles = [];
    for (let i = 0; i < particles.length; i += particleDrawStep) {
        const p = particles[i];
        const isActive = p.update();
        if (isActive) {
            p.draw();
            newParticles.push(p);
        }
    }
    particles = newParticles;
    
    // 更新并绘制特效
    let newEffects = [];
    for (let i = 0; i < effects.length; i++) {
        const effect = effects[i];
        let keep = false;
        switch (effect.type) {
            case 'starTrail':
                keep = drawStarTrail(effect); break;
            case 'warpBeam':
                keep = drawWarpBeam(effect); break;
            case 'ripple':
                keep = drawRipple(effect); break;
            case 'quantumFoam':
                keep = drawQuantumFoam(effect); break;
            case 'energyVortex':
                keep = drawEnergyVortex(effect); break;
            case 'darkMatterWave':
                keep = drawDarkMatterWave(effect); break;
            case 'quantumString':
                keep = drawQuantumString(effect); break;
            case 'spaceFracture':
                keep = drawSpaceFracture(effect); break;
            case 'gravitationalLens':
                keep = drawGravitationalLens(effect); break;
            case 'supernova':
                keep = drawSupernova(effect); break;
            case 'blackHole':
                keep = drawBlackHole(effect); break;
            case 'plasmaCloud':
                keep = drawPlasmaCloud(effect); break;
            case 'cosmicString':
                keep = drawCosmicString(effect); break;
            case 'nebula':
                keep = drawNebula(effect); break;
            case 'aurora':
                keep = drawAurora(effect); break;
            case 'collapse':
                keep = drawCollapseEffect(effect); break;
            default:
                keep = false;
        }
        if (keep) newEffects.push(effect);
    }
    effects = newEffects;
    
    animationId = requestAnimationFrame(animate);
}

// 启动动画
animate();

// 鼠标事件

//单击鼠标左键触发特效
document.addEventListener('click', (e) => {
    if (e.button === 0) {
        createWarpEffect(e.clientX, e.clientY);
    }
});
// 禁止右键菜单弹出
window.addEventListener('contextmenu', e => e.preventDefault());

// 触摸屏支持
document.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    createWarpEffect(touch.clientX, touch.clientY);
});

document.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    createWarpEffect(touch.clientX, touch.clientY);
});

 清理
window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(animationId);
});



cosmicRipple();
