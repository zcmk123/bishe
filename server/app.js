var fs = require('fs');
var url = require('url');

var http = require('http');
var https = require('https');
var WebSocketServer = require('ws').Server;

var bodyParser = require('body-parser');

var privateKey = fs.readFileSync('./certificate/2_pinche.istarmcgames.com.key', 'utf8');
var certificate = fs.readFileSync('./certificate/1_pinche.istarmcgames.com_bundle.crt', 'utf8');
var credentials = { key: privateKey, cert: certificate };

var express = require('express');

var app = express();

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

app.use(express.static('static'));
app.use('/uploadpic', express.static('uploadpic'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('./router/router'));

httpServer.listen(80, function () {
    console.log('HTTP Server is running on: https://localhost:80');
});

httpsServer.listen(443, function () {
    console.log('HTTPS Server is running on: https://localhost:443');
});


// ------------------------------------------------------------
var wss = new WebSocketServer({     // websocket服务器
    server: httpsServer
});

var userSet = {};       // 储存用户连接的集合

var locationSet = {};    //储存位置信息的集合

// locationSet['5ab7ad18a6d0314c13b30ca0'] = {
//     nickName: '我是司机',
//     latitude: 25.40,
//     longitude: 110.32552
// }

wss.on('connection', function connection(ws, req) {
    var userId = url.parse(req.url, true).query.myId;
    var driverId = url.parse(req.url, true).query.driverId;
    console.log(userId + '连接了');
    userSet[userId] = ws;   // 连接之后增加到用户集合
    ws['userId'] = userId;  // 设置用户标识

    ws.on('message', function incoming(message) {
        var recObj = JSON.parse(message);   // 接收到的信息对象
        var target = recObj.target;     // 数组
        var source = recObj.source;
        var location = recObj.location;
        
        // 存储终端的位置信息
        locationSet[source] = location;

        var data = [];
        // 检查有没有locationSet中有没有target的位置
        target.forEach(function (ele, index) {
            var location = locationSet[ele];
            if(location) {
                data.push(location);
            }
        })

        try {     
            ws.send(JSON.stringify({data})); // 发送位置
        } catch (error) {
            console.log(error);
        }

    });

    ws.on('close', function close(code, reason) {
        console.log( ws.userId + ' 断开连接 ' + reason);
        delete userSet[ws.userId];  // 清除用户连接
        delete locationSet[ws.userId];  // 清除用户位置
    });

    // ws.send('连接成功！');
});
//-----------------------------------------------------------------------
// // 没有挂载路径的中间件，通过该路由的每个请求都会执行该中间件
// router.use('/', function (req, res, next) {
//     console.log('Time:', Date.now());
//     next();
// });

// 处理404
// app.use(function (req, res, next) {
//     res.status(404).send('404 NOT FOUND !!!');
// });
// var serverPort = process.env.PORT || 80;

// var server = app.listen(serverPort);
