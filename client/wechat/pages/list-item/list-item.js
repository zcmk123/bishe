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
    var _this = this;
    //第二次确认
    wx.showModal({
      title: '确认拼车',
      content: '确定要拼车吗？',
      success: function (res) {
        if(res.confirm) {
          sendInfo();
        }
      }
    })
    function sendInfo () {
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
            title: '成功！',
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
          itemData: util.formatDate(data.data)
        })
        //转换rating评分为图标显示
        _this.converRating();
        //检查乘客是否能拼车
        _this.checkPassenger();
      }
    })
  },
  /**
   * 转换评分变成对应分数的图片
   */
  converRating: function () {
    var rating = this.data.itemData.driver.isdriver.rating;
    var starClass = '';
    if (rating >= 0 && rating < 0.5) {
      starClass = 'star00';
    } else if (rating >= 0.5 && rating < 1.0) {
      starClass = 'star05';
    } else if (rating >= 1.0 && rating < 1.5) {
      starClass = 'star10';
    } else if (rating >= 1.5 && rating < 2.0) {
      starClass = 'star15';
    } else if (rating >= 2.0 && rating < 2.5) {
      starClass = 'star20';
    } else if (rating >= 2.5 && rating < 3.0) {
      starClass = 'star25';
    } else if (rating >= 3.0 && rating < 3.5) {
      starClass = 'star30';
    } else if (rating >= 3.5 && rating < 4.0) {
      starClass = 'star35';
    } else if (rating >= 4.0 && rating < 4.5) {
      starClass = 'star40';
    } else if (rating >= 4.5 && rating < 5.0) {
      starClass = 'star50';
    }
    this.setData({
      ['itemData.starClass']: starClass
    })
  },
  /**
   * 检查乘客是否能拼车
   * 司机/已在此次拼车中的乘客  不能点击确定拼车按钮
   */
  checkPassenger: function () {
    var selfId = app.globalData.uInfo._id;
    var driverId = this.data.itemData.driver._id;
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
    
    // TODO 设置评分星级的图片位置
    // this.setData({
    //   ['itemData.ratingStar']: 25
    // })
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