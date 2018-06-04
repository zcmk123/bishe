// pages/list/list.js
const app = getApp();
var config = require('../../config/config');
var util = require('../../utils/util');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    page: 1,// 默认页数
    optionArr: ['全部', '出发地', '目的地'],
    optionSelect: 0,
    isLoading: false,
    loadedList: [],
    inputShowed: false,
    inputVal: ""//目的地关键字
  },
  /**
   * 按目的地搜索
   */
  tapConfirm: function () {
    var searchText = util.trim(this.data.inputVal);
    this.loadList(searchText);
  },
  showInput: function () {
    if (this.data.searchDisabled) {
      console.log('input已经禁用')
    }else {
      this.setData({
        inputShowed: true
      });
    }
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  bindPickerChange: function (e) {
    var _this = this;
    if (e.detail.value == 0) {
      this.setData({
        searchDisabled: true
      })
      this.loadList();
    } else {
      this.setData({
        searchDisabled: false
      })
    }
    this.setData({
      optionSelect: e.detail.value,
      inputVal: ''
    })
  },
  bindItemTap: function (e) {
    app.checkAuth(function () { // 检查用户信息
      var itemId = e.currentTarget.dataset.id;
      //带参数跳转
      wx.navigateTo({
        url: '/pages/list-item/list-item?itemId=' + itemId
      })
    })
  },
  /**
   * 加载拼车信息列表
   */
  loadList: function (search) {
    var sText = search || '';
    var _this = this;
    // show加载
    wx.showLoading({
      title: '加载中'
    })
    // 请求列表
    wx.request({
      url: config.requestUrl + 'loadlist',
      data: {
        page: 1,
        school: app.globalData.selectSchool,
        search: sText,
        option: this.data.optionSelect
      },
      success: function (data) {
        if (data.data != 'end') {
          _this.setData({
            loadedList: util.formatData(data.data),
            loadMoreText: '下拉加载更多'
          })
        } else {
          _this.setData({
            loadedList: []
          })
        }

        wx.hideLoading();
      },
      fail: function () {
        wx.showToast({
          title: '服务器连接超时',
          icon: 'none'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.setData({
      optionSelect: 0,
      inputVal: '',
      searchDisabled: true,
      inputShowed: false,
      page: 1       // 重置page
    })
    this.loadList();
    this.setData({
      loadMoreText: '下拉加载更多'
    })
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
    _this.setData({isLoading: isLoading});

    // 向后台发送请求拉取数据
    wx.request({
      url: config.requestUrl + 'loadlist',
      data: {
        page: _this.data.page + 1,
        school: app.globalData.selectSchool,
        search: this.data.inputVal,
        option: this.data.optionSelect
      },
      success: function (data) {
        // 拉取信息成功
        if(data.data == 'end') {  // 没有更多数据了
          _this.setData({
            loadMoreText: '没有更多拼车信息了',
            isLoading: false
          })
        } else {
          var resData = util.formatData(data.data);
          var newLoadedList = _this.data.loadedList.concat(resData);
          _this.setData({
            loadedList: newLoadedList,
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