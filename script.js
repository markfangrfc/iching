// 常量與定義
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzZzNGr7Kq44tFSHMKEt9NnZvLXXnMPUqUKIvp0fZNmj1V4dfEtcG1-t9-lngqoQ9dM/exec';

// 卦象定義
const hexagramData = {
    "111111": { name: "乾為天", description: "乾" },
    "000000": { name: "坤為地", description: "坤" },
    "010001": { name: "水雷屯", description: "屯" },
    "100010": { name: "山水蒙", description: "蒙" },
    "010111": { name: "水天需", description: "需" },
    "111010": { name: "天水訟", description: "訟" },
    "000010": { name: "地水師", description: "師" },
    "010000": { name: "水地比", description: "比" },
    "110111": { name: "風天小畜", description: "小畜" },
    "111011": { name: "天澤履", description: "履" },
    "000111": { name: "地天泰", description: "泰" },
    "111000": { name: "天地否", description: "否" },
    "111101": { name: "天火同人", description: "同人" },
    "101111": { name: "火天大有", description: "大有" },
    "000100": { name: "地山謙", description: "謙" },
    "001000": { name: "雷地豫", description: "豫" },
    "011001": { name: "澤雷隨", description: "隨" },
    "100110": { name: "山風蠱", description: "蠱" },
    "000011": { name: "地澤臨", description: "臨" },
    "110000": { name: "風地觀", description: "觀" },
    "101001": { name: "火雷噬嗑", description: "噬嗑" },
    "100101": { name: "山火賁", description: "賁" },
    "100000": { name: "山地剝", description: "剝" },
    "000001": { name: "地雷復", description: "復" },
    "111001": { name: "天雷無妄", description: "無妄" },
    "100111": { name: "山天大畜", description: "大畜" },
    "100001": { name: "山雷頤", description: "頤" },
    "011110": { name: "澤風大過", description: "大過" },
    "010010": { name: "水山坎", description: "坎" },
    "101101": { name: "火澤睽", description: "睽" },
    "001110": { name: "雷澤歸妹", description: "歸妹" },
    "011100": { name: "風火家人", description: "家人" },
    "101100": { name: "火山旅", description: "旅" },
    "001101": { name: "雷風恆", description: "恆" },
    "101000": { name: "火地晉", description: "晉" },
    "000101": { name: "地火明夷", description: "明夷" },
    "110101": { name: "風火家人", description: "家人" },
    "101011": { name: "火澤睽", description: "睽" },
    "001010": { name: "雷水解", description: "解" },
    "010100": { name: "水山蹇", description: "蹇" },
    "100011": { name: "山澤損", description: "損" },
    "110001": { name: "風雷益", description: "益" },
    "011111": { name: "澤天夬", description: "夬" },
    "111110": { name: "天風姤", description: "姤" },
    "000110": { name: "地澤萃", description: "萃" },
    "011000": { name: "澤地升", description: "升" },
    "010110": { name: "水風井", description: "井" },
    "011010": { name: "澤水困", description: "困" },
    "101110": { name: "火風鼎", description: "鼎" },
    "011101": { name: "澤火革", description: "革" },
    "100100": { name: "山雷頤", description: "頤" },
    "001001": { name: "雷澤歸妹", description: "歸妹" },
    "001011": { name: "雷天大壯", description: "大壯" },
    "110100": { name: "風山漸", description: "漸" },
    "101001": { name: "火山旅", description: "旅" },
    "110011": { name: "風澤中孚", description: "中孚" },
    "001100": { name: "雷火豐", description: "豐" },
    "110010": { name: "風水渙", description: "渙" },
    "010011": { name: "水澤節", description: "節" },
    "001111": { name: "雷天大壯", description: "大壯" },
    "111100": { name: "天山遁", description: "遁" }
};

// DOM 元素
const questionInput = document.getElementById('question');
const seedCodeInput = document.getElementById('seed-code');
const generateBtn = document.getElementById('generate-btn');
const resultContainer = document.getElementById('result-container');
const hexagramLinesContainer = document.getElementById('hexagram-lines');
const hexagramNameElement = document.getElementById('hexagram-name');
const calculationElement = document.getElementById('calculation');
const interpretBtn = document.getElementById('interpret-btn');
const loadingElement = document.getElementById('loading');
const interpretationResultElement = document.getElementById('interpretation-result');
const interpretationElement = document.getElementById('interpretation');

// 事件監聽器
generateBtn.addEventListener('click', generateHexagram);
interpretBtn.addEventListener('click', interpretHexagram);

// 生成卦象
function generateHexagram() {
    const question = questionInput.value.trim();
    const seedCode = seedCodeInput.value.trim();
    
    if (!question) {
        alert('請輸入您的問題！');
        return;
    }
    
    if (!seedCode) {
        alert('請輸入種子碼！');
        return;
    }
    
    // 使用種子碼生成卦象
    const hexagramValues = generateHexagramValues(seedCode);
    const hexagramCode = convertValuesToCode(hexagramValues);
    const hexagramInfo = getHexagramInfo(hexagramCode);
    
    // 計算總和並用55減去結果
    const sum = hexagramValues.reduce((a, b) => a + b, 0);
    const calculationResult = 55 - sum;
    
    // 顯示卦象
    displayHexagram(hexagramValues, hexagramInfo.name);
    calculationElement.textContent = `爻值總和: ${sum}, 55減總和: ${calculationResult}`;
    
    // 顯示結果容器
    resultContainer.classList.remove('hidden');
    interpretationResultElement.classList.add('hidden');
    
    // 保存數據到 Google Sheets
    saveToGoogleSheets(question, seedCode, hexagramValues, hexagramInfo.name, calculationResult);
}

// 使用種子碼生成六爻數值
function generateHexagramValues(seed) {
    // 使用簡單的字符串哈希算法
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        hash |= 0; // 轉換為32位整數
    }
    
    // 設置隨機種子
    Math.seedrandom(hash.toString());
    
    // 生成六個數值 (6, 7, 8, 9)
    const values = [];
    for (let i = 0; i < 6; i++) {
        const randomVal = Math.floor(Math.random() * 4) + 6; // 6-9
        values.push(randomVal);
    }
    
    return values;
}

// 將數值轉換為卦象代碼 (0和1)
function convertValuesToCode(values) {
    return values.map(val => {
        // 6(老陰)和8(少陰)轉換為0，7(少陽)和9(老陽)轉換為1
        return (val === 7 || val === 9) ? '1' : '0';
    }).join('');
}

// 獲取卦象信息
function getHexagramInfo(code) {
    return hexagramData[code] || { name: "未知卦象", description: "未知" };
}

// 顯示卦象
function displayHexagram(values, name) {
    // 清空現有爻線
    hexagramLinesContainer.innerHTML = '';
    
    // 設置卦名
    hexagramNameElement.textContent = name;
    
    // 從下到上創建爻線 (第一爻在最下方)
    for (let i = 0; i < 6; i++) {
        const lineValue = values[5 - i]; // 反轉順序，第一爻在最下方
        const isYang = lineValue === 7 || lineValue === 9; // 7(少陽)和9(老陽)是陽爻
        
        const lineElement = document.createElement('div');
        lineElement.className = `line ${isYang ? 'yang' : 'yin'}`;
        
        // 添加爻位數字
        const lineNumber = document.createElement('span');
        lineNumber.className = 'line-number';
        lineNumber.textContent = i + 1;
        lineElement.appendChild(lineNumber);
        
        // 添加爻值
        const lineValueElement = document.createElement('span');
        lineValueElement.className = 'line-value';
        lineValueElement.textContent = lineValue;
        lineElement.appendChild(lineValueElement);
        
        hexagramLinesContainer.appendChild(lineElement);
    }
}

// 保存到 Google Sheets - 使用最簡單可靠的方法
function saveToGoogleSheets(question, seedCode, hexagramValues, hexagramName, calculationResult) {
    const data = {
        action: 'saveReading',
        question: question,
        seedCode: seedCode,
        hexagramValues: hexagramValues,
        hexagramName: hexagramName,
        calculationResult: calculationResult
    };
    
    console.log('正在發送數據到 Google Sheets:', data);
    
    // 打印詳細調試信息
    console.log('問題:', question);
    console.log('種子碼:', seedCode);
    console.log('六爻值:', hexagramValues);
    console.log('卦名:', hexagramName);
    console.log('計算結果:', calculationResult);
    
    // 使用XML HTTP請求而不是表單提交
    const xhr = new XMLHttpRequest();
    xhr.open('POST', APPS_SCRIPT_URL);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
        if (xhr.status === 200) {
            console.log('數據已成功發送到 Google Sheets, 回應:', xhr.responseText);
            window.currentRowId = true;
            alert('數據保存成功!');
        } else {
            console.error('保存數據時發生錯誤:', xhr.statusText);
            alert('保存數據時發生錯誤: ' + xhr.statusText);
        }
    };
    xhr.onerror = function() {
        console.error('保存數據請求失敗');
        alert('保存數據請求失敗，請檢查網絡連接');
    };
    
    // 發送數據
    const formData = 'data=' + encodeURIComponent(JSON.stringify(data));
    console.log('發送的表單數據:', formData);
    xhr.send(formData);
}

// 解卦 - 使用同樣的方法與服務器通信
function interpretHexagram() {
    const question = questionInput.value.trim();
    const hexagramName = hexagramNameElement.textContent;
    
    // 獲取爻值
    const hexagramValues = [];
    const lineElements = hexagramLinesContainer.querySelectorAll('.line');
    
    for (let i = lineElements.length - 1; i >= 0; i--) {
        const valueElement = lineElements[i].querySelector('.line-value');
        hexagramValues.push(parseInt(valueElement.textContent));
    }
    
    // 顯示載入中
    loadingElement.classList.remove('hidden');
    interpretBtn.disabled = true;
    
    // 準備數據
    const data = {
        action: 'interpret',
        question: question,
        hexagramName: hexagramName,
        hexagramValues: hexagramValues,
        rowId: window.currentRowId || 0
    };
    
    // 使用XML HTTP請求
    const xhr = new XMLHttpRequest();
    xhr.open('POST', APPS_SCRIPT_URL);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
        if (xhr.status === 200) {
            console.log('解卦請求成功, 回應:', xhr.responseText);
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.success && response.interpretation) {
                    // 使用服務器返回的解卦結果
                    displayInterpretation(response.interpretation);
                } else {
                    // 如果服務器響應格式不正確，使用模擬解卦
                    simulateInterpretation(question, hexagramName, hexagramValues);
                }
            } catch (error) {
                console.error('解析服務器響應時出錯:', error);
                // 使用模擬解卦作為備用
                simulateInterpretation(question, hexagramName, hexagramValues);
            }
        } else {
            console.error('解卦請求失敗:', xhr.statusText);
            // 使用模擬解卦作為備用
            simulateInterpretation(question, hexagramName, hexagramValues);
        }
    };
    xhr.onerror = function() {
        console.error('解卦請求網絡錯誤');
        // 使用模擬解卦作為備用
        simulateInterpretation(question, hexagramName, hexagramValues);
    };
    
    // 發送數據
    const formData = 'data=' + encodeURIComponent(JSON.stringify(data));
    console.log('發送的解卦請求數據:', formData);
    xhr.send(formData);
}

// 顯示解卦結果
function displayInterpretation(interpretation) {
    // 隱藏載入中，顯示結果
    loadingElement.classList.add('hidden');
    interpretationResultElement.classList.remove('hidden');
    interpretBtn.disabled = false;
    
    // 設置解卦結果
    interpretationElement.textContent = interpretation;
}

// 模擬解卦結果（實際應用中將從API獲取）
function simulateInterpretation(question, hexagramName, values) {
    // 隱藏載入中，顯示結果
    loadingElement.classList.add('hidden');
    interpretationResultElement.classList.remove('hidden');
    interpretBtn.disabled = false;
    
    // 創建一個基本的解卦結果
    const hexType = values.reduce((a, b) => a + b, 0) % 2 === 0 ? '陰' : '陽';
    const interpretation = `
【${hexagramName}】卦象解讀

關於您的問題："${question}"

卦象分析：
您所得到的是${hexagramName}卦，總體呈現${hexType}性特質。
六爻數值為：${values.join(', ')}，表示...

[注意：由於目前使用的是模擬結果，實際解卦內容將在實際部署後替換]

這個卦象對您的啟示：
1. 根據卦象特性，您應該保持冷靜，審時度勢
2. 注意把握當前機會，但不要操之過急
3. 保持謹慎並堅持自己的原則

※ 請記住，卦象只是指引，最終決定權在您手中。
`;
    
    interpretationElement.textContent = interpretation;
    
    console.log('解卦完成，已顯示模擬結果');
}

// 添加 seedrandom 庫用於基於種子碼的隨機數生成
!function(a,b,c,d,e,f,g,h,i){function j(a){var b,c=a.length,e=this,f=0,g=e.i=e.j=0,h=e.S=[];for(c||(a=[c++]);d>f;)h[f]=f++;for(f=0;d>f;f++)h[f]=h[f+a[f%c]&d-1],b=h[f],h[f]=h[b],h[b]=b;(e.g=function(a){for(var b,c=0,f=e.i,g=e.j,h=e.S;a--;)b=h[f=(f+1)&d-1],c=c*d+h[(h[f]=h[g=(g+b)&d-1])+(h[g]=b)&d-1];return e.i=f,e.j=g,c})(d)}function k(a,b){var c,d=[],e=typeof a;if(b&&"object"==e)for(c in a)try{d.push(k(a[c],b-1))}catch(f){}return d.length?d:"string"==e?a:a+"\0"}function l(a,b){for(var c,d=a+"",e=0;e<d.length;)b[d-1&e]=b[d-1&e]<<8^d.charCodeAt(e++);return b}function m(c){if(c.F&&c.m)return c.m;var d=[];c.j=new j(d),c=new j(d);return c}b.seedrandom=function(d,e){var f=[],h=k(l(e?[d,a]:arguments.length?d:[(new Date).getTime(),a,window],3),f);return m(new j(f))}}([],Math,256,52);

// 當頁面加載完成後初始化
document.addEventListener('DOMContentLoaded', function() {
    // 測試種子化隨機數生成器
    console.log('測試種子化隨機數生成器:', Math.seedrandom('test'));
}); 