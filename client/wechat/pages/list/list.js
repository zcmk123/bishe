// pages/list/list.js
var util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    page: 1,// 默认页数
    isLoading: false,
    loadedList: []
  },
  loadList: function () {
    var _this = this;
    // show加载
    wx.showLoading({
      title: '加载中'
    })
    wx.request({
      url: 'https://pinche.istarmcgames.com/loadlist',
      // url: 'http://localhost/loadlist',
      data: {
        page: _this.data.page
      },
      success: function (data) {
        _this.setData({
          loadedList: data.data
        })
        wx.hideLoading();
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(util.formatTime(new Date()));


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
    this.loadList();
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
    var _this = this;
    console.log('触底操作')
    // var isLoading = this.data.isLoading;
    // isLoading = isLoading ? false : true;
    // _this.setData({
    //   isLoading: isLoading
    // })
    // setTimeout(function () {
    //   _this.setData({
    //     isLoading: false
    //   })
    // }, 2000)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})