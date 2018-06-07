var dbUtil = require('./mongodb');
var ObjectId = require('mongodb').ObjectId;

const TIME_DIFF = 8;

var statistics = {
    /**
     * 时间点统计发布拼车订单数
     */
    sTime: function (resp) {
        dbUtil.aggregate('list', [
            { $project: { hours: { $substr: ["$date", 11, 2] } } },
            { $group: { _id: "$hours", count: { $sum: 1 } } },
            { $sort : { _id: -1 } }
        ], 
        function (results) {
            results.forEach(function (ele) {
                ele._id = (Number(ele._id) + TIME_DIFF) % 24;
            })
            resp.jsonp(results);
        })
    }
}

module.exports = statistics;