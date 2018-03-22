// pages/list-item/list-item.js
const app = getApp();
var util = require('../../utils/util.js');
var config = require('../../config/config');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemData: null,
    subBtnStatus: false
  },
  /**
   * 确认拼车，按钮逻辑
   */
  bindPinChe: function () {
    var passengerId = app.globalData.uInfo._id;
    var itemId = this.data.itemId;
    //发请求添加乘客到拼车中
    wx.request({
      url: config.requestUrl + 'addpassenger',
      data: {
        itemId: itemId,
        passengerId: passengerId
      },
      success: function (data) {
        wx.showToast({
          title: '成功！',
          icon: "success",
          success: function () {
            //返回上一页
            setTimeout(wx.navigateBack, 1500);
          }
        })
      }
    })
  },
  /**
   * 初始化页面
   */
  itemPageInit: function (itemId) {
    var _this = this;
    //发请求，请求单条信息详情
    wx.request({
      url: config.requestUrl + 'loaditem',
      data: {
        itemId: itemId
      },
      success: function (data) {
        //后端传回的数据设置到页面
        _this.setData({
          itemId: itemId,
          itemData: data.data
        })
        //检查乘客是否能拼车
        _this.checkPassenger();
      }
    })
  },
  /**
   * 检查乘客是否能拼车
   * 司机/已在此次拼车中的乘客  不能点击确定拼车按钮
   */
  checkPassenger: function () {
    var selfId = app.globalData.uInfo._id;
    var driverId = this.data.itemData.driverId;
    var passengerArr = this.data.itemData.passenger;
    //判断乘客是否已经在这次拼车中，如果在则不允许再点击拼车按钮
    if ((selfId != driverId) && (passengerArr.indexOf(selfId) == -1)) {//司机自己不能再次参加自己的拼车
      this.setData({
        subBtnStatus: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(util.formatTime(new Date()));
    var itemId = options.itemId;
    this.itemPageInit(itemId);
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