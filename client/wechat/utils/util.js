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

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':');
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 计算时间差--相隔多少分钟
 */
function timeDiff (t1, t2) {
  return parseInt(t1 - t2) / 1000 / 60;
}

/**
 * 评分转换
 */
function ratingConvert (rating, cplorders) {
  var rateScore = rating / cplorders;
  if (Number.isNaN(rateScore)) {
    return 0;
  } else {
    return rateScore;
  }
}

/**
 * 订单状态转换
 */
function statusConvert (status) {
  return status == 0 ? '进行中' : '已完成';
}

/**
 * 显示信息转换
 * 1、UTC时间转化为本地时间字符串
 * 2、司机评分转换
 */
function formatData (data) {
  var dataType = Object.prototype.toString.call(data);
  // 判断data为对象还是数组

  switch (dataType) {
    case '[object Array]':  //为数组，循环转换每一项
      data.forEach(function (ele, index) {
        var tempDate = new Date(ele.date);
        ele.date = formatTime(tempDate);
        ele.status = statusConvert(ele.status);
      })
    break;
    case '[object Object]': //为对象，直接转换
      var tempDate = new Date(data.date);
      var driverInfo = data.driver.isdriver;
      data.date = formatTime(tempDate); // 转换时间
      driverInfo.rating = ratingConvert(driverInfo.rating, driverInfo.cplorders);  // 转换评分
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
  formatData: formatData,
  isDriver: isDriver,
  timeDiff: timeDiff
}
