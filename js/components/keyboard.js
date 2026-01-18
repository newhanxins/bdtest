/**
 * 自定义键盘组件 - keyboard.js
 * 用于IP地址和北斗号输入的虚拟键盘
 * 提供数字、小数点和删除功能
 * 禁止触发系统自带键盘输入法
 */

/**
 * 键盘状态管理对象
 */
var KeyboardState = {
    targetElement: null,      // 当前激活的输入框元素
    inputElement: null,         // 当前输入框元素
    currentValue: '',         // 当前输入值
    isActive: false,          // 键盘是否激活
    keyboardType: 'ip'        // 键盘类型 ('ip' 或 'bd')
};

/**
 * 初始化键盘组件
 */
function initKeyboard() {
    
    // 绑定IP输入框点击事件
    var ipInput = document.getElementById('ip-input');
    if (ipInput) {
        // 禁止系统键盘弹出
        ipInput.setAttribute('readonly', 'readonly');
        ipInput.onclick = function() {
            showKeyboard('ip', this);
        };
        
        // 防止键盘事件
        ipInput.onkeydown = function(e) {
            e.preventDefault();
            return false;
        };
        
        ipInput.onkeypress = function(e) {
            e.preventDefault();
            return false;
        };
        
        ipInput.oninput = function(e) {
            e.preventDefault();
            return false;
        };
    }
    
    // 绑定北斗号输入框点击事件
    var bdInput = document.getElementById('bd-client-id');
    if (bdInput) {
        // 禁止系统键盘弹出
        bdInput.setAttribute('readonly', 'readonly');
        bdInput.onclick = function() {
            showKeyboard('bd', this);
        };
        
        // 防止键盘事件
        bdInput.onkeydown = function(e) {
            e.preventDefault();
            return false;
        };
        
        bdInput.onkeypress = function(e) {
            e.preventDefault();
            return false;
        };
        
        bdInput.oninput = function(e) {
            e.preventDefault();
            return false;
        };
    }
    // 绑定时间输入框点击事件
    var numInput = document.getElementById('data-interval');
    if (numInput) {
        // 禁止系统键盘弹出
        numInput.setAttribute('readonly', 'readonly');
        numInput.onclick = function() {
            showKeyboard('num', this);
        };
        
        // 防止键盘事件
        numInput.onkeydown = function(e) {
            e.preventDefault();
            return false;
        };
        
        numInput.onkeypress = function(e) {
            e.preventDefault();
            return false;
        };
        
        numInput.oninput = function(e) {
            e.preventDefault();
            return false;
        };
    }
    // 绑定键盘容器点击事件
    var keyboardInput = document.getElementById('keyboard-input');
    if (keyboardInput) {
        // 禁止系统键盘弹出
        keyboardInput.setAttribute('readonly', 'readonly');
        keyboardInput.onclick = function() {
            // console.log('点击了键盘容器');
        };
        
        // 防止键盘事件
        keyboardInput.onkeydown = function(e) {
            e.preventDefault();
            return false;
        };
        
        keyboardInput.onkeypress = function(e) {
            e.preventDefault();
            return false;
        };
        
        keyboardInput.oninput = function(e) {
            e.preventDefault();
            return false;
        };
    }
    // 绑定关闭按钮事件
    var closeBtn = document.getElementById('close-btn');
    if (closeBtn) {
        closeBtn.onclick = hideKeyboard;
    }
    
    // 绑定确认按钮事件
    var confirmBtn = document.getElementById('confirm-btn');
    if (confirmBtn) {
        confirmBtn.onclick = confirmInput;
    }
    
    // 绑定数字按钮事件
    var numberButtons = document.querySelectorAll('.number-btn');
    for (var i = 0; i < numberButtons.length; i++) {
        numberButtons[i].onclick = handleKeyPress;
    }
    
    // 绑定退格按钮事件
    var backspaceBtn = document.getElementById('backspace-btn');
    if (backspaceBtn) {
        backspaceBtn.onclick = handleBackspace;
    }

    // 点击空白区域
    var keyboardContainer=document.getElementById('custom-keyboard');
    if(keyboardContainer){
        keyboardContainer.onclick = function(e) {
            if (e.target === keyboardContainer) {
                hideKeyboard();
            }
        };
    }
    console.log('键盘组件初始化完成');
}

/**
 * 显示键盘
 * @param {string} type - 键盘类型 ('ip' 或 'bd','num')
 * @param {HTMLElement} element - 目标输入框元素
 */
function showKeyboard(type, element,isAdd) {
    // 设置键盘类型和目标元素
    KeyboardState.keyboardType = type;
    KeyboardState.targetElement = element;
    KeyboardState.inputElement = document.getElementById('keyboard-input');
    if(KeyboardState.keyboardType === 'ip'&&validateIP(element.value)){
        KeyboardState.currentValue = element.value;
    }else if(KeyboardState.keyboardType === 'ip') {
        KeyboardState.currentValue = ''
    }else{
        KeyboardState.currentValue = element.value;
    }
    KeyboardState.isActive = true;
    // 设置输入框的值
    KeyboardState.inputElement.value=KeyboardState.currentValue
    // 显示键盘容器
    var keyboardContainer = document.getElementById('custom-keyboard');
    if (keyboardContainer) {
        keyboardContainer.style.display = 'block';
    }
    
    // 如果是IP键盘，确保小数点按钮可用
    var dotButton = document.querySelector('.dot-btn');
    var zeroButton = document.querySelector('.number-btn:nth-child(10)');
    if (type === 'ip') {
        zeroButton.classList.remove('flex3');
        if (dotButton) {
            dotButton.style.display = 'block';
        }
    }else{
        zeroButton.classList.add('flex3');
        dotButton.style.display = 'none';
        var dotButtons = document.querySelector('.number-btn:nth-child(11)')
    }
    
    console.log('显示键盘: ' + type);
}

/**
 * 隐藏键盘
 */
function hideKeyboard() {
    KeyboardState.isActive = false;
    KeyboardState.targetElement = null;
    KeyboardState.currentValue = '';
    
    var keyboardContainer = document.getElementById('custom-keyboard');
    if (keyboardContainer) {
        keyboardContainer.style.display = 'none';
    }
    
    console.log('隐藏键盘');
}

/**
 * 处理按键点击
 */
function handleKeyPress() {
    var key = this.textContent;
    console.log('按键点击: ' + key);
    // 根据键盘类型验证输入
    if (KeyboardState.keyboardType === 'ip') {
        // IP地址输入验证
        if (key === '.') {
            // 防止连续多个点号
            if (KeyboardState.currentValue.slice(-1) === '.') {
                return;
            }
            
            // 防止点号出现在开头
            if (KeyboardState.currentValue === '') {
                return;
            }
            
            // 防止连续的数字段超过3位
            var parts = KeyboardState.currentValue.split('.');
            var lastPart = parts[parts.length - 1];
            if (lastPart.length >= 3) {
                // 先添加点号，然后验证每一段是否有效
                var newValue = KeyboardState.currentValue + key;
                
                // 检查是否会导致无效IP段
                var testParts = newValue.split('.');
                if (testParts.length > 4) {
                    return; // 不允许超过4段
                }
                
                KeyboardState.currentValue = newValue;
            } else {
                KeyboardState.currentValue += key;
            }
        } else if (key === '删除') {
            // 删除键已经在handleBackspace中处理
            return;
        } else {
            // 数字输入验证
            var parts = KeyboardState.currentValue.split('.');
            var lastPart = parts[parts.length - 1];
            
            // 检查当前段是否已达到最大长度（3位）
            if (lastPart.length >= 3) {
                // 如果当前段已经以0开头并且长度为1，不允许继续输入
                if (lastPart === '0') {
                    // 替换最后一个字符
                    parts[parts.length - 1] = key;
                    KeyboardState.currentValue = parts.join('.');
                } else {
                    // 如果最后一段已经是3位数，不允许再添加数字
                    return;
                }
            } else {
                KeyboardState.currentValue += key;
            }
        }
    } else if (KeyboardState.keyboardType === 'bd') {
        // 北斗号输入验证（通常为数字）
        if (key !== '.') {
            // 北斗号一般只允许数字
            if (key !== '删除') {
                // 限制北斗号长度（例如最多11位）
                if (KeyboardState.currentValue.length < 11) {
                    KeyboardState.currentValue += key;
                }
            }
        }
    }else if (KeyboardState.keyboardType === 'num') {
        // 数字输入验证
        if (key !== '.'&&key !== '删除') {
            // 禁止输入多个小数点
            if (KeyboardState.currentValue.includes('.')) {
                return;
            }
            // 防止输入第一个数字为0
            if (KeyboardState.currentValue === '0') {
                return;
            }

            KeyboardState.currentValue += key;
        } else if (key === '删除') {
            // 删除键已经在handleBackspace中处理
        }
    }
    
    // // 更新输入框显示值（但不触发事件，避免干扰现有逻辑）
    // //增加确认时才能赋值目标元素
    // if (KeyboardState.targetElement) {
    //     KeyboardState.targetElement.value = KeyboardState.currentValue;
    // }
    if (KeyboardState.inputElement) {
        KeyboardState.inputElement.value = KeyboardState.currentValue;
    }
    console.log('按键输入: ' + key + ', 当前值: ' + KeyboardState.currentValue);
}

/**
 * 处理退格操作
 */
function handleBackspace() {
    if (KeyboardState.currentValue.length > 0) {
        KeyboardState.currentValue = KeyboardState.currentValue.slice(0, -1);
        
        // 更新输入框显示值
        if (KeyboardState.inputElement) {
            KeyboardState.inputElement.value = KeyboardState.currentValue;
        }
    }
}

/**
 * 确认输入
 */
function confirmInput() {
    // 尝试验证IP地址格式（如果是IP键盘）
    if (KeyboardState.keyboardType === 'ip') {
        if (validateIP(KeyboardState.currentValue)) {
            console.log('IP地址验证通过: ' + KeyboardState.currentValue);
            // 更新输入框显示值（但不触发事件，避免干扰现有逻辑）
            //增加确认时才能赋值目标元素
            if (KeyboardState.targetElement) {
                KeyboardState.targetElement.value = KeyboardState.currentValue;
            }
        } else {
            console.log('IP地址格式错误: ' + KeyboardState.currentValue);
            // 这里可以根据需要显示错误提示
            showWarn("IP地址格式错误",3000)
            return false;
        }
    }else if(KeyboardState.keyboardType === 'bd'){
        //增加确认时才能赋值目标元素
        if (KeyboardState.targetElement) {
            KeyboardState.targetElement.value = KeyboardState.currentValue;
            window.setBDClientId(KeyboardState.currentValue);
        }
    }else if(KeyboardState.keyboardType === 'num'){
        //增加确认时才能赋值目标元素
        if(KeyboardState.currentValue<30){
            showWarn("输入不能小于30",3000)
            return false;
        }
        if (KeyboardState.targetElement) {
            KeyboardState.targetElement.value = KeyboardState.currentValue;
            window.setDataSendInterval(KeyboardState.currentValue);
        }
    }
    
    // 隐藏键盘
    hideKeyboard();
    
    console.log('确认输入: ' + KeyboardState.currentValue);
}

/**
 * 验证IP地址格式
 * @param {string} ip - IP地址字符串
 * @returns {boolean} 是否为有效IP地址
 */
function validateIP(ip) {
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
 * 根据键盘类型获取允许的最大输入长度
 * @param {string} type - 键盘类型
 * @returns {number} 最大长度
 */
function getMaxInputLength(type) {
    if (type === 'bd') {
        return 11; // 北斗号最大长度
    }
    return 15; // IP地址最大长度 (255.255.255.255)
}

// 页面加载完成后初始化键盘组件
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initKeyboard);
} else {
    initKeyboard();
}