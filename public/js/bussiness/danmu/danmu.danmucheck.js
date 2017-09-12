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
        $scope.autoCheck=0;
        $scope.checkFlg=0;

        var globalObject = {};
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
            type_findclientList:'findclientList',
            type_checkStatus:'checkStatus'
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
                //活动时间
                $scope.partyName = json.data.partyName;
                //弹幕密度
                $scope.danmuDensity = json.data.danmuDensity;
                //预置弹幕
                $scope.preStatus = json.data.preDanmu;
                //测试模式
                $scope.testModel = json.data.testIsOpen;

                //审核延迟时间
                $scope.delaySecond = json.data.delaySecond;
                //弹幕密度
                $scope.danmuDensity = json.data.danmuDensity;

                $scope.checkFlg= parseInt(json.data.checkStatus);

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
                $interval(refreshDanmuList, 1000);
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
                danmu.timeCount = $scope.delaySecond+1;
                danmu.isSend=false;
                $scope.danmuList.unshift(setDanmuLeftTime(danmu, new Date().getTime()));
                if ($scope.danmuList.length > 1000) {
                    $scope.clearAndTurnUp();
                }
            } else if (json.type == $scope.type.type_preDanmu) {
                //预制弹幕开启关闭处理
                $scope.preStatus = json.data.status;
            } else if (json.type == $scope.type.type_playerStatus) {
                //屏幕控制处理
                $scope.playerStatus = json.data;
            } else if (json.type == $scope.type.type_delaySecond) {
                $scope.delaySecond = parseInt(json.data);
            }else if (json.type == $scope.type.type_danmuDensity) {
                initPreDanmuLibrary();
            } else if (json.type == $scope.type.type_partyActive) {
                $scope.partyStatus = json.data.status;
                if ($scope.partyStatus == 1) {
                    $("#partyStartButton").hide();
                    $("#filmStartButton").show();
                    $("#filmEndButton").show();
                } else if ($scope.partyStatus == 2) {
                    $("#partyStartButton").hide();
                    $("#filmStartButton").hide();
                    $("#filmEndButton").show();
                    $scope.time = json.data.time;
                    restDate($scope.partyStatus);
                    $("#stime").show();
                } else if ($scope.partyStatus == 3) {
                    //活动结束
                    $("#partyStartButton").hide();
                    $("#filmStartButton").hide();
                    $("#filmEndButton").hide();
                    $("#partyStatus").html('活动已经结束!')
                } else if ($scope.partyStatus == 4) {
                    alert("当前场地正在进行" + json.data.partyName + "活动，等活动结束后,再开始" + $scope.partyName + "活动");
                    return;
                }
            } else if (json.type == $scope.type.type_specialVideo) {
                if (json.data.status == 0) {
                    specialVideoJudge(json.data.id, 1);
                } else if (json.data.status == 1) {
                    specialVideoJudge(json.data.id, 0);
                }
                $scope.specialVideo = json.data.id;
            } else if(json.type==$scope.type.type_danmuDensity){
                $scope.danmuDensity= json.data;
            } else if (json.type == 'normalDanmu') {
                var danmu = json.data;
                danmu.s = 10;
                danmu.createTime = new Date().getTime() + 1000;
                danmu.timeCount = $scope.delaySecond+1;
                danmu.isSend=false;
                if($scope.checkIsArray(danmu.msg)){
                    for(var i=0; i<danmu.msg.length; i++){
                        //danmu.msg[i].id = i;
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
                alert(json.data);
            }else if (json.type == 'isRepeateLogin') {
                alert(json.data.message);
                ws.close();
                setLinkStatus();
                $scope.$apply();
            } else if (json.type == $scope.type.type_findclientList) {
                if (json.data != null) {
                    $scope.clientCount = json.data.data;
                }
            }  else if(json.type==$scope.type.type_checkStatus){
                $scope.checkFlg= parseInt(json.data.data);
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

        setInterval(function () {
            webSocketSendMessage({type:$scope.type.type_findclientList});
        }, 3 * 1000);

        $scope.setAutoCheck=function (value) {
            if(value==0){
                $scope.autoCheck =0;
            }else{
                $scope.autoCheck =1;
            }
        }

        $scope.sendDanmu=function (danmu) {
            danmu.s = -1;
            danmu.isSend=true;
            webSocketSendMessage({
                type: danmu.type,
                data: {message: danmu.msg, id:danmu.id,color: danmu.color, openId: danmu.openId}
            });
        }

        /**
         * 设置弹幕密度
         */
        $scope.setDanmuDensity = function () {
            if (webSocketIsConnect() && checkPatyIsBegin()) {
                webSocketSendMessage({
                    type: $scope.type.type_danmuDensity,
                    data: {danmuDensity: $scope.danmuDensity}
                });
            }
        }

        /**
         * 设置电影状态
         * @param status
         */
        $scope.filmStart = function (status) {
            //电影开始

            var statusStr = ""
            if(status==1){
                statusStr ="活动开始";
            }else if(status==2){
                statusStr ="电影开始";
            }else{
                statusStr ="结束活动";
            }
            var alertStr = "你是否决定要"+statusStr+"，操作后不能撤销!!!"
            if (confirm(alertStr)) {
                webSocketSendMessage({type: $scope.type.type_partyActive, data: {status: status}});
            }

        }

        //增减延迟时间
        $scope.setDelaySecond = function (status) {
            if (webSocketIsConnect() && checkPatyIsBegin()) {
                if(!status){
                    if($scope.delaySecond>0){
                        $scope.delaySecond = $scope.delaySecond-1;
                    }
                }else{
                    $scope.delaySecond = $scope.delaySecond+1;
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
                        webSocketSendMessage({type: $scope.type.type_blockDanmu, data: {id: danmu.id}})
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
                webSocketSendMessage({type: $scope.type.type_modeltest, data: {status: status}});
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
                webSocketSendMessage({type: $scope.type.type_preDanmu, data: {status: status}});
            }
        }


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


        $scope.setCheck=function (value) {
            if (ws.readyState == 1) {
                var key = getCookieValue("auth_key");
                webSocketSendMessage({type: 'checkStatus',data: {status: value,key:key}});
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
            webSocketSendMessage({type: $scope.type.type_specialVideo, data: {id: specialVideo.id, status: status}});
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
            object.nick =getCookieValue("nick");
            object.addressId = $scope.addressId;
            object.partyType=0;
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
            //alert('与服务器断开连接！');
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
                if($scope.autoCheck==1){
                    danmu.s = danmu.timeCount-1;
                    danmu.timeCount = danmu.s;
                    if (danmu.s == 0) {
                        danmu.s = -1;
                        danmu.isSend=true;
                        webSocketSendMessage({
                            type: danmu.type,
                            data: {message: danmu.msg,id:danmu.id, color: danmu.color, openId: danmu.openId}
                        });
                    }
                }
            }
            return danmu;
        };


        /**
         * 发送普通弹幕
         */
        $scope.sendDm = function () {
            if (webSocketIsConnect() && checkPatyIsBegin()) {
                if ($scope.danmuMsg && $scope.danmuMsg.length <= 40 && (!$scope.testModel || confirm('当前为测试模式,确认要发送吗？'))) {

                    $.danmuAjax('/v1/api/sendDanmu', 'post', 'json', {
                        msg: $scope.danmuMsg,
                        partyId: $scope.partyId,
                        addressId: $scope.addressId,
                        color: $scope.danmuColor
                    }, function (data) {
                        $scope.danmuMsg = "";
                        if (data.result == "403") {
                            alert("弹幕含有屏蔽词,禁止发送!");
                            return;
                        }
                        console.log(data);
                    }, function (data) {
                        console.log(data);
                    })
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
            if ($scope.partyStatus == 2) {
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

                document.getElementById("stime").innerHTML = "活动时间:<span style='color: red;'>"+hours + "时" + minutes + "分" + seconds + "秒</span>";

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
            //获取图片信息
            $http.get('/v1/api/admin/initResource?partyId=' + $scope.partyId)
                .success(function (data) {
                    if (data.result == 200) {
                        //$scope.expressions = data.data.expressions;
                        //$scope.specialImages = data.data.specialImages;
                        $scope.specialVideos = data.data.specialVideos;
                    } else {
                        alert("资源加载失败")
                    }
                }).error(function (data, status, headers, config) {
            });

        }

        $scope.checkIsArray = function (object) {
            return object && typeof object==='object' &&
                Array == object.constructor;
        }

        $scope.send=function(){
            if($.executeCompontentCheck()){
                $.ajax({
                    type: "POST",
                    url:"/v1/api/admin/danmuSend",
                    data:$('#danmuForm').serialize(),// 序列化表单值
                    async: false,
                    dataType:'json',
                    error: function(request) {
                        alert("Connection error");
                    },
                    success: function(data) {
                        if(data.result!=200){
                            alert(data.result_msg);
                        }
                        //window.location.href="跳转页面"
                    }
                });
            }
        }
        var initPage = function () {
            var url = location.href;
            if (url.indexOf('partyId=') != -1) {
                var param = url.substr(url.indexOf('?') + 1).split("&");
                $scope.partyId = param[0].substr(param[0].indexOf('=') + 1);
                $scope.addressId = param[1].substr(param[1].indexOf('=') + 1);
            }
            ajaxInit();
            var object= {
                'divId':'typeTitleDiv',
               'partyId':$scope.partyId,
               'addressId':$scope.addressId
            };
            $.initTitle(object);

            $.danmuAjax('/distribute/adminTask/socketAddress', 'GET', 'json', {}, function (data) {
                console.log(data);
                if (data.code == 200) {
                    var key = getCookieValue("auth_key");
                    websoctAddress = "ws://" + data.serverInfo.ip + ":" + data.serverInfo.port + "/ws?key="+key+'&partyType=0';
                    webSocketInit();
                }
            }, function (data) {
                console.log(data);
            });

            initPreDanmuLibrary();
        }
        
        function initPreDanmuLibrary() {
            $.danmuAjax('/v1/api/admin/danmuLibraryParty/getAllByPartyId?partyId='+$scope.partyId, 'GET', 'json', {}, function (data) {
                console.log(data);
                if(data.data!=null && data.data.length>0){
                    var html = '';
                    html+='<table>';
                    html+='<tr><td rowspan="2"><i class="icon-bookmark"></i><h3 style="margin-right: 1em;width: 68px; margin-top: 0px;">弹幕密度</h3></td></tr>';
                    for( var i=0;i<data.data.length;i++){
                        if(i==0){
                            html+='<tr>';
                            html+='<td>'+data.data[i].name+'</td>';
                            html+='<td><input type="text" style="width: 20px;" id="density_'+(i+1)+'" maxlength="2" value="'+data.data[i].densitry+'"><input type="hidden" value="'+data.data[i].danmuLibraryId+'" id="density_id_'+(i+1)+'" >';
                            html+='</td>';
                            html+='</tr>';
                        }else{
                            html+='<tr>';
                            html+='<td></td>';
                            html+='<td>'+data.data[i].name+'</td>' ;
                            html+='<td><input type="text" style="width: 20px;" id="density_'+(i+1)+'" maxlength="2" value="'+data.data[i].densitry+'"><input type="hidden" value="'+data.data[i].danmuLibraryId+'" id="density_id_'+(i+1)+'" >';
                            html+='</td>';
                            html+='</tr>';
                        }
                    }
                    html+='<tr><td>&nbsp;</td><td>&nbsp;</td><td style="text-align: right;"><input type="button" class="btn-info saveDensity" value="确定"/></td></tr>';
                    html+='</table>';
                    html+='<input type="hidden" id="libraryCount" value="'+data.data.length+'">';
                    $("#densityDiv").html(html);

                    $(".saveDensity").click(function(){
                        var count =$("#libraryCount").val();
                        if(count>0){
                            var array = [];
                            var sum = 0;
                            for(var i=0; i<count; i++){
                                var density = $("#density_"+(i+1)).val();
                                sum +=density;
                                var object  = {
                                    partyId:$scope.partyId,
                                    danmuLibraryId:$("#density_id_"+(i+1)).val(),
                                    densitry:density
                                }
                                array.push(object);
                            }
                            if(sum>15){
                                alert('弹幕密度之和不能超过15');
                                return;
                            }
                            if (webSocketIsConnect() && checkPatyIsBegin()) {
                                webSocketSendMessage({
                                    type: 'danmuDensity',
                                    data: {danmuDensity: array}
                                });
                            }
                            /*$.ajax({
                                type: "post",
                                url: "/v1/api/admin/danmuLibraryParty/chageDensity",
                                data:JSON.stringify(array) ,
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                success: function (response, ifo) {
                                    alert("success");
                                }, error: function () {
                                    alert("error");
                                }
                            })*/
                        }
                    });
                }else{
                    var html = '';
                    html+='<table>';
                    html+='<tr><td rowspan="2"><i class="icon-bookmark"></i><h3 style="margin-right: 1em;width: 68px; margin-top: 0px;">弹幕密度</h3></td></tr>';
                    html+='<tr>';
                    html+='<td></td>';
                    html+='<td>没有设置预置弹幕';
                    html+='</td>';
                    html+='</tr>';
                    html+='</table>';
                    $("#densityDiv").html(html);
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

