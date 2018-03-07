//app.js
App({
  onLaunch: function () {
    var _this = this;
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
          method: 'GET',
          url: 'https://pinche.istarmcgames.com/getopenid',
          // url: 'http://localhost/getopenid',
          data: {
            jsCode: res.code
          },
          success: function (data) {
            _this.globalData.openid = data.data.openid;
            console.log(data)
            // var errcode = data.errcode || true;
            if (data.errcode) {
              console.log('重复请求登陆');
            } else {
              // 发请求给服务器存openid
              wx.request({
                url: 'https://pinche.istarmcgames.com/setopenid',
                // url: 'http://localhost/setopenid',
                data: {
                  openid: _this.globalData.openid
                },
                success: function (data) {
                  var uInfo = data.data[0];
                  _this.globalData.uInfo = uInfo;
                  // 回调以解决不同步问题
                  if(_this.uInfoCallback) {
                    _this.uInfoCallback(uInfo);
                  }
                },
                fail: function () {
                  console.log('setoid请求失败');
                }
              })
            }
          },
          fail: function () {
            console.log('fail');
          }
        })
      }
    })

    // 向用户请求授权
    wx.authorize({
      scope: 'scope.userInfo',
      success: function () {
        wx.authorize({
          scope: 'scope.userLocation',
          success: getInfo
        })
      }
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
                _this.globalData.userInfo = res.userInfo

                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (_this.userInfoReadyCallback) {
                  _this.userInfoReadyCallback(res)
                }
              }
            })
          }
        }
      })
    }

  },
  globalData: {
    userInfo: null,
    openId: null,
    uInfo: {}
  }
})