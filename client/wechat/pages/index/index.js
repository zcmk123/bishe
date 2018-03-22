//index.js
//获取应用实例
const app = getApp();
var config = require('../../config/config');

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
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
  toListPage: function () {
    wx.switchTab({
      url: '../list/list',
    })
  },
  toPostPage: function () {
    wx.navigateTo({
      url: '../post/post',
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
  onLoad: function () {
    this.init();
  },
  getUserInfo: function(e) {
    // console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
