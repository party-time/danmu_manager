(function () {
    var app = angular.module('danmuCheckApp', []);
    app.controller('danmuCheckCtrl', function ($scope, $http, $interval) {


        //var websoctAddress = "ws://192.168.1.118:7070/ws";
        var positionArray = [{id: 0, text: '全部'}, {id: 1, text: '左上'}, {id: 2, text: '顶部'}, {id: 3, text: '右上'}, {
            id: 4,
            text: '左下'
        }, {id: 5, text: '底部'}, {id: 6, text: '右下'}];
        var websoctAddress;
        var ws;
        $scope.partyId;
        $scope.addressId;

        $scope.baseUrl = _baseImageUrl;

        $scope.partyName;//活动名称
        $scope.link_Status = "未连接";//连接状态

        $scope.testModel;//测试模式
        $scope.preStatus;//预制弹幕

        $scope.danmuDensity = 0;//弹幕密度
        $scope.delaySecond = 0;//延迟时间
        $scope.playerStatus;//播放器状态

        $scope.adminCount = 0;//管理员数量
        $scope.clientCount=0;//客户端数量
        $scope.delayHour = 0;
        $scope.colors = [];//颜色列表
        $scope.blingColors = [];//闪光字颜色
        $scope.danmuList = [];//弹幕

        $scope.expressions = [];//表情特效
        $scope.specialVideos = [];//视频特效
        $scope.specialVideo;//正在开启的动画特效
        $scope.specialVideos = [];//图片特效

        $scope.key;

        $scope.danmuMsg = "";//弹幕
        $scope.danmuColor = "#ffffff";// 弹幕颜色
        $scope.blingDanmuMsg = "";//闪光字
        $scope.blingColor = "#ffffff";//闪光字颜色
        $scope.direction;//弹幕位置

        $scope.autoCheck=0;
        $scope.delaySecond=0;


        $scope.partyStatus;

        $scope.type = {
            type_init: 'init',
            type_modeltest: 'test',
            type_testDanmu: 'testDanmu',
            type_adminCount: 'adminCount',
            type_preDanmu: 'preDanmu',
            type_playerStatus: 'playerStatus',
            type_delaySecond: 'delaySecond',
            type_partyActive: 'partyStatus',
            type_blockDanmu: 'blockDanmu',
            type_specialVideo: 'specialVideo',
            type_picture: 'picture',
            type_expression: 'expression',
            type_bing: 'bling',
            type_danmuDensity: 'danmuDensity',
            type_danmuDirection: 'danmuDirection',
            type_findclientList:'findclientList'
        };


        $scope.checkIsArray = function (object) {
            return object && typeof object==='object' &&
                Array == object.constructor;
        }

        var webSocketInit = function () {
            //初始化websocket
            if (WebSocket) {
                ws = new WebSocket(websoctAddress);
                ws.onopen = function (event) {
                    //设置连接状态
                    setLinkStatus();
                    //获取初始化信息
                    webSocketSendMessage({type: $scope.type.type_init});
                    //sendHeartbeat();

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
                }
            } else {
                alert('浏览器不支持webscoket，请使用支持html5的浏览器');
            }
        }


        /**
         * 收到服务器返回的消息后的处理
         */
        function acceptMessageHandler(event) {
            var json = $.jsonConvertToObject(event.data);
            if (json.type == $scope.type.type_init) {
                //弹幕密度
                $scope.danmuDensity = json.data.danmuDensity;
                //延迟时间
                $scope.delaySecond = 5;
                //刷新弹幕频率
                $interval(refreshDanmuList, 1000);
            } else if (json.type == $scope.type.type_adminCount) {
                $scope.adminCount = json.data;
            } else if(json.type==$scope.type.type_danmuDensity){
                $scope.danmuDensity= json.data;
            } else if (json.type == 'normalDanmu') {
                var danmu = json.data;
                danmu.s = 5;
                danmu.createTime = new Date().getTime() + 1000;
                danmu.timeCount = $scope.delaySecond+1;
                danmu.isSend=false;
                if($scope.checkIsArray(danmu.msg)){
                    for(var i=0; i<danmu.msg.length; i++){
                        danmu.msg[i] = {
                            content : danmu.msg[i]
                        }
                    }
                }
                $scope.danmuList.unshift(setDanmuLeftTime(danmu, new Date().getTime()));
                if ($scope.danmuList.length > 1000) {
                    $scope.clearAndTurnUp();
                }
            }else if (json.type == 'error') {
                alert(json.data.message);
            } else if (json.type == $scope.type.type_delaySecond) {
                $scope.delaySecond = parseInt(json.data);
            } else if (json.type == $scope.type.type_findclientList) {
                if (json.data != null) {
                    $scope.clientCount = json.data.length;
                }
            } else {
                return;
            }
        }


        /**
         * 发送心跳
         */
        var sendHeartbeat = function () {
            setInterval(function () {
                if (ws.readyState == 1) {
                    webSocketSendMessage({type: 'isOk'});

                    /*$.ajax({
                        type: "GET",
                        url:"/v1/api/admin/fileDanmuCheck",
                        data:{},// 序列化表单值
                        async: true,
                        error: function(request) {
                            alert("Connection error");
                        },
                        success: function(data) {

                        }
                    });*/
                }
            }, 10 * 1000);
        }

        /*setInterval(function () {
         webSocketSendMessage({type:$scope.type.type_findclientList});
         }, 3 * 1000);*/

        $scope.setAutoCheck=function (value) {
            if(value==0){
                $scope.autoCheck =0;
            }else{
                $scope.autoCheck =1;
            }
        }


        /**
         * 设置弹幕密度
         */
        $scope.setDanmuDensity = function () {
                webSocketSendMessage({
                    type: $scope.type.type_danmuDensity,
                    density: {danmuDensity: $scope.danmuDensity}
                });
        }

        //增减延迟时间
        $scope.setDelaySecond = function (status) {
                if(!status){
                    if($scope.delaySecond>0){
                        $scope.delaySecond = $scope.delaySecond-1;
                    }
                }else{
                    $scope.delaySecond = $scope.delaySecond+1;
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
                        webSocketSendMessage({type: $scope.type.type_blockDanmu, blockDanmu: {id: danmu.id}})
                        break;
                    }
                }
            }
        };

        /**
         * 发送消息
         */
        function webSocketSendMessage(object) {
            object.partyId = $scope.partyId;
            object.key = getCookieValue("auth_key");
            object.addressId = $scope.addressId;
            if (webSocketIsConnect()) {
                ws.send($.objectCovertJson(object));
            }
        }


        /**
         * 设置连接状态
         */
        function setLinkStatus() {
            if (ws.readyState == 1) {
                $scope.link_Status = '已连接';
            } else {
                $("#partyStartButton").hide();
                $("#filmStartButton").hide();
                $("#filmEndButton").hide();
                $("#partyStatus").html('活动已经结束!');
                $("#stime").html("");
                $scope.link_Status = '连接关闭';
            }
        }

        function webSocketIsConnect() {
            if (ws.readyState == 1) {
                return true;
            }

            alert('与服务器断开连接！');
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
        
        $scope.sendDanmu=function (danmu) {
            danmu.s = -1;
            danmu.isSend=true;
            webSocketSendMessage({
                type: danmu.type,
                danmu: {message: danmu.msg,id:danmu.id, color: danmu.color, openId: danmu.openId}
            });
        }
        var setDanmuLeftTime = function (danmu, nowTime) {
            if (!danmu.s || danmu.s > 0) {
                if($scope.autoCheck==1){
                    danmu.s = danmu.timeCount-1;
                    danmu.timeCount = danmu.s;
                    if (danmu.s == 0) {
                        danmu.s = -1;
                        danmu.isSend=true;
                        webSocketSendMessage({
                            type: danmu.type,
                            danmu: {message: danmu.msg, id:danmu.id,color: danmu.color, openId: danmu.openId}
                        });
                    }
                }
            }
            return danmu;
        };

        var initPage = function () {
            $(".danmuPosition-array").val(null).select2({data: positionArray, minimumResultsForSearch: -1});
            $.danmuAjax('/distribute/adminTask/filmSocketAddress', 'GET', 'json', {}, function (data) {
                console.log(data);
                if (data.code == 200) {
                    var key = getCookieValue("auth_key");
                    websoctAddress = "ws://" + data.serverInfo.ip + ":" + data.serverInfo.port + "/ws?key="+key;
                    webSocketInit();
                }
            }, function (data) {
                console.log(data);
            });


        }


        function getCookieValue(cookieName) {
            var cookieValue = document.cookie;
            var cookieStartAt = cookieValue.indexOf("" + cookieName + "=");
            if (cookieStartAt == -1) {
                cookieStartAt = cookieValue.indexOf(cookieName + "=");
            }
            if (cookieStartAt == -1) {
                cookieValue = null;
            } else {
                cookieStartAt = cookieValue.indexOf("=", cookieStartAt) + 1;
                cookieEndAt = cookieValue.indexOf(";", cookieStartAt);
                if (cookieEndAt == -1) {
                    cookieEndAt = cookieValue.length;
                }
                cookieValue = unescape(cookieValue.substring(cookieStartAt, cookieEndAt));//解码latin-1
            }
            return cookieValue;
        }
        initPage();
    });
})();

