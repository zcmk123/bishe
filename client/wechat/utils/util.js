var config = require('../config/config');
/**
 * 格式化时间工具方法
 */
const formatTime = date => {
  // console.log(date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * UTC时间转化为本地时间字符串
 */
function formatDate (data) {
  var dataType = Object.prototype.toString.call(data);
  // 判断data为对象还是数组

  switch (dataType) {
    case '[object Array]':  //为数组，循环转换每一项
      data.forEach(function (ele, index) {
        var tempDate = new Date(ele.date);
        ele.date = formatTime(tempDate);
      })
    break;
    case '[object Object]': //为对象，直接转换
      var tempDate = new Date(data.date);
      data.date = formatTime(tempDate);
    break;
  }
  return data;
}

/**
 * 判断是否通过司机认证
 */
function isDriver (uInfo) {
  var v_status = config.v_statusArr[uInfo.isdriver.v_status];
  return v_status == 'verified' ? true : false;
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  isDriver: isDriver
}
