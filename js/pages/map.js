/**
 * 地图页面功能 - map.js
 * 处理地图页面的交互逻辑
 * 包括频率列表弹窗、数据过滤等功能
 */

/**
 * 当前选中的频率
 */
var currentFreq = "all"; // 默认350MHz
var map=null;
var dataid=0
/**
 * 初始化地图页面
 */
function initMapPage() {
    console.log('初始化地图页面');
    
    // 绑定地图频率点击事件
    var mapFreqBox = document.getElementById('map-switch');
    if (mapFreqBox) {
        mapFreqBox.onclick = showFreqListPopup;
    }
    
    // 绑定频率列表弹窗关闭按钮事件
    var closeBtn = document.getElementById('freq-list-close');
    if (closeBtn) {
        closeBtn.onclick = hideFreqListPopup;
    }
    
    // 绑定频率列表弹窗清除按钮事件
    var clearBtn = document.getElementById('freq-list-clear');
    if (clearBtn) {
        clearBtn.onclick = clearFreqList;
    }
    
    // 初始化时设置默认频率
    var defaultFreq = "all"; // 默认350MHz
    var mapFreqElement = document.getElementById('map-freq');
    if (mapFreqElement) {
        // mapFreqElement.textContent = formatFrequency(defaultFreq);
        mapFreqElement.textContent = "全部频率";
        currentFreq = defaultFreq;
    }
    
    // 初始过滤地图数据
    // filterMapDataByFreq(currentFreq);
    
    console.log('地图页面初始化完成');
}
function onloadMap() {
    var options={
            "target": 'map',
            "map_center": [104.06, 30.67],
            "map_type":"baidu",
            "map_url":"./",
            "map_zoom":5,
            "map_online":true,
            "map_offline_street":"",//离线街道瓦片地址
            "map_offline_satellite":"",//离线卫星瓦片地址
            "line_mode":{
                "line_size_style":"normal",
                "line_color_mode":false
            }
          }
          console.log("初始化地图参数",options)
          map=new DzMap(options)
          map.on('map:click', (evt) => {
            console.log('地图点击', evt); 
          });

          map.on('map:zoomend', function () {
            console.log('地图缩放');
            filterMapDataByFreq()
          });
          
          // 可选：监听窗口大小变化
         map.setupResizeHandler();
}
/**
 * 获取所有频率并去重
 * @returns {Array} 去重后的频率数组
 */
function getAllFrequencies() {
    var frequencies = [];
    

    // 从手持数据中获取频率
    dataList.handleList.route.forEach(function(item) {
        if (item.freq && item.freq !== -1) {
            frequencies.push(item.freq);
        }
    });
    
    dataList.handleList.df.forEach(function(item) {
        if (item.freq && item.freq !== -1) {
            frequencies.push(item.freq);
        }
    });
    
    // dataList.handleList.spectrum.forEach(function(item) {
    //     if (item.freq && item.freq !== -1) {
    //         frequencies.push(item.freq);
    //     }
    // });
    
    // 从回传数据中获取频率
    dataList.backtransmissionList.route.forEach(function(item) {
        if (item.freq && item.freq !== -1) {
            frequencies.push(item.freq);
        }
    });
    
    dataList.backtransmissionList.df.forEach(function(item) {
        if (item.freq && item.freq !== -1) {
            frequencies.push(item.freq);
        }
    });
    
    // dataList.backtransmissionList.spectrum.forEach(function(item) {
    //     if (item.freq && item.freq !== -1) {
    //         frequencies.push(item.freq);
    //     }
    // });
    
    // 去重
    var uniqueFrequencies = [];
    var seen = {};
    for (var i = 0; i < frequencies.length; i++) {
        var freq = frequencies[i];
        if (!seen[freq]) {
            seen[freq] = true;
            uniqueFrequencies.push(freq);
        }
    }
    
    // 排序
    uniqueFrequencies.sort(function(a, b) {
        return a - b;
    });
    
    return uniqueFrequencies;
}

/**
 * 更新频率列表显示
 * @param {Array} frequencies - 频率数组
 */
function updateFreqList(frequencies) {
    var container = document.querySelector('.freq-list-container');
    if (!container) {
        return;
    }
    
    // 清空容器
    container.innerHTML = '';
    
    // 添加"全部频率"选项
    var allFreqItem = document.createElement('div');
    allFreqItem.className = 'freq-item';
    allFreqItem.textContent = '全部频率';
    allFreqItem.dataset.freq = 'all';
    
    // 添加点击事件
    allFreqItem.onclick = function() {
        selectFreq('all');
    };
    
    container.appendChild(allFreqItem);
    
    // 添加其他频率选项
    for (var i = 0; i < frequencies.length; i++) {
        var freq = frequencies[i];
        var freqItem = document.createElement('div');
        freqItem.className = 'freq-item';
        freqItem.textContent = formatFrequency(freq);
        freqItem.dataset.freq = freq;
        
        // 添加点击事件
        freqItem.onclick = function() {
            var selectedFreq = this.dataset.freq;
            if (selectedFreq === 'all') {
                selectFreq('all');
            } else {
                selectFreq(parseInt(selectedFreq));
            }
            // 移除其他选项的选中样式
            var freqItems = document.querySelectorAll('.freq-item');
            for (var j = 0; j < freqItems.length; j++) {
                freqItems[j].classList.remove('active');
            }
            this.classList.add('active'); // 添加选中样式

        };
        
        container.appendChild(freqItem);
    }
    
    // 默认选中
    if(currentFreq==="all"){
        allFreqItem.classList.add('active');
    }else{
        var selectedFreqItem = container.querySelector('.freq-item[data-freq="' + currentFreq + '"]');
        if (selectedFreqItem) {
            selectedFreqItem.classList.add('active');
        }
    }
}


/**
 * 显示频率列表弹窗
 */
function showFreqListPopup() {
    var popup = document.getElementById('freq-list-popup');
    if (popup) {
        popup.style.display = 'block';
        
        // 获取所有频率并更新列表
        var frequencies = getAllFrequencies();
        updateFreqList(frequencies);
    }
}

/**
 * 隐藏频率列表弹窗
 */
function hideFreqListPopup() {
    var popup = document.getElementById('freq-list-popup');
    if (popup) {
        popup.style.display = 'none';
    }
}

/**
 * 清空频率列表
 */
function clearFreqList() {
    var container = document.querySelector('.freq-list-container');
    if (container) {
        container.innerHTML = '';
    }
}

/**
 * 选择频率
 * @param {number|string} freq - 频率值，'all'表示全部频率
 */
function selectFreq(freq) {
    // 更新地图显示的频率
    var mapFreqElement = document.getElementById('map-freq');
    if (mapFreqElement) {
        if (freq === 'all') {
            mapFreqElement.textContent = '全部频率';
        } else {
            mapFreqElement.textContent = parseFloat(formatFrequency(freq));
        }
    }
    
    // 更新当前选中的频率
    currentFreq = freq;
    
    // 根据频率过滤地图数据
    filterMapDataByFreq(freq);
    
    // 隐藏弹窗
    hideFreqListPopup();
}

/**
 * 根据频率过滤地图数据
 * @param {number|string} freq - 频率值，'all'表示全部频率
 */
function filterMapDataByFreq() {
    // 这里你可以添加地图数据过滤的逻辑
    // 例如：只显示该频率的数据点
    if(map){
        map.clearAll()
    }
    console.log('过滤地图数据，频率:', currentFreq === 'all' ? '全部频率' : formatFrequency(currentFreq));
    var currentFreqNum=currentFreq;
    // 示例：调用地图相关的函数来更新显示
    // updateMapDisplay(freq);
    dataList.handleList.route.forEach(function(item) {
        if (item.freq && item.freq ==currentFreqNum||currentFreq==="all") {
            drawData(1,"handheld",item)
        }
    });
    
    dataList.handleList.df.forEach(function(item) {
        if (item.freq && item.freq ==currentFreqNum||currentFreq==="all") {
            drawData(2,"handheld",item)
        }
    });
    
    // dataList.handleList.spectrum.forEach(function(item) {
    //     if (item.freq && item.freq !== -1) {
    //         frequencies.push(item.freq);
    //     }
    // });
    
    // 从回传数据中获取频率
    dataList.backtransmissionList.route.forEach(function(item) {
        if (item.freq && item.freq ==currentFreqNum||currentFreq==="all") {
            drawData(1,"backtransmission",item)
        }
    });
    
    dataList.backtransmissionList.df.forEach(function(item) {
        if (item.freq && item.freq ==currentFreqNum||currentFreq==="all") {
            drawData(2,"backtransmission",item)
        }
    });
}

function drawData(type,pageType,data){
    console.log("地图绘制数据",type,pageType,data)
    dataid=dataid+1;
    var longitude=data.lng/10000000;
    var latitude=data.lat/10000000;
    if(longitude>-180&&longitude<180&&latitude>-90&&latitude<90){
    }else{
        console.log("经纬度错误")
        return false;
    }
    if(type===1){
        // 绘制点
        //路径点
        var pointdata = {
            "operate_type": "add_data",
            "operate_data": {
                "data_id": dataid,
                "data_type": "data_point",
                "data_point": {
                    "point_ischange": false, //true 受控 false 不受控
                    "point_gps": [longitude, latitude],
                    "point_radius": 10,
                    "point_color": [0, 205, 0, 1],
                    "point_strength": data.lev/100
                }
            }
        }
        map.addPoint(pointdata);
    }else if(type===2){
        // 绘制线
        var color=[255,0,0,1]
        if(pageType==="handheld"){
        }else if(pageType==="backtransmission"){
            color=[51,119,255,1]
        }
        var linedata = {
            "operate_type": "add_data",
            "operate_data": {
                "map_id": 0,
                "data_show": true,
                "data_type": "data_line",
                "data_time": 1591773416330,
                "data_line": {
                    "line_ischange": false,
                    "line_gps": [
                        [longitude, latitude],
                        [103.0222, 30.7]
                    ],
                    "line_angle": data.angle,
                    "line_offset_angle": 0,//偏移角度有为射线，无为0
                    "line_length": 80,
                    "line_arrow_length":20,//箭头长度
                    "line_arrow_angle":30,//箭头角度
                    "line_width": 2,
                    "line_style": ["arrow", "solid", "hollow"],//单双箭头 线段 arrow arrows segment  solid 实线 dotted 虚线  sincere 实心 hollow空心
                    "line_color": color,
                    "line_strength": data.lev/100
                },
                "data_id": dataid
            }
        }
        map.addLine(linedata);
    }
}

// 页面加载完成后初始化地图页面
// if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', initMapPage);
// } else {
//     initMapPage();
// }