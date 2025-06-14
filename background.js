// 背景功能
document.addEventListener('DOMContentLoaded', () => {
    const customBackground = document.getElementById('custom-background');
    const backgroundFileInput = document.getElementById('backgroundFileInput');
    const backgroundBtn = document.getElementById('backgroundBtn');
    
    // 设置初始背景
    function setInitialBackground() {
        // 设置 meteor-sky-line-4.mp4 为初始背景视频
        const video = document.createElement('video');
        video.src = 'meteor-sky-line-4.mp4';
        video.alt = '默认背景';
        
        // 清除之前的背景并添加新背景
        while (customBackground.firstChild) {
            customBackground.removeChild(customBackground.firstChild);
        }
        
        // 使用视频背景设置函数
        setupVideoBackground(video);
        
        customBackground.appendChild(video);
        
        // 开始播放视频
        video.play().catch(e => {
            console.error('无法自动播放背景视频:', e);
            // 用户交互后再次尝试播放
            document.addEventListener('click', () => {
                video.play().catch(() => {});
            }, {once: true});
        });
        
        // 保存背景类型到本地存储
        localStorage.setItem('backgroundType', 'video');
    }

    // 检查图片宽高比并应用适当的样式
    function checkImageAspectRatio(img) {
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        
        // 如果图片是标准比例（不是太高或太宽），使用cover模式
        if (aspectRatio >= 0.7 && aspectRatio <= 1.8) {
            img.classList.add('normal-image');
        } else {
            img.classList.remove('normal-image');
            // 对于非标准比例，使用默认的contain模式
        }
        
        console.log(`背景图片宽高比: ${aspectRatio}，宽: ${img.naturalWidth}，高: ${img.naturalHeight}`);
    }

    // 设置初始背景
    setInitialBackground();
    
    // 当用户点击"自定义背景"按钮时，触发文件输入
    backgroundBtn.addEventListener('click', () => {
        backgroundFileInput.click();
    });
    
    // 实现无缝循环播放的增强版视频背景处理
    function setupVideoBackground(video) {
        // 主视频设置
        video.autoplay = true;
        video.loop = true;  // 原生循环属性
        video.muted = true;
        video.playsInline = true;
        video.setAttribute('playsinline', ''); // iOS支持
        video.setAttribute('webkit-playsinline', ''); // Safari旧版支持
        video.setAttribute('disablePictureInPicture', ''); // 禁用画中画
        video.setAttribute('controlsList', 'nodownload nofullscreen noremoteplayback'); // 禁用各种控件
        video.controls = false; // 隐藏控件
        video.disablePictureInPicture = true; // 禁用画中画
        video.disableRemotePlayback = true; // 禁用远程播放
        
        // 性能优化设置
        video.preload = 'auto'; // 预加载视频
        if (video.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"')) {
            video.type = 'video/mp4'; // 确保使用正确的解码器
        }
        
        // 强制以CSS类标识视频
        video.classList.add('bg-video-element');
        
        // 强力设置视频样式以确保铺满屏幕
        video.style.position = 'absolute';
        video.style.top = '50%';
        video.style.left = '50%';
        video.style.transform = 'translate(-50%, -50%) scale(1.05)'; 
        video.style.width = '100vw';
        video.style.height = '100vh';
        video.style.minWidth = '105vw'; // 超出视口宽度
        video.style.minHeight = '105vh'; // 超出视口高度
        video.style.objectFit = 'cover';
        video.style.objectPosition = 'center center';
        video.style.margin = '0';
        video.style.padding = '0';
        video.style.border = 'none';
        
        // 性能优化
        video.style.willChange = 'transform';
        video.style.backfaceVisibility = 'hidden';
        video.style.perspective = '1000px';
        video.style.transformStyle = 'preserve-3d';
        
        // 解决iOS上的问题
        if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
            video.style.width = 'calc(100vw + 2px)';
            video.style.transform = 'translate(-50%, -50%) scale(1.1)';
        }
        
        // 更可靠的循环处理方法 - 使用ended事件
        video.addEventListener('ended', function() {
            // 视频结束时立即重置到开头并重新播放
            video.currentTime = 0;
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log('视频自动循环播放失败:', error);
                    // 300毫秒后再次尝试播放
                    setTimeout(() => {
                        video.play().catch(() => {});
                    }, 300);
                });
            }
        }, false);
        
        // 备份循环机制 - 使用timeupdate检测接近结束
        video.addEventListener('timeupdate', function() {
            if (video.duration > 0 && video.currentTime >= video.duration - 0.2) {
                // 请求动画帧以确保平滑过渡
                requestAnimationFrame(() => {
                    // 平滑重置到开头
                    video.currentTime = 0;
                });
            }
        });
        
        // 视频加载后处理
        video.addEventListener('loadeddata', () => {
            video.classList.add('loaded');
            applyStrongVideoStyles(video);
        });
        
        // 确保视频播放
        video.play().catch(e => {
            console.error('无法播放背景视频:', e);
            // 多次尝试播放，提高成功率
            setTimeout(() => video.play().catch(() => {}), 500);
            setTimeout(() => video.play().catch(() => {}), 1000);
            setTimeout(() => video.play().catch(() => {}), 2000);
            
            // 用户交互后尝试播放
            document.addEventListener('click', function startVideoOnUserInteraction() {
                video.play().catch(() => {});
                document.removeEventListener('click', startVideoOnUserInteraction);
            }, {once: true});
        });
        
        // 监听播放状态
        video.addEventListener('playing', () => {
            applyStrongVideoStyles(video);
            
            if (window.innerWidth < 768) {
                video.style.filter = 'blur(1px)';
            }
        });
        
        // 视频卡顿检测和修复
        let lastTime = 0;
        let stuckCounter = 0;
        let lastFrameTime = performance.now();
        
        // 使用requestAnimationFrame实现更高效的卡顿检测
        function checkVideoSmooth() {
            const now = performance.now();
            const timeDelta = now - lastFrameTime;
            lastFrameTime = now;
            
            // 检测视频是否卡顿
            if (video.currentTime === lastTime && !video.paused) {
                stuckCounter++;
                if (stuckCounter > 3) {  // 降低门槛，更快响应卡顿
                    console.log('检测到视频卡顿，应用修复');
                    
                    // 尝试调整播放速度略微加速通过卡顿点
                    const currentTime = video.currentTime;
                    video.playbackRate = 1.05; // 稍微加速
                    
                    // 短暂加速后恢复正常速度
                    setTimeout(() => {
                        video.playbackRate = 1.0;
                    }, 500);
                    
                    stuckCounter = 0;
                }
            } else {
                stuckCounter = 0;
                lastTime = video.currentTime;
            }
            
            // 每帧检查一次卡顿状态
            requestAnimationFrame(checkVideoSmooth);
        }
        
        // 启动卡顿检测
        requestAnimationFrame(checkVideoSmooth);
        
        return video;
    }
    
    // 强力应用视频样式的辅助函数
    function applyStrongVideoStyles(video) {
        video.style.objectFit = 'cover';
        video.style.width = '100vw';
        video.style.height = '100vh';
        video.style.minWidth = '105vw';
        video.style.minHeight = '105vh';
        video.style.transform = 'translate(-50%, -50%) scale(1.05)';
    }
    
    // 当用户选择文件时，更换背景
    backgroundFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        
        if (file) {
            const fileType = file.type;
            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
            const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
            
            const fileUrl = URL.createObjectURL(file);
            
            // 清除当前背景
            while (customBackground.firstChild) {
                customBackground.removeChild(customBackground.firstChild);
            }
            
            // 添加加载中的提示
            const loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'loading-indicator';
            loadingIndicator.innerHTML = '正在加载背景...';
            loadingIndicator.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; background: rgba(0,0,0,0.5); padding: 10px; border-radius: 5px;';
            customBackground.appendChild(loadingIndicator);
            
            if (validImageTypes.includes(fileType)) {
                // 如果是图片
                const img = document.createElement('img');
                img.src = fileUrl;
                img.alt = '自定义背景';
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.5s ease';
                
                img.addEventListener('load', () => {
                    // 移除加载提示
                    if (loadingIndicator.parentNode) {
                        loadingIndicator.parentNode.removeChild(loadingIndicator);
                    }
                    
                    // 检查图片宽高比
                    checkImageAspectRatio(img);
                    
                    img.style.opacity = '1';
                });
                
                img.addEventListener('error', () => {
                    console.error('背景图片加载失败');
                    setInitialBackground();
                });
                
                customBackground.appendChild(img);
                
            } else if (validVideoTypes.includes(fileType)) {
                // 如果是视频
                const video = document.createElement('video');
                video.src = fileUrl;
                video.style.opacity = '0';
                video.style.transition = 'opacity 0.5s ease';
                
                // 超强力设置内联样式确保视频铺满整个屏幕
                video.style.position = 'absolute';
                video.style.top = '50%';
                video.style.left = '50%';
                video.style.transform = 'translate(-50%, -50%) scale(1.05)'; // 超级重要：放大视频
                video.style.width = '100vw';
                video.style.height = '100vh';
                video.style.minWidth = '105vw'; // 超出视口宽度
                video.style.minHeight = '105vh'; // 超出视口高度
                video.style.objectFit = 'cover !important';
                video.style.objectPosition = 'center center';
                video.style.margin = '0';
                video.style.padding = '0';
                video.style.border = 'none';
                
                // 设置视频背景
                setupVideoBackground(video);
                
                // 视频可以播放时
                video.addEventListener('canplay', () => {
                    // 移除加载提示
                    if (loadingIndicator.parentNode) {
                        loadingIndicator.parentNode.removeChild(loadingIndicator);
                    }
                    video.style.opacity = '1';
                    
                    // 再次应用强力样式以确保填满屏幕
                    applyStrongVideoStyles(video);
                });
                
                video.addEventListener('error', () => {
                    console.error('背景视频加载失败');
                    setInitialBackground();
                });
                
                customBackground.appendChild(video);
                
            } else {
                alert('不支持的文件类型。请选择图片或视频文件。');
                setInitialBackground(); // 重置回默认背景
                return;
            }
            
            // 保存用户选择的背景类型到本地存储
            localStorage.setItem('backgroundType', fileType.startsWith('image') ? 'image' : 'video');
            
            // 为了避免内存泄露，当页面关闭时释放URL
            window.addEventListener('beforeunload', () => {
                URL.revokeObjectURL(fileUrl);
            });
        }
    });
    
    // 窗口大小变化时优化背景
    window.addEventListener('resize', () => {
        const videoBackground = customBackground.querySelector('video');
        if (videoBackground) {
            // 强力应用视频样式以确保填满屏幕
            videoBackground.style.position = 'absolute';
            videoBackground.style.top = '50%';
            videoBackground.style.left = '50%';
            videoBackground.style.transform = 'translate(-50%, -50%) scale(1.05)'; // 超级重要：放大视频
            videoBackground.style.width = '100vw';
            videoBackground.style.height = '100vh';
            videoBackground.style.minWidth = '105vw'; // 超出视口宽度
            videoBackground.style.minHeight = '105vh'; // 超出视口高度
            videoBackground.style.objectFit = 'cover';
            videoBackground.style.objectPosition = 'center center';
            videoBackground.style.margin = '0';
            videoBackground.style.padding = '0';
            
            // 修复iOS和某些浏览器上的问题
            if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
                videoBackground.style.width = 'calc(100vw + 2px)'; // 额外添加2px解决iOS的边距问题
                videoBackground.style.transform = 'translate(-50%, -50%) scale(1.1)'; // iOS需要额外放大
            }
            
            // 移动设备上轻微模糊以提高性能
            if (window.innerWidth < 768) {
                videoBackground.style.filter = 'blur(1px)';
            } else {
                videoBackground.style.filter = 'none';
            }
            
            // 强制刷新视频样式（有时浏览器会忽略样式更新）
            setTimeout(() => {
                applyStrongVideoStyles(videoBackground);
            }, 50);
        }
        
        // 重新检查图片宽高比
        const imgBackground = customBackground.querySelector('img');
        if (imgBackground) {
            checkImageAspectRatio(imgBackground);
        }
    });
    
    // 添加强制性视频大小监控，确保视频始终铺满整个屏幕
    function monitorVideoSize() {
        const videoBackground = customBackground.querySelector('video');
        if (videoBackground) {
            // 检查视频尺寸是否正确
            const rect = videoBackground.getBoundingClientRect();
            const hasCorrectSize = (rect.width >= window.innerWidth && rect.height >= window.innerHeight);
            
            if (!hasCorrectSize) {
                console.log('检测到视频尺寸异常，重新应用样式');
                // 强力应用样式
                videoBackground.style.position = 'absolute';
                videoBackground.style.top = '50%';
                videoBackground.style.left = '50%';
                videoBackground.style.transform = 'translate(-50%, -50%) scale(1.1)'; // 放大更多
                videoBackground.style.width = '105vw';
                videoBackground.style.height = '105vh';
                videoBackground.style.minWidth = '105vw';
                videoBackground.style.minHeight = '105vh';
                videoBackground.style.objectFit = 'cover';
                videoBackground.style.objectPosition = 'center center';
            }
            
            // 检查并修复暂停问题
            if (videoBackground.paused && !videoBackground.ended) {
                console.log('检测到视频已暂停，尝试重新播放');
                videoBackground.play().catch(() => {});
            }
        }
        
        // 每100ms检查一次
        setTimeout(monitorVideoSize, 100);
    }
    
    // 启动视频大小监控
    setTimeout(monitorVideoSize, 500);
    
    // 定期检查视频状态并处理循环问题
    setInterval(() => {
        const videoBackground = customBackground.querySelector('video');
        if (videoBackground) {
            // 检查视频是否接近结束但没有正确循环
            if (videoBackground.duration > 0 && 
                videoBackground.currentTime > videoBackground.duration - 0.3 && 
                !videoBackground.paused) {
                console.log('视频接近结束，确保循环播放');
                // 重置到开头
                videoBackground.currentTime = 0;
            }
            
            // 如果视频已暂停但应该在播放中
            if (videoBackground.paused && !document.hidden) {
                console.log('检测到视频已暂停，重新启动');
                videoBackground.play().catch(() => {});
            }
        }
    }, 1000);
    
    // 页面可见性变化时处理
    document.addEventListener('visibilitychange', () => {
        const videoBackground = customBackground.querySelector('video');
        if (videoBackground) {
            if (!document.hidden) {
                // 页面重新可见时，确保视频播放
                videoBackground.play().catch(() => {});
            }
        }
    });
});
