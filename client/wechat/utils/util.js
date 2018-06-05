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
function timeDiff(t1, t2) {
  return parseInt(t1 - t2) / 1000 / 60;
}

/**
 * 评分转换
 */
function ratingConvert(rating, cplorders) {
  var rateScore = rating / cplorders;
  if (Number.isNaN(rateScore)) {
    return 0;
  } else {
    return rateScore.toFixed(2);
  }
}

/**
 * 转换等级
 */
function convertRank (credit) {
  var rank = null;
  if (credit >= 0 && credit < 200) {
    rank = 0;
  } else if (credit >= 200 && credit < 500) {
    rank = 1;
  } else if (credit >= 500 && credit < 1000) {
    rank = 2;
  } else if (credit >= 100 && credit < 1500) {
    rank = 3;
  } else if (credit >= 1500 && credit < 2000) {
    rank = 4;
  } else if (credit >= 2000) {
    rank = 5;
  }
  return rank;
}

/**
 * 订单状态转换
 */
function statusConvert(status) {
  return status == 0 ? '进行中' : '已完成';
}

/**
 * 显示信息转换
 * 1、UTC时间转化为本地时间字符串
 * 2、司机评分转换
 */
function formatData(data) {
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

function checkPhoneNum(phone) {
  var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (!myreg.test(phone)) {
    return false;
  } else {
    return true;
  }
}

/**
 * 判断是否通过司机认证
 */
function isDriver(uInfo) {
  var v_status = config.v_statusArr[uInfo.isdriver.v_status];
  return v_status == 'verified' ? true : false;
}

/**
 * 去除两边空格
 */
function trim (str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

/**
 * 兼容iosDate
 */
function iosDate(dateStr) {
  var iosDateArr = dateStr.split(/[- : \/]/);
  return new Date(iosDateArr[0], iosDateArr[1] - 1, iosDateArr[2], iosDateArr[3], iosDateArr[4]);
}

module.exports = {
  formatTime: formatTime,
  formatData: formatData,
  convertRank: convertRank,
  isDriver: isDriver,
  timeDiff: timeDiff,
  checkPhoneNum: checkPhoneNum,
  trim: trim,
  iosDate: iosDate
}
