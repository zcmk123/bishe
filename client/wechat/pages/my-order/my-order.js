// pages/my-order/my-order.js
const app = getApp();
var config = require('../../config/config');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    listData: []    // 后台接收的数据
  },
  /**
   * 点击切换加载内容
   */
  clickTab: function (e) {
    var _this = this;
    var clickTab = e.target.dataset.current;
    if (this.data.currentTab != clickTab) { // 点击的就是当前页面，不做处理

      if (clickTab == 1) {  // 我发布的Tab
        _this.setData({
          currentTab: clickTab,
          listData: [{
            title: 'zhouchenminkun',
            ['startLoc.name']: '186454321434'
          }]
        })
      } else if (clickTab == 0) {  // 我加入的Tab
        _this.setData({
          currentTab: clickTab,
          listData: [{
            title: 'sadasdasda1',
            ['startLoc.name']: '6+546646464'
          }]
        })
      }

    }
  },
  /**
   * 初始化页面
   */
  initPage: function () {
    var userId = app.globalData.uInfo._id;
    wx.request({
      url: config.requestUrl + 'order/myorder',   // 请求我的订单
      data: {
        userId: userId
      },
      success: function (res) {
        console.log(res);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  // TODO 加载我加入的拼车
  this.initPage();
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