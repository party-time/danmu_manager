(function () {
    var app = angular.module('danmuCheckApp', []);
    app.controller('danmuCheckCtrl', function ($scope) {


        $scope.partyId = "581a9dc50cf2852c417a9b31";
        $scope.addressId = "580078b30cf28b271aea44e5";


        $scope.partyName;//活动名称
        $scope.link_Status;//连接状态

        $scope.playerStatus;//播放器状态

        /*************测试模式***************************/
        $scope.testModel;

        /*************预制弹幕*******************************/
        $scope.preStatus;

        $scope.webSocketStatus = 3;//连接状态
        $scope.danmuDensity = 0;//弹幕密度
        $scope.delaySecond = 0;//延迟时间
        $scope.play_status = 0;//播放器状态

        $scope.adminCount = 0;


        $scope.danmuList = [];

        $scope.type = {
            type_init: 'init',
            type_modeltest: 'test',
            type_testDanmu: 'testDanmu',
            type_adminCount: 'adminCount'
        };

        $scope.vedio;//视频特效
        var websoctAddress = "ws://192.168.1.118:7070/ws";
        var ws;

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
            ws.send($.objectCovertJson({type: $scope.type.type_init, partyId: $scope.partyId, addressId: $scope.addressId}));

        }
        ws.onmessage = function (event) {
            //收到消息后处理
            acceptMessageHandler(event);
            $scope.$apply();
        }
        ws.onerror = function (event) {
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
            if (json.type == $scope.type.type_init) {
                $scope.delaySecond = parseInt(json.data.delaySecond);
                //控制显示器状态
                $scope.playerStatus = json.data.playerStatus;
                //活动时间
                $scope.partyName = json.data.partyName;
                //弹幕密度
                $scope.danmuDensity = json.data.danmuDensity;
                //预置弹幕
                $scope.preStatus = json.data.preDanmu;
                //测试模式
                $scope.testModel = json.data.testIsOpen;
                if ($scope.testModel) {
                    ws.send($.objectCovertJson({
                        type: 'test',
                        partyId: $scope.partyId,
                        addressId: $scope.addressId,
                        "status": $scope.testModel
                    }));
                }

            } else if (json.type == $scope.type.type_adminCount) {
                $scope.adminCount = json.data;
            } else if(json.type == $scope.type.type_modeltest){
                $scope.testModel = json.data;
            }else if (json.type == $scope.type.type_testDanmu) {
                var danmu = json.data;
                danmu.s = 10;
                danmu.createTime = new Date().getTime() + 1000;
                $scope.danmuList.unshift(setDanmuLeftTime(danmu, new Date().getTime()));
                if ($scope.danmuList.length > 1000) {
                    $scope.clearAndTurnUp();
                }
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


        $scope.setTestModelHandler = function (state) {
            if (webSocketIsConnect()) {
                webSocketSendMessage({type: $scope.type.type_modeltest,partyId: $scope.partyId,addressId: $scope.addressId, "status": state})
            }
        }

        /**
         * 设置连接状态
         */
        function setLinkStatus() {
            if (webSocketIsConnect()) {
                $scope.link_Status = '已连接';
            } else {
                setAllButtonStatus();
                $scope.link_Status = '连接断开';
            }
        }

        /**
         * 控制所有按钮状态
         */
        function setAllButtonStatus() {
            if (ws.readyState == 1) {
                $.setControlDisabledStateByType('button', false);
                $.setControlDisabledStateByType('input', false);
            } else {
                $.setControlDisabledStateByType('button', true);
                $.setControlDisabledStateByType('input', true);
            }
        }

        /**
         * 发送消息
         */
        function webSocketSendMessage(object) {
            if (webSocketIsConnect()) {
                ws.send($.objectCovertJson(object));
            }
        }

        function webSocketIsConnect() {
            if (ws.readyState == 1) {
                return true;
            }
            //alert('服务器连接异常!');
            return false;
        }
        var setDanmuLeftTime = function (danmu, nowTime) {
            if (!danmu.s || danmu.s > 0) {
                if (!danmu.createTime) {
                    danmu.createTime = new Date().getTime();
                }
                danmu.s = parseInt($scope.delaySecond - ( nowTime - danmu.createTime) / 1000);
                if (danmu.s == 0) {
                    danmu.s = -1;
                    client.send(JSON.stringify({
                        "type": danmu.type,
                        "msg": danmu.msg,
                        "partyId": $scope.partyId,
                        "addressId": $scope.addressId,
                        "color": danmu.color,
                        "openId": danmu.openId
                    }));
                }
            }
            return danmu;
        };
    });
})();

