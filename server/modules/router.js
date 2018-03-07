// router路由模块

// fs模块
var fs = require('fs');

var router = {
    index : function (req, res) {
        res.end('index');
    },
    itemPage : function (req, res) {
        res.end('itemPage');
    },
    login : function (req, res) {
        res.end('login');
    },
    404 : function (req, res) {
        res.end('404 not found');
    }
}

// 导出router模块
module.exports = router;