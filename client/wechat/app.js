var config = require('./config/config');
//app.js
App({
  onLaunch: function () {
    var _this = this;

    //加载学校信息到全局
    this.globalData.schoolInfoList = config.schoolList;

    //从缓存加载选择的学校
    this.globalData.selectSchool = wx.getStorageSync('selectSchool') || 0;

    //缓存加载用户信息
    this.globalData.uInfo = wx.getStorageSync('CACHE.uInfo') || {};

    this.globalData.login = wx.getStorageSync('CACHE.login') || false;

    if (!this.globalData.login) {
      // 没登录
      // 登陆 Promise 写法
      new Promise(function (resolve, reject) {
        wx.login({// 发送 res.code 到后台换取 openId, sessionKey, unionId
          success: res => { resolve(res) },
          fail: res => { reject('wxlogin登陆失败：' + res.errMsg) }
        })
      }).then(function (upperData) {
        return new Promise(function (resolve, reject) {
          wx.request({  //请求微信api获取openid
            url: config.requestUrl + 'getopenid',
            data: {
              jsCode: upperData.code
            },
            success: res => {
              console.log(res); 
              resolve(res);
            },
            fail: res => { reject('获取openid失败：' + res.errMsg) }
          })
        });
      }).then(function (upperData) {
        // 拿到openid
        if (_this.uInfoCallback) {
          _this.uInfoCallback(upperData);
        }
        _this.globalData.openId = upperData.data.openid;  // 存储openid到全局
        _this.globalData.uInfo = upperData.data;
        console.log(_this.globalData);
      })
    }else {
      // 有登录信息了
      _this.getUInfo();
    }
  },
  /**
   * show权限不足提示框
   */
  showAuthTips: function () {
    wx.showModal({
      title: '提示',
      content: '您禁止了微信获取您的用户信息，在“我的”页面右上角的设置按钮中可以重新开启授权。未授权不能进行拼车。',
      showCancel: false,
      confirmText: '知道了'
    })
  },
  /**
   * 检查用户授权情况
   */
  checkAuth: function (callback) {
    var _this = this;
    //  && !res.authSetting['scope.userLocation']   // 定位权限不一定需要
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) { //用户信息权限一定需要
          if (_this.globalData.login) {
            callback();
          } else {
            wx.showModal({
              title: '提示',
              content: '请先去"我的"页面登录再进行操作',
              showCancel: false,
              confirmText: '知道了'
            })
          }
        } else {
          _this.showAuthTips();
        }
      }
    })
  },
  /**
   * 获取微信用户基本信息
   */
  // getUserInfo: function () {
  //   var _this = this;
  // wx.getUserInfo({
  //   success: function (res) {
  //     _this.globalData.userInfo = res.userInfo;
  //     if (_this.userInfoReadyCallback) {  // 回调防止不同步
  //       _this.userInfoReadyCallback(res);
  //     }
  //   }
  // })
  // },
  /**
   * 获取服务器端用户信息
   */
  getUInfo: function (callback) {
    var _this = this;
    console.log(_this.globalData);

    var openId = _this.globalData.openId || _this.globalData.uInfo.openid;

    wx.request({
      url: config.requestUrl + 'getuinfo',
      data: {
        openid: openId
      },
      success: function (data) {
        var uInfo = data.data;
        _this.globalData.uInfo = uInfo;
        wx.setStorage({
          key: 'CACHE.uInfo',
          data: uInfo,
        })
        if (callback) {
          callback(uInfo);
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '连接服务器失败: ' + res.errMsg,
          icon: 'none'
        })
      }
    })
  },
  /**
   * 修改服务器用户信息
   */
  setUInfo: function (newInfo, callback) {
    var _this = this;
    wx.request({
      method: 'PUT',
      url: config.requestUrl + 'setuinfo',
      data: {
        _id: _this.globalData.uInfo._id,
        newInfo: newInfo
      },
      success: function (data) {
        console.log(data);
        if (callback) {
          callback(data);
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    selectSchool: 0,
    schoolInfoList: [],
    uInfo: {}
  }
})