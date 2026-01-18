/**
 * 设置页面逻辑 - settings.js
 * 处理设置页面的交互逻辑
 * 包括北斗号设置、数据发送间隔、开关设置等功能
 */

/**
 * 初始化设置页面
 */
function initSettingsPage() {
    console.log('初始化设置页面');
    
    // 绑定北斗号输入框事件
    bindBDClientIdEvents();
    
    // 绑定数据发送间隔选择事件
    bindDataIntervalEvents();
    
    // 绑定开关设置事件
    bindSwitchEvents();
    
    console.log('设置页面初始化完成');
}

/**
 * 绑定北斗号输入框事件
 */
function bindBDClientIdEvents() {
    var bdClientIdInput = document.getElementById('bd-client-id');
    if (bdClientIdInput) {
        // 输入完成时发送设置消息
        bdClientIdInput.onchange = function() {
            var bdId = this.value.trim();
            if (bdId) {
                window.setBDClientId(bdId);
            }
        };
        
        // 失去焦点时也发送设置消息
        bdClientIdInput.onblur = function() {
            var bdId = this.value.trim();
            if (bdId) {
                window.setBDClientId(bdId);
            }
        };
    }
}


/**
 * 绑定数据发送间隔选择事件
 */
function bindDataIntervalEvents() {
    // var dataIntervalSelect = document.getElementById('data-interval');
    // if (dataIntervalSelect) {
    //     dataIntervalSelect.onchange = function() {
    //         var interval = parseInt(this.value);
    //         if (interval) {
    //             window.setDataSendInterval(interval);
    //         }
    //     };
    // }
    var bdClientIdInput = document.getElementById('data-interval');
    if (bdClientIdInput) {
        // 输入完成时发送设置消息
        bdClientIdInput.onchange = function(evt) {
            console.log('输入完成',this.value,evt);
            var interval = this.value.trim();
            if (interval&&interval>30) {
                window.setDataSendInterval(interval);
            }
        };
        
        // 失去焦点时也发送设置消息
        bdClientIdInput.onblur = function(evt) {
            console.log('输入完成onblur',this.value,evt);
            var interval = this.value.trim();
            if (interval&&interval>30) {
                window.setDataSendInterval(interval);
            }
        };
    }
}

/**
 * 绑定开关设置事件
 */
function bindSwitchEvents() {
    // 频差开关
    var freqDiffSwitch = document.getElementById('freq-diff-switch');
    if (freqDiffSwitch) {
        freqDiffSwitch.onchange = function() {
            window.setFreqDiffSwitch(this.checked);
        };
    }
    
    // 测量带宽开关
    var measureBWSwitch = document.getElementById('measure-bw-switch');
    if (measureBWSwitch) {
        measureBWSwitch.onchange = function() {
            window.setMeasureBWSwitch(this.checked);
        };
    }
    
    // RBW开关
    var rbwSwitch = document.getElementById('rbw-switch');
    if (rbwSwitch) {
        rbwSwitch.onchange = function() {
            window.setRBWSwitch(this.checked);
        };
    }
    
    // FM频偏开关
    var fmDiffSwitch = document.getElementById('fm-diff-switch');
    if (fmDiffSwitch) {
        fmDiffSwitch.onchange = function() {
            window.setFMDiffSwitch(this.checked);
        };
    }
    
    // 占用度开关
    var occupySwitch = document.getElementById('occupy-switch');
    if (occupySwitch) {
        occupySwitch.onchange = function() {
            window.setOccupySwitch(this.checked);
        };
    }
}




/**
 * 更新设置页面显示
 * @param {string} bdClientId - 北斗终端号
 * @param {number} dataInterval - 数据发送间隔
 * @param {boolean} freqDiffEnabled - 频差开关状态
 * @param {boolean} measureBWEnabled - 测量带宽开关状态
 * @param {boolean} rbwEnabled - RBW开关状态
 * @param {boolean} fmDiffEnabled - FM频偏开关状态
 * @param {boolean} occupyEnabled - 占用度开关状态
 */
function updateSettingsDisplay(bdClientId, dataInterval, freqDiffEnabled, measureBWEnabled, rbwEnabled, fmDiffEnabled, occupyEnabled) {
    // 更新北斗终端号
    var bdClientIdInput = document.getElementById('bd-client-id');
    if (bdClientIdInput) {
        bdClientIdInput.value = bdClientId || '';
    }
    
    // 更新数据发送间隔
    var dataIntervalSelect = document.getElementById('data-interval');
    if (dataIntervalSelect) {
        dataIntervalSelect.value = dataInterval/1000 || 30;
        // 查找匹配的选项，如果没有匹配则使用第一个选项
        // var found = false;
        // var options = dataIntervalSelect.options;
        // for (var i = 0; i < options.length; i++) {
        //     if (parseInt(options[i].value) === dataInterval) {
        //         dataIntervalSelect.selectedIndex = i;
        //         found = true;
        //         break;
        //     }
        // }
        // // 如果没有找到匹配的选项，使用第一个选项
        // if (!found) {
        //     dataIntervalSelect.selectedIndex = 0;
        // }
    }
    
    // 更新频差开关
    var freqDiffSwitch = document.getElementById('freq-diff-switch');
    if (freqDiffSwitch) {
        freqDiffSwitch.checked = freqDiffEnabled;
    }
    
    // 更新测量带宽开关
    var measureBWSwitch = document.getElementById('measure-bw-switch');
    if (measureBWSwitch) {
        measureBWSwitch.checked = measureBWEnabled;
    }
    
    // 更新RBW开关
    var rbwSwitch = document.getElementById('rbw-switch');
    if (rbwSwitch) {
        rbwSwitch.checked = rbwEnabled;
    }
    
    // 更新FM频偏开关
    var fmDiffSwitch = document.getElementById('fm-diff-switch');
    if (fmDiffSwitch) {
        fmDiffSwitch.checked = fmDiffEnabled;
    }
    
    // 更新占用度开关
    var occupySwitch = document.getElementById('occupy-switch');
    if (occupySwitch) {
        occupySwitch.checked = occupyEnabled;
    }
    
    console.log('设置页面显示已更新');
}

/**
 * 页面加载完成后初始化设置页面
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSettingsPage);
} else {
    initSettingsPage();
}