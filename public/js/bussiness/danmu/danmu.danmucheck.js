(function () {
    var app = angular.module('danmuCheckApp', []);
    app.controller('danmuCheckCtrl', function ($scope,$http,$interval) {


        var websoctAddress = "ws://192.168.1.118:7070/ws";
        var ws;
        $scope.partyId = "582a86620cf2d2a9f936ce77";
        $scope.addressId = "580078b30cf28b271aea44e5";

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
        $scope.specialVideos=[];//视频特效
        $scope.specialVideo;//正在开启的动画特效
        $scope.specialVideos=[];//图片特效



        $scope.danmuMsg="";//弹幕
        $scope.danmuColor="#ffffff";// 弹幕颜色
        $scope.blingDanmuMsg="";//闪光字
        $scope.blingColor="#ffffff";//闪光字颜色

        $scope.type = {
            type_init: 'init',
            type_modeltest: 'test',
            type_testDanmu: 'testDanmu',
            type_adminCount: 'adminCount',
            type_preDanmu:'preDanmu',
            type_playerStatus:'playerStatus',
            type_delaySecond:'delaySecond',
            type_partyActive:'partyActive',
            type_blockDanmu:'blockDanmu',
            type_specialVideo:'specialVideo',
            type_picture:'picture',
            type_expression:'expression',
            type_bing:'bling',
            type_danmuDensity:'danmuDensity'
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
                    webSocketSendMessage({type: $scope.type.type_init, partyId: $scope.partyId, addressId: $scope.addressId});
                    sendHeartbeat();
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

                //电影状态
                $scope.partyActive = json.data.partyActive;
                if ($scope.partyActive == 1) {
                    $("#ptime").hide();
                    $("#stime").show();
                    $("#etime").show();
                } else if ($scope.partyActive == 2) {
                    $("#ptime").hide();
                    //$("#stime").hide();
                    $("#etime").show();
                    $scope.time = json.data.time;
                    restDate($scope.partyActive);
                } else if ($scope.partyActive == 3) {
                    //活动结束
                    $("#ptime").hide();
                    $("#stime").hide();
                    $("#etime").html("活动已经结束");
                } else {
                    $("#ptime").show();
                    $("#stime").show();
                    $("#etime").hide();
                }
                //动画特效
                $scope.specialVideo = json.data.specialVideo;
                //设置动画特效
                specialVideoJudge($scope.specialVideo, 1);
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
            }else if (json.type ==  $scope.type.type_partyActive) {
                $scope.partyActive = json.data.status;
                if ($scope.partyActive == 1) {
                    $("#ptime").hide();
                    $("#stime").show();
                    $("#etime").show();
                } else if ($scope.partyActive == 2) {
                    $("#ptime").hide();
                    //$("#stime").hide();
                    $("#etime").show();
                    $scope.time = json.data.time;
                    restDate($scope.partyActive);
                } else if ($scope.partyActive == 3) {
                    //活动结束
                    $("#ptime").hide();
                    $("#stime").hide();
                    $("#etime").html("活动已经结束");
                } else if ($scope.partyActive == 4) {
                    alert("当前场地正在进行" + json.data.partyName + "活动，等活动结束后,再开始" + $scope.partyName + "活动");
                    return;
                }
            }else if (json.type == $scope.type.type_specialVideo) {
                if (json.data.status == 0) {
                    specialVideoJudge(json.data.id, 1);
                } else if (json.data.status == 1) {
                    specialVideoJudge(json.data.id, 0);
                }
                $scope.specialVideo = json.data.id;
            }else if (json.type == 'normalDanmu') {
                var danmu = json.data;
                danmu.s = 10;
                danmu.createTime = new Date().getTime() + 1000;
                $scope.danmuList.unshift(setDanmuLeftTime(danmu, new Date().getTime()));
                if ($scope.danmuList.length > 1000) {
                    $scope.clearAndTurnUp();
                }
            }else {
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


        /**
         * 延长活动时间
         * @param hour
         */
        $scope.delayParty=function () {
            if (confirm('你确定要延迟活动时间吗？确定后不可更改!')) {
                var msgObject = {
                    partyId: $scope.partyId,
                    addressId: $scope.addressId,
                    delayHour: $scope.delayHour
                };
                $.danmuAjax('/v1/api/admin/party/delayParty','post','json',msgObject,function (data) {
                    console.log(data);
                },function (data) {
                    console.log(data);
                });
            }
        }

        /**
         * 设置弹幕密度
         */
        $scope.setDanmuDensity = function () {
            if (webSocketIsConnect()) {
                webSocketSendMessage({type: $scope.type.type_danmuDensity, partyId: $scope.partyId, addressId: $scope.addressId, danmuDensity:$scope.danmuDensity});
            }
        }
        
        /**
         * 设置电影状态
         * @param status
         */
        $scope.filmStart = function (status) {
            if ($scope.partyActive == 0 && !status) {
                alert('活动没有开始!');
                return;
            }
            //电影开始
            webSocketSendMessage({type: $scope.type.type_partyActive, partyId: $scope.partyId, addressId: $scope.addressId, status: status});
        }

        //增减延迟时间
        $scope.setDelaySecond = function (status) {
            if (webSocketIsConnect()) {
                webSocketSendMessage({type: $scope.type.type_delaySecond, partyId: $scope.partyId, addressId: $scope.addressId, status: status});
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
                        webSocketSendMessage({type: $scope.type.type_blockDanmu, partyId: $scope.partyId, addressId: $scope.addressId, danmuId: danmu.id})
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
                webSocketSendMessage({type: $scope.type.type_modeltest, partyId: $scope.partyId, addressId: $scope.addressId, status: status});
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
                webSocketSendMessage({partyId: $scope.partyId, addressId: $scope.addressId, type: $scope.type.type_preDanmu, status: status});
            }
        }

        /**
         * 客户端屏幕控制
         * @param status
         */
        $scope.operateScreenHandler = function (status) {
            if (webSocketIsConnect()) {
                webSocketSendMessage({type: $scope.type.type_playerStatus, partyId: $scope.partyId, addressId: $scope.addressId, status: status});
            }
        }


        /**
         * 图片特效开启
         * @param specialImage
         */
        $scope.showSpecialImage = function (specialImage) {
            if (webSocketIsConnect()) {
                if (confirm("确定开启图片特效？")) {
                    webSocketSendMessage({type: $scope.type.type_picture, partyId: $scope.partyId, addressId: $scope.addressId, id: specialImage.id});
                }
            }
        };

        $scope.showExpression = function (expression) {
            if (webSocketIsConnect()) {
                if (confirm("是否发送表情特效？")) {
                    webSocketSendMessage({type: $scope.type.type_expression, partyId: $scope.partyId, addressId: $scope.addressId, name: expression.name, id: expression.id});
                }
            }
        };
        /**
         * 视频特效开启
         * @param specialVideo
         * @param status
         */
        $scope.showSpecialVideo = function (specialVideo, status) {

            if (webSocketIsConnect()) {
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
            $scope.blingColor = object;
        };

        /**
         * 设置弹幕颜色
         * @param object
         */
        $scope.setDanmuColor = function (object) {
            $scope.danmuColor = object;
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
            webSocketSendMessage({type: $scope.type.type_specialVideo, id: specialVideo.id, partyId: $scope.partyId, addressId: $scope.addressId, status: status});
        }
        /**
         * 设置动画特效按钮的状态
         * @param id
         * @param status
         */
        var specialVideoJudge = function (id, status) {
            if ($scope.specialVideos != null && $scope.specialVideos.length > 0) {
                for (var i = 0; i < $scope.specialVideos.length; i++) {
                    if (id == $scope.specialVideos[i].id) {
                        $scope.specialVideos[i].status = status;
                        break;
                    }
                }
            }

        };

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

        /**
         * 发送闪光字弹幕
         */
        $scope.sendBlingDm = function () {
            if (webSocketIsConnect()) {
                webSocketSendMessage({type: $scope.type.type_bing, msg: $scope.blingDanmuMsg, partyId: $scope.partyId, addressId: $scope.addressId, color: $scope.blingColor});
                $scope.blingDanmuMsg = "";
            }
        };
        /**
         * 发送普通弹幕
         */
        $scope.sendDm = function () {
            if (webSocketIsConnect()) {
                if ($scope.danmuMsg && $scope.danmuMsg.length <= 40 && (!$scope.testModel || confirm('当前为测试模式,确认要发送吗？'))) {

                    $.danmuAjax('/v1/api/sendDanmu','post','json',{msg: $scope.danmuMsg, partyId: $scope.partyId, addressId: $scope.addressId, color: $scope.danmuColor},function (data) {
                        $scope.danmuMsg = "";
                        if (data.result == "403") {
                            alert("弹幕含有屏蔽词,禁止发送!");
                            return;
                        }
                        console.log(data);
                    },function (data) {
                        console.log(data);
                    })

                    /*$http.post('/v1/api/sendDanmu', msgObject)
                        .success(function (data) {
                            $scope.danmuMsg = "";
                            if (data.result == "403") {
                                alert("弹幕含有屏蔽词,禁止发送!");
                                return;
                            }
                            console.log(data);
                        }).error(function (data, status, headers, config) {
                        console.log(data);
                    });*/
                }
            }
        };

        /**
         * 日期重置
         */

        var t = setTimeout(function () {
            restDate();
        }, 1000);
        var restDate = function () {
            if ($scope.partyActive == 2) {
                var nowDate = new Date();
                var time = nowDate.getTime();
                var sub = nowDate.getTime() - $scope.time;
                var leave1 = sub / (60 * 60 * 1000);    //计算天数后剩余的毫秒数
                var hours = parseInt(leave1);

                //计算相差分钟数
                var time2 = sub - hours * 60 * 60 * 1000;
                var leave2 = time2 / (60 * 1000);      //计算小时数后剩余的毫秒数
                var minutes = parseInt(leave2);

                var time3 = sub - hours * 60 * 60 * 1000 - minutes * 60 * 1000;

                var leave3 = time3 / 1000;     //计算分钟数后剩余的毫秒数
                var seconds = parseInt(leave3);

                document.getElementById("stime").innerHTML = hours + "时" + minutes + "分" + seconds + "秒";

                if (t) {
                    clearTimeout(t);
                }
                t = setTimeout(function () {
                    restDate();
                }, 1000);

            } else {
                clearTimeout(t);
            }
        }

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
            });

        }

        var initPage = function () {
            ajaxInit();
            webSocketInit();
        }
        initPage();
    });
})();

