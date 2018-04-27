// pages/rtp-map/rtp-map.js
var config = require('../../config/config');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    socketOpen: false,
    target_Latitude: null,
    target_Longitude: null,
    markers: [
      {
        iconPath: "/images/icon/marker.png",
        width: 16,
        height: 20,
        id: 0,
        latitude: 25.4097,
        longitude: 110.32552,
      }
    ]
  },
  /**
   * 定时发送位置
   */
  sendLocation: function () {
    var _this = this;
    var timeGap = 5000; // 时间间隔
    var locationTimer = setInterval(function () {
      
      wx.getLocation({
        success: function(res) {
          var latitude = res.latitude;
          var longitude = res.longitude;

          var sendJSON = {
            source: _this.data.myId,
            target: _this.data.driverId,
            location: {
              latitude: latitude,
              longitude: longitude
            }
          };

          if (_this.data.socketOpen) {
            wx.sendSocketMessage({
              data: JSON.stringify(sendJSON)
            })
          }
        },
      })

    }, timeGap);

    _this.setData({
      locationTimer: locationTimer
    })
  },
  /**
   * 初始化页面
   */
  initPage: function (options) {
    var _this = this;

    this.setData({
      myId: options.myId,
      driverId: options.driverId
    })

    // 初始化socket
    wx.connectSocket({
      url: config.socketUrl + '?myId=' + this.data.myId,
      success: function () {
        console.log('连接服务器成功');
      },
      fail: function () {
        console.err('连接服务器失败');
      }
    })

    // 监听open
    wx.onSocketOpen(function (res) {
      _this.setData({
        socketOpen: true
      })
      console.log('WebSocket连接已打开！');
      // 开始间隔发送位置信息
      _this.sendLocation();
    })

    // 接收的内容
    wx.onSocketMessage(function (res) {
      // 接收到的信息
      var recObj = JSON.parse(res.data);
      _this.setData({
        target_Latitude: recObj.location.latitude,
        target_Longitude: recObj.location.longitude
      })
      console.log('收到服务器内容：' + res.data)
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initPage(options);
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
    wx.closeSocket({
      reason: '客户端主动断开'
    });

    clearInterval(this.data.locationTimer);
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