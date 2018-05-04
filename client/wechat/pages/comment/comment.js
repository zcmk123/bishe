// pages/comment/comment.js
var config = require('../../config/config');
const Toptips = require('../../libs/zanui/toptips/index');
var app = getApp();
var count = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../images/img/no-star.png',
    selectedSrc: '../../images/img/full-star.png',
    halfSrc: '../../images/img/half-star.png',
    key: 0,//评分
    postInfo: {}
  },
  /**
   * 初始化页面
   */
  initPage: function () {
    var _this = this;
    wx.getStorage({
      key: 'CACHE.itemData',
      success: function(res) {
        _this.setData({
          itemData: res.data
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initPage();
  },
  //点击左边,半颗星
  selectLeft: function (e) {
    var key = e.currentTarget.dataset.key
    if (this.data.key == 0.5 && e.currentTarget.dataset.key == 0.5) {
      //只有一颗星的时候,再次点击,变为0颗
      key = 0;
    }
    count = key
    this.setData({
      key: key
    })
  },
  //点击右边,整颗星
  selectRight: function (e) {
    var key = e.currentTarget.dataset.key
    count = key
    this.setData({
      key: key
    })
  },
  startRating: function (e) {
    var score = count;
    var itemId = this.data.itemData._id;
    var userId = app.globalData.uInfo._id;
    var driverId = this.data.itemData.driver._id;
    var postInfo = this.data.postInfo;
    if (postInfo.comment) {

      postInfo.rating = score;  // 评分分数

      // 发送评论请求
      wx.showLoading({
        title: '发布评论中',
      })
      wx.request({
        method: 'POST',
        url: config.requestUrl + 'order/comment',
        data: {
          itemId: itemId,
          userId: userId,
          driverId: driverId,
          postInfo: postInfo
        },
        success: function (res) {
          if (res.data == 'success') {
            wx.hideLoading();
            wx.showToast({
              title: '发布成功！',
              icon: "success",
              success: function () {
                setTimeout(wx.navigateBack, 1500);
              }
            })
          }
        }
      })
    } else {
      Toptips('请填写评价内容');
    }
    
  },
  bindiCommentChange: function (e) {
    this.setData({
      ['postInfo.comment']: e.detail.value
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