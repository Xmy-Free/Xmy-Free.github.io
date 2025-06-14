// 第一次点击自动全屏
document.addEventListener('click', function () {
    var elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
}, { once: true }); // 使用 { once: true } 确保只在第一次点击时触发







// 长按鼠标中键，跳转到index.html主页
let middleClickTimer = null;
const longPressTime = 1000; // 1秒长按

document.addEventListener('mousedown', function(event) {
    // 检查是否是鼠标中键 (按键代码 1 代表鼠标中键)
    if (event.button === 1) {
        middleClickTimer = setTimeout(function() {
            // 长按超过1秒，跳转到index.html
            window.location.href = 'wandering-earth.html';
        }, longPressTime);
    }
});

document.addEventListener('mouseup', function(event) {
    // 鼠标释放时清除定时器
    if (event.button === 1 && middleClickTimer) {
        clearTimeout(middleClickTimer);
        middleClickTimer = null;
    }
});

document.addEventListener('mouseleave', function() {
    // 鼠标离开页面时清除定时器，防止意外触发
    if (middleClickTimer) {
        clearTimeout(middleClickTimer);
        middleClickTimer = null;
    }
});







// 阻止鼠标右键菜单出现
document.addEventListener('contextmenu', function(event) {
    // 阻止默认的右键菜单
    event.preventDefault();
    return false;
});







