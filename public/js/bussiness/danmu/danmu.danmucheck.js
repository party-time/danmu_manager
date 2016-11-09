(function () {
    var app = angular.module('danmuCheckApp', []);
    app.controller('danmuCheckCtrl', function ($scope) {

        $scope.webSocketStatus = 3;//连接状态
        $scope.danmu_density = 0;//弹幕密度
        $scope.delay_time = 0;//延迟时间
        $scope.play_status = 0;//播放器状态

        $scope.testModelStatus = 0;//测试弹幕
        $scope.preModelStatus = 0;//预制弹幕

        $scope.vedio;//视频特效




        var websoctAddress = "ws://192.168.1.118:7070/ws";
        var ws;
        //初始化测试弹幕按钮
        $.initSwitch('testDanmuModel', switchTestHandler);
        //预制弹幕按钮
        $.initSwitch('preDanmuModel', switchPreHandler);

        //$('#testDanmuModel').bootstrapSwitch('state', true);
        //初始化websocket
        ws = new WebSocket(websoctAddress);
        /**
         *     0  CONNECTING        连接尚未建立
         *     1  OPEN            WebSocket的链接已经建立
         *     2  CLOSING            连接正在关闭
         *     3  CLOSED            连接已经关闭或不可用
         */
        if (ws.readyState == 1) {
            ws.open = function (event) {

            }
            ws.onmessage = function (event) {

            }
            ws.close = function (event) {
                alert("服务器连接已中断，确定后刷新页面");
                return false;
            }
        }

        //设置弹幕密度
        $(".btn-density").click(function () {
            if (webSocketIsConnect()) {

            }
        });

        //设置弹幕密度
        $(".btn-partyDelay").click(function () {
            if (webSocketIsConnect()) {

            }
        });

        //增减延迟时间
        $(".time-delay-plus").click(function () {
            if (webSocketIsConnect()) {

            }
        });

        //减少延迟时间
        $(".time-delay-sub").click(function () {
            if (webSocketIsConnect()) {

            }
        });

        function operateScreenHandler(status) {
            if (webSocketIsConnect()) {

            }
        }

        function webSocketSendMessage() {
            if (webSocketIsConnect()) {
            }
        }

        function webSocketIsConnect() {
            if (ws.readyState == 1) {
                return true;
            }
            alert('服务器连接异常!');
            return false;
        }

        /**
         * 测试弹幕处理
         * @param event
         * @param state
         */
        function switchTestHandler(event, state) {
            //$('#testDanmuModel').bootstrapSwitch('state', true);
            if (webSocketIsConnect()) {
                //$('#testDanmuModel').bootstrapSwitch('state', false);
            }
        }

        /**
         * 预制弹幕处理
         * @param event
         * @param state
         */
        function switchPreHandler(event, state) {
            if (webSocketIsConnect()) {

            }
            /*if (state == true) {
             $(this).val("1");
             } else {
             $(this).val("2");
             }*/
        }
    });
})();

