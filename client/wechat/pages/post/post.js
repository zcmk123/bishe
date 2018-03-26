// pages/post/post.js
const app = getApp();
var config = require('../../config/config');
var util = require('../../utils/util');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    postInfo: {
      passenger: []
    },
    seatArr: [1, 2, 3, 4, 5, 6],
    date: '',
    time: '',
    endDate: null,
    endTime: null,
  },
  bindiTitleChange: function (e) {
    this.setData({
      ['postInfo.title']: e.detail.value
    })
  },
  bindiDescChange: function (e) {
    this.setData({
      ['postInfo.desc']: e.detail.value
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  bindSeatChange: function (e) {
    var seat = parseInt(e.detail.value) + 1;
    this.setData({
      ['postInfo.seat']: seat
    })
  },
  bindRulesChange: function (e) {
    var rulesCheck = e.detail.value[0] ? true : false;
    this.setData({
      rulesCheck: rulesCheck
    })
  },
  /**
   * 提交按钮逻辑
   */
  bindPostInfo: function () {
    var postInfo = this.data.postInfo;

    if (postInfo.title && postInfo.desc && postInfo.startLoc && postInfo.destLoc && postInfo.seat) {
      // TODO 标题 备注 为空格的情况处理

      // 判断勾选规则checkbox
      if (this.data.rulesCheck) {
        console.log('send postinfo');

        // 发送之前设置司机的ObjectID
        // 设置时间
        postInfo.driver = app.globalData.uInfo._id;
        postInfo.date = this.data.date + ' ' + this.data.time;

        console.log(postInfo);

        // 显示loading
          wx.showLoading({
            title: '发布中...'
          })
          // 给服务器发送请求传递数据
          wx.request({
            method: 'POST',
            url: config.requestUrl + 'postinfo',
            data: postInfo,
            success: function (data) {
              wx.hideLoading();
              wx.showToast({
                title: '发布成功！',
                icon: "success",
                success: function () {
                  setTimeout(wx.navigateBack, 1500);
                }
              })
            },
            fail: function (err) {
              wx.hideLoading();
              wx.showToast({
                title: '连接服务器失败！',
                icon: "none"
              })
            }
          })
        } else {// 未同意规则
          wx.showModal({
            title: '提示',
            content: '必须同意xxx规则',
            showCancel: false
          })
      }
    } else {// 未将信息填写完整
      wx.showModal({
        title: '提示',
        content: '请将信息填写完整',
        showCancel: false
      })
    }
  },
  /**
   * 跳转到地图页面
   */
  bindtapToMap: function (e) {
    var _this = this;
    var targetId = e.target.id;
    var actionStr = '';
    if (targetId == 'content-loc') {
      actionStr = 'startLoc';
      wx.navigateTo({
        url: '../map/map',
      })
    } else if (targetId == 'content-dest') {
      actionStr = 'destLoc';
      wx.chooseLocation({
        success: function (res) {
          delete res.errMsg;
          // console.log(res)
          _this.setData({
            ['postInfo.' + actionStr]: res
          })
        }
      })
    }
    // console.log(this.data)
  },
  /**
  * 初始化时间
  */
  initDate: function () {
    var _this = this;
    var date = new Date();
    var dateArr = util.formatTime(date).split(' '),
      nowDate = dateArr[0],
      endDate = new Date((date.getFullYear() + 10), date.getMonth(), date.getDate()),
      time = dateArr[1],
      endTime = 0;

    _this.setData({
      date: nowDate,
      endDate: endDate.getFullYear() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getDate(),
      time: time
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initDate();
    // console.log(app.globalData.uInfo)
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