// pages/pinche-wiki/pinche-wiki.js
import * as echarts from '../../libs/echarts/ec-canvas/echarts';

var config = require('../../config/config');

let chart = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  /**
   * 初始化图表
   */
  initDia: function () {
    var _this = this;
    this.echartsBar.init((canvas, width, height) => {
      wx.request({
        url: config.requestUrl + 'statistics/pinchetime',
        success: function (res) {
          var dataArr = res.data;
          //格式化数组
          var option = _this.formatDiaData(dataArr);

          // 初始化图表
          const barChart = echarts.init(canvas, null, {
            width: width,
            height: height
          });

          barChart.setOption(option);
          return barChart;
        },
        fail: function (res) {
          console.log('读取失败');
        }
      })
    });
  },
  /**
   * 格式化图表数据
   */
  formatDiaData: function (dataArr) {
    var legend = [];
    var data = [];
    dataArr.forEach(function (ele) {
      legend.push(ele._id + '时');
      data.push({ value: ele.count, name: ele._id + '时' })
    })

    var option = {
      title: {
        text: '拼车订单24小时分布图',
        subtext: '近期',
        x: 'center'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: legend
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '52%',
          center: ['50%', '60%'],
          data: data,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            normal: {
              show: true,
              formatter: '{c} ({d}%)'
            }
          },
        }
      ]
    };

    return option;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.echartsBar = this.selectComponent('#mychart-dom-bar');
    this.initDia();
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