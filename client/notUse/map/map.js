// pages/map/map.js
var amapFile = require('../../libs/amap-wx.js');
var AMap;
var lat = 22.817161,
  long = 108.341652;

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  /**
   * 点击地图控件事件
   */
  controlTap: function (e) {
    if(e.controlId == 2) {
      this.mapCtx.moveToLocation();
    }
  },
  /**
   * 选择一个地址后的点击事件
   */
  selectLoc: function (e) {
    var data = e.currentTarget.dataset.loc;
    // 选择一条之后跳转回上一个页面
    var page = getCurrentPages();
    var prevPage = page[page.length - 2];
    var action = '';

    if (this.data.action == 'start') {
      action = 'startLoc';
    } else if (this.data.action == 'dest') {
      action = 'destLoc';
    }
    //直接给上一页面赋值
    prevPage.setData({
      [action]: data
    });

    //返回上一页
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 拖动地图后放开，更新经纬度及附近地点
   */
  regionChange: function (e) {
    var _this = this;
    if (e.type == 'end') {
      console.log('map moving')
      this.mapCtx.getCenterLocation({
        success: function (res) {
          lat = res.latitude;
          long = res.longitude;
          // _this.setData({
          //   latitude: latitude,
          //   longitude: longitude
          // })
          _this.searchAround();
        }
      })
      // console.log(_this.data)
    }
  },
  pageInit: function (options) {
    var action = options.action;
    var barTitle = '';
    if (action == 'start') {
      barTitle = '请选择出发地';
    } else if (action == 'dest') {
      barTitle = '请选择目的地';
    }
    // 设置导航条文字
    wx.setNavigationBarTitle({
      title: barTitle,
    })
    this.setData({
      action: action
    })
  },
  /**
   * 初始化地图控件
   */
  mapInit: function () {
    var _this = this;
    AMap = new amapFile.AMapWX({ key: '1ca82aa6df3bef576bd9954d899f3cd5' });

    // 初始化图钉图片位置
    wx.getSystemInfo({
      success: function (res) {
        // 获取设备宽高后计算图钉位置
        var top = res.windowHeight;
        var left = res.windowWidth;
        _this.setData({
          controls: [{
            id: 1,
            iconPath: '../../images/icon/map-pin.png',
            position: {
              left: (left / 2) - 15,
              top: (top / 2 / 2) - 30,
              width: 30,
              height: 30
            },
            clickable: false
          },
          {
            id: 2,
            iconPath: '../../images/icon/findme.png',
            position: {
              left: left - 60,
              top: (top / 2) - 60,
              width: 40,
              height: 40
            },
            clickable: true
          }]
        })
      }
    })
    // 初始化位置
    _this.initLocation();
  },
  /**
   * 初始化位置获取当前经纬度
   */
  initLocation: function () {
    var _this = this;
    wx.getLocation({
      success: function (res) {
        // lat = res.latitude;
        // long = res.longitude;
        lat = 22.817161;
        long = 108.341652;
        // 设置位置
        _this.setData({
          latitude: lat,
          longitude: long
          // latitude: 22.817161,
          // longitude: 108.341652
        })
        // 搜索位置附近地点
        _this.searchAround();
      }
    })
  },
  /**
   * 搜索位置附近地点POI
   */
  searchAround: function () {
    var _this = this;
    // 搜索位置附近地点
    AMap.getPoiAround({
      location: lat + ',' + long,
      querytypes: "0705|08|09|10|11|12|14|19",
      success: function (data) {
        console.log(data)
        _this.setData({
          poiLocList: data.poisData
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.pageInit(options);
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