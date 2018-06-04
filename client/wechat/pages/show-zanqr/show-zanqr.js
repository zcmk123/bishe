// pages/show-zanqr/show-zanqr.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  bindToPreview: function () {
    var _this = this;
    wx.previewImage({
      current: _this.data.zanImgSrc, // 当前显示图片的http链接
      urls: [_this.data.zanImgSrc] // 需要预览的图片http链接列表
    })
  },
  /**
   * 页面初始化
   */
  initPage: function () {
    var _this = this;
    wx.showLoading({
      title: '加载中...'
    })
    wx.getStorage({
      key: 'CACHE.ZanQR',
      success: function (res) {
        if (res.data) {
          _this.setData({
            zanImgSrc: res.data
          })
          wx.hideLoading();
        }else {
          _this.setData({
            zanImgSrc: ''
          })
          wx.hideLoading();
        }
      },
    })
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
    wx.removeStorage({
      key: 'CACHE.ZanQR',
      success: function (res) {
        console.log(res.data)
      }
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