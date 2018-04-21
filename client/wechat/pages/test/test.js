// pages/test/test.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: '',
    socketOpen: false,
  },
  msgChange: function (e) {
    this.setData({
      text: e.detail.value
    })
  },
  closeConn: function () {
    wx.closeSocket({
      reason: '客户端主动断开'
    })
  },
  sendMsg: function () {
    var socketOpen = this.data.socketOpen;
    var msg = this.data.text;

    var sendMsgObj = {
      userId: app.globalData.uInfo._id,
      targetId: Math.random(),
      msg: msg
    }

    if (socketOpen) {
      wx.sendSocketMessage({
        data: JSON.stringify(sendMsgObj)
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    setTimeout(function () {
      wx.connectSocket({
        url: 'wss://localhost?userId=' + app.globalData.uInfo._id,
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
      })

      // 接收的内容
      wx.onSocketMessage(function (res) {
        console.log('收到服务器内容：' + res.data)
      })

    }, 5000)

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