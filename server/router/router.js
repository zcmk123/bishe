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
    // var employees = info.getInfo();
    res.jsonp(info.getTime());
    res.end();
})

/**
 * 上传车的图片处理
 */
router.post('/uploadpic', upload.single('file'), function(req, res){
    var picName = req.body.id;
    var filePath = req.file.path;
    pinche.uploadCarPic(picName, filePath, res);
})

/**
 * 获取openid
 */
router.get('/getopenid', function (req, res) {
    var jsCode = url.parse(req.url, true).query.jsCode;
    info.getOpenId(jsCode, res);
    // res.jsonp(openid);
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
    pinche.loadList(page, res);
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
    console.log('进来了');
    res.end('end');
 })

module.exports = router;