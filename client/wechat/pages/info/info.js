// pages/info/info.js
const app = getApp();
var config = require('../../config/config');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    genderArr: ['女', '男'],
    // 微信获取到的用户信息
    userInfo: {},
    // 后端传来的用户信息
    uInfo: {
      credit: 500,
      gender: 1,
      school: "桂林电子科技大学",
      phone: "18577361464",
      driver: false
    },
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  /**
   * 跳转到司机验证/信息页面
   */
  bindToDriverInfo: function () {
    var driverInfo = app.globalData.uInfo.driver;
    var v_status = config.v_statusArr[driverInfo.v_status];

    if (v_status == 'unverified') {
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
    } else {
      wx.navigateTo({
        url: '/pages/driver-info/driver-info'
      })
    }
  },
  /**
   * 跳转到我的订单页面
   */
  bindToOrder: function () {

  },
  bindGenderChange: function (e) {
    var gender = parseInt(e.detail.value);
    this.setData({
      ['uInfo.gender']: gender
    })
  },
  bindSchoolChange: function (e) {
    var school = e.detail.value;
    this.setData({
      ['uInfo.school']: school
    })
  },
  bindPhoneChange: function (e) {
    var phone = e.detail.value;
    this.setData({
      ['uInfo.phone']: phone
    })
  },
  /**
   * 获取、设置用户信息到Data
   */
  setUserInfo: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  setUinfo: function () {

    if (app.globalData.uInfo.openid) {
      this.setData({
        uInfo: app.globalData.uInfo
      })
    } else {
      app.uInfoCallback = uInfo => {
        // console.log(uInfo)
        this.setData({
          uInfo: uInfo
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setUserInfo();
    this.setUinfo();
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