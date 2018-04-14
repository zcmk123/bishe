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
    /**
     * 插入一条数据
     * @param {string} collectionName 集合名字
     * @param {object} obj 要插入的数据
     * @param {function} callback 回调函数
     */
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
    /**
     * 更新一条数据
     * @param {stirng} collectionName 集合名称
     * @param {object} filter where筛选条件
     * @param {object} obj 要修改的数据
     * @param {function} callback 回调函数
     */
    update: function (collectionName, filter, obj, callback) {
        // 更新
        connect(function (err, db) {
            db.collection(collectionName).updateOne(filter, obj, function (error, result) {
                if (callback) {
                    callback(result);
                }
            })
        })
    },
    /**
     * 查询数据(返回数组)
     * @param {string} collectionName 集合名称
     * @param {object} filter 查询条件
     * @param {object} obj 要修改的数据
     * @param {function} callback 回调函数
     */
    find: function (collectionName, filter, obj, callback) {
        // 查找
        connect(function (err, db) {
            db.collection(collectionName).find(obj, filter).toArray(function (error, result) {
                if (callback) {
                    callback(result.length, result);
                }
            })
        })
    },
    /**
     * 查询并修改数据(原子操作)
     * @param {string} collectionName 集合名称
     * @param {object} filter 查询条件
     * @param {object} obj 要修改的数据
     * @param {function} callback 回调函数
     */
    findAndModify: function (collectionName, filter, obj, callback) {
        connect(function (err, db) {
            db.collection(collectionName).findOneAndUpdate(filter, obj, function (error, result) {
                if(callback) {
                    callback(result);
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