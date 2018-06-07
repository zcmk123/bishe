// pages/my-order/my-order.js
const app = getApp();
var config = require('../../config/config');
var util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    currentTab: 0,// 判断是哪个页面 0---我加入的  1---我发布的
    listData: {    // 后台接收的数据
      isLoading: false
    }
  },
  /**
   * 点击切换加载内容
   */
  clickTab: function (e) {
    var _this = this;
    var clickTab = e.target.dataset.current;
    if (this.data.currentTab != clickTab) { // 点击的就是当前页面，不做处理
      if (clickTab == 0) {  // 我加入的Tab
        _this.setData({
          currentTab: clickTab,
          page: 1          
        })
        _this.requestOrder('myorder');
      } else if (clickTab == 1) {  // 我发布的Tab
        _this.setData({
          currentTab: clickTab,
          page: 1
        })
        this.requestOrder('postorder');
      }

    }
  },
  /**
   * 到订单详情页
   */
  bindItemTap: function (e) {
    var _this = this;
    var itemId = e.currentTarget.dataset.id;
    //带参数跳转
    wx.navigateTo({
      url: '/pages/order-info/order-info?itemId=' + itemId + '&tab=' + _this.data.currentTab
    })
  },
  /**
   * 初始化页面
   */
  initPage: function () {
    var currentPage = this.data.currentTab == 0 ? 'myorder' : 'postorder';
    this.requestOrder(currentPage);
  },
  /**
   * 请求postorder或者myorder
   */
  requestOrder: function (action) {
    var _this = this;
    var userId = app.globalData.uInfo._id;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: config.requestUrl + 'order/' + action,   // 请求我的订单
      data: {
        userId: userId,
        page: this.data.page
      },
      success: function (res) {
        _this.setData({
          ['listData.list']: util.formatData(res.data),
          ['listData.loadMoreText']: '下拉加载更多'
        })
        wx.hideLoading();
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    this.setData({
      page: 1       // 重置page
    })
    this.initPage();
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
    console.log('触底操作');
    var isLoading = this.data.isLoading;
    isLoading = isLoading ? false : true;
    _this.setData({ isLoading: isLoading });
    var userId = app.globalData.uInfo._id;
    var route = this.data.currentTab == 0 ? 'order/myorder' : 'order/postorder';
    // 向后台发送请求拉取数据
    wx.request({
      url: config.requestUrl + route,
      data: {
        userId: userId,
        page: _this.data.page + 1
      },
      success: function (data) {
        // 拉取信息成功
        if (data.data == 'end') {  // 没有更多数据了
          _this.setData({
            ['listData.loadMoreText']: '没有更多订单',
            ['listData.isLoading']: false
          })
        } else {
          var resData = util.formatData(data.data);
          var newLoadedList = _this.data.listData.list.concat(resData);
          _this.setData({
            ['listData.list']: newLoadedList,
            ['listData.isLoading']: false
          })
          _this.data.page++;
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})