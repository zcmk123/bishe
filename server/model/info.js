var https = require('https');

var dbUtil = require('./mongodb');
var ObjectId = require('mongodb').ObjectId;
var request = require('request');
var fs = require('fs');

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
     * @param {string} jsCode 微信的jsCode用于兑换openid
     * @param {res} resp response对象
     */
    getOpenId: function (jsCode, resp) {
        var _this = this;
        var appid = 'wx5ab890ab211bee33';
        var secret = '760236e7b41f50d7f32ad1025eb4e572';
        var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + jsCode + '&grant_type=authorization_code';

        request(url, function (error, response, results) {
            if (!error && response.statusCode == 200) {
                var results = JSON.parse(results);
                var oid = results.openid;    // 存储openid
                // var errcode = results.errcode || true;

                if (results.errcode) {   // 如果错误，返回给客户端错误信息
                    resp.jsonp(results);
                    resp.end();
                } else {    // 正确，查询数据库是否已存在该openid
                    _this.getUInfo(oid, null, function (len, resu) {
                        if (len == 0) {
                            // 不存在，添加默认记录
                            var userDefaultObj = {
                                // nickname: userInfo.nickName,    //微信昵称
                                openid: oid,                             //用户openid
                                gender: 1,            //默认性别
                                credit: 0,                                 //用户积分
                                school: '',                                //用户学校
                                phone: '',                                 //电话号码
                                // avatarUrl: userInfo.avatarUrl,      //头像地址
                                rating: 0.0,                              //乘客评分
                                cplorders: 0,                           //完成订单总数
                                myorder: [],                            //存储我参与的订单，订单条数在百条数量级，以ObjectId存储
                                postorder: [],                        //存储我发布的订单，订单条数在百条数量级，以ObjectId存储
                                isdriver: {
                                    v_status: 0,                         //司机认证情况  0未认证  1认证中   2已认证
                                    car: '',                                //车型
                                    carpic: '',                             //车图片
                                    rating: 0.0,                           //司机评分
                                    cplorders: 0                         //完成订单总数
                                }
                            };

                            // 不存在，添加默认记录
                            dbUtil.insert('user', userDefaultObj, function (res) {
                                userDefaultObj._id = res.insertedId;
                                resp.jsonp(oid);
                                resp.end();
                            });
                        } else {
                            // 如果存在，直接把查询结果返回
                            resp.jsonp(resu[0]);
                            resp.end();
                        }
                    })
                }
            }
        })
    },
    /**
     * 微信登录
     */
    wechatLogin: function (postData, resp) {
        // console.log(postData)
        dbUtil.findAndModify('user',
            {
                openid: postData.openId
            }, {
                $set: {
                    avatarUrl: postData.avatarUrl,
                    nickname: postData.nickname
                }
            }, function (results) {
                // console.log(results);
                var sendObj = results.value;
                delete sendObj.myorder;
                delete sendObj.postorder;
                resp.jsonp(sendObj);
                resp.end();
            });
    },
    /**
     * 查询数据库中是否存在该openid
     * 不存在则添加
     * 废弃方法
     * @param {string} oid 用户openid
     * @param {object} userInfo 用户信息对象
     * @param {res} resp response对象
     */
    setOpenid: function (oid, userInfo, resp) {
        this.getUInfo(oid, null, function (len, results) {
            if (len == 0) {
                // 不存在，添加默认记录
                var userDefaultObj = {
                    nickname: userInfo.nickName,    //微信昵称
                    openid: oid,                             //用户openid
                    gender: userInfo.gender,            //微信性别
                    credit: 0,                                 //用户积分
                    school: '',                                //用户学校
                    phone: '',                                 //电话号码
                    avatarUrl: userInfo.avatarUrl,      //头像地址
                    rating: 0.0,                              //乘客评分
                    cplorders: 0,                           //完成订单总数
                    myorder: [],                            //存储我参与的订单，订单条数在百条数量级，以ObjectId存储
                    postorder: [],                        //存储我发布的订单，订单条数在百条数量级，以ObjectId存储
                    isdriver: {
                        v_status: 0,                         //司机认证情况  0未认证  1认证中   2已认证
                        car: '',                                //车型
                        carpic: '',                             //车图片
                        rating: 0.0,                           //司机评分
                        cplorders: 0                         //完成订单总数
                    }
                };

                // 不存在，添加默认记录
                dbUtil.insert('user', userDefaultObj, function (res) {
                    userDefaultObj._id = res.insertedId;
                    resp.jsonp(userDefaultObj);
                    resp.end();
                });
            } else {
                // 如果存在，直接把查询结果返回
                resp.jsonp(results[0]);
                resp.end();
            }
        })

    },
    /**
     * 查询用户信息并返回
     * @param {string} oid 用户openid
     * @param {res} resp response对象
     * @param {function} callback 回调函数
     */
    getUInfo: function (oid, resp, callback) {
        //去数据库中查找oid对应的用户
        dbUtil.find('user', {
            projection: {
                'myorder': 0,                   // 查询用户信息时订单字段不返回
                'postorder': 0       // 查询用户信息时订单字段不返回
            }
        }, { openid: oid }, function (len, results) {
            if (resp) {
                //返回一条数据
                resp.jsonp(results[0]);
                resp.end();
            } else {
                if (callback) {
                    callback(len, results);
                }
            }
        })
    },
    /**
     * 更新用户信息
     * @param {string} _id openid或者是ObjectID
     * @param {object} newInfo 新的用户信息
     * @param {res} resp response对象
     */
    setUInfo: function (_id, newInfo, resp) {
        dbUtil.update('user', { _id: ObjectId(_id) }, {
            $set: newInfo
        }, function (result) {
            resp.jsonp('success');
            resp.end();
        })
    },
    /**
     * 返回用户订单
     */
    findMyOrder: function (userId, page, resp) {
        dbUtil.find('user', { projection: { 'myorder': 1 } }, { _id: ObjectId(userId) }, function (len, results) {
            var myOrder = results[0].myorder;
            dbUtil.findByPage(page, { _id: { $in: myOrder } }, function (results) {
                if (results.length == 0) {
                    resp.jsonp('end');
                } else {
                    resp.jsonp(results);
                }
                resp.end();
            });
        });
    },
    /**
    * 返回发布订单
    */
    findPostOrder: function (userId, page, resp) {
        dbUtil.find('user', { projection: { 'postorder': 1 } }, { _id: ObjectId(userId) }, function (len, results) {
            var postOrder = results[0].postorder;
            dbUtil.findByPage(page, { _id: { $in: postOrder } }, function (results) {
                resp.jsonp(results);
                resp.end();
            });
        });
    },
    /**
     * 上传车辆验证图片
     * @param {string} picName 图片名称
     * @param {string} filePath 图片路径
     * @param {res} resp response对象
     */
    uploadCarPic: function (picName, filePath, resp) {
        //上传车的图片
        fs.rename(filePath, 'uploadpic/car/' + picName + '.jpg', function (err) {
            if (err) {
                throw err;
            }
            console.log('上传成功!');
            resp.jsonp('success')
            resp.end();
        })
    },
    /**
     * 上传赞赏码
     * @param {string} picName 图片名称
     * @param {string} filePath 图片路径
     * @param {res} resp response对象
     */
    uploadZanQR: function (picName, filePath, resp) {
        //上传车的图片
        fs.rename(filePath, 'uploadpic/zanQR/' + picName + '.jpg', function (err) {
            if (err) {
                throw err;
            }
            var imgUrl = 'https://pinche.istarmcgames.com/uploadpic/zanQR/' + picName + '.jpg';
            dbUtil.update('user', {_id: ObjectId(picName)}, { $set: {'isdriver.zanqr': imgUrl } }, function () {
                console.log('zanQR上传成功!');
                resp.jsonp({
                    msg: 'success',
                    imgUrl: imgUrl
                })
                resp.end();
            })
        })
    },
    /**
     * 设置司机信息
     */
    setDriverInfo: function (postInfo, resp) {
        var driverId = postInfo.driverId;

        dbUtil.findAndModify('user',
            {
                _id: ObjectId(driverId)
            }, {
                $set: {
                    'isdriver.v_status': 1, // 设置为待审核状态
                    'isdriver.phone': postInfo.postInfo.phone,
                    'isdriver.car': postInfo.postInfo.car,
                    'isdriver.carid': postInfo.postInfo.carid,
                    'isdriver.carpic': 'https://pinche.istarmcgames.com/uploadpic/car/' + driverId + '.jpg'
                }
            }, function (results) {
                resp.jsonp('success');
                resp.end();
            })
    }
}

module.exports = info;