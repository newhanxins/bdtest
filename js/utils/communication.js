/**
 * 通信工具函数 - communication.js
 * 用于处理与C++后端的JSON数据交互
 * 实现各种data_type的消息发送和接收处理
 */

// 全局变量，存储设备连接状态和设备号
var connectionStatus = false;
var deviceNumber = '';

/**
 * 发送消息到C++后端
 * @param {Object} message - 要发送的消息对象
 */
function sendMessageToCpp(message) {
    // 检查是否在QML环境中
    if (typeof window.qt !== 'undefined') {
        // 通过QML的webChannel发送消息
        // window.qt.webChannelTransport.send(JSON.stringify(message));
        var sendMessage=message
        // 判断是否字符串
        if (typeof message==='object'){
            sendMessage=JSON.stringify(message)
        }
        console.log('发送消息到C++:', sendMessage);
        bridge.recvDataFromWebFun(sendMessage)
    } else {
        // 开发环境下模拟发送
        console.log('qt通信桥创建失败++:', message);
        // simulateConnectionResponse(message)
        
    }
}



/**
 * 处理从C++后端接收的消息
 * @param {string|Object} messageData - 接收到的消息数据
 */
function handleReceivedMessage(messageData) {
    // 如果是字符串，则解析为JSON对象
    var message = typeof messageData === 'string' ? JSON.parse(messageData) : messageData;
    console.log('收到后端数据消息:', message);
    // 根据data_type处理不同类型的消息
    switch (message.data_type) {
        case 1: // 地图创建成功
            onMapCreated();
            break;
        case 3: // 连接状态设置
            onConnectionStatusUpdate(message.connect_300_status_update);
            break;
            
        case 11: // 手持设备号更新
            onDeviceNumberUpdate(message.dz_number);
            break;
            
        case 100: // 添加手持轨迹数据
            onAddHandheldRouteData(message.route_data);
            break;
            
        case 101: // 添加手持测向数据
            onAddHandheldDFData(message.df_data);
            break;
            
        case 102: // 添加手持频谱参数数据
            onAddHandheldSpectrumData(message.trace_param);
            break;
            
        case 103: // 添加北斗轨迹数据
            onAddBDRouteData(message.route_data);
            break;
            
        case 104: // 添加北斗测向数据
            onAddBDDFData(message.df_data);
            break;
            
        case 105: // 添加北斗频谱参数数据
            onAddBDSpectrumData(message.trace_param);
            break;
            
        case 200: // 清空数据列表
            // onClearDataList(message.clear_dz_datalist, message.clear_bd_datalist);
            break;
        case 201://设置状态
            onSetStatus(message);
        default:
            console.log('未知的消息类型:', message.data_type);
    }
}

/**
 * 地图创建成功回调
 */
function onMapCreated() {
    console.log('地图创建成功');
    // 可以在这里执行地图初始化完成后的操作
}

/**
 * 连接状态更新回调
 * @param {boolean} isConnected - 连接状态
 */
function onConnectionStatusUpdate(isConnected) {
    connectionStatus = isConnected;
    // 更新UI中的连接状态图标
    var statusIcon = document.getElementById('connect-status-icon');
    if (statusIcon) {
        statusIcon.className = 'status-icon';
        if (isConnected) {
            statusIcon.classList.add('connected');
            statusIcon.title = '已连接';
            // 保存连接ip
            var connectIp = document.getElementById('ip-input');
            localStorage.setItem('connectIp', connectIp.value);
            showSuccess("连接成功")
            getSettingStatus();//获取设置状态
        } else {
            statusIcon.classList.add('disconnected');
            statusIcon.title = '未连接';
            showWarn("连接断开")
        }
    }
    
    // 更新连接按钮文本
    var connectBtn = document.getElementById('connect-btn');
    if (connectBtn) {
        connectBtn.textContent = isConnected ? '断开连接' : '连接设备';
    }
    
    console.log('连接状态更新:', isConnected ? '已连接' : '已断开');
}

/**
 * 设备号更新回调
 * @param {string} deviceNum - 设备号
 */
function onDeviceNumberUpdate(deviceNum) {
    deviceNumber = deviceNum;
    
    // 更新UI中的设备号显示
    var deviceNumberSpan = document.getElementById('device-number');
    if (deviceNumberSpan) {
        deviceNumberSpan.textContent = deviceNum || '--';
    }
    
    console.log('设备号更新:', deviceNum);
}

/**
 * 添加手持轨迹数据回调
 * @param {Object} routeData - 轨迹数据
 */
function onAddHandheldRouteData(routeData) {
    // console.log('收到手持轨迹数据:', routeData);
    
    // 创建数据卡片并添加到手持数据列表
    createAndAppendDataCard('handheld', 'route', routeData);
    
    // 更新数据统计
    updateDataCount('handheld', 'route');
}

/**
 * 添加手持测向数据回调
 * @param {Object} dfData - 测向数据
 */
function onAddHandheldDFData(dfData) {
    // console.log('收到手持测向数据:', dfData);
    
    // 创建数据卡片并添加到手持数据列表
    createAndAppendDataCard('handheld', 'df', dfData);
    
    // 更新数据统计
    updateDataCount('handheld', 'df');
}

/**
 * 添加手持频谱参数数据回调
 * @param {Object} spectrumData - 频谱参数数据
 */
function onAddHandheldSpectrumData(spectrumData) {
    // console.log('收到手持频谱参数数据:', spectrumData);
    
    // 创建数据卡片并添加到手持数据列表
    createAndAppendDataCard('handheld', 'spectrum', spectrumData);
    
    // 更新数据统计
    updateDataCount('handheld', 'spectrum');
}

/**
 * 添加北斗轨迹数据回调
 * @param {Object} routeData - 轨迹数据
 */
function onAddBDRouteData(routeData) {
    // console.log('收到北斗轨迹数据:', routeData);
    
    // 创建数据卡片并添加到回传数据列表
    createAndAppendDataCard('backtransmission', 'route', routeData);
    
    // 更新数据统计
    updateDataCount('backtransmission', 'route');
}

/**
 * 添加北斗测向数据回调
 * @param {Object} dfData - 测向数据
 */
function onAddBDDFData(dfData) {
    // console.log('收到北斗测向数据:', dfData);
    
    // 创建数据卡片并添加到回传数据列表
    createAndAppendDataCard('backtransmission', 'df', dfData);
    
    // 更新数据统计
    updateDataCount('backtransmission', 'df');
}

/**
 * 添加北斗频谱参数数据回调
 * @param {Object} spectrumData - 频谱参数数据
 */
function onAddBDSpectrumData(spectrumData) {
    // console.log('收到北斗频谱参数数据:', spectrumData);
    
    // 创建数据卡片并添加到回传数据列表
    createAndAppendDataCard('backtransmission', 'spectrum', spectrumData);
    
    // 更新数据统计
    updateDataCount('backtransmission', 'spectrum');
}

/**
 * 清空数据列表回调
 * @param {boolean} clearDZList - 是否清空手持数据列表
 * @param {boolean} clearBDList - 是否清空北斗数据列表
 */
function onClearDataList(clearDZList, clearBDList) {
    // console.log('收到清空数据列表指令');
    
    if (clearDZList) {
        // 清空手持数据列表
        var handheldList = document.getElementById('handheld-data-list');
        if (handheldList) {
            handheldList.innerHTML = '';
        }
        
        // 重置手持数据统计
        resetDataCount('handheld');
    }
    
    if (clearBDList) {
        // 清空回传数据列表
        var backtransmissionList = document.getElementById('backtransmission-data-list');
        if (backtransmissionList) {
            backtransmissionList.innerHTML = '';
        }
        
        // 重置回传数据统计
        resetDataCount('backtransmission');
    }
}

function onSetStatus(data) {
    // data={
    //     data_type: 201,
    //     set_bd_client_id:"123456789",
    //     set_data_send_interval:30000,
    //     freq_diff:false,
    //     measure_bw:true,
    //     rbw:true,
    //     fm_diff:false,
    //     occupy:false,
    // }
    console.log('收到状态更新:', data);
    window.updateSettingsDisplay(data.set_bd_client_id, data.set_data_send_interval, data.freq_diff, data.measure_bw, data.rbw, data.fm_diff, data.occupy);
}

/**
 * 通知C++地图创建成功
 */
function notifyMapCreated() {
    var message = {
        data_type: 1
    };
    sendMessageToCpp(message);
}

/**
 * 请求连接或断开手持设备
 * @param {boolean} shouldConnect - 是否连接
 * @param {string} ip - 设备IP地址
 */
function requestConnectDevice(shouldConnect, ip) {
    var message = {
        data_type: 2,
        request_connect_status: shouldConnect ? 1 : 0,// 1: 连接 0: 断开
        request_connect_300_ip: ip
    };
    sendMessageToCpp(message);
}




/**
 * 设置北斗终端号
 * @param {string} bdId - 北斗终端号
 */
function setBDClientId(bdId) {
    var message = {
        data_type: 4,
        set_bd_client_id: bdId
    };
    sendMessageToCpp(message);
}

/**
 * 设置数据发送间隔
 * @param {number} interval - 间隔时间（毫秒）
 */
function setDataSendInterval(interval) {
    var message = {
        data_type: 5,
        set_data_send_interval: interval*1000
    };
    sendMessageToCpp(message);
}

/**
 * 设置频差开关
 * @param {boolean} enabled - 是否启用
 */
function setFreqDiffSwitch(enabled) {
    var message = {
        data_type: 6,
        freq_diff: enabled
    };
    sendMessageToCpp(message);
}

/**
 * 设置测量带宽开关
 * @param {boolean} enabled - 是否启用
 */
function setMeasureBWSwitch(enabled) {
    var message = {
        data_type: 7,
        measure_bw: enabled
    };
    sendMessageToCpp(message);
}

/**
 * 设置RBW开关
 * @param {boolean} enabled - 是否启用
 */
function setRBWSwitch(enabled) {
    var message = {
        data_type: 8,
        rbw: enabled
    };
    sendMessageToCpp(message);
}

/**
 * 设置FM频偏开关
 * @param {boolean} enabled - 是否启用
 */
function setFMDiffSwitch(enabled) {
    var message = {
        data_type: 9,
        fm_diff: enabled
    };
    sendMessageToCpp(message);
}

/**
 * 设置占用度开关
 * @param {boolean} enabled - 是否启用
 */
function setOccupySwitch(enabled) {
    var message = {
        data_type: 10,
        occupy: enabled
    };
    sendMessageToCpp(message);
}

/**
 * 获取设置界面状态
 */
function getSettingStatus() {
    var message = {
        data_type: 201
    };
    sendMessageToCpp(message);
}


// 初始化通信模块
function initCommunication() {
    console.log('通信模块初始化');
    // new QWebChannel(qt.webChannelTransport, function(channel) {
    //     window.bridge = channel.objects.bridge;
    //     bridge.recvDataFromWebFun('{"data_type":1}')
    //     bridge.sendDataToWebSignal.connect(function (data) {
    //         handleReceivedMessage(data)
    //     })
    // })
    
    // 检查是否在QML环境中，如果是则监听来自C++的消息
    if (typeof window.bridge !== 'undefined' && qt.webChannelTransport) {
        console.log('检测到QML环境，准备接收C++消息');
    } else {
        console.log('非QML环境，使用模拟模式');
    }
}
/**
 * 模拟连接响应（仅用于开发环境）
 * @param {boolean} message - 数据
 */
function simulateConnectionResponse(message) {
    // 模拟连接过程延迟
    setTimeout(function() {
        // 发送连接状态更新消息到前端处理
        var resultMessage = {}
        
        
        // 根据消息类型进行模拟响应
        switch (message.data_type) {
            case 2: 
                // 请求连接/断开手持
                resultMessage = {
                        data_type: 3,
                        connect_300_status_update: message.request_connect_status===1?true:false
                    };
                break;
            case 4: // 北斗终端号设置
                console.log('北斗终端号已设置为:', message.set_bd_client_id);
                resultMessage = {
                    data_type: 11,
                    dz_number: message.set_bd_client_id+"0000"
                };
                break;
            case 5: // 数据发送间隔设置
                console.log('数据发送间隔已设置为:', message.set_data_send_interval + 'ms');
                break;
            case 6: // 频差开关设置
            case 7: // 测量带宽设置
            case 8: // RBW开关设置
            case 9: // FM频偏开关设置
            case 10: // 占用度开关设置
                console.log('开关设置已更新');
                break;
        }
        // 模拟c++内容
        handleReceivedMessage(resultMessage);
    }, 500);
}


// 页面加载完成后初始化通信模块
// if (document.readyState === 'loading') {
//     console.log('DOM 加载完成，准备初始化通信模块');
//     document.addEventListener('DOMContentLoaded', initCommunication);
// } else {
//     console.log('DOM 加载完成，准备初始化通信模块');
//     initCommunication();
// }
















//测试
setTimeout(addTestData, 1000);
function testFun(){
    setTimeout(() => {
        // onClearDataList(false, true)
        // onSetStatus()
        console.log('已清空数据列表',dataList);
    }, 6000);
}
/**
 * 生成测试数据的函数
 */
function generateRandomRouteData() {
    var baseLng = 1030000000 + Math.floor(Math.random() * 20000000); // 103.xxxxxxx
    var baseLat = 300000000 + Math.floor(Math.random() * 10000000);   // 30.xxxxxxx
    var baseFreq = 100000000 + Math.floor(Math.random() * 100000000); // 100-200 MHz
    var baseLev = 2000 + Math.floor(Math.random() * 3000);            // 20-50 dBμV
    var baseThreshold = 2500 + Math.floor(Math.random() * 1000);      // 25-35 dBμV
    
    return {
        freq: baseFreq,
        lev: baseLev,
        lng: baseLng,
        lat: baseLat,
        height: 100 + Math.floor(Math.random() * 100),               // 100-200m
        time: Date.now() + Math.floor(Math.random() * 1000000),      // 当前时间附近
        threshold: baseThreshold
    };
}



/**
 * 生成随机的测向数据
 * @returns {Object} 测向数据对象
 */
function generateRandomDFData() {
    var baseLng = 1030000000 + Math.floor(Math.random() * 20000000); // 103.xxxxxxx
    var baseLat = 300000000 + Math.floor(Math.random() * 10000000);   // 30.xxxxxxx
    var baseFreq = 100000000 + Math.floor(Math.random() * 100000000); // 100-200 MHz
    var baseLev = 2000 + Math.floor(Math.random() * 3000);            // 20-50 dBμV
    var angle = Math.floor(Math.random() * 360);                      // 0-359度
    
    return {
        freq: baseFreq,
        lev: baseLev,
        lng: baseLng,
        lat: baseLat,
        height: 100 + Math.floor(Math.random() * 100),               // 100-200m
        time: Date.now() + Math.floor(Math.random() * 1000000),      // 当前时间附近
        angle: angle
    };
}



/**
 * 生成随机的频谱参数数据
 * @returns {Object} 频谱参数数据对象
 */
function generateRandomSpectrumData() {
    var baseFreqDiff = 10000 + Math.floor(Math.random() * 20000);     // 10-30 kHz
    var baseMeasureBW = 20000 + Math.floor(Math.random() * 30000);    // 20-50 kHz
    var baseRbw = 5000 + Math.floor(Math.random() * 10000);          // 5-15 kHz
    var baseFmDiff = 3000 + Math.floor(Math.random() * 5000);        // 3-8 kHz
    var baseOccupy = 5000 + Math.floor(Math.random() * 5000);        // 50-100%
    
    return {
        freq_diff: baseFreqDiff,
        measure_bw: baseMeasureBW,
        rbw: baseRbw,
        fm_diff: baseFmDiff,
        occupy: baseOccupy,
        time: Date.now() + Math.floor(Math.random() * 1000000)       // 当前时间附近
    };
}

/**
 * 生成随机的北斗轨迹数据
 * @returns {Object} 北斗轨迹数据对象
 */
function generateRandomBDRouteData() {
    var routeData = generateRandomRouteData();
    
    return {
        freq: routeData.freq,
        lev: routeData.lev,
        lng: routeData.lng,
        lat: routeData.lat,
        height: routeData.height,
        time: routeData.time,
        threshold: routeData.threshold,
        bd_number: "123456789",
        dz_number: "abcd123456789abc"
    };
}

/**
 * 生成随机的北斗测向数据
 * @returns {Object} 北斗测向数据对象
 */
function generateRandomBDDFData() {
    var dfData = generateRandomDFData();
    
    return {
        freq: dfData.freq,
        lev: dfData.lev,
        lng: dfData.lng,
        lat: dfData.lat,
        height: dfData.height,
        time: dfData.time,
        angle: dfData.angle,
        bd_number: "123456789",
        dz_number: "abcd123456789abc"
    };
}

/**
 * 生成随机的北斗频谱参数数据
 * @returns {Object} 北斗频谱参数数据对象
 */
function generateRandomBDSpectrumData() {
    var spectrumData = generateRandomSpectrumData();
    
    return {
        freq_diff: spectrumData.freq_diff,
        measure_bw: spectrumData.measure_bw,
        rbw: spectrumData.rbw,
        fm_diff: spectrumData.fm_diff,
        occupy: spectrumData.occupy,
        time: spectrumData.time,
        bd_number: "123456789",
        dz_number: "abcd123456789abc"
    };
}

/**
 * 添加测试数据到系统
 */
function addTestData() {
    console.log("开始添加测试数据...");
    var randomDataCount = 100;

    // 添加手持频谱参数数据 (100条)
    for (var i = 0; i < 1; i++) {
        var spectrumData = generateRandomSpectrumData();
        onAddHandheldSpectrumData(spectrumData);
        // if (window.updateDataCount) {
        //     window.updateDataCount('handheld', 'spectrum');
        // }
    }

    // 添加手持测向数据 (100条)
    for (var i = 0; i < 1; i++) {
        var dfData = generateRandomDFData();
        onAddHandheldDFData(dfData);
        // if (window.updateDataCount) {
        //     window.updateDataCount('handheld', 'df');
        // }
    }

    // 添加手持轨迹数据 (100条)
    for (var i = 0; i < 1; i++) {
        var routeData = generateRandomRouteData();
        onAddHandheldRouteData(routeData);
        // if (window.updateDataCount) {
        //     window.updateDataCount('handheld', 'route');
        // }
    }
    
    
    
    
    
    // 添加北斗轨迹数据 (100条)
    for (var i = 0; i < randomDataCount; i++) {
        var bdRouteData = generateRandomBDRouteData();
        onAddBDRouteData(bdRouteData);
        // if (window.updateDataCount) {
        //     window.updateDataCount('backtransmission', 'route');
        // }
    }
    
    // 添加北斗测向数据 (100条)
    for (var i = 0; i < randomDataCount; i++) {
        var bdDFData = generateRandomBDDFData();
        onAddBDDFData(bdDFData);
        // if (window.updateDataCount) {
        //     window.updateDataCount('backtransmission', 'df');
        // }
    }
    
    // 添加北斗频谱参数数据 (100条)
    for (var i = 0; i < randomDataCount; i++) {
        var bdSpectrumData = generateRandomBDSpectrumData();
        onAddBDSpectrumData(bdSpectrumData);
        // if (window.updateDataCount) {
        //     window.updateDataCount('backtransmission', 'spectrum');
        // }
    }

    testFun()
}


