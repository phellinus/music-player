/**
 * 解析歌词字符串
 */
function parseLrc() {
    var lines = lrc.split("\n");
    var result = [];
    lines.forEach((line) => {
        var parts = line.split("]");
        var timesStr = parts[0].substring(1);      
        var obj = {
            time: parseTime(timesStr),
            word: parts[1],
        };
        result.push(obj);
    });
    return result;
}
/**
 * 将一个时间字符串转化为数字（秒）
 * @param {*} timeStr 时间字符
 * @returns 
 */
function parseTime(timeStr) {
    var parts = timeStr.split(":");
    return +parts[0] * 60 + +parts[1];
}
var lrcData = parseLrc();
// 获取需要的dom
var doms = {
    audio: document.querySelector('audio'),
    ul: document.querySelector('.container ul'),
    container: document.querySelector('.container'),
}
/**
 * 计算出当前应该播放的歌词
 */
function findIndex(){
    var curTime = doms.audio.currentTime;
    let i = lrcData.findIndex(item => curTime < item.time);
    return i === -1 ? lrcData.length - 1 : i - 1;
}
// function findIndex(){
//     var curTime = doms.audio.currentTime;
//     for (var i = 0;i<lrcData.length;i++){
//           if(curTime < lrcData[i].time){
//             return i - 1;
//         }
//     }
//     return lrcData.length - 1;
// }
//界面
/**
 * 创建歌词元素 li
 */
function createLrcElements(){
    var frag = document.createDocumentFragment();
    lrcData.forEach((item, index) => {
        var li = document.createElement("li");
        li.textContent = lrcData[index].word;
        frag.appendChild(li);
    })
    doms.ul.appendChild(frag)

}
createLrcElements();

// 容器高度
var containerHeight = doms.container.clientHeight;
//每个li的高度
var liHeight = doms.ul.children[0].clientHeight;
//最大偏移量
var maxOffset = doms.ul.clientHeight - containerHeight;
/**
 * 设置ul元素的偏移量
 */
function setOffset() {
    var index = findIndex();
    var offset = liHeight * index + liHeight / 2 - containerHeight / 2;
    if (offset < 0) {
        offset = 0;
    }
    if (offset > maxOffset) {
        offset = maxOffset;
    }

    doms.ul.style.transform = `translateY(-${offset}px)`;
    var li = doms.ul.querySelector('.active')
    if(li){
        li.classList.remove('active');
    }
    li = doms.ul.children[index];
    if(li){
        li.classList.add('active');
    }
}

doms.audio.addEventListener('timeupdate', setOffset);