// MongoDB
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

// 连接串、数据库名
var url = 'mongodb://root:123456@119.29.205.219:27017';
var dbName = 'pinche';

/**
 * 连接数据库
 * @param {*} callback 
 */
function connect(callback) {
    MongoClient.connect(url, function (err, client) {
        if (err) {
            console.log('数据库连接失败，log:' + err);
            return;
        }
        var db = client.db(dbName);
        callback(err, db);
        client.close();
    })
}

/** 
 * 暴露给外界的方法
*/
var dbUtil = {
    insert: function (collectionName, obj, callback) {
        connect(function (err, db) {
            db.collection(collectionName).insertOne(obj, function (error, res) {
                if (callback) {
                    callback(res);
                }
            })
        })
    },
    delete: function () {
        // 删除
    },
    update: function () {
        // 更新
    },
    find: function (collectionName, obj, callback) {
        // 查找
        connect(function (err, db) {
            db.collection(collectionName).find(obj).toArray(function (error, result) {
                if (callback) {
                    callback(result.length, result);
                }
            })
        })
    },
    findById: function (collectionName, ObjectId, callback) {
        var _id = ObjectId(ObjectId);
        connect(function (err, db) {
            db.collection(collectionName).findOne({ _id: _id }, {}, function (error, result) {
                if (callback) {
                    callback(result);
                }
            })
        })
    },
    findByPage: function (page, callback) {
        var pageSize = 5;
        var skip = (page-1) * pageSize;
        connect(function (err, db) {
            db.collection('list').find({}, {limit: pageSize, skip: skip}).toArray(function (error, results) {
                if (callback) {
                    callback(results);
                }
            });
        })
    }
}

module.exports = dbUtil;