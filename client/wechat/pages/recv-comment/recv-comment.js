// pages/recv-comment/recv-comment.js
var config = require('../../config/config');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    isLoading: false,
    listData: []
  },
  initPage: function () {
    var _this = this;
    wx.request({
      url: config.requestUrl + 'comment/getComment',
      data: {
        userId: _this.data.userId,
        page: _this.data.page
      },
      success: function (res) {
        // console.log(res.data)
        // _this.convertComment(res.data);
        _this.setData({
          listData: _this.convertComment(res.data)
        })
      }
    })
  },
  /**
   * 转换评论
   */
  convertComment: function (data) {
    var listData = [];
    var commentList = data.comment_list;
    var uidList = data.uid_list;
    commentList.forEach(function (element, index) {
      for (let i = 0; i < uidList.length; i++) {
        if (uidList[i]._id == element.userId) {
          element.nickname = uidList[i].nickname;
          element.avatarUrl = uidList[i].avatarUrl;
          listData.push(element);
          break;
        }
      }
    });
    return listData;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    this.setData({
      loadMoreText: '下拉加载更多',
      userId: options.userId,
      convertComment: _this.convertComment
    })
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
    var _this = this;
    console.log('触底操作')
    var isLoading = this.data.isLoading;
    isLoading = isLoading ? false : true;
    _this.setData({ isLoading: isLoading });

    // 向后台发送请求拉取数据
    wx.request({
      url: config.requestUrl + 'comment/getComment',
      data: {
        userId: _this.data.userId,
        page: _this.data.page + 1
      },
      success: function (data) {
        // 拉取信息成功
        if (data.data.comment_list.length == 0) {  // 没有更多数据了
          _this.setData({
            loadMoreText: '没有更多拼车信息了',
            isLoading: false
          })
        } else {
          var resData = _this.convertComment(data.data);
          var newLoadedList = _this.data.listData.concat(resData);
          _this.setData({
            listData: newLoadedList,
            isLoading: false,
            loadMoreText: '下拉加载更多'
          })
          _this.data.page++;
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})