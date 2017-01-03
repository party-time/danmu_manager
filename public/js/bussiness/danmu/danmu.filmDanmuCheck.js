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

        var webSocketInit = function () {
            //初始化websocket
            if (WebSocket) {
                ws = new WebSocket(websoctAddress);
                ws.onopen = function (event) {
                    //设置连接状态
                    setLinkStatus();
                    //获取初始化信息
                    webSocketSendMessage({type: $scope.type.type_init});
                    sendHeartbeat();

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

                //延迟时间
                $scope.delayHour = 0;
                //审核延迟时间
                $scope.delaySecond = json.data.delaySecond;
                //弹幕密度
                $scope.danmuDensity = json.data.danmuDensity;

                //电影状态
                $scope.partyStatus = json.data.partyStatus;
                if ($scope.partyStatus == 1) {
                    $("#partyStartButton").hide();
                    $("#filmStartButton").show();
                    $("#filmEndButton").show();
                    $("#stime").hide();
                } else if ($scope.partyStatus == 2) {
                    $("#partyStartButton").hide();
                    $("#filmStartButton").hide();
                    $("#filmEndButton").show();
                    $scope.time = json.data.time;
                    restDate($scope.partyStatus);
                } else if ($scope.partyStatus == 3) {
                    //活动结束
                    $("#partyStartButton").hide();
                    $("#filmStartButton").hide();
                    $("#filmEndButton").hide();
                    $("#partyStatus").html('活动已经结束!');
                    $("#stime").hide();
                    ws.close();
                } else {
                    $("#partyStartButton").show();
                    $("#filmStartButton").show();
                    $("#filmEndButton").hide();
                    $("#stime").hide();

                }
                //动画特效
                $scope.specialVideo = json.data.specialVideo;
                //设置动画特效
                specialVideoJudge($scope.specialVideo, 1);
                //刷新弹幕频率
                $interval(refreshDanmuList, 500);
            } else if (json.type == $scope.type.type_adminCount) {
                $scope.adminCount = json.data;
            } else if(json.type==$scope.type.type_danmuDensity){
                $scope.danmuDensity= json.data;
            } else if (json.type == 'normalDanmu') {
                var danmu = json.data;
                danmu.s = 10;
                danmu.createTime = new Date().getTime() + 1000;
                $scope.danmuList.unshift(setDanmuLeftTime(danmu, new Date().getTime()));
                if ($scope.danmuList.length > 1000) {
                    $scope.clearAndTurnUp();
                }
            }else if (json.type == 'error') {
                alert(json.data.message);
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
                }
            }, 3 * 1000);
        }

        /*setInterval(function () {
         webSocketSendMessage({type:$scope.type.type_findclientList});
         }, 3 * 1000);*/


        /**
         * 延长活动时间
         * @param hour
         */
        $scope.delayParty = function () {
            if (checkPatyIsBegin()) {
                if (confirm('你确定要延迟活动时间吗？确定后不可更改!')) {
                    var msgObject = {
                        partyId: $scope.partyId,
                        addressId: $scope.addressId,
                        delayHour: $scope.delayHour
                    };
                    $.danmuAjax('/v1/api/admin/party/delayParty', 'post', 'json', msgObject, function (data) {
                        console.log(data);
                    }, function (data) {
                        console.log(data);
                    });
                }
            }
        }

        /**
         * 设置弹幕密度
         */
        $scope.setDanmuDensity = function () {
            if (webSocketIsConnect()) {
                webSocketSendMessage({
                    type: $scope.type.type_danmuDensity,
                    density: {danmuDensity: $scope.danmuDensity}
                });
            }
        }

        /**
         * 设置电影状态
         * @param status
         */
        $scope.filmStart = function (status) {
            //电影开始
            webSocketSendMessage({type: $scope.type.type_partyActive, partyCtrl: {status: status}});

            /*if(status==3){
             window.location.reload();
             }*/
        }

        //增减延迟时间
        $scope.setDelaySecond = function (status) {
            if (webSocketIsConnect() && checkPatyIsBegin()) {
                if(!status){
                    if($scope.delaySecond>0){
                        webSocketSendMessage({type: $scope.type.type_delaySecond, delayTime: {status: status}});
                    }
                }else{
                    webSocketSendMessage({type: $scope.type.type_delaySecond, delayTime: {status: status}});
                }

            }
        };
        /**
         * 屏蔽弹幕
         * @param id
         */
        $scope.setDanmuBlocked = function (id) {
            if (webSocketIsConnect() && checkPatyIsBegin()) {
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
         * 测试模式处理
         * @param state
         */
        $scope.setTestModelHandler = function (status) {
            if (webSocketIsConnect()) {
                webSocketSendMessage({type: $scope.type.type_modeltest, testDanmu: {status: status}});
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
            if (webSocketIsConnect() && checkPatyIsBegin()) {
                webSocketSendMessage({type: $scope.type.type_preDanmu, preDanmu: {status: status}});
            }
        }

        /**
         * 客户端屏幕控制
         * @param status
         */
        $scope.operateScreenHandler = function (status) {
            if (webSocketIsConnect() && checkPatyIsBegin()) {
                webSocketSendMessage({type: $scope.type.type_playerStatus, playStatus: {status: status}});
            }
        }


        /**
         * 图片特效开启
         * @param specialImage
         */
        $scope.showSpecialImage = function (specialImage) {
            if (webSocketIsConnect() && checkPatyIsBegin()) {
                if (confirm("确定开启图片特效？")) {
                    webSocketSendMessage({type: $scope.type.type_picture, picture: {id: specialImage.id}});
                }
            }
        };

        $scope.showExpression = function (expression) {
            if (webSocketIsConnect() && checkPatyIsBegin()) {
                if (confirm("是否发送表情特效？")) {
                    webSocketSendMessage({
                        type: $scope.type.type_expression,
                        expression: {name: expression.name, id: expression.id}
                    });
                }
            }
        };
        /**
         * 视频特效开启
         * @param specialVideo
         * @param status
         */
        $scope.showSpecialVideo = function (specialVideo, status) {

            if (webSocketIsConnect() && checkPatyIsBegin()) {
                //判断当前开启的特效与要开启的特效是不是同一个
                if ($scope.specialVideo != specialVideo.id) {
                    var name = specialVideoName($scope.specialVideo);
                    var namenew = specialVideoName(specialVideo.id);
                    if (confirm("特效" + name + "正在开启，是否要开启" + namenew + "特效？")) {
                        startSpecialVedio(specialVideo, status);
                    }
                } else {
                    var msg = "";
                    if (status == 0) {
                        msg = "开启";
                    } else {
                        msg = "结束";
                    }
                    msg += specialVideo.resourceName;
                    if (confirm("确定" + msg + "?")) {
                        startSpecialVedio(specialVideo, status);
                    }
                }

            }
        };

        /**
         * 设置闪光字颜色
         * @param index
         */
        $scope.setBlingColor = function (object) {
            if (webSocketIsConnect() && checkPatyIsBegin()) {
                $scope.blingColor = object;
            }
        };


        $("#direction").click(function () {
            if (webSocketIsConnect() && checkPatyIsBegin()) {
                webSocketSendMessage({type: $scope.type.type_danmuDirection,direction:{direction: $scope.direction}});
            }
        });
        //设置方位
        $(".danmuPosition-array").change(function (data) {
            if (webSocketIsConnect() && checkPatyIsBegin()) {
                $scope.direction = data.target.value;
            }
        });

        /**
         * 设置弹幕颜色
         * @param object
         */
        $scope.setDanmuColor = function (object) {
            if (webSocketIsConnect() && checkPatyIsBegin()) {
                $scope.danmuColor = object;
            }
        }

        var specialVideoName = function (id) {
            if ($scope.specialVideos != null && $scope.specialVideos.length > 0) {
                for (var i = 0; i < $scope.specialVideos.length; i++) {
                    if (id == $scope.specialVideos[i].id) {
                        return $scope.specialVideos[i].resourceName;
                        return;
                    }
                }
            }
        }

        var startSpecialVedio = function (specialVideo, status) {
            webSocketSendMessage({type: $scope.type.type_specialVideo, video: {id: specialVideo.id, status: status}});
        }
        /**
         * 设置动画特效按钮的状态
         * @param id
         * @param status
         */
        var specialVideoJudge = function (id, status) {
            var otherSatauts = 0;
            if ($scope.specialVideos != null && $scope.specialVideos.length > 0) {
                for (var i = 0; i < $scope.specialVideos.length; i++) {
                    if (id == $scope.specialVideos[i].id) {
                        $scope.specialVideos[i].status = status;
                    }else{
                        $scope.specialVideos[i].status = otherSatauts;
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
                clearTimeout(t);
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

        function checkPatyIsBegin() {
            if($scope.partyStatus==1||$scope.partyStatus==2){
                return true;
            } else if($scope.partyStatus==3){
                alert('活动已经结束');
                return false;
            } else if($scope.partyStatus==0){
                alert('活动尚未开始!');
                return false;
            }
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
                danmu.s = parseInt(5 - ( nowTime - danmu.createTime) / 1000);
                if (danmu.s == 0) {
                    danmu.s = -1;
                    webSocketSendMessage({
                        type: danmu.type,
                        danmu: {message: danmu.msg, color: danmu.color, openId: danmu.openId}
                    });
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

