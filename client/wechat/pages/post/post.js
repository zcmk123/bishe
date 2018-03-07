// pages/post/post.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    postInfo: {

    },
    seatArr: [1, 2, 3, 4, 5, 6],
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
      ['postInfo.date']: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      ['postInfo.time']: e.detail.value
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
    console.log(postInfo)
    
    if (postInfo.title && postInfo.desc && postInfo.startLoc && postInfo.destLoc && postInfo.seat) {
      // TODO 标题 备注 为空格的情况处理

      // TODO 判断勾选规则checkbox
      if (this.data.rulesCheck) {
        console.log('send postinfo');

        // 发送之前设置司机的ObjectID
        postInfo.driverId = app.globalData.uInfo._id;

        // 显示loading
        wx.showLoading({
          title: '发布中...'
        })
        // 给服务器发送请求传递数据
        wx.request({
          method: 'POST',
          url:  'https://pinche.istarmcgames.com/postinfo',
          // url: 'http://localhost/postinfo',
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
    // var targetId = e.target.id;
    // var url = '';
    // if (targetId == 'content-loc') {
    //   url = "../map/map?action=start";
    // } else if (targetId == 'content-dest') {
    //   url = "../map/map?action=dest";
    // }
    // wx.navigateTo({
    //   url: url
    // })
    var targetId = e.target.id;
    var actionStr = '';
    if (targetId == 'content-loc') {
      actionStr = 'startLoc';
    } else if (targetId == 'content-dest') {
      actionStr = 'destLoc';
    }
    wx.chooseLocation({
      success: function (res) {
        delete res.errMsg;
        // console.log(res)
        _this.setData({
          ['postInfo.' + actionStr]: res
        })
      }
    })
  },
  /**
  * 初始化时间
  */
  initDate: function () {
    var _this = this;
    var date = new Date(),
      endDate = new Date((date.getFullYear() + 10), date.getMonth(), date.getDate()),
      time = date.getHours() + ':' + date.getMinutes(),
      endTime = 0;

    _this.setData({
      ['postInfo.date']: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
      endDate: endDate.getFullYear() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getDate(),
      ['postInfo.time']: time
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initDate();
    console.log(app.globalData.uInfo)
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