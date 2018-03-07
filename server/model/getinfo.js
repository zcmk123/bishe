var https = require('https');

var dbUtil = require('./mongodb');

var request = require('request');

var info = {
    getTime: function () {
        var obj = {};
        var time = new Date().toLocaleString();
        obj.time = time;
        return obj;
    },
    /**
     * 获取微信用户唯一识别码OpenId
     * 直接返回给客户端
     */
    getOpenId: function (jsCode, resp) {
        var appid = 'wx5ab890ab211bee33';
        var secret = '760236e7b41f50d7f32ad1025eb4e572';
        var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + jsCode + '&grant_type=authorization_code';

        request(url, function (error, response, results) {
            if (!error && response.statusCode == 200) {
                var results = JSON.parse(results);
                var oid = results.openid;    // 存储openid
                var errcode = results.errcode || true;

                if (errcode) {   // 如果错误，返回给客户端错误信息
                    resp.jsonp(results);
                    resp.end();
                } else {    // 正确，查询数据库是否已存在该openid
                    resp.jsonp(results);
                    resp.end();
                }
            }
        })
    },
    /**
     * 查询数据库中是否存在该openid
     * 不存在则添加
     */
    setOpenid: function (oid, resp) {
        dbUtil.find('user', { openid: oid }, function (len, results) {
            if (len == 0) {
                // 不存在，添加记录
                var userDefaultObj = { 
                    openid: oid,
                    gender: 1,
                    credit: 0,
                    school: '',
                    phone: '',
                    driver: false
                };
                dbUtil.insert('user', userDefaultObj, function (res) {
                    userDefaultObj._id = res.insertedId;
                    resp.jsonp([userDefaultObj]);
                    resp.end();
                });
                
            } else {
                // 如果存在，直接把查询结果返回
                resp.jsonp(results);
                resp.end();
            }
        })
    },
    /**
     * 发布拼车信息逻辑
     */
    postInfo: function (postInfoObj, resp) {
        // console.log(postInfoObj);
        dbUtil.insert('list', postInfoObj, function () {
            console.log('list-item插入数据库成功');
            resp.end();
        })
    },
    /**
     * 加载拼车信息列表
     */
    loadList: function (page, resp) {
        // console.log(page);
        dbUtil.findByPage(page, function (results) {
            resp.jsonp(results);
            resp.end();
        })
    }
}

module.exports = info;