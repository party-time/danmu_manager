(function () {
    var app = angular.module('danmuCheckApp', []);
    app.controller('danmuCheckCtrl', function ($scope,$http,$interval) {


        var websoctAddress = "ws://192.168.1.118:7070/ws";
        var ws;
        $scope.partyId = "5825685d0cf234b532cb823f";
        $scope.addressId = "580855800cf2c73403935868";

        $scope.baseUrl="http://testimages.party-time.cn/upload";

        $scope.partyName;//活动名称
        $scope.link_Status;//连接状态





        /*************测试模式***************************/
        $scope.testModel;

        /*************预制弹幕*******************************/
        $scope.preStatus;

        $scope.webSocketStatus = 3;//连接状态
        $scope.danmuDensity = 0;//弹幕密度
        $scope.delaySecond = 0;//延迟时间
        $scope.playerStatus;//播放器状态

        $scope.adminCount = 0;//管理员数量
        $scope.delayHour=0;


        $scope.colors = [];//颜色列表
        $scope.blingColors = [];//闪光字颜色
        $scope.danmuList = [];//弹幕

        $scope.expressions=[];//表情特效

        $scope.type = {
            type_init: 'init',
            type_modeltest: 'test',
            type_testDanmu: 'testDanmu',
            type_adminCount: 'adminCount',
            type_preDanmu:'preDanmu',
            type_playerStatus:'playerStatus',
            type_delaySecond:'delaySecond'
        };

        var webSocketInit = function() {
            //初始化websocket
            if(WebSocket){
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
                    //获取初始化信息
                    ws.send($.objectCovertJson({
                        type: $scope.type.type_init,
                        partyId: $scope.partyId,
                        addressId: $scope.addressId
                    }));
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
            }else{
                alert('浏览器不支持webscoket，请使用支持html5的浏览器');
            }
        }




        /**
         * 收到服务器返回的消息后的处理
         */
        function acceptMessageHandler(event) {
            var json = $.jsonConvertToObject(event.data);
            if (json.type == $scope.type.type_init) {
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
                /*if ($scope.testModel) {
                 ws.send($.objectCovertJson({
                 type: 'test',
                 partyId: $scope.partyId,
                 addressId: $scope.addressId,
                 "status": $scope.testModel
                 }));
                 }*/

                //延迟时间
                $scope.delayHour=0;
                //审核延迟时间
                $scope.delaySecond = json.data.delaySecond;
                //弹幕密度
                $scope.danmuDensity = json.data.danmuDensity;
                //刷新弹幕频率
                $interval(refreshDanmuList, 500);
            } else if (json.type == $scope.type.type_adminCount) {
                $scope.adminCount = json.data;
            } else if (json.type == $scope.type.type_modeltest) {
                //测试弹幕开启关闭处理
                $scope.testModel = json.data;
            } else if (json.type == $scope.type.type_testDanmu) {
                //接收测试弹幕处理
                var danmu = json.data;
                danmu.s = 10;
                danmu.createTime = new Date().getTime() + 1000;
                $scope.danmuList.unshift(setDanmuLeftTime(danmu, new Date().getTime()));
                if ($scope.danmuList.length > 1000) {
                    $scope.clearAndTurnUp();
                }
            }else if(json.type==$scope.type.type_preDanmu){
                //预制弹幕开启关闭处理
                $scope.preStatus = json.data.status;
            }else if (json.type == $scope.type.type_playerStatus) {
                //屏幕控制处理
                $scope.playerStatus = json.data;
            } else if (json.type == $scope.type.type_delaySecond) {
                $scope.delaySecond = parseInt(json.data);
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
        $scope.setDelaySecond = function (status) {
            if (webSocketIsConnect()) {
                webSocketSendMessage({
                    type: 'delaySecond',
                    partyId: $scope.partyId,
                    addressId: $scope.addressId,
                    status: status
                })
            }
        };


        /**
         * 屏蔽弹幕
         * @param id
         */
        $scope.setDanmuBlocked = function (id) {
            if (webSocketIsConnect()) {
                for (var i = 0; i < $scope.danmuList.length; i++) {
                    var danmu = $scope.danmuList[i];
                    if (danmu.id == id) {
                        danmu.isBlocked = true;
                        danmu.s = -10;
                        webSocketSendMessage({
                            type: 'blockDanmu',
                            partyId: $scope.partyId,
                            addressId: $scope.addressId,
                            danmuId: danmu.id
                        })
                        break;
                    }
                }
            }
        };

        /**
         * 测试模式处理
         * @param state
         */
        $scope.setTestModelHandler = function (status) {
            if (webSocketIsConnect()) {
                webSocketSendMessage({
                    type: $scope.type.type_modeltest,
                    partyId: $scope.partyId,
                    addressId: $scope.addressId,
                    status: status
                })
                if (!status) {
                    $scope.danmuList = [];
                }
            }
        }

        /**
         * 设置预制弹幕
         * @param status
         */
        $scope.setPreDanmuHandler = function (status) {
            if (webSocketIsConnect()) {
                webSocketSendMessage({
                    partyId: $scope.partyId,
                    addressId: $scope.addressId,
                    type: 'preDanmu',
                    status: status
                });
            }
        }

        /**
         * 客户端屏幕控制
         * @param status
         */
        $scope.operateScreenHandler = function (status) {
            if (webSocketIsConnect()) {
                webSocketSendMessage({
                    type: 'playerStatus',
                    partyId: $scope.partyId,
                    addressId: $scope.addressId,
                    status: status
                });
            }
        }

        /**
         * 设置连接状态
         */
        function setLinkStatus() {
            if (webSocketIsConnect()) {
                $scope.link_Status = '已连接';
            } else {
                //setAllButtonStatus();
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

        //刷新弹幕列表的时间
        var refreshDanmuList = function () {
            if ($scope.danmuList && $scope.danmuList.length > 0) {
                var nowTime = new Date().getTime();
                for (var i = 0; i < $scope.danmuList.length; i++) {
                    setDanmuLeftTime($scope.danmuList[i], nowTime)
                }
                $scope.danmuListScrollTop = $("#mainDiv").scrollTop;
            }
        };
        $scope.clearAndTurnUp = function () {
            var danmuList = [];
            for (var i = 0; i < $scope.danmuList.length; i++) {
                var danmu = $scope.danmuList[i];
                if (!danmu.s || danmu.s > 0) {
                    danmuList.push(danmu);
                }
            }
            $scope.danmuList = danmuList;
            $("#mainDiv").scrollTop = 0;
            document.body.scrollTop = 0;
        };
        var setDanmuLeftTime = function (danmu, nowTime) {
            if (!danmu.s || danmu.s > 0) {
                if (!danmu.createTime) {
                    danmu.createTime = new Date().getTime();
                }
                danmu.s = parseInt($scope.delaySecond - ( nowTime - danmu.createTime) / 1000);
                if (danmu.s == 0) {
                    danmu.s = -1;
                    webSocketSendMessage({
                        "type": danmu.type,
                        "msg": danmu.msg,
                        "partyId": $scope.partyId,
                        "addressId": $scope.addressId,
                        "color": danmu.color,
                        "openId": danmu.openId
                    });
                }
            }
            return danmu;
        };
        
        var ajaxInit = function () {
            //获取颜色信息
            $http.get('/v1/api/admin/colors').success(function (data) {
                    if (data.result == 200) {
                        $scope.colors = data.data.danmuColors;
                        $scope.blingColors = data.data.flashWordColors;
                    } else {
                        alert("资源加载失败")
                    }
                }).error(function (data, status, headers, config) {
                console.log(data);
            });
            //获取图片信息
            $http.get('/v1/api/admin/initResource?partyId=' + $scope.partyId)
                .success(function (data) {
                    if (data.result == 200) {
                        $scope.expressions = data.data.expressions;
                        $scope.specialImages = data.data.specialImages;
                        $scope.specialVideos = data.data.specialVideos;
                    } else {
                        alert("资源加载失败")
                    }

                }).error(function (data, status, headers, config) {
                console.log(data);
            });

        }
        
        var initPage = function () {
            ajaxInit();
            webSocketInit();
        }
        initPage();
    });




})();

