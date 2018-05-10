// pages/order-info/order-info.js
const app = getApp();
var config = require('../../config/config');
var util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemData: null,
    canCancel: false,
    canComment: false,
    canComplet: false
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
  bindComplete: function () {
    var itemId = this.data.itemData._id;
    wx.showModal({
      title: '完成行程',
      content: '确定完成行程吗？',
      success: function (res) {
        if (res.confirm) {
          completOrder();
        }
      }
    })

    function completOrder() {
      wx.showLoading({
        title: '确认中',
      })
      wx.request({
        url: config.requestUrl + 'order/completorder',
        data: {
          itemId: itemId
        },
        success: function (res) {
          if (res.data == 'success') {
            wx.hideLoading();
            wx.showToast({
              title: '确认成功！',
              icon: "success",
              success: function () {
                setTimeout(wx.navigateBack, 1500);
              }
            })
          }
        }
      })
    }
  },
  /**
   * 跳转到评价页面
   */
  bindComment: function () {
    wx.setStorageSync('CACHE.itemData', this.data.itemData);
    wx.navigateTo({
      url: '/pages/comment/comment',
    })
  },
  /**
   * 取消按钮
   */
  bindCancel: function () {
    var _this = this;
    //第二次确认
    wx.showModal({
      title: '取消拼车',
      content: '确定要取消吗？',
      success: function (res) {
        if (res.confirm) {
          cancelOrder();
        }
      }
    })

    function cancelOrder() {
      var userId = app.globalData.uInfo._id;
      var itemId = _this.data.itemData._id;
      wx.showLoading({
        title: '正在取消订单',
      })
      wx.request({
        method: 'DELETE',
        url: config.requestUrl + 'order/cancelorder',
        data: {
          userId: userId,
          itemId: itemId
        },
        success: function (res) {
          if (res.data == 'success') {
            wx.hideLoading();
            wx.showToast({
              title: '取消成功',
              icon: "success",
              success: function () {
                setTimeout(wx.navigateBack, 1500);
              }
            })
          }
        }
      })
    }
  },
  /**
   * 跳转到实时定位页面
   */
  bindRTPMap: function () {
    var myId = app.globalData.uInfo._id;  //我的(乘客)id

    wx.setStorageSync('CACHE.itemData', this.data.itemData);

    wx.navigateTo({
      url: '/pages/rtp-map/rtp-map?myId=' + myId,
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
   * 初始化页面
   */
  initPage: function (options) {
    var _this = this;
    var itemId = options.itemId;
    var fromPost = options.tab == 1 ? true : false;
    var fromMyOrder = !fromPost;

    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: config.requestUrl + 'loaditem',
      data: {
        itemId: itemId
      },
      success: function (res) {
        _this.setData({
          itemData: util.formatData(res.data)
        })
        _this.converRating();
        // 设置详情页面不显示的信息
        _this.setData({
          ['itemData.fromOrder']: {
            fromPost: fromPost,
            fromMyOrder: fromMyOrder
          }
        })

        // 检查能否取消订单
        _this.checkCancel();

        // 检查能否评论
        _this.checkCanComment();

        if (fromPost) {
          _this.setData({
            canComplet: _this.checkCanComplet()
          })
        }

        wx.hideLoading();
        console.log(res);
      }
    })

  },
  checkCanComplet: function () {
    var itemData = this.data.itemData;
    return new Date() - new Date(itemData.date) > 0;
  },
  checkCanComment: function () {
    var _this = this;
    var itemData = _this.data.itemData;
    // 检查能否评论
    if (itemData.status == 1) {
      wx.request({
        url: config.requestUrl + 'order/getComment',
        data: {
          driverId: itemData.driver._id
        },
        success: function (res) {
          var uid_list = res.data.uid_list;
          var userId = app.globalData.uInfo._id;
          if (uid_list.indexOf(userId) == -1) {
            _this.setData({
              canComment: true
            })
          }
        }
      })
    }
  },
  /**
   * 检查是否可以取消订单
   */
  checkCancel: function () {
    var status = this.data.itemData.status;
    var startDate = this.data.itemData.date;
    var timeDiff = util.timeDiff(new Date(startDate), new Date());
    var timeCheck = timeDiff >= 0 && timeDiff <= 30;
    if (status == 0 && timeCheck) {
      this.setData({
        canCancel: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options: options
    })
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
      canComment: false
    })
    this.initPage(this.data.options);
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
    wx.removeStorage({
      key: 'CACHE.itemData',
      success: function (res) { },
    })
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