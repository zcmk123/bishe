var fs = require('fs');

var http = require('http');
var https = require('https');
var ws = require("nodejs-websocket");

var bodyParser = require('body-parser');

var privateKey = fs.readFileSync('./certificate/2_pinche.istarmcgames.com.key', 'utf8');
var certificate = fs.readFileSync('./certificate/1_pinche.istarmcgames.com_bundle.crt', 'utf8');
var credentials = { key: privateKey, cert: certificate };

var express = require('express');

var app = express();

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

app.use(express.static('static'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(require('./router/router'));

httpServer.listen(80, function () {
    console.log('HTTP Server is running on: https://localhost:80');
});

httpsServer.listen(443, function () {
    console.log('HTTPS Server is running on: https://localhost:443');
});

// webSocket 测试服务器
// var userA = null, userB = null , userAReady = false , userBReady = false;
// var wsServer = ws.createServer(function(conn){
//     conn.on("text", function (str) {
//         /*
//             客户端A传过来（发起者）
//             {
//                 selfID: 自己的id
//                 targetID: 目标id
//             }
//             if selfID 存在，说明userA准备完成
//         */
//         // console.log("收到的信息为:"+str)
//         if(str==="userA"){
//             userA = conn;
//             userAReady = true;
//             conn.sendText("success");
//         }
//         if(str==="userB"){
//             userB = conn;
//             userBReady = true;
//         }
//         if(userAReady&&userBReady){
//             //把str推送给userB
//             userB.sendText(str);
//         }
//         conn.sendText(str)
//     })
//     conn.on("close", function (code, reason) {
//         console.log("关闭连接")
//     });
//     conn.on("error", function (code, reason) {
//         console.log("异常关闭")
//     });
// }).listen(80,'127.0.0.1')
// console.log("WebSocket建立完毕")

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
