//index.js
//获取应用实例
const app = getApp();
var config = require('../../config/config');
var util = require('../../utils/util');

Page({
  data: {
    pickerRotateCss: '',
    userInfo: {},
    schoolList: [],
    selectSchool: 0,
    schoolLogoArr: []
  },
  /**
   * 改变学校逻辑处理
   */
  bindChangeSchool: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      selectSchool: e.detail.value
    })
    app.globalData.selectSchool = parseInt(e.detail.value);
    wx.setStorageSync('selectSchool', e.detail.value);
    console.log(app.globalData)
  },
  /**
   * 去拼车列表页面
   */
  toListPage: function () {
    wx.switchTab({
      url: '../list/list',
    })
  },
  /**
   * 去发布页面
   */
  toPostPage: function () {
    app.checkAuth(function () { // 验证权限
      var uInfo = app.globalData.uInfo;
      if (util.isDriver(uInfo)) {
        wx.navigateTo({
          url: '../post/post',
        })
      } else {
        wx.showToast({
          title: '请先完成司机认证',
          icon: 'none'
        })
      }
    })
  },
  /**
   * 初始化首页数据
   */
  init: function () {
    var schoolList = [];
    var sourceList = config.schoolList;
    //读取学校名字
    sourceList.forEach(function (ele, index) {
      schoolList.push(ele.name);
    })
    //设置页面初始数据
    this.setData({
      selectSchool: app.globalData.selectSchool,
      schoolList: schoolList,
      schoolLogoArr: config.schoolLogoArr
    })
  },
  getUserInfo: function (e) {
    // console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onLoad: function () {
    this.init();
  },
  onShow: function () {

  }
})
