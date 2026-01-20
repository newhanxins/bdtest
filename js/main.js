/**
 * 主程序逻辑 - main.js
 * 处理页面切换、全局事件绑定等主程序逻辑
 */

/**
 * 当前活动页面
 */
var currentPage = 'handheld';



/**
 * 初始化主程序
 */
function initMain() {
    console.log('初始化主程序');
    // calculaAreaHeight()
    // 绑定底部导航事件
    bindFooterEvents();
    
    // 初始化通信模块
    window.initCommunication();
    
    // 初始化各页面
    window.initHandheldPage();
    window.initBacktransmissionPage();
    window.initSettingsPage();
    
    // 初始化键盘组件
    window.initKeyboard();
    // 初始化地图页面
    window.initMapPage();
    console.log('主程序初始化完成');
    onSetStatus()
}

/**
 * 绑定底部导航事件
 */
function bindFooterEvents() {
    var footerItems = document.querySelectorAll('.footer-item');
    for (var i = 0; i < footerItems.length; i++) {
        footerItems[i].onclick = function() {
            var page = this.getAttribute('data-page');
            switchToPage(page);
        };
    }
}

/**
 * 切换页面
 * @param {string} page - 页面名称 ('handheld', 'backtransmission', 'settings')
 */
function switchToPage(page) {
    // 移除当前活动页面的active类
    var currentPageElement = document.getElementById(currentPage + '-page');
    if (currentPageElement) {
        currentPageElement.classList.remove('active');
    }
    
    // 移除当前活动导航项的active类
    var currentNavItem = document.querySelector('.footer-item.active');
    if (currentNavItem) {
        currentNavItem.classList.remove('active');
    }
    
    // 设置新页面为活动页面
    var newPageElement = document.getElementById(page + '-page');
    if (newPageElement) {
        newPageElement.classList.add('active');
        
        
    }
    // 设置新导航项为活动项
    var newNavItem = document.querySelector('.footer-item[data-page="' + page + '"]');
    if (newNavItem) {
        newNavItem.classList.add('active');
    }
    
    // 更新当前页面
    currentPage = page;
    calculaAreaHeight();
    if(page==="map"){
        // map.updateSize();
        if(map===null){
            onloadMap()
        }
        
        filterMapDataByFreq()
    }
    console.log('切换到页面: ' + page);
}


/**
 * 计算中间区域的高度
 */
function calculaAreaHeight() {
    console.log('计算中间区域高度',currentPage);
    // 获取页面头部高度
    // 计算数据列表容器的高度
    var newPageElement = document.getElementById(currentPage + '-page');
    var dataListContainer = newPageElement.querySelector('.data-list');
    if (dataListContainer) {
        var header = newPageElement.querySelector('.header');
        var headerHeight = header ? header.offsetHeight : 0;
        
        // 获取数据概览高度
        var dataSummary = newPageElement.querySelector('.data-summary');
        var summaryHeight = dataSummary ? dataSummary.offsetHeight : 0;
        
        // 获取底部导航高度
        var footer = document.querySelector('.footer');
        var footerHeight =0;
        if(footer.offsetHeight){
            footerHeight = footer.offsetHeight;
        }
        
        // 计算剩余可用高度
        var windowHeight = window.innerHeight;
        var availableHeight = windowHeight - headerHeight - summaryHeight - footerHeight - 56; // 32为上下边距
        // 设置数据列表容器高度
        console.log('数据列表容器高度',availableHeight);
        dataListContainer.style.height = availableHeight + 'px';
        dataListContainer.style.overflowY = 'auto'; // 启用垂直滚动
        dataListContainer.style.overflowX = 'hidden'; // 隐藏水平滚动
        
        // 隐藏滚动条样式（但保持滚动功能）
        dataListContainer.style.msOverflowStyle = 'none'; // IE 和 Edge
        dataListContainer.style.scrollbarWidth = 'none'; // Firefox

    }
}




/**
 * 更新手持数据页面统计
 * @param {number} total - 总数据量
 * @param {number} routeCount - 轨迹数据量
 * @param {number} dfCount - 测向线数据量
 * @param {number} spectrumCount - 频谱参数数据量
 */
function updateHandheldDataSummary(total, routeCount, dfCount, spectrumCount) {
    if (window.updateDataSummary) {
        window.updateDataSummary(total, routeCount, dfCount, spectrumCount);
    }
}

/**
 * 更新回传数据页面统计
 * @param {number} total - 总数据量
 * @param {number} routeCount - 轨迹数据量
 * @param {number} dfCount - 测向线数据量
 * @param {number} spectrumCount - 频谱参数数据量
 */
function updateBacktransmissionDataSummary(total, routeCount, dfCount, spectrumCount) {
    if (window.updateDataSummary) {
        window.updateDataSummary(total, routeCount, dfCount, spectrumCount);
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
function updateSettingsPageDisplay(bdClientId, dataInterval, freqDiffEnabled, measureBWEnabled, rbwEnabled, fmDiffEnabled, occupyEnabled) {
    if (window.updateSettingsDisplay) {
        window.updateSettingsDisplay(
            bdClientId,
            dataInterval,
            freqDiffEnabled,
            measureBWEnabled,
            rbwEnabled,
            fmDiffEnabled,
            occupyEnabled
        );
    }
}
















// 加载存储ip
function loadStorageIp() {
    var ip = localStorage.getItem('connectIp');
    if (ip) {
        document.getElementById('ip-input').value = ip;
    }
}


// 页面加载完成后初始化主程序
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        loadStorageIp()
        initMain();
        // 延迟添加测试数据，确保系统完全初始化
        // 打印浏览器信息
        console.log(navigator.userAgent);
        // setTimeout(addTestData, 1000);
        
    });
} else {
    initMain();
    // 如果页面已经加载完成，则立即添加测试数据
    // setTimeout(addTestData, 1000);
}
// window.onerror = function(message, source, lineno, colno, error) {
//   console.error('Error:', error); // 输出错误对象
//   console.log('Message:', message); // 错误消息
//   console.log('Source:', source); // 错误来源文件
//   console.log('Line:', lineno); // 行号
//   console.log('Column:', colno); // 列号
//   console.log('Stack:', error); // 堆栈跟踪
//   alert(error+"\n"+message+"\n"+source+"\n"+lineno+":"+colno)
//   return true; // 阻止默认错误处理
// };

