// pages/driver-info/driver-info.js
const app = getApp();
var config = require('../../config/config');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    subBtnProp: {
      subBtnText: '提交审核',
      subBtnStatus: true
    },
    carImgSrc: ''
  },
  bindSubDriverInfo: function () {
    //TODO 最后按键统一提交验证
    // TODO 修改认证信息
  },
  /**
   * 选择图片逻辑处理
   */
  uploadPic: function () {
    var _this = this;
    var _id = app.globalData.uInfo._id;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        var tempFilePaths = res.tempFilePaths[0]
        // 选择图片后在下方显示
        _this.setData({
          carImgSrc: tempFilePaths
        })
        // wx.uploadFile({
        //   url: 'http://localhost/uploadpic', //上传文件接口
        //   filePath: tempFilePaths[0],
        //   name: 'file',
        //   formData: {
        //     'id': _id
        //   },
        //   success: function (res) {
        //     console.log(res.data);
        //   }
        // })
      },
    })
  },
  /**
   * 获取服务器端用户信息
   */
  getUInfo: function (callback) {
    var _this = this;
    wx.request({
      url: config.requestUrl + 'getuinfo',
      data: {
        openid: app.globalData.openId
      },
      success: function (data) {
        // _this.globalData.uInfo = data.data;
        app.globalData.uInfo = data.data;
        callback();
      }
    })
  },
  /**
   * 初始化页面
   */
  initPage: function () {
    var _this = this;
    //初始化时先同步用户数据
    this.getUInfo(function () {
      var driverInfo = app.globalData.uInfo.driver;
      var v_status = config.v_statusArr[driverInfo.v_status];

      // 文字默认为 提交审核
      var subBtnText = '提交审核',
        subBtnStatus = true;
      if (v_status == 'verifying') {
        subBtnText = '您的信息正在认证中';
        subBtnStatus = false;
      } else if (v_status == 'verified') {
        subBtnText = '修改认证信息'
      }
      _this.setData({
        ['subBtnProp.subBtnText']: subBtnText,
        ['subBtnProp.subBtnStatus']: subBtnStatus
      })
    });
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