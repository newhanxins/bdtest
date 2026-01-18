/**
 * 提示信息组件 - notification.js
 * 用于显示各种类型的提示信息
 * 包括 info、warn、error、success 等类型
 */

/**
 * 提示信息类型枚举
 */
var NotificationTypes = {
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error',
    SUCCESS: 'success'
};

/**
 * 提示信息配置
 */
var NotificationConfig = {
    DEFAULT_DURATION: 3000,  // 默认显示时间（毫秒）
    MAX_NOTIFICATIONS: 5,     // 最大同时显示数量
    ANIMATION_DURATION: 300   // 动画持续时间（毫秒）
};

/**
 * 提示信息队列
 */
var notificationQueue = [];

/**
 * 显示提示信息
 * @param {string} message - 提示信息内容
 * @param {string} type - 提示类型 (info, warn, error, success)
 * @param {number} duration - 显示时长（毫秒），0表示永久显示
 * @param {Function} onClose - 关闭回调函数
 * @returns {Object} 返回提示信息对象，包含remove方法
 */
function showNotification(message, type, duration, onClose) {
    // 参数验证
    if (!message) {
        console.warn('提示信息内容不能为空');
        return null;
    }
    
    type = type || NotificationTypes.INFO;
    duration = duration !== undefined ? duration : NotificationConfig.DEFAULT_DURATION;
    
    // 验证类型
    var validTypes = [NotificationTypes.INFO, NotificationTypes.WARN, NotificationTypes.ERROR, NotificationTypes.SUCCESS];
    var isValidType = false;
    for (var i = 0; i < validTypes.length; i++) {
        if (validTypes[i] === type) {
            isValidType = true;
            break;
        }
    }
    if (!isValidType) {
        console.warn('无效的提示类型:', type);
        type = NotificationTypes.INFO;
    }
    
    // 创建提示信息容器（如果不存在）
    var container = document.getElementById('notification-container');
    if (!container) {
        container = createNotificationContainer();
    }
    
    // 检查是否达到最大显示数量
    var existingNotifications = container.querySelectorAll('.notification-item');
    if (existingNotifications.length >= NotificationConfig.MAX_NOTIFICATIONS) {
        // 移除最早的提示信息
        var oldestNotification = existingNotifications[0];
        removeNotificationElement(oldestNotification);
    }
    
    // 创建提示信息元素
    var notificationElement = createNotificationElement(message, type, duration, onClose);
    
    // 添加到容器
    container.appendChild(notificationElement);
    
    // 触发动画
    setTimeout(function() {
        notificationElement.className += ' show';
    }, 10);
    
    // 设置自动移除定时器
    var notificationObj = {
        element: notificationElement,
        timer: null,
        remove: function() {
            removeNotification(notificationElement, onClose);
        }
    };
    
    if (duration > 0) {
        notificationObj.timer = setTimeout(function() {
            removeNotification(notificationElement, onClose);
        }, duration);
    }
    
    return notificationObj;
}

/**
 * 创建提示信息容器
 * @returns {HTMLElement} 提示信息容器元素
 */
function createNotificationContainer() {
    var container = document.createElement('div');
    container.id = 'notification-container';
    container.className = 'notification-container';
    
    // 添加样式
    var style = document.createElement('style');
    style.type = 'text/css';
    var animationDuration = NotificationConfig.ANIMATION_DURATION;
    style.textContent = '.notification-container {' +
                        'position: fixed;' +
                        'top: 70px;' +
                        'left: 50%;' +
                        'transform: translateX(-50%);' +
                        'max-width: 400px;' +
                        'min-width: 280px;' +
                        '}' +
                        '.notification-item {' +
                        'position: relative;' +
                        'margin-bottom: 10px;' +
                        'padding: 12px 16px;' +
                        'border-radius: 6px;' +
                        'box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);' +
                        'opacity: 0;' +
                        'transform: translateY(-50%) scale(0.8);' +
                        'transition: all ' + animationDuration + 'ms ease-in-out;' +
                        'color: #fff;' +
                        'font-size: 14px;' +
                        'line-height: 1.4;' +
                        'word-wrap: break-word;' +
                        'text-align: center;' +
                        '}' +
                        '.notification-item.show {' +
                        'opacity: 1;' +
                        'transform: translateY(0) scale(1);' +
                        '}' +
                        '.notification-item.info {' +
                        'background-color: #2196F3;' +
                        '}' +
                        '.notification-item.warn {' +
                        'background-color: #FF9800;' +
                        '}' +
                        '.notification-item.error {' +
                        'background-color: #F44336;' +
                        '}' +
                        '.notification-item.success {' +
                        'background-color: #4CAF50;' +
                        '}' +
                        '.notification-close {' +
                        'position: absolute;' +
                        'top: 8px;' +
                        'right: 8px;' +
                        'width: 20px;' +
                        'height: 20px;' +
                        'background: none;' +
                        'border: none;' +
                        'color: #fff;' +
                        'font-size: 18px;' +
                        'cursor: pointer;' +
                        'padding: 0;' +
                        'opacity: 0.8;' +
                        '}' +
                        '.notification-close:hover {' +
                        'opacity: 1;' +
                        '}' +
                        '.notification-icon {' +
                        'margin-right: 8px;' +
                        'font-weight: bold;' +
                        '}';
    document.head.appendChild(style);
    
    document.body.appendChild(container);
    return container;
}

/**
 * 创建提示信息元素
 * @param {string} message - 提示信息内容
 * @param {string} type - 提示类型
 * @param {number} duration - 显示时长
 * @param {Function} onClose - 关闭回调
 * @returns {HTMLElement} 提示信息元素
 */
function createNotificationElement(message, type, duration, onClose) {
    var element = document.createElement('div');
    element.className = 'notification-item ' + type;
    
    // 添加图标
    var icon = getNotificationIcon(type);
    element.innerHTML = '<span class="notification-icon">' + icon + '</span>' +
                       '<span class="notification-message">' + message + '</span>' +
                       '<button class="notification-close">&times;</button>';
    
    // 绑定关闭按钮事件
    var closeButton = element.querySelector('.notification-close');
    var self = this; // 保存当前上下文
    closeButton.onclick = function() {
        removeNotification(element, onClose);
    };
    
    return element;
}

/**
 * 获取提示类型对应的图标
 * @param {string} type - 提示类型
 * @returns {string} 图标字符
 */
function getNotificationIcon(type) {
    switch (type) {
        case NotificationTypes.INFO:
            return 'ℹ️';
        case NotificationTypes.WARN:
            return '⚠️';
        case NotificationTypes.ERROR:
            return '❌';
        case NotificationTypes.SUCCESS:
            return '✅';
        default:
            return 'ℹ️';
    }
}

/**
 * 移除提示信息
 * @param {HTMLElement} element - 提示信息元素
 * @param {Function} onClose - 关闭回调函数
 */
function removeNotification(element, onClose) {
    // 触发移除动画
    var classes = element.className.split(' ');
    var newClasses = [];
    for (var i = 0; i < classes.length; i++) {
        if (classes[i] !== 'show') {
            newClasses.push(classes[i]);
        }
    }
    element.className = newClasses.join(' ');
    
    // 动画结束后真正移除元素
    setTimeout(function() {
        removeNotificationElement(element);
        
        // 执行关闭回调
        if (onClose && typeof onClose === 'function') {
            onClose();
        }
    }, NotificationConfig.ANIMATION_DURATION);
}

/**
 * 从DOM中移除提示信息元素
 * @param {HTMLElement} element - 提示信息元素
 */
function removeNotificationElement(element) {
    if (element && element.parentNode) {
        element.parentNode.removeChild(element);
    }
}

/**
 * 显示信息提示
 * @param {string} message - 提示信息内容
 * @param {number} duration - 显示时长（毫秒）
 * @param {Function} onClose - 关闭回调函数
 */
function showInfo(message, duration, onClose) {
    return showNotification(message, NotificationTypes.INFO, duration, onClose);
}

/**
 * 显示警告提示
 * @param {string} message - 提示信息内容
 * @param {number} duration - 显示时长（毫秒）
 * @param {Function} onClose - 关闭回调函数
 */
function showWarn(message, duration, onClose) {
    return showNotification(message, NotificationTypes.WARN, duration, onClose);
}

/**
 * 显示错误提示
 * @param {string} message - 提示信息内容
 * @param {number} duration - 显示时长（毫秒）
 * @param {Function} onClose - 关闭回调函数
 */
function showError(message, duration, onClose) {
    return showNotification(message, NotificationTypes.ERROR, duration, onClose);
}

/**
 * 显示成功提示
 * @param {string} message - 提示信息内容
 * @param {number} duration - 显示时长（毫秒）
 * @param {Function} onClose - 关闭回调函数
 */
function showSuccess(message, duration, onClose) {
    return showNotification(message, NotificationTypes.SUCCESS, duration, onClose);
}

/**
 * 清空所有提示信息
 */
function clearAllNotifications() {
    var container = document.getElementById('notification-container');
    if (container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }
}

// 导出函数到全局作用域
window.showNotification = showNotification;
window.showInfo = showInfo;
window.showWarn = showWarn;
window.showError = showError;
window.showSuccess = showSuccess;
window.clearAllNotifications = clearAllNotifications;

console.log('提示信息组件已加载');