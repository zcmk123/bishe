var config = require('./config/config');
//app.js
App({
  onLaunch: function () {
    var _this = this;

    //加载学校信息到全局
    this.globalData.schoolInfoList = config.schoolList;

    //从缓存加载选择的学校
    this.globalData.selectSchool = wx.getStorageSync('selectSchool') || 0;

    // // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res.code);
        var _this = this;
        wx.request({
          url: config.requestUrl + 'getopenid',
          data: {
            jsCode: res.code
          },
          success: function (data) {
            _this.globalData.openId = data.data.openid;
            // console.log(data)
            // var errcode = data.errcode || true;
            if (data.errcode) {
              console.log('重复请求登陆');
            } else {
              // 获取微信端用户信息 (头像、名字等)
              wx.getUserInfo({
                withCredentials: true,
                success: function (res) {

                  _this.globalData.userInfo = res.userInfo;
                  // 发请求给服务器存openid、及用户其他数据, 取回用户信息
                  wx.request({
                    method: 'POST',
                    url: config.requestUrl + 'setopenid',
                    data: {
                      openid: _this.globalData.openId,
                      userInfo: _this.globalData.userInfo
                    },
                    success: function (data) {
                      var uInfo = data.data[0];
                      _this.globalData.uInfo = uInfo;
                      console.log(_this.globalData.uInfo);
                      // 回调以解决不同步问题
                      if (_this.uInfoCallback) {
                        _this.uInfoCallback(uInfo);
                      }
                    },
                    fail: function (res) {
                      //setoid请求失败
                      console.error('setoid请求失败' + res);
                    }
                  })
                },
                fail: function (res) {
                  //getUserInfo请求失败
                  console.error('getUserInfo请求失败' + res);
                }
              })
            }
          },
          fail: function (res) {
            //getopenid请求失败
            console.error('getopenid请求失败' + res);
          }
        })
      }
    })

    // 向用户请求授权
    wx.authorize({
      scope: 'scope.userInfo',
      // success: function () {
      //   wx.authorize({
      //     scope: 'scope.userLocation',
      //     success: getInfo
      //   })
      // }
    })

    function getInfo() {
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                _this.globalData.userInfo = res.userInfo;

                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (_this.userInfoReadyCallback) {
                  _this.userInfoReadyCallback(res);
                }
              }
            })
          }
        }
      })
    }
  },
  /**
   * 获取服务器端用户信息
   */
  getUInfo: function (callback) {
    var _this = this;
    wx.request({
      url: config.requestUrl + 'getuinfo',
      data: {
        openid: _this.globalData.openId
      },
      success: function (data) {
        // _this.globalData.uInfo = data.data;
        _this.globalData.uInfo = data.data;
        if (callback) {
          callback();
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