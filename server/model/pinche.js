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
        dbUtil.findByPage(page, function (results) {
            resp.jsonp(results);
            resp.end();
        })
    },
    /**
     * 加载单条拼车详情
     */
    loadItem: function (itemId, resp) {
        dbUtil.find('list', {
            _id: ObjectId(itemId)
        }, function (len, result) {
            resp.jsonp(result[0]);
            resp.end();
        })
    },
    /**
     * 将乘客添加到拼车中，修改拼车信息中的剩余座位数
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
    uploadCarPic: function (picName, filePath, resp) {
    // console.log(req.file.originalname);
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