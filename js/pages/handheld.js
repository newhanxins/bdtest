/**
 * 手持数据页面逻辑 - handheld.js
 * 处理手持数据页面的交互逻辑
 * 包括连接管理、数据显示控制等功能
 */

/**
 * 初始化手持数据页面
 */
function initHandheldPage() {
    console.log('初始化手持数据页面');
    
    // 绑定连接按钮事件
    var connectBtn = document.getElementById('connect-btn');
    if (connectBtn) {
        connectBtn.onclick = handleConnectBtnClick;
    }
    // 绑定数据清除按钮事件
    var clearBtn = document.getElementById('clear-handheld');
    if (clearBtn) {
        clearBtn.onclick = handleClearBtnClick;
    }
    // 绑定复选框事件
    bindHandCheckboxEvents();
    
    // 初始化连接状态
    updateConnectionStatus(window.connectionStatus || false);
    
    // 初始化设备号显示
    updateDeviceNumber(window.deviceNumber || '');
    
    console.log('手持数据页面初始化完成');
}

/**
 * 处理连接按钮点击事件
 */
function handleConnectBtnClick() {
    var ipInput = document.getElementById('ip-input');
    var connectBtn = document.getElementById('connect-btn');
    
    if (!ipInput) {
        console.error('找不到IP输入框');
        return;
    }
    
    var ip = ipInput.value.trim();
    
    // 验证IP地址格式
    if (!validateIP(ip)) {
        showError('请输入有效的IP地址',3000);
        return;
    }
    
    // 检查当前连接状态
    var isConnected = connectBtn.textContent === '断开连接';
    
    if (isConnected) {
        // 断开连接
        window.requestConnectDevice(false, ip);
    } else {
        // 连接设备
        window.requestConnectDevice(true, ip);
    }
}
function handleClearBtnClick() {
    window.onClearDataList(true, false)
}
/**
 * 验证IP地址格式
 * @param {string} ip - IP地址字符串
 * @returns {boolean} 是否为有效IP地址
 */
function validateIP(ip) {
    if (!ip) {
        return false;
    }
    
    // IP地址格式正则表达式
    var ipRegex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    var match = ip.match(ipRegex);
    
    if (!match) {
        return false;
    }
    
    // 验证每个部分是否在0-255范围内
    for (var i = 1; i <= 4; i++) {
        var part = parseInt(match[i]);
        if (part < 0 || part > 255) {
            return false;
        }
        
        // 检查是否有前导零（除了单独的0）
        if (match[i].length > 1 && match[i][0] === '0') {
            return false;
        }
    }
    
    return true;
}

/**
 * 绑定复选框事件
 */
function bindHandCheckboxEvents() {
    // 轨迹复选框
    console.log('绑定轨迹复选框事件');
    var routeCheckbox = document.getElementById('show-route');
    if (routeCheckbox) {
        routeCheckbox.onchange = function() {
            window.toggleDataCardsVisibility('handheld', 'route');
        };
    }
    
    // 测向线复选框
    var dfCheckbox = document.getElementById('show-df');
    if (dfCheckbox) {
        dfCheckbox.onchange = function() {
            window.toggleDataCardsVisibility('handheld', 'df');
        };
    }
    
    // 频谱参数复选框
    var spectrumCheckbox = document.getElementById('show-spectrum');
    if (spectrumCheckbox) {
        spectrumCheckbox.onchange = function() {
            window.toggleDataCardsVisibility('handheld', 'spectrum');
        };
    }
}

/**
 * 更新连接状态显示
 * @param {boolean} isConnected - 连接状态
 */
function updateConnectionStatus(isConnected) {
    // 更新连接状态图标
    var statusIcon = document.getElementById('connect-status-icon');
    if (statusIcon) {
        statusIcon.className = 'status-icon';
        if (isConnected) {
            statusIcon.classList.add('connected');
            statusIcon.title = '已连接';
        } else {
            statusIcon.classList.add('disconnected');
            statusIcon.title = '未连接';
        }
    }
    
    // 更新连接按钮文本
    var connectBtn = document.getElementById('connect-btn');
    if (connectBtn) {
        connectBtn.textContent = isConnected ? '断开连接' : '连接设备';
    }
    
    console.log('连接状态更新为: ' + (isConnected ? '已连接' : '未连接'));
}

/**
 * 更新设备号显示
 * @param {string} deviceNumber - 设备号
 */
function updateDeviceNumber(deviceNumber) {
    var deviceNumberSpan = document.getElementById('device-number');
    if (deviceNumberSpan) {
        deviceNumberSpan.textContent = deviceNumber || '--';
    }
    
    console.log('设备号更新为: ' + deviceNumber);
}

/**
 * 更新数据统计显示
 * @param {number} total - 总数据量
 * @param {number} routeCount - 轨迹数据量
 * @param {number} dfCount - 测向线数据量
 * @param {number} spectrumCount - 频谱参数数据量
 */
function updateDataSummary(total, routeCount, dfCount, spectrumCount) {
    // 更新总数据量
    var totalEl = document.getElementById('total-data-count');
    if (totalEl) {
        totalEl.textContent = total;
    }
    
    // 更新轨迹数据量
    var routeEl = document.getElementById('route-data-count');
    if (routeEl) {
        routeEl.textContent = routeCount;
    }
    
    // 更新测向线数据量
    var dfEl = document.getElementById('df-data-count');
    if (dfEl) {
        dfEl.textContent = dfCount;
    }
    
    // 更新频谱参数数据量
    var spectrumEl = document.getElementById('spectrum-data-count');
    if (spectrumEl) {
        spectrumEl.textContent = spectrumCount;
    }
    
    console.log('数据统计更新 - 总计: ' + total + ', 轨迹: ' + routeCount + ', 测向: ' + dfCount + ', 频谱: ' + spectrumCount);
}

/**
 * 页面加载完成后初始化手持数据页面
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHandheldPage);
} else {
    initHandheldPage();
}