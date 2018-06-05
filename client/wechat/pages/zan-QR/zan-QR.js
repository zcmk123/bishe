// pages/zan-QR/zan-QR.js
const app = getApp();
const Toptips = require('../../libs/zanui/toptips/index');
var config = require('../../config/config');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zanImgSrc: ''
  },
  /**
   * 上传赞赏码逻辑
   */
  bindToUploadQR: function () {
    var _this = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        var _id = app.globalData.uInfo._id;
        wx.uploadFile({
          url: config.requestUrl + 'uploadpic/zanqr',
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'id': _id
          },
          success: function (res) {
            var data = JSON.parse(res.data);
            if (data.msg == 'success') {
              Toptips({
                content: '上传赞赏码成功！',
                backgroundColor: '#44bb00'
              });
              _this.setData({
                zanImgSrc: tempFilePaths[0]
              })
            } else {
              Toptips({
                content: '上传赞赏码失败！',
                backgroundColor: '#e64340'
              });
            }
          },
          fail: function () {
            Toptips({
              content: '上传赞赏码失败！',
              backgroundColor: '#e64340'
            });
          }
        })
      }
    })
  },
  /**
   * 页面初始化
   */
  initPage: function (){
    wx.showLoading({
      title: '加载中...'
    })
    this.setData({
      zanImgSrc: app.globalData.uInfo.isdriver.zanqr
    })
    wx.hideLoading();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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