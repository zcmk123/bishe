/**
 * 全局配置文件
 */

//请求Url
// var requestUrl = 'http://localhost/';
// var socketUrl = 'ws://localhost:8000/';
var requestUrl = 'https://pinche.istarmcgames.com/';
var socketUrl = 'wss://pinche.istarmcgames.com/';

//学校信息配置
var schoolList = [{
  tag: 'guet',
  name: '桂林电子科技大学',
  centerLoc: {
    latitude: 25.311518,
    longitude: 110.415899
  },
  startLoc: [
    {
      name: '食堂',
      address: '桂林电子科技大学花江校区食堂',
      latitude: 25.316096,
      longitude: 110.417365
    },
    {
      name: 'B区宿舍',
      address: '桂林电子科技大学花江校区B区宿舍',
      latitude: 25.318827,
      longitude: 110.415897
    },
    {
      name: 'D区宿舍',
      address: '桂林电子科技大学花江校区D区宿舍',
      latitude: 25.31117,
      longitude: 110.410489
    },
    {
      name: '第五教学楼',
      address: '桂林电子科技大学花江校区第五教学楼',
      latitude: 25.31395,
      longitude: 110.417522
    },
    {
      name: '实训中心',
      address: '桂林电子科技大学花江校区实训中心',
      latitude: 25.310218,
      longitude: 110.420702
    }
  ]
},
{
  tag: 'glut',
  name: '桂林理工大学',
  centerLoc: {
    latitude:  25.060855,
    longitude: 110.301715
  },
  startLoc: [
    {
      name: '公交站',
      address: '桂林理工大学雁山校区公交站',
      latitude: 25.06528,
      longitude: 110.302262
    },
    {
      name: '教学楼',
      address: '桂林理工大学雁山校区教学楼',
      latitude: 25.064144,
      longitude: 110.293555
    },
    {
      name: '学生宿舍',
      address: '桂林理工大学雁山校区学生宿舍',
      latitude: 25.060222,
      longitude: 110.302976
    },
    {
      name: '体育馆',
      address: '桂林理工大学雁山校区体育馆',
      latitude: 25.066121,
      longitude: 110.29656
    }
  ]
}]

//学校logo数组
var schoolLogoArr = ['/images/img/guet-logo.png', '/images/img/glut-logo.png'];

//司机认证状态转换数组 [未认证，认证中， 已认证]
var v_statusArr = ['unverified', 'verifying', 'verified'];

module.exports = {
  requestUrl: requestUrl,
  socketUrl: socketUrl,
  schoolList: schoolList,
  schoolLogoArr: schoolLogoArr,
  v_statusArr: v_statusArr
}