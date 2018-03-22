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
        // TODO删除
    },
    update: function (collectionName, filter, obj, callback) {
        // 更新
        connect(function (err, db) {
            db.collection(collectionName).updateOne(filter, obj, function (error, result) {
                if(callback) {
                    callback(result);
                }
            })
        })
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
    /**
     * 通过ObjectID查询
     * 废弃方法
     */
    findById: function (collectionName, oid, callback) {
        var _id = ObjectId(oid);
        connect(function (err, db) {
            db.collection(collectionName).findOne({ _id: _id }, {}, function (error, result) {
                if (callback) {
                    callback(result);
                }
            })
        })
    },
    /**
     * 通过页数查询
     */
    findByPage: function (page, callback) {
        var pageSize = 5;
        var skip = (page - 1) * pageSize;
        connect(function (err, db) {
            db.collection('list').find({}, {
                limit: pageSize,    //分页，每页多少条
                skip: skip, //从第几条开始
                projection: {//指定输出哪些字段
                    'title': 1,
                    'desc': 1,
                    'date': 1,
                    'time': 1,
                    'seat': 1,
                    'startLoc.name': 1,
                    'destLoc.name': 1
                }
            }).toArray(function (error, results) {
                if (callback) {
                    callback(results);
                }
            });
        })
    }
}

module.exports = dbUtil;