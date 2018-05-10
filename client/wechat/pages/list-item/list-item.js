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
  bindCallPhone: function () {
    var _this = this;
    var itemData = _this.data.itemData;
    wx.makePhoneCall({
      phoneNumber: itemData.driver.isdriver.phone,
      fail: function () {
        wx.showToast({
          title: '拨打电话失败',
          icon: 'none'
        })
      }
    })
  },
  /**
   * 确认拼车，按钮逻辑
   */
  bindPinChe: function () {
    var _this = this;
    //第二次确认
    wx.showModal({
      title: '确认拼车',
      content: '确定要拼车吗？',
      success: function (res) {
        if (res.confirm) {
          sendInfo();
        }
      }
    })
    function sendInfo() {
      var passengerId = app.globalData.uInfo._id;
      var itemId = _this.data.itemId;
      //发请求添加乘客到拼车中
      wx.request({
        url: config.requestUrl + 'addpassenger',
        data: {
          itemId: itemId,
          passengerId: passengerId
        },
        success: function (data) {
          wx.showToast({
            title: '加入成功！',
            icon: "success",
            success: function () {
              //返回上一页
              setTimeout(wx.navigateBack, 1500);
            }
          })
        }
      })
    }
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
          itemData: util.formatData(data.data)
        })
        //检查乘客是否能拼车
        _this.checkPassenger();
        //转换rating评分为图标显示
        _this.converRating();
      }
    })
  },
  /**
   * 转换评分变成对应分数的图片
   */
  converRating: function () {
    var driver = this.data.itemData.driver.isdriver;
    var rateScore = driver.rating;
    var starClass = '';
    if (rateScore >= 0 && rateScore < 0.5) {
      starClass = 'star00';
    } else if (rateScore >= 0.5 && rateScore < 1.0) {
      starClass = 'star05';
    } else if (rateScore >= 1.0 && rateScore < 1.5) {
      starClass = 'star10';
    } else if (rateScore >= 1.5 && rateScore < 2.0) {
      starClass = 'star15';
    } else if (rateScore >= 2.0 && rateScore < 2.5) {
      starClass = 'star20';
    } else if (rateScore >= 2.5 && rateScore < 3.0) {
      starClass = 'star25';
    } else if (rateScore >= 3.0 && rateScore < 3.5) {
      starClass = 'star30';
    } else if (rateScore >= 3.5 && rateScore < 4.0) {
      starClass = 'star35';
    } else if (rateScore >= 4.0 && rateScore < 4.5) {
      starClass = 'star40';
    } else if (rateScore >= 4.5 && rateScore < 5.0) {
      starClass = 'star50';
    }
    this.setData({
      ['itemData.starClass']: starClass
    })
  },
  /**
   * 检查乘客是否能拼车
   * 司机/已在此次拼车中的乘客  不能点击确定拼车按钮
   * 座位为0不能拼车
   */
  checkPassenger: function () {
    var selfId = app.globalData.uInfo._id;
    var driverId = this.data.itemData.driver._id;
    var passengerArr = this.data.itemData.passenger;
    var seat = this.data.itemData.seat
    //判断乘客是否已经在这次拼车中，如果在则不允许再点击拼车按钮
    if ((selfId != driverId) && (passengerArr.indexOf(selfId) == -1) && (seat > 0)) {//司机自己不能再次参加自己的拼车
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