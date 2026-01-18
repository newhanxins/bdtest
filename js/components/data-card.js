/**
 * 数据卡片组件 - data-card.js
 * 用于创建和管理各种类型的数据卡片
 * 包括轨迹、测向线、频谱参数等数据展示
 */
var dataList={
    config: {
        maxCount: 1000  // 每种类型数据的最大数量
    },
    handleList:{//手持数据
        route:[],
        df:[],
        spectrum:[]
    },
    backtransmissionList:{//回传数据
        route:[],
        df:[],
        spectrum:[]
    }
}
/**
 * 创建数据卡片元素
 * @param {string} pageType - 页面类型 ('handheld' 或 'backtransmission')
 * @param {string} dataType - 数据类型 ('route', 'df', 'spectrum')
 * @param {Object} data - 数据对象
 * @returns {HTMLElement} 返回创建的数据卡片元素
 */
function createDataCard(pageType, dataType, data) {
    // 创建卡片容器
    var card = document.createElement('div');
    card.className = 'data-card';
    // 根据数据类型添加特定类名
    if (dataType === 'df') {
        card.classList.add('df-data');
    } else if (dataType === 'spectrum') {
        card.classList.add('spectrum-data');
    } else if (dataType === 'route') {
        card.classList.add('route-data');
    }
    
    // 创建标题
    var title = document.createElement('div');
    title.className = 'data-title';
    
    // 根据页面类型和数据类型确定标题文本
    var titleText = '';
    if (pageType === 'handheld') {
        // 手持数据
        if (dataType === 'route') {
            titleText = '轨迹';
        } else if (dataType === 'df') {
            titleText = '测向线';
        } else if (dataType === 'spectrum') {
            titleText = '频谱参数';
        }
    } else if (pageType === 'backtransmission') {
        // 回传数据
        if (dataType === 'route') {
            titleText = '轨迹';
        } else if (dataType === 'df') {
            titleText = '测向线';
        } else if (dataType === 'spectrum') {
            titleText = '频谱参数';
        }
    }
    title.appendChild(document.createTextNode(titleText));
    card.appendChild(title);
    
    // 根据数据类型创建不同的数据行
    var dataRows = [];
    
    if (dataType === 'route') {
        // 轨迹数据
        dataRows.push('频率：' + formatFrequency(data.freq));
        dataRows.push('强度：' + formatLevel(data.lev));
        dataRows.push('经度：' + formatCoordinate(data.lng, 'lng'));
        dataRows.push('纬度：' + formatCoordinate(data.lat, 'lat'))
        if(pageType === 'backtransmission'){
            dataRows.push('北斗号：' + (data.bd_number || '--'));
        }
        dataRows.push('时间：' + formatTime(data.time))
        // 计算是否超过门限
        var isExceeded = data.threshold!==-32767&&data.lev > data.threshold;
        var thresholdText = isExceeded ? 
            '<span class="threshold-exceeded">是（'+ formatLevel(data.lev-data.threshold)+'）</span>' : 
            '<span class="threshold-not-exceeded">否</span>';
        dataRows.push('是否超过门限：' + thresholdText)
        if(pageType === 'backtransmission'){
            dataRows.push('设备编号：' + (data.dz_number || '--'));
        }
    } else if (dataType === 'df') {
        // 测向数据
        dataRows.push('频率：' + formatFrequency(data.freq))
        dataRows.push('测向结果：' + formatLevel(data.lev))
        dataRows.push('经度：' + formatCoordinate(data.lng, 'lng'))
        dataRows.push('纬度：' + formatCoordinate(data.lat, 'lat'));
        if(pageType === 'backtransmission'){
            dataRows.push('北斗号：' + (data.bd_number || '--'));
        }
        
        dataRows.push('时间：' + formatTime(data.time))
        
        dataRows.push('角度：' + (data.angle !== undefined ? data.angle + '°' : '--'));
        
        
        if(pageType === 'backtransmission'){
            dataRows.push('设备编号：' + (data.dz_number || '--'));
        }
        //dataRows.push(pageType === 'backtransmission' ? '设备编号：' + (data.dz_number || '--') : '设备编号：' + (window.deviceNumber || '--'));
    } else if (dataType === 'spectrum') {
        // 频谱参数数据
        var freqDiffStr = (data.freq_diff !== undefined && data.freq_diff !== -1) ? formatFrequency(data.freq_diff) : '--';
        var measureBwStr = (data.measure_bw !== undefined && data.measure_bw !== -1) ? formatFrequency(data.measure_bw) : '--';
        // var rbwStr = (data.rbw !== undefined && data.rbw !== -1) ? formatFrequency(data.rbw) : '--';
        var fmDiffStr = (data.fm_diff !== undefined && data.fm_diff !== -1) ? formatFrequency(data.fm_diff) : '--';
        var occupyStr = (data.occupy !== undefined && data.occupy !== -1) ? (data.occupy / 10000 * 100).toFixed(3) + '%' : '--';
        
        dataRows.push('测量带宽：' + measureBwStr)
        dataRows.push('频差：' + freqDiffStr)
        if(pageType === 'backtransmission'){
            dataRows.push('北斗号：' + (data.bd_number || '--'));
        }

        dataRows.push('FM频偏：' + fmDiffStr)
        // dataRows.push('RBW：' + rbwStr);
        
        dataRows.push('时间：' + formatTime(data.time))
        dataRows.push('占用：' + occupyStr);
        
        if(pageType === 'backtransmission'){
            dataRows.push('设备编号：' + (data.dz_number || '--'));
        }
        //dataRows.push( pageType === 'backtransmission' ? '设备编号：' + (data.dz_number || '--') : '设备编号：' + (window.deviceNumber || '--'));
    }
    var row = document.createElement('div');
    row.className = 'data-content';
    // 添加数据行到卡片
    for (var i = 0; i < dataRows.length; i++) {
        var rowData = dataRows[i];
        var leftSpan = document.createElement('div');
        leftSpan.className = 'data-item';
        leftSpan.innerHTML = rowData || '';
        row.appendChild(leftSpan);
        card.appendChild(row);
    }
    // 旧版本左右分开
    // for (var i = 0; i < dataRows.length; i++) {
    //     var rowData = dataRows[i];
    //     if (!rowData.left && !rowData.right) continue; // 跳过空行
        
    //     var row = document.createElement('div');
    //     row.className = 'data-row';
        
    //     var leftSpan = document.createElement('span');
    //     leftSpan.innerHTML = rowData.left || '';
    //     row.appendChild(leftSpan);
        
    //     var rightSpan = document.createElement('span');
    //     rightSpan.innerHTML = rowData.right || '';
    //     row.appendChild(rightSpan);
        
    //     card.appendChild(row);
    // }
    
    return card;
}

/**
 * 将数据卡片添加到指定列表
 * @param {string} pageType - 页面类型 ('handheld' 或 'backtransmission')
 * @param {string} dataType - 数据类型 ('route', 'df', 'spectrum')
 * @param {Object} data - 数据对象
 */
function createAndAppendDataCard(pageType, dataType, data) {
    // 获取对应的数据列表容器
    var listContainerId = pageType === 'handheld' ? 'handheld-data-list' : 'backtransmission-data-list';
    var listContainer = document.getElementById(listContainerId);
    
    if (!listContainer) {
        console.error('找不到数据列表容器：', listContainerId);
        return;
    }
    
    // 存储数据到dataList对象
    var listRef = pageType === 'handheld' ? dataList.handleList : dataList.backtransmissionList;
    var dataListArray = listRef[dataType];
    
    // 添加新数据到数组开头
    dataListArray.unshift(data);
    
    // 检查是否超过最大数量限制
    if (dataListArray.length > dataList.config.maxCount) {
        console.log('数据列表已满，开始删除数据...',dataType);
        // 删除超出数量限制的数据
        dataListArray.splice(dataList.config.maxCount, dataListArray.length - dataList.config.maxCount);
        
        // 同时删除对应的DOM元素
        var cards = listContainer.querySelectorAll('.'+dataType+"-data");
        var excessCount = cards.length - dataList.config.maxCount;
        console.log('已删除数据-----------：',excessCount);
        for (var i = 0; i < excessCount; i++) {
            if (cards[cards.length - 1]) {
                cards[cards.length - 1].remove();
            }
        }
    }


    // 创建数据卡片
    var card = createDataCard(pageType, dataType, data);
    
    // 检查是否应该显示该类型的数据（基于复选框状态）
    var showCheckboxId = (pageType === 'backtransmission' ? 'show-bd-' : 'show-') + dataType;
    var showCheckbox = document.getElementById(showCheckboxId);
    var shouldDisplay = !showCheckbox || showCheckbox.checked;
    
    // 设置卡片显示状态
    card.style.display = shouldDisplay ? 'block' : 'none';
    
    // 添加到列表开头（最新数据在最上方）
    if (listContainer.firstChild) {
        listContainer.insertBefore(card, listContainer.firstChild);
    } else {
        listContainer.appendChild(card);
    }
}


/**
 * 格式化坐标值
 * @param {number} coord - 坐标值（精度1e-7）
 * @param {string} type - 坐标类型 ('lng' 或 'lat')
 * @returns {string} 格式化后的坐标字符串
 */
function formatCoordinate(coord, type) {
    // 检查是否为无效值
    if ((type === 'lng' && (coord === 1810000000 || coord === null || coord === undefined)) ||
        (type === 'lat' && (coord === 910000000 || coord === null || coord === undefined))) {
        return '--';
    }
    
    if (coord === null || coord === undefined) {
        return '--';
    }
    
    // 转换为度数（除以1e7）
    var degrees = coord / 10000000.0;
    return degrees.toFixed(7);
}

/**
 * 格式化电平强度值
 * @param {number} level - 电平强度值（精度0.01dBμV）
 * @returns {string} 格式化后的电平强度字符串
 */
function formatLevel(level) {
    if (level === null || level === undefined) {
        return '-- dBμV';
    }
    
    // 转换为dBμV（除以100）
    var dbuv = level / 100.0;
    return dbuv.toFixed(2) + ' dBμV';
}

/**
 * 格式化频率值
 * @param {number} freq - 频率值（Hz）
 * @returns {string} 格式化后的频率字符串
 */
function formatFrequency(freq) {
    if (freq === null || freq === undefined || freq === -1) {
        return '--';
    }
    
    // 根据频率值自动选择合适的单位
    if (freq >= 1000000000) {
        // GHz
        return (freq / 1000000000.0).toFixed(6) + ' GHz';
    } else if (freq >= 1000000) {
        // MHz
        return (freq / 1000000.0).toFixed(3) + ' MHz';
    } else if (freq >= 1000) {
        // kHz
        return (freq / 1000.0).toFixed(3) + ' kHz';
    } else {
        // Hz
        return freq + ' Hz';
    }
}

/**
 * 格式化时间戳
 * @param {number} timestamp - 时间戳（毫秒）
 * @returns {string} 格式化后的时间字符串
 */
function formatTime(timestamp) {
    if (timestamp === null || timestamp === undefined) {
        return '--';
    }
    
    // 创建Date对象（时间戳单位为毫秒）
    var date = new Date(timestamp);
    
    // 格式化为 YYYY-MM-DD HH:mm:ss
    var year = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var day = ('0' + date.getDate()).slice(-2);
    var hours = ('0' + date.getHours()).slice(-2);
    var minutes = ('0' + date.getMinutes()).slice(-2);
    var seconds = ('0' + date.getSeconds()).slice(-2);
    
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
}

/**
 * 更新数据统计
 * @param {string} pageType - 页面类型 ('handheld' 或 'backtransmission')
 * @param {string} dataType - 数据类型 ('route', 'df', 'spectrum')
 */
function updateDataCount(pageType, dataType) {
    // 获取当前统计数据
    var totalId = pageType === 'backtransmission' ? 'bd-total-data-count' : 'total-data-count';
    var routeId = pageType === 'backtransmission' ? 'bd-route-data-count' : 'route-data-count';
    var dfId = pageType === 'backtransmission' ? 'bd-df-data-count' : 'df-data-count';
    var spectrumId = pageType === 'backtransmission' ? 'bd-spectrum-data-count' : 'spectrum-data-count';
    
    var totalCountEl = document.getElementById(totalId);
    var routeCountEl = document.getElementById(routeId);
    var dfCountEl = document.getElementById(dfId);
    var spectrumCountEl = document.getElementById(spectrumId);
    
    if (!totalCountEl || !routeCountEl || !dfCountEl || !spectrumCountEl) {
        return;
    }
    //老版本统计所有添加
    // 获取当前计数值
    // var routeCount = parseInt(routeCountEl.textContent) || 0;
    // var dfCount = parseInt(dfCountEl.textContent) || 0;
    // var spectrumCount = parseInt(spectrumCountEl.textContent) || 0;
    // // 根据数据类型增加对应计数
    // if (dataType === 'route') {
    //     routeCount++;
    // } else if (dataType === 'df') {
    //     dfCount++;
    // } else if (dataType === 'spectrum') {
    //     spectrumCount++;
    // }
    
    // 获取数据列表引用
    var listRef = pageType === 'handheld' ? dataList.handleList : dataList.backtransmissionList;
    // 根据存储的数据直接获取计数
    var routeCount = listRef.route.length;
    var dfCount = listRef.df.length;
    var spectrumCount = listRef.spectrum.length;


    // 更新各类型计数
    routeCountEl.textContent = routeCount;
    dfCountEl.textContent = dfCount;
    spectrumCountEl.textContent = spectrumCount;
    
    // 更新总计数
    var totalCount = routeCount + dfCount + spectrumCount;
    totalCountEl.textContent = totalCount;
}

/**
 * 重置数据统计
 * @param {string} pageType - 页面类型 ('handheld' 或 'backtransmission')
 */
function resetDataCount(pageType) {
    var totalId = pageType === 'backtransmission' ? 'bd-total-data-count' : 'total-data-count';
    var routeId = pageType === 'backtransmission' ? 'bd-route-data-count' : 'route-data-count';
    var dfId = pageType === 'backtransmission' ? 'bd-df-data-count' : 'df-data-count';
    var spectrumId = pageType === 'backtransmission' ? 'bd-spectrum-data-count' : 'spectrum-data-count';
    
    var totalCountEl = document.getElementById(totalId);
    var routeCountEl = document.getElementById(routeId);
    var dfCountEl = document.getElementById(dfId);
    var spectrumCountEl = document.getElementById(spectrumId);
    
    if (totalCountEl) totalCountEl.textContent = '0';
    if (routeCountEl) routeCountEl.textContent = '0';
    if (dfCountEl) dfCountEl.textContent = '0';
    if (spectrumCountEl) spectrumCountEl.textContent = '0';

    // 重置dataList中的数据
    var listRef = pageType === 'handheld' ? dataList.handleList : dataList.backtransmissionList;
    listRef.route = [];
    listRef.df = [];
    listRef.spectrum = [];
}

/**
 * 根据复选框状态显示/隐藏数据卡片
 * @param {string} pageType - 页面类型 ('handheld' 或 'backtransmission')
 * @param {string} dataType - 数据类型 ('route', 'df', 'spectrum')
 */
function toggleDataCardsVisibility(pageType, dataType) {
    console.log('toggleDataCardsVisibility', pageType, dataType);
    var showCheckboxId = (pageType === 'backtransmission' ? 'show-bd-' : 'show-') + dataType;
    var showCheckbox = document.getElementById(showCheckboxId);
    var shouldShow = showCheckbox && showCheckbox.checked;
    
    // 获取对应页面的数据列表
    var listContainerId = pageType === 'handheld' ? 'handheld-data-list' : 'backtransmission-data-list';
    var listContainer = document.getElementById(listContainerId);
    
    if (!listContainer) {
        return;
    }
    
    // 获取所有数据卡片
    var cards = listContainer.getElementsByClassName('data-card');
    
    // 遍历卡片，根据类型和显示状态决定是否显示
    for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        
        // 检查卡片是否属于指定的数据类型
        var isRouteCard = !card.classList.contains('df-data') && !card.classList.contains('spectrum-data');
        var isDFCard = card.classList.contains('df-data');
        var isSpectrumCard = card.classList.contains('spectrum-data');
        
        var isTargetType = false;
        if (dataType === 'route' && isRouteCard) {
            isTargetType = true;
        } else if (dataType === 'df' && isDFCard) {
            isTargetType = true;
        } else if (dataType === 'spectrum' && isSpectrumCard) {
            isTargetType = true;
        }
        
        // 如果是目标类型，则根据复选框状态设置显示/隐藏
        if (isTargetType) {
            card.style.display = shouldShow ? 'block' : 'none';
        }
    }
}

// 页面加载完成后初始化数据卡片组件
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('数据卡片组件初始化');
    });
} else {
    console.log('数据卡片组件初始化');
}