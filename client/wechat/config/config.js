/**
 * 全局配置文件
 */

//请求Url
// var requestUrl = 'https://localhost/';
var requestUrl = 'https://pinche.istarmcgames.com/';

//学校信息
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
    }
  ]
}]

//学校logo数组
var schoolLogoArr = ['/images/img/guet-logo.png', '/images/img/glut-logo.png']

module.exports = {
  requestUrl: requestUrl,
  schoolList: schoolList,
  schoolLogoArr: schoolLogoArr
}