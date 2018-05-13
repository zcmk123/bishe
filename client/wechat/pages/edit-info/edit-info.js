// pages/edit-info/edit-info.js
const app = getApp();
const Toptips = require('../../libs/zanui/toptips/index');
var config = require('../../config/config');
var util = require('../../utils/util');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    genderArr: ['女', '男'],
    Info: {
      gender: '',
      school: '',
      phone: ''
    }
  },
  bindGenderChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      'Info.gender': parseInt(e.detail.value)
    })
  },
  bindSchoolChange: function (e) {
    this.setData({
      'Info.school': e.detail.value
    })
  },
  bindPhoneChange: function (e) {
    this.setData({
      'Info.phone': e.detail.value
    })
  },
  /**
   * 提交信息
   */
  bindSubmitInfo: function () {
    var postData = this.data.Info;
    if (util.checkPhoneNum(postData.phone)) {
      wx.showLoading({
        title: '修改信息中',
      })
      wx.request({
        method: 'PUT',
        url: config.requestUrl + 'setuinfo',
        data: {
          newInfo: postData,
          _id: app.globalData.uInfo._id
        },
        success: function (res) {
          if (res.data == 'success') {
            wx.hideLoading();
            wx.showToast({
              title: '修改成功！',
              icon: "success",
              success: function () {
                //返回上一页
                setTimeout(wx.navigateBack, 1500);
              }
            })
          }
        }
      })
    } else {
      Toptips('手机号码为空或格式错误！');
    }
  },
  /**
   * 初始化
   */
  initPage: function () {
    var _this = this;
    var uInfo = app.globalData.uInfo;
    this.setData({
      'Info.gender': uInfo.gender,
      'Info.school': uInfo.school,
      'Info.phone': uInfo.phone
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