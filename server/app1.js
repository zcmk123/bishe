// node服务端

// http模块
var http = require('http');

// path模块
var path = require('path');
// path.extname('abc.css')  能获取文件的扩展名

//url模块
var url=require('url');

// router路由模块
var router = require('./modules/router')

// 获取扩展名模块
var mime = require('mime')

var server = http.createServer(function (req, res) {
    
    // 获取url
    var pathName =  url.parse(req.url).pathname.replace('/', '');
    console.log(pathName);

    if (pathName == '') {
        pathName = 'index';
    }
    
    var extname = path.extname(pathName);

    try {
        router[pathName](req, res);
    } catch (error) {
        router['404'](req, res);
    }
    

    // if (pathName == '/dologin') {   //登陆逻辑

    //     console.log(req.method);
    //     res.end('login');

    // } else if (pathName != '/favicon.ico') {
    //     // 获取静态页面
    //     fs.readFile('static' + pathName, function (err, data) {    //回调函数
    //         // 获取mime类型
    //         var mimeText = mime.getType(extname);
    //         if (err) {
    //             // 如果找不到文件 fs.write404页面
    //             fs.readFile('static/404.html', function (err, data) {
    //                 res.writeHead(404, {'Content-Type': ''+ mimeText + ';charset=utf-8'});
    //                 res.write(data);
    //                 res.end();  //结束相应
    //             });
    //         } else {
    //             res.writeHead(200, {'Content-Type': ''+ mimeText + ';charset=utf-8'});
    //             res.write(data);
    //             res.end();  //结束相应
    //         }
    //     });
    // }
});

var serverPort = process.env.PORT || 5000;

server.listen(serverPort);

console.log('server listening at '+ serverPort +' port');