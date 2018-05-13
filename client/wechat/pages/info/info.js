// pages/info/info.js
const app = getApp();
var config = require('../../config/config');
var util = require('../../utils/util');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    login: false,
    genderArr: ['女', '男'],
    // 后端传来的用户信息
    uInfo: {  // 默认信息
      credit: 0,
      gender: 1,
      school: "",
      phone: "",
      driver: false
    },
    vipNum: 0
  },
  /**
   * 手动登录逻辑
   */
  userInfoHandler: function (e) { // 手动登录
    console.log(e.detail);
    var _this = this;
    var userInfo = e.detail.userInfo; // 微信的用户信息
    var openId = app.globalData.openId || app.globalData.uInfo.openid;
    if (e.detail.errMsg == 'getUserInfo:ok') {
      wx.request({
        method: 'POST',
        url: config.requestUrl + 'wechatlogin',
        data: {
          openId: openId,
          avatarUrl: userInfo.avatarUrl,
          nickname: userInfo.nickName
        },
        success: function (res) {
          _this.setData({
            login: true,
            userInfo: {
              nickName: res.data.nickname,
              avatarUrl: res.data.avatarUrl,
              gender: res.data.gender
            },
            uInfo: res.data,
            vipNum: util.convertRank(res.data.credit),
            hasUserInfo: true
          })
          app.globalData.uInfo = res.data; // 更新用户信息到全局变量
          app.globalData.login = true;
          wx.setStorage({
            key: 'CACHE.uInfo',
            data: res.data,
          })
          wx.setStorage({
            key: 'CACHE.login',
            data: true,
          })
          wx.showToast({
            title: '登录成功！',
            icon: 'none'
          })
        }
      })
    }
  },
  /**
   * 跳转评论页面
   */
  bindToComment: function () {
    wx.navigateTo({
      url: '/pages/recv-comment/recv-comment?userId=' + app.globalData.uInfo._id,
    })
  },
  /**
   * 跳转设置权限页面
   */
  bindToSetting: function () {
    wx.openSetting({});
  },
  /**
   * 跳转到司机验证/信息页面
   */
  bindToDriverInfo: function () {
    app.checkAuth(function () {
      var driverInfo = app.globalData.uInfo;
      if (util.isDriver(driverInfo)) {
        wx.navigateTo({
          url: '/pages/driver-info/driver-info'
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '你还没有完成司机认证，现在就认证吗？',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/driver-info/driver-info'
              })
            }
          }
        })
      }
    })
  },
  /**
   * 跳转到我的拼车页面
   */
  bindToOrder: function () {
    app.checkAuth(function () {
      wx.navigateTo({
        url: '/pages/my-order/my-order',
      })
    })
  },
  /**
   * 跳转到修改信息页面
   */
  bindToEditInfo: function () {
    app.checkAuth(function () {
      wx.navigateTo({
        url: '/pages/edit-info/edit-info',
      })
    })
  },
  /**
   * 获取、设置用户信息到Data
   */
  setUserInfo: function () {
    if (app.globalData.login) { // 如果已经登录
      this.setData({
        'userInfo.nickName': app.globalData.uInfo.nickname,
        'userInfo.avatarUrl': app.globalData.uInfo.avatarUrl,
        login: true,
        hasUserInfo: true
      })
    } else {
      // 未登录显示的东西
      this.setData({
        userInfo: {
          nickName: '用户昵称', //默认提示
          avatarUrl: '/images/img/testAvatar.jpg'  //默认头像
        }
      });
    }
  },
  /**
   * 设置服务器获取的用户信息
   */
  setUInfo: function () {
    var _this = this;
    console.log(app.globalData)
    if (app.globalData.uInfo.openid && app.globalData.login) {
      _this.setData({
        uInfo: app.globalData.uInfo,
        vipNum: util.convertRank(app.globalData.uInfo.credit)
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // console.log(app.globalData)

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this = this;
    app.getUInfo(function () {
      _this.setUserInfo();
      _this.setUInfo();
    })
    // var _this = this;
    // var hasUserInfo = this.data.hasUserInfo;
    // wx.getSetting({
    //   success: function (res) {
    //     if (res.authSetting['scope.userInfo'] && !hasUserInfo) {  //有权限但是没有userInfo
    //       // 尝试更新用户信息
    //       console.log('尝试更新用户信息。。。');
    //       // TODO 更新失败处理
    //       // app.getUserInfo();
    //       app.getUInfo();
    //       // console.log(app.globalData);
    //     }
    //   }
    // })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})