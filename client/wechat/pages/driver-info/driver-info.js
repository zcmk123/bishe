// pages/driver-info/driver-info.js
const app = getApp();
var config = require('../../config/config');
var util = require('../../utils/util');
const Toptips = require('../../libs/zanui/toptips/index');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    postInfo: {
      carImgSrc: ''
    },   // 需要提交的数据
    subBtnProp: {
      subBtnText: '提交审核',
      subBtnStatus: true
    },
    showData: {}
  },
  bindCarChange: function (e) {
    this.setData({
      ['postInfo.car']: e.detail.value
    })
  },
  bindCarIdChange: function (e) {
    this.setData({
      ['postInfo.carid']: e.detail.value
    })
  },
  bindPhoneChange: function (e) {
    this.setData({
      ['postInfo.phone']: e.detail.value
    })
  },
  bindSubDriverInfo: function () {
    var _this = this;
    wx.showModal({
      title: '确认提交信息',
      content: '确定提交认证信息吗？',
      success: function (res) {
        if (res.confirm) {
          sendInfo();
        }
      }
    })

    function sendInfo() {
      var postInfo = _this.data.postInfo;
      var _id = app.globalData.uInfo._id;
      if (postInfo.car && postInfo.carid && postInfo.carImgSrc && postInfo.phone) {
        if (util.checkPhoneNum(postInfo.phone)) {
          // 提交服务器
          wx.showLoading({
            title: '提交中',
          })
          Promise.all([uploadInfo(), uploadPic()])
            .then(function (res) {
              if (res[0] == 'success' && res[1] == '"success"') {
                wx.hideLoading();
                wx.showToast({
                  title: '提交成功！',
                  icon: "success",
                  success: function () {
                    setTimeout(wx.navigateBack, 1500);
                  }
                })
              }
            })

          function uploadInfo() {
            return new Promise(function (resolve, reject) {
              wx.request({
                method: 'POST',
                url: config.requestUrl + 'setdriverinfo',
                data: {
                  driverId: _id,
                  postInfo: postInfo
                },
                success: function (res) {
                  resolve(res.data);
                },
                fail: function (res) {
                  reject(res.data);
                }
              })
            })
          }

          function uploadPic() {
            return new Promise(function (resolve, reject) {
              wx.uploadFile({
                url: config.requestUrl + 'uploadpic', //上传文件接口
                filePath: postInfo.carImgSrc,
                name: 'file',
                formData: {
                  'id': _id
                },
                success: function (res) {
                  console.log(res)
                  // console.log(res.data);
                  resolve(res.data);
                },
                fail: function (res) {
                  reject(res.data);
                }
              })
            })
          }
        } else {
          Toptips('手机号码格式错误！');
        }
      } else {
        Toptips('请您将信息输入完整！');
      }
    }
  },
  /**
   * 选择图片逻辑处理
   */
  choosePic: function () {
    var _this = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        var tempFilePaths = res.tempFilePaths[0]
        // 选择图片后在下方显示
        _this.setData({
          'postInfo.carImgSrc': tempFilePaths
        })
      },
    })
  },
  /**
   * 初始化页面
   */
  initPage: function () {
    var _this = this;
    //初始化时先同步用户数据
    app.getUInfo(function () {
      var driverInfo = app.globalData.uInfo.isdriver;
      var v_status = config.v_statusArr[driverInfo.v_status];

      // 文字默认为 提交审核
      var subBtnText = '提交审核',
        subBtnStatus = true;
      if (v_status == 'verifying') {
        subBtnText = '您的信息正在认证中';
        subBtnStatus = false;
      } else if (v_status == 'verified') {
        subBtnText = '修改认证信息'
      }
      //设置提交按钮的状态与文字
      _this.setData({
        v_status: driverInfo.v_status,
        ['showData.car']: driverInfo.car,
        ['showData.carid']: driverInfo.carid,
        ['showData.phone']: driverInfo.phone,
        ['showData.carImgSrc']: driverInfo.carpic,
        ['subBtnProp.subBtnText']: subBtnText,
        ['subBtnProp.subBtnStatus']: subBtnStatus
      })
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})