/**
 * 回传数据页面逻辑 - backtransmission.js
 * 处理回传数据页面的交互逻辑
 * 包括数据显示控制等功能
 */

/**
 * 初始化回传数据页面
 */
function initBacktransmissionPage() {
    // 绑定复选框事件
    bindCheckboxEvents();
    // 绑定数据清除按钮事件
    var clearBtn = document.getElementById('clear-backtransmission');
    if (clearBtn) {
        clearBtn.onclick = backtransmissionClearBtnClick;
    }
    console.log('回传数据页面初始化完成');
}

/**
 * 绑定复选框事件
 */
function bindCheckboxEvents() {
    // 轨迹复选框
    var routeCheckbox = document.getElementById('show-bd-route');
    if (routeCheckbox) {
        routeCheckbox.onchange = function() {
            window.toggleDataCardsVisibility('backtransmission', 'route');
        };
    }
    
    // 测向线复选框
    var dfCheckbox = document.getElementById('show-bd-df');
    if (dfCheckbox) {
        dfCheckbox.onchange = function() {
            window.toggleDataCardsVisibility('backtransmission', 'df');
        };
    }
    
    // 频谱参数复选框
    var spectrumCheckbox = document.getElementById('show-bd-spectrum');
    if (spectrumCheckbox) {
        spectrumCheckbox.onchange = function() {
            window.toggleDataCardsVisibility('backtransmission', 'spectrum');
        };
    }
}
function backtransmissionClearBtnClick(){
    window.onClearDataList(false,true);
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
    var totalEl = document.getElementById('bd-total-data-count');
    if (totalEl) {
        totalEl.textContent = total;
    }
    
    // 更新轨迹数据量
    var routeEl = document.getElementById('bd-route-data-count');
    if (routeEl) {
        routeEl.textContent = routeCount;
    }
    
    // 更新测向线数据量
    var dfEl = document.getElementById('bd-df-data-count');
    if (dfEl) {
        dfEl.textContent = dfCount;
    }
    
    // 更新频谱参数数据量
    var spectrumEl = document.getElementById('bd-spectrum-data-count');
    if (spectrumEl) {
        spectrumEl.textContent = spectrumCount;
    }
    
    console.log('回传数据统计更新 - 总计: ' + total + ', 轨迹: ' + routeCount + ', 测向: ' + dfCount + ', 频谱: ' + spectrumCount);
}

/**
 * 页面加载完成后初始化回传数据页面
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBacktransmissionPage);
} else {
    initBacktransmissionPage();
}