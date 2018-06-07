/*
 * @Author: zhouchen minkun 
 * @Date: 2018-03-21 21:17:18 
 * @Last Modified time: 2018-03-21 21:17:18 
 */

var dbUtil = require('./mongodb');
var ObjectId = require('mongodb').ObjectId;

var pinche = {
    /**
     * 发布拼车信息逻辑
     * @param {object} postInfoObj 前端传来的拼车信息
     * @param {res} resp response对象
     */
    postInfo: function (postInfoObj, resp) {
        var driverId = postInfoObj.driver;
        // 时间做处理，以Date格式存入
        // 时间以UTC存储取到客户端需要转换
        postInfoObj.date = new Date(postInfoObj.date);
        postInfoObj.driver = ObjectId(postInfoObj.driver);
        postInfoObj.school = parseInt(postInfoObj.school);
        // 添加拼车默认状态
        postInfoObj.status = 0;         // 0 未开始   1 已完成(司机手动确认完成)

        updateListItem()
            .then(function (itemId) {
                return Promise.all([updateMyOrder(itemId), createComment(driverId)])
            })
            .then(function (res) {
                if (res[0] == 'success') {
                    resp.jsonp('success');
                    resp.end();
                }
            });

        function updateListItem() { // 更新订单列表
            return new Promise(function (resolve, reject) {
                dbUtil.insert('list', postInfoObj, function (res) {
                    var itemId = res.insertedId;
                    console.log('list-item插入数据库成功');
                    resolve(itemId);
                });
            });
        }

        function updateMyOrder(itemId) {  // 更新发布的订单数组
            return new Promise(function (resolve, reject) {
                dbUtil.findAndModify('user', {
                    _id: ObjectId(driverId)
                }, {
                        $push: {  //增加订单数组
                            postorder: itemId
                        }
                    }, function () {
                        resolve('success');
                    })
            });
        }


        /**
         * 创建评论条目
         */
        function createComment(driverId) {
            var insertObj = {   // 要插入的对象
                driverId: ObjectId(driverId),
                uid_list: [],   // 用户id列表数组
                comment_list: []    // 评论列表数组
            }

            return new Promise(function (resolve, reject) {
                dbUtil.find('comments', {}, { driverId: ObjectId(driverId) }, function (len, results) {
                    if (len == 0) {
                        dbUtil.insert('comments', insertObj, function (res) {
                            resolve('success');
                        })
                    } else {
                        resolve('success');
                    }
                })
            });
        }
    },
    /**
     * 加载拼车信息列表
     * @param {number} page 信息列表页数
     * @param {res} resp response对象
     */
    loadList: function (page, school, search, option, resp) {
        var filter = school == null ? { status: 0 } : { school: parseInt(school), status: 0 };

        if (search && option != 0) {    //如果有搜索关键词且搜索项不为全部
            var reg = new RegExp("^.*" + search + ".*$");
            switch (option) {
                case '1':
                    filter['startLoc.name'] = reg;
                    break;
                case '2':
                    filter['destLoc.name'] = reg;
                    break;
            }
        }

        dbUtil.findByPage(page, filter, function (results) {
            if (results.length == 0) {
                resp.jsonp('end');
            } else {
                resp.jsonp(results);
            }
            resp.end();
        })
    },
    /**
     * 加载单条拼车详情
     * @param {string} itemId 拼车信息的ObjectID
     * @param {res} resp response对象
     */
    loadItem: function (itemId, resp) {
        dbUtil.find('list', {}, {
            _id: ObjectId(itemId)
        }, function (len, results) {
            // 临时变量暂存结果
            var sendObj = results[0];
            var driverId = sendObj.driver;
            var passenger = sendObj.passenger;

            Promise.all([findPassenger(), findDriver()])
                .then(function (res) {
                    if (res[0] == 'success' && res[1] == 'success') {
                        resp.jsonp(sendObj);
                        resp.end();
                    }
                });

            function findPassenger() {
                return new Promise(function (resolve, reject) {
                    dbUtil.find('user', { projection: { 'myorder': 0, 'postorder': 0, 'isdriver': 0 } }, { _id: { $in: passenger } }, function (length, res) {
                        sendObj.passenger = res;
                        resolve('success');
                    })
                });
            }

            function findDriver() {
                return new Promise(function (resolve, reject) {
                    dbUtil.find('user', { projection: { 'nickname': 1, 'phone': 1, 'avatarUrl': 1, 'isdriver': 1 } }, { _id: driverId }, function (leng, resu) {
                        sendObj.driver = resu[0];
                        resolve('success');
                    })
                })
            }
        })

    },
    /**
     * 将乘客添加到拼车中，修改拼车信息中的剩余座位数
     * @param {string} itemId 拼车信息的ObjectID
     * @param {string} passengerId 乘客的ObjectID
     * @param {res} resp response对象
     */
    addPassenger: function (itemId, passengerId, resp) {

        Promise.all([updateListItem(), updateMyOrder()])
            .then(function (res) {
                if (res[0] == 'success' && res[1] == 'success') {   // 两个都更新成功
                    resp.jsonp('success');
                    resp.end();
                }
                // TODO 有一个失败要回滚
            })

        /**
         * 更新订单列表
         */
        function updateListItem() {
            return new Promise(function (resolve, reject) {
                dbUtil.findAndModify('list', {
                    _id: ObjectId(itemId),
                    seat: { $gt: 0 }
                }, {
                        $push: {//增加乘客数组
                            passenger: ObjectId(passengerId)
                        },
                        $inc: {//座位数-1
                            seat: -1
                        }
                    }, function () {
                        resolve('success');
                    })
            })
        }

        /**
         * 更新我参与的订单
         */
        function updateMyOrder() {
            return new Promise(function (resolve, reject) {
                //增加订单信息到我参与的订单
                dbUtil.findAndModify('user', {
                    _id: ObjectId(passengerId)
                }, {
                        $push: {  //增加订单数组
                            myorder: ObjectId(itemId)
                        }
                    }, function () {
                        resolve('success');
                    })
            })
        }
    },
    /**
     * 取消订单，删除乘客
     */
    removePassenger: function (postData, resp) {
        var userId = postData.userId;
        var itemId = postData.itemId;

        Promise.all([removeListItem(), removeMyOrder()])
            .then(function (res) {
                if (res[0] == 'success' && res[1] == 'success') {   // 两个都更新成功
                    resp.jsonp('success');
                    resp.end();
                }
                // TODO 有一个失败要回滚
            })

        function removeListItem() {
            return new Promise(function (resolve, reject) {
                dbUtil.findAndModify('list', {
                    _id: ObjectId(itemId)
                }, {
                        $pull: {
                            passenger: ObjectId(userId)
                        },
                        $inc: {//座位数+1
                            seat: 1
                        }
                    },
                    function (results) {
                        resolve('success');
                    });
            });
        }

        function removeMyOrder() {
            return new Promise(function (resolve, reject) {
                dbUtil.findAndModify('user', {
                    _id: ObjectId(userId)
                }, {
                        $pull: {
                            myorder: ObjectId(itemId)
                        }
                    },
                    function (results) {
                        resolve('success');
                    });
            });
        }
    },
    /**
     * 删除订单
     */
    removeOrder: function (postData, resp) {
        var userId = postData.userId;
        var itemId = postData.itemId;
        
        Promise.all([removeListItem(), removeMyPost()])
        .then(function (res) {
            if (res[0] == 'success' && res[1] == 'success') {   // 两个都更新成功
                resp.jsonp('success');
                resp.end();
            }
            // TODO 有一个失败要回滚
        })

        function removeListItem() {
            return new Promise(function (resolve, reject) {
                dbUtil.delete('list', { _id: ObjectId(itemId) }, function (results) {
                    resolve('success');
                })
            });
        }

        function removeMyPost() {
            return new Promise(function (resolve, reject) {
                dbUtil.findAndModify('user', {
                    _id: ObjectId(userId)
                }, {
                        $pull: {
                            postorder: ObjectId(itemId)
                        }
                    },
                    function (results) {
                        resolve('success');
                    });
            });
        }
    },
    /**
     * 处理评论、评分
     */
    comment: function (postData, resp) {
        var userId = postData.userId;
        var driverId = postData.driverId;
        var itemId = postData.itemId;

        Promise.all([updateRating(), insertComment(), updateCredit()])
            .then(function (res) {
                if (res[0] == 'success' && res[1] == 'success' && res[2] == 'success') {   // 两个都更新成功
                    resp.jsonp('success');
                    resp.end();
                }
            });

        // 更新总分、评论数量
        function updateRating() {
            return new Promise(function (resolve, reject) {
                dbUtil.findAndModify('user', {
                    _id: ObjectId(driverId)
                }, {
                        $inc: {
                            'isdriver.rating': postData.postInfo.rating,
                            'isdriver.cplorders': 1
                        }
                    }, function (results) {
                        resolve('success');
                    })
            });
        }

        //更新积分
        function updateCredit() {
            return new Promise(function (resolve, reject) {
                dbUtil.findAndModify('user', {
                    _id: ObjectId(userId)
                }, {
                        $inc: {
                            credit: 50
                        }
                    }, function (results) {
                        resolve('success');
                    })
            });
        }

        // 新增评论到评论集合中
        function insertComment() {
            return new Promise(function (resolve, reject) {
                dbUtil.findAndModify('comments', {
                    driverId: ObjectId(driverId)
                }, {
                        $addToSet: { uid_list: ObjectId(userId) },
                        $push: {
                            comment_list: {
                                userId: ObjectId(userId),
                                comment: postData.postInfo.comment,
                                orderId: ObjectId(itemId)
                            }
                        }
                    }, function (results) {
                        resolve('success');
                    })
            });
        }
    },
    /**
     * 检查能否评论
     */
    checkComment: function (userId, itemId, resp) {
        dbUtil.find('comments', {}, {
            comment_list: { $elemMatch: { userId: ObjectId(userId), orderId: ObjectId(itemId) } }
        }, function (len, results) {
            if (len == 0) {
                resp.jsonp('true');
            } else {
                resp.jsonp('false');
            }
            resp.end();
        })
    },
    /**
     * 获取评论列表
     */
    getComment: function (userId, page, resp) {
        dbUtil.findCommentByPage(page, {
            driverId: ObjectId(userId)
        }, function (results) {
            var sendObj = results[0];
            var uid_list = sendObj.uid_list;
            dbUtil.find('user', {
                projection: {//指定输出哪些字段
                    'nickname': 1,
                    'avatarUrl': 1
                }
            }, {
                    _id: { $in: uid_list }
                }, function (len, res) {
                    if (len != 0) {
                        sendObj.uid_list = res;
                    } else {
                        sendObj = [];
                    }
                    resp.jsonp(sendObj);
                    resp.end();
                })

        })
    },
    /**
     * 完成订单
     */
    completOrder: function (itemId, resp) {
        dbUtil.findAndModify('list', { _id: ObjectId(itemId) }, { $set: { status: 1 } }, function (result) {
            resp.send('success');
            resp.end();
        })
    }
}

module.exports = pinche;