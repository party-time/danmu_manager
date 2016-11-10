(function () {
    var app = angular.module('danmuCheckApp', []);
    app.controller('danmuCheckCtrl', function ($scope) {


        $scope.partyId = "581a9dc50cf2852c417a9b31";
        $scope.addressId = "580078b30cf28b271aea44e5";


        $scope.partyName;//活动名称
        $scope.link_Status;//连接状态

        $scope.playerStatus;//播放器状态

        $scope.webSocketStatus = 3;//连接状态
        $scope.danmu_density = 0;//弹幕密度
        $scope.delay_time = 0;//延迟时间
        $scope.play_status = 0;//播放器状态

        $scope.testModelStatus = 0;//测试弹幕
        $scope.preModelStatus = 0;//预制弹幕

        $scope.type = {
            init: 'init'
        };

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
        /*if (ws.readyState == 1) {

         }*/
        ws.onopen = function (event) {
            //设置连接状态
            setLinkStatus();
            //设置所有按钮状态
            setAllButtonStatus();
            //获取初始化信息
            ws.send($.objectCovertJson({type: $scope.type.init, partyId: $scope.partyId, addressId: $scope.addressId}));
        }
        ws.onmessage = function (event) {
            //收到消息后处理
            acceptMessageHandler(event);
            $scope.$apply();
        }
        ws.onerror = function (event) {
            alert('连接异常');
            return;
        }
        ws.onclose = function (event) {
            //设置连接状态
            setLinkStatus();
            $scope.$apply();
            return false;
        }

        /**
         * 收到服务器返回的消息后的处理
         */
        function acceptMessageHandler(event) {
            var json = $.jsonConvertToObject(event.data);
            if (json.type == $scope.type.init) {
                $scope.delaySecond = parseInt(json.data.delaySecond);
                //$scope.isDelayEnable = json.data.isDelayEnable;
                $scope.playerStatus = json.data.playerStatus;
                $scope.partyName = json.data.partyName;
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

        function setLinkStatus() {
            if (webSocketIsConnect()) {
                $scope.link_Status = '已连接';
            }else{
                setAllButtonStatus();
                $scope.link_Status = '连接断开';
            }
        }

        /**
         * 控制所有按钮状态
         */
        function setAllButtonStatus() {
            if(ws.readyState == 1){
                $("button").removeClass('disabled');
                $('button').prop('disabled', false);
                $("input").removeClass('readonly');
                $('input').prop('readonly', false);
            }else{
                $("button").addClass('disabled');
                $('button').prop('disabled', true);
                $("input").addClass('readonly');
                $('input').prop('readonly', true);
            }
        }

        /**
         * 发送消息
         */
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

