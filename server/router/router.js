var express = require('express');

// 文件上传模块
var multer = require("multer");
var upload = multer({ dest: 'uploadpic/' });

var router = express.Router();

var url = require('url');

var info = require('../model/info');

var pinche = require('../model/pinche');

// 路由

router.get('/getinfo', function (req, res) {
    res.jsonp(info.getTime());
    res.end();
})

/**
 * 微信登录
 */
router.post('/wechatlogin', function (req, res) {
    var postData = req.body;
    info.wechatLogin(postData, res);
})

/**
 * 上传车的图片处理
 */
router.post('/uploadpic', upload.single('file'), function(req, res){
    var picName = req.body.id;
    var filePath = req.file.path;
    info.uploadCarPic(picName, filePath, res);
})

/**
 * 上传赞赏码
 */
router.post('/uploadpic/zanqr', upload.single('file'), function(req, res){
    var picName = req.body.id;
    var filePath = req.file.path;
    info.uploadZanQR(picName, filePath, res);
})

/**
 * 司机信息验证
 */
router.post('/setdriverinfo', function (req, res) {
    var postInfo = req.body;
    info.setDriverInfo(postInfo, res);
})

/**
 * 获取openid
 */
router.get('/getopenid', function (req, res) {
    var jsCode = url.parse(req.url, true).query.jsCode;
    info.getOpenId(jsCode, res);
})

/**
 * 获取用户信息
 */
router.get('/getuinfo', function (req, res) {
    var oid = url.parse(req.url, true).query.openid;
    info.getUInfo(oid ,res);
})

/**
 * 查询数据库、保存用户信息
 */
router.post('/setopenid', function (req, res) {
    var postData = req.body;
    var oid = postData.openid;
    var userInfo = postData.userInfo;
    info.setOpenid(oid, userInfo, res);
})

/**
 * 更新用户信息
 */
router.put('/setuinfo', function (req, res) {
    var postData = req.body;
    var _id = postData._id;
    var newInfo = postData.newInfo;
    info.setUInfo(_id, newInfo, res);
})

/**
 * 接收处理发布的拼车信息
 */
router.post('/postinfo', function (req, res) {
    var postData = req.body;
    pinche.postInfo(postData, res);
})

/**
 * 加载拼车信息列表
 */
router.get('/loadlist', function (req, res) {
    var page = url.parse(req.url, true).query.page;
    var school = url.parse(req.url, true).query.school || null;
    pinche.loadList(page, school, res);
})

/**
 * 加载一条拼车信息详情list-item页面
 */
 router.get('/loaditem', function (req, res) {
    var itemId = url.parse(req.url, true).query.itemId;
    pinche.loadItem(itemId, res);
 })

 /**
  * 确认拼车，将用户信息添加到拼车详情中
  */
 router.get('/addpassenger', function (req, res) {
    var itemId = url.parse(req.url, true).query.itemId;
    var passengerId = url.parse(req.url, true).query.passengerId;
    pinche.addPassenger(itemId, passengerId, res);
 })

 /**
  * 请求我参与的拼车信息
  */
 router.get('/order/myorder', function (req, res) {
    var userId = url.parse(req.url, true).query.userId;
    var page = url.parse(req.url, true).query.page;
    info.findMyOrder(userId, page, res);
 })

 /**
  * 请求我发布的拼车信息
  */
 router.get('/order/postorder', function (req, res) {
    var userId = url.parse(req.url, true).query.userId;
    var page = url.parse(req.url, true).query.page;
    info.findPostOrder(userId, page, res);
 })

 /**
  * 取消拼车
  */
 router.delete('/order/cancelorder', function (req, res) {
    var postData = req.body;
    pinche.removePassenger(postData, res);
 })

 /**
  * 评价拼车
  */
 router.post('/order/comment', function (req, res) {
    var postData = req.body;
    pinche.comment(postData, res);
 })

  /**
  * 检查评论
  */
 router.get('/order/checkcomment', function (req, res) {
    var userId = url.parse(req.url, true).query.userId;
    var itemId = url.parse(req.url, true).query.itemId;
    pinche.checkComment(userId, itemId, res);
 })

 /**
  * 获取评论
  */
 router.get('/comment/getcomment', function (req, res) {
    var userId = url.parse(req.url, true).query.userId;
    var page = url.parse(req.url, true).query.page;
    pinche.getComment(userId, page, res);
 })

 /**
  * 完成订单
  */
 router.get('/order/completorder', function (req, res) {
    var itemId = url.parse(req.url, true).query.itemId;
    pinche.completOrder(itemId, res);
 })

module.exports = router;