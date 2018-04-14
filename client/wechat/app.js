var config = require('./config/config');
//app.js
App({
  onLaunch: function () {
    var _this = this;

    //加载学校信息到全局
    this.globalData.schoolInfoList = config.schoolList;

    //从缓存加载选择的学校
    this.globalData.selectSchool = wx.getStorageSync('selectSchool') || 0;

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
          success: res => { resolve(res) },
          fail: res => { reject('获取openid失败：' + res.errMsg) }
        })
      });
    }).then(function (upperData) {
      _this.globalData.openId = upperData.data.openid;  // 存储openid到全局
      if (upperData.errcode) {
        console.log('重复请求登陆');
      } else {
        // 获取微信端用户信息 (头像、名字等)
        return new Promise(function (resolve, reject) {
          wx.getUserInfo({
            withCredentials: true,
            success: res => { resolve(res) },
            fail: res => { reject('getUserInfo失败：' + res.errMsg) }
          });
        });
      }
    }).then(function (upperData) {
      _this.globalData.userInfo = upperData.userInfo;
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      if (_this.userInfoReadyCallback) {
        _this.userInfoReadyCallback(res);
      }
      return new Promise(function (resolve, reject) {
        // 发请求给服务器存openid、及用户其他数据, 取回用户信息
        wx.request({
          method: 'POST',
          url: config.requestUrl + 'setopenid',
          data: {
            openid: _this.globalData.openId,
            userInfo: _this.globalData.userInfo
          },
          success: res => { resolve(res) },
          fail: res => { reject('setopenid失败：' + res.errMsg) }
        })
      });
    }).then(function (upperData) {
      var uInfo = upperData.data;
      _this.globalData.uInfo = uInfo;
      console.log(_this.globalData.uInfo);
      // 回调以解决不同步问题
      if (_this.uInfoCallback) {
        _this.uInfoCallback(uInfo);
      }
    }).catch(function (error) { // 处理错误
      console.error(error);
    })

    // 向用户请求授权
    wx.authorize({
      scope: 'scope.userInfo'
    })

    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     console.log(res.code);
    //     var _this = this;
    //     wx.request({
    //       url: config.requestUrl + 'getopenid',
    //       data: {
    //         jsCode: res.code
    //       },
    //       success: function (data) {
    //         _this.globalData.openId = data.data.openid;
    //         // console.log(data)
    //         // var errcode = data.errcode || true;
    //         if (data.errcode) {
    //           console.log('重复请求登陆');
    //         } else {

    //           // 获取微信端用户信息 (头像、名字等)
    //           wx.getUserInfo({
    //             withCredentials: true,
    //             success: function (res) {

    //               _this.globalData.userInfo = res.userInfo;
    //               // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //               // 所以此处加入 callback 以防止这种情况
    //               if (_this.userInfoReadyCallback) {
    //                 _this.userInfoReadyCallback(res);
    //               }
    //               // 发请求给服务器存openid、及用户其他数据, 取回用户信息
    //               wx.request({
    //                 method: 'POST',
    //                 url: config.requestUrl + 'setopenid',
    //                 data: {
    //                   openid: _this.globalData.openId,
    //                   userInfo: _this.globalData.userInfo
    //                 },
    //                 success: function (data) {
    //                   var uInfo = data.data[0];
    //                   _this.globalData.uInfo = uInfo;
    //                   console.log(_this.globalData.uInfo);
    //                   // 回调以解决不同步问题
    //                   if (_this.uInfoCallback) {
    //                     _this.uInfoCallback(uInfo);
    //                   }
    //                 },
    //                 fail: function (res) {
    //                   //setoid请求失败
    //                   console.error('setoid请求失败' + res);
    //                 }
    //               })
    //             },
    //             fail: function (res) {
    //               //getUserInfo请求失败
    //               console.error('getUserInfo请求失败' + res);
    //             }
    //           })
    //         }
    //       },
    //       fail: function (res) {
    //         //getopenid请求失败
    //         console.error('getopenid请求失败' + res);
    //       }
    //     })
    //   }
    // })

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
          callback();
        } else {
          _this.showAuthTips();
        }
      }
    })
  },
  /**
   * 获取微信用户基本信息
   */
  getUserInfo: function () {
    var _this = this;
    wx.getUserInfo({
      success: function (res) {
        _this.globalData.userInfo = res.userInfo;
        if (_this.userInfoReadyCallback) {  // 回调防止不同步
          _this.userInfoReadyCallback(res);
        }
      }
    })
  },
  /**
   * 获取服务器端用户信息
   */
  getUInfo: function () {
    var _this = this;
    wx.request({
      url: config.requestUrl + 'getuinfo',
      data: {
        openid: _this.globalData.openId
      },
      success: function (data) {
        var uInfo = data.data;
        _this.globalData.uInfo = uInfo;
        if (_this.uInfoCallback) {
          _this.uInfoCallback(uInfo);
        }
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
    openId: null,
    uInfo: {}
  }
})