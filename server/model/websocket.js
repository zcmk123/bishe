// webSocket 测试服务器

function socketStart() {
    var userA = null;
    var userB = null;
    var userAReady = false;
    var userBReady = false;

    var connArr = []; // 用户连接数组

    /*
        客户端A传过来（发起者）
        {
            selfID: 自己的id
            targetID: 目标id
            data: 要传送的数据
        }
        if selfID 存在，说明userA准备完成
    */
    // console.log("收到的信息为:"+str)
}

function consoleMsg (msg) {
    msg = JSON.parse(msg);
    console.log(msg.userId);
    console.log(msg.targetId);
    console.log(msg.msg);
}

module.exports = {
    consoleMsg: consoleMsg
}