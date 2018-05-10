// pages/rtp-map/rtp-map.js
const app = getApp();
const Toptips = require('../../libs/zanui/toptips/index');
var config = require('../../config/config');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    socketOpen: false,
    markers: [],
    markersLength: 0
  },
  /**
   * 定时发送位置
   */
  sendLocation: function (callback) {
    var _this = this;
    var itemData = _this.data.itemData;
    var targetArr = itemData.fromOrder.fromPost ? allPassenger(itemData.passenger) : [itemData.driver._id];


    wx.getLocation({
      success: function (res) {
        var latitude = res.latitude;
        var longitude = res.longitude;

        var sendJSON = {
          source: _this.data.myId,
          target: targetArr,  // 数组
          location: {
            nickName: app.globalData.uInfo.nickname,
            latitude: latitude,
            longitude: longitude
          }
        };

        if (_this.data.socketOpen) {
          wx.sendSocketMessage({
            data: JSON.stringify(sendJSON),
            success: function () {
              if (callback) {
                callback();
              }
            }
          })
        }
      },
    })

    function allPassenger(passengers) {
      var tempArr = [];
      passengers.forEach(function (ele, index) {
        tempArr.push(ele._id);
      })
      return tempArr;
    }
  },
  /**
   * 初始化页面
   */
  initPage: function (options) {
    var _this = this;

    var itemData = wx.getStorageSync('CACHE.itemData');

    this.setData({
      itemData: itemData,
      myId: options.myId,
      driverId: itemData.driver._id,
      itemId: itemData._id
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
      _this.sendLocation(function () {
        var locationTimer = setInterval(_this.sendLocation, 5000);
        _this.setData({
          locationTimer: locationTimer
        })
      })
    })

    // 接收的内容
    wx.onSocketMessage(function (res) {
      // 接收到的信息
      var locationArr = JSON.parse(res.data).data;

      // locationArr转换成markers数组
      var markers = _this.convertToMarkers(locationArr);

      if (markers.length > _this.data.markersLength) {
        Toptips({
          content: '有人加入了位置共享',
          backgroundColor: '#44bb00'
        });
      } else if (markers.length < _this.data.markersLength) {
        Toptips('有人离开了位置共享');
      }

      _this.setData({
        markersLength: markers.length,
        markers: markers
      })
      // console.log('收到服务器内容：' + res.data);
    })
  },
  /**
   * locationArr转换成markers数组
   */
  convertToMarkers: function (locationArr) {
    var markers = [];

    locationArr.forEach(function (ele, index) {
      var markersItem = {
        iconPath: "/images/icon/marker.png",
        width: 16,
        height: 20,
        latitude: ele.latitude,
        longitude: ele.longitude,
        label: {
          content: ele.nickName,
          x: ele.nickName.length * -6
        }
      };

      markers.push(markersItem);
    })

    return markers;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;

    wx.getLocation({
      success: function (res) {
        _this.setData({
          tLatitude: res.latitude,
          tLongitude: res.longitude
        })

        _this.initPage(options);
      },
      fail: function () {
        // console.log('失败');
        // 没有权限
        wx.showModal({
          title: '提示',
          content: '您禁止了微信获取您的地理位置信息，在“我的”页面右上角的设置按钮中可以重新开启授权。未授权不能使用实时定位。',
          showCancel: false,
          confirmText: '知道了'
        })
      }
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
    if (this.data.socketOpen) {
      wx.closeSocket({
        reason: '客户端主动断开'
      });
      clearInterval(this.data.locationTimer);
    }
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