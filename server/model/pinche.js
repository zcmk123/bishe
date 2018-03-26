/*
 * @Author: zhouchen minkun 
 * @Date: 2018-03-21 21:17:18 
 * @Last Modified time: 2018-03-21 21:17:18 
 */

var dbUtil = require('./mongodb');
var ObjectId = require('mongodb').ObjectId;
var fs = require('fs');

var pinche = {
    /**
     * 发布拼车信息逻辑
     * @param {object} postInfoObj 前端传来的拼车信息
     * @param {res} resp response对象
     */
    postInfo: function (postInfoObj, resp) {
        // 时间做处理，以Date格式存入
        // 时间以UTC存储取到客户端需要转换
        postInfoObj.date = new Date(postInfoObj.date);
        dbUtil.insert('list', postInfoObj, function () {
            console.log('list-item插入数据库成功');
            resp.end();
        })
    },
    /**
     * 加载拼车信息列表
     * @param {number} page 信息列表页数
     * @param {res} resp response对象
     */
    loadList: function (page, resp) {
        dbUtil.findByPage(page, function (results) {
            resp.jsonp(results);
            resp.end();
        })
    },
    /**
     * 加载单条拼车详情
     * @param {string} itemId 拼车信息的ObjectID
     * @param {res} resp response对象
     */
    loadItem: function (itemId, resp) {
        dbUtil.find('list', {
            _id: ObjectId(itemId)
        }, function (len, result) {
            // 临时变量暂存结果
            var sendObj = result[0];
            var driverId = sendObj.driver;
            
            // 第二次查询，找出司机信息
            dbUtil.find('user', {
                _id: ObjectId(driverId)
            }, function (len, result) {
                sendObj.driver = result[0];
                resp.jsonp(sendObj);
                resp.end();
            })
        })
    },
    /**
     * 将乘客添加到拼车中，修改拼车信息中的剩余座位数
     * @param {string} itemId 拼车信息的ObjectID
     * @param {string} passengerId 乘客的ObjectID
     * @param {res} resp response对象
     */
    addPassenger: function (itemId, passengerId, resp) {
        // console.log(itemId + ' ' + passengerId);
        dbUtil.update('list', {
            //where条件找到对应的拼车条目，将乘客ObjectID添加到内部
            _id: ObjectId(itemId)
        }, {
            $push: {//增加乘客数组
                passenger: passengerId
            },
            $inc: {//座位数-1
                seat: -1
            }
        }, function (result) {
            resp.jsonp('success');
            resp.end();
        })
    },
    /**
     * 上传车辆验证图片
     * @param {string} picName 图片名称
     * @param {string} filePath 图片路径
     * @param {res} resp response对象
     */
    uploadCarPic: function (picName, filePath, resp) {
    //上传车的图片
    fs.rename(filePath, 'uploadpic/car/' + picName + '.jpg', function(err) {
        if (err) {
            throw err;
        }
        console.log('上传成功!');
    })
    resp.jsonp('success')
    resp.end();
    }
}

module.exports = pinche;