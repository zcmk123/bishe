var express = require('express');

var router = express.Router();

var url = require('url');

var info = require('../model/getinfo');

// 路由

router.get('/getinfo', function (req, res) {
    // var employees = info.getInfo();
    res.jsonp(info.getTime());
    res.end();
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
 * 查询数据库、增加openid
 */
router.get('/setopenid', function (req, res) {
    var oid = url.parse(req.url, true).query.openid;
    info.setOpenid(oid, res);
})

/**
 * 接收处理发布的拼车信息
 */
router.post('/postinfo', function (req, res) {
    var postData = req.body;
    info.postInfo(postData, res);
})

/**
 * 加载拼车信息列表
 */
router.get('/loadlist', function (req, res) {
    var page = url.parse(req.url, true).query.page;
    info.loadList(page, res);
})

module.exports = router;