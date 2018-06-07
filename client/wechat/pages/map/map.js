// pages/map/map.js
const app = getApp();
// var amapFile = require('../../libs/amap-wx.js');
// var AMap;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    markers: [],
    locList: []
  },
  /**
   * 选择一个地址后的点击事件
   */
  selectLoc: function (e) {
    var data = e.currentTarget.dataset.loc;
    // 选择一条之后跳转回上一个页面
    var page = getCurrentPages();
    var prevPage = page[page.length - 2];

    //直接给上一页面赋值
    prevPage.setData({
      ['postInfo.startLoc']: data
    });

    //返回上一页
    wx.navigateBack({
      delta: 1
    })
  },
  pageInit: function () {
    var barTitle = '请选择出发地';
    // 设置导航条文字
    wx.setNavigationBarTitle({
      title: barTitle,
    })
  },
  /**
   * 初始化地图控件
   */
  mapInit: function () {
    var _this = this;
    var selectSchool = app.globalData.selectSchool;
    var selectSchoolInfo = app.globalData.schoolInfoList[selectSchool];
    // AMap = new amapFile.AMapWX({ key: '1ca82aa6df3bef576bd9954d899f3cd5' });
    // 初始化位置
    _this.initLocation(selectSchool);
    _this.locToMarkers(selectSchoolInfo);
    _this.initLocList(selectSchoolInfo);
  },
  /**
   * 初始化位置设定学校中心经纬度
   */
  initLocation: function (selectSchool) {
    var _this = this;
    var centerLat = app.globalData.schoolInfoList[selectSchool].centerLoc.latitude;
    var centerLong = app.globalData.schoolInfoList[selectSchool].centerLoc.longitude;
    _this.setData({
      latitude: centerLat,
      longitude: centerLong
    })
  },
  /**
   * 将坐标转换成markers数组
   */
  locToMarkers: function (obj) {
    console.log(obj);
    var markersArr = [];
    obj.startLoc.forEach(function (ele, index) {
      var tempObj = {
        iconPath: "/images/icon/marker.png",
        width: 16,
        height: 20,
        title: '',
        label: {}
      };
      tempObj.id = index;
      tempObj.latitude = ele.latitude;
      tempObj.longitude = ele.longitude;
      tempObj.title = ele.name;
      tempObj.label.content = ele.name;
      tempObj.label.x = ele.name.length * -6;
      markersArr.push(tempObj);
    })
    this.setData({
      markers: markersArr
    })
  },
  /**
   * 初始化地图下方地点列表
   */
  initLocList: function (obj) {
    var locListArr = [];
    obj.startLoc.forEach(function (ele, index) {
      locListArr.push(ele);
    })
    this.setData({
      locList: locListArr
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.pageInit();
    this.mapInit();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mapCtx = wx.createMapContext('myMap');
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