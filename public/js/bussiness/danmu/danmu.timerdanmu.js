

var tableUrl = '/v1/api/admin/timerDanmu/page';
var chartUrl = '/v1/api/admin/timerDanmu/chart';
var baseUrl = _baseImageUrl;
var danmuAddUrl = '/v1/api/admin/timerDanmu/save';
var divIndex = 0;
var direction=0 ;//方位
//var partyId = "582a86620cf2d2a9f936ce77";
//var partyId='582a86620cf2d2a9f936ce77';
var partyId;
var insertData = new Object();

var updateFlg=false;


var columnsArray = [
    {
        field: '', title: '编号', align: 'center', formatter: function (value, row, index) {
            return index + 1;
        }
    },
    {field: 'typeName', title: '类型', align: 'center'},
    {
        field: 'content', title: '内容', halign: "center", align: "left", formatter: function (value, row, index) {
            /*if (row.type == 0 || row.type == 3) {
                return '<span style="background-color: ' + row.color + '"> ' + row.content + '</span>';
            } else if (row.type == 4 || row.type == 2) {
                return ' <img src="' + baseUrl + row.content + '" style="width: 30px;height: 30px;"/>'
            } else if (row.type != 0 && row.type != 3 && row.type != 4 && row.type != 2) {
                return row.content;
            }*/
            var  content  = row.msg
            if(content==null){
                return "";
            }else{
                if(row.danmuType==1 || row.danmuType==2){
                    return ' <img src="' + baseUrl + content + '" style="width: 30px;height: 30px;"/>'
                }else {
                    if(row.content.hasOwnProperty("color")){
                        if(row.content.color!=null){
                            if(isArray(row.content.color)){
                                var colorArray = row.content.color;
                                if(colorArray!=null){
                                    var value = "";
                                    for(var i=0; i<colorArray.length; i++){
                                        value+= "<span style='background-color: "+colorArray[i].replace("0x","#")+"'>"+content+"</span> ";
                                    }
                                    return value;
                                }
                                return content;
                            }
                            return "<span style='background-color: "+row.content.color.replace("0x","#")+"'>"+content+"</span>";
                        }else{
                            return content;
                        }
                    }else{
                        return content;
                    }
                }
            }
        }
    },
    {
        field: 'beginTime', title: '时间', align: 'center', formatter: function (value, row, index) {
        return parseInt(row.beginTime / 60) + "分" + row.beginTime % 60 + "秒";
    }
    },
    {
        field: 'endTime', title: '结束时间', align: 'center', formatter: function (value, row, index) {
        if(row.endTime!=null){
            return parseInt(row.endTime / 60) + "分" + row.endTime % 60 + "秒";
        }
        return "";
    }
    },
    {
        field: 'operate', title: '删除', align: 'center', formatter: function (value, row, index) {
        var buttonStr = "<a class='btn btn-info edit' onclick='doEdit(\""+row.id+"\")' title='remove'>编辑</a>";
        buttonStr +="&nbsp;<a class='btn btn-danger remove'  onclick='doDelete(\""+row.id+"\")' title='remove'>删除</a>";
        return buttonStr;
        //return "<button class='btn btn-info edit' onclick='doEdit(\''+row.id+'\')' title='remove'>编辑</button>&nbsp;<button class='btn btn-danger remove'  title='remove'>删除</button>";
    }, events: 'operateEvents'
    }
];

function isArray(arg) {
    if (typeof arg === 'object') {
        return Object.prototype.toString.call(arg) === '[object Array]';
    }
    return false;
}

var doDelete = function(id){
    $.danmuAjax('/v1/api/admin/timerDanmu/delete', 'GET', 'json', {danmuId:id}, function (data) {
        if (data.result == 200) {
            initable();
            initCarts();
        }
    }, function (data) {
        console.log(data);
    });
}

var quaryObject = {pageSize: 10, partyId: partyId};

var initable = function () {
    $.initTable('tableList', columnsArray, quaryObject, tableUrl);
}
var initCarts = function () {
    $.danmuAjax(chartUrl, 'GET', 'json', quaryObject, function (data) {
        initHighcharts(data.data);
    }, function (data) {
        console.log(data);
    });
}
var getAllDanmuLibrary = function () {
    var url = location.href.substring(location.href.indexOf("?")+1);
    var paramArray =  url.split("&");
    partyId = paramArray[0].substr(url.indexOf('=') + 1);
    quaryObject.partyId = partyId;

    if(paramArray[1]==null){
        $(".porcessButton").hide();
    }

    $.danmuAjax('/v1/api/admin/party/partyInfo/'+partyId, 'GET', 'json', {}, function (data) {
        if (data.result == 200) {
            if(data.data.danmuStartTime>0){
                setDanmuStartButtonStatus(1);
            }else{
                setDanmuStartButtonStatus(0);
            }
        } else {
            alert("资源加载失败")
        }
    });
    initable();
    initCarts();
    //初始化标题
    $.initTitle({'divId':'typeTitleDiv','partyId':partyId});

    $("#currentPartyId").val(partyId);

    //加载资源
    $.danmuAjax('/v1/api/admin/initResource', 'GET', 'json', quaryObject, function (data) {
        if (data.result == 200) {

            html = '';
            var videoDanmuArray = data.data.specialVideos;
            if(videoDanmuArray!=null){
                for (var i = 0; i < videoDanmuArray.length; i++) {
                    var specialVideo = videoDanmuArray[i];
                    //html += '<button type="button" class="btn btn-sm btn-default" style="margin-left: 1em" onclick="setElement(\'' + specialVideo.resourceName + '\',\'' + specialVideo.id + '\')" >' + specialVideo.resourceName + '</button>';
                    var buttonName = specialVideo.resourceName.substring(0,4);
                    html += '<input type="button" class="btn"  style=" width: 65px; height:30px;margin-top: 1px; margin-right: 0.5em; " onclick="setElement(\'' + specialVideo.resourceName + '\',\'' + specialVideo.id + '\')" title="'+specialVideo.resourceName+'" idAttr="' + specialVideo.id + '" value="'+buttonName+'"></input>';
                }
                $(".videoDanmu").empty().html(html);
            }
        } else {
            alert("资源加载失败")
        }
    });
}
getAllDanmuLibrary();




$(".saveDanmuButton").click(function () {
    if($.executeCompontentCheck()){
        $.ajax({
            type: "POST",
            url:"/v1/api/admin/timerDanmu/danmuSave",
            data:$('#danmuForm2').serialize(),// 序列化表单值
            async: false,
            error: function(request) {
                alert("Connection error");
                return;
            },
            success: function(data) {
                //window.location.href="跳转页面"
                initable();
                initCarts();
                $("#danmuId").val('');
            }
        });
    }
})


$(".saveVideoButton").click(function () {
    var videoId =  $("#videoId").val();
    if(videoId==null || videoId==""){
        alert('请选择视频！');
        return;
    }
    $.ajax({
        type: "POST",
        url:"/v1/api/admin/timerDanmu/videoSave",
        data:$('#videoForm').serialize(),// 序列化表单值
        async: false,
        error: function(request) {
            alert("Connection error");
            return;
        },
        success: function(data) {
            //window.location.href="跳转页面"
            initable();
            initCarts();
            $("#vediodanmuId").val('');

        }
    });
})






function initHighcharts(data) {
    if (data == null) {
        $('#container').html("没有数据!");
        return;
    }
    $('#container').highcharts({
        chart: {
            type: 'spline'
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        exporting: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        xAxis: {
            //maxPadding: 360,
            showLastLabel: true,
            labels: {
                formatter: function () {
                    return this.value / 60;
                }
            },
            min: 0,
            tickPositions: data.xtickPositions,
            max: data.xmax
        },
        yAxis: {
            title: {
                text: ''
            },
            labels: {
                formatter: function () {
                    return this.value;
                }
            },
            min: 0,
            tickPositions: data.ytickPositions,
            max: data.ymax,
            lineWidth: 1
        },
        legend: {
            enabled: false
        },
        tooltip: {
            headerFormat: '<b>{series.name}</b><br/>',
            /*pointFormat: '{point.x/60} "分" +{point.x%60}"秒" : {point.y}'*/
            formatter: function () {
                return '<b>' + parseInt(this.x / 60) + "'" + this.x % 60 + "''" + '</b><br/>' +
                    '弹幕数: ' + this.y;
            }
        },
        plotOptions: {
            spline: {
                marker: {
                    enabled: true
                }
            }
        },
        series: [{
            name: '弹幕数',
            data: data.series
        }]
    });
}

$(".timeDanmuButton").click(function(){
    //alert(partyId);
    $.danmuAjax('/v1/api/admin/timerDanmu/creatTimerDanmuFile', 'GET', 'json', {partyId:partyId}, function (data) {
        if (data.result == 200) {
            //initable();
            //initCarts();
            alert("创建成功！");
        }
    }, function (data) {
        console.log(data);
    });
});

$(".importDanmu").click(function () {
    $('#myModal').modal('show');
});


$(".importDanmuButton").click(function(){
    //alert(partyId);
    if ($("#uploadFileId2").val().length > 0) {
        ajaxFileUpload();
    } else {
        alert("请选择文件！");
    }
});

function ajaxFileUpload() {
    $.ajaxFileUpload({
        url: "/v1/api/admin/timerDanmu/upload/"+partyId, //用于文件上传的服务器端请求地址
        secureuri: false, //一般设置为false
        fileElementId: 'uploadFileId2', //文件上传空间的id属性  <input type="file" id="file" name="file" />
        dataType: 'json', //返回值类型 一般设置为json
        type:"post",
        success: function (data,status){
            if(data.result==200){

                initable();
                initCarts();
                $("#uploadFileId2").val('');
                $('#myModal').modal('hide');
                alert(data.result_msg);
            }else{
                $("#uploadFileId2").val('');
                $('#myModal').modal('hide');
                alert(data.result_msg);
            }
        }
    });
    return false;
}

$(".templetDownButton").click(function () {
    var form=$("<form>");//定义一个form表单
    form.attr("style","display:none");
    form.attr("target","");
    form.attr("method","POST");
    form.attr("action","/v1/api/admin/timerDanmu/downloadTemplet");
    $("body").append(form);//将表单放置在web中
    form.submit();//表单提交
});

$(".movieStart").click(function () {
    var status = $("#movieStatus").val();
    if(status==0){
        danmuStartFunction(1);
    }else{
        danmuStartFunction(0);
    }

});

$(".addTimeButton").click(function () {

    updateDanmuBeginTime(1);
    //$("#adjustTime").val(parseInt(time)+1)
});

$(".minusTimeButton").click(function () {
    updateDanmuBeginTime(0);
});

var updateDanmuBeginTime = function(status){
    $.danmuAjax('/v1/api/admin/timerDanmu/updateDanmuBeginTime/'+partyId+"/"+status, 'GET', 'json', null, function (data) {
        if (data.result == 200) {
            //setDanmuStartButtonStatus(status)
            var time = $("#adjustTime").val();
            if(status>0){
                $("#adjustTime").val(parseInt(time)+1);
            }else{
                $("#adjustTime").val(parseInt(time)-1);
            }
            initable();
            initCarts();
        }
    }, function (data) {
        console.log(data);
    });
}

var danmuStartFunction = function(status){
    $.danmuAjax('/v1/api/admin/timerDanmu/danmuStart/'+partyId+"/"+status, 'GET', 'json', null, function (data) {
        if (data.result == 200) {
            setDanmuStartButtonStatus(status)
        }
    }, function (data) {
        console.log(data);
    });
}
var setDanmuStartButtonStatus=function(status){
    if(status==1){
        $(".movieStart").html('电影结束');
        $(".movieStart").removeClass('btn-info').addClass('btn-danger');
    }else {
        $(".movieStart").html('电影开始');
        $(".movieStart").removeClass('btn-danger').addClass('btn-info');
    }
    $("#movieStatus").val(status);
}

function doEdit(id){
    updateFlg  = true;
    $.danmuAjax('/v1/api/admin/timerDanmu/findTimerDanmu/'+id, 'GET', 'json', null, function (data) {
        if (data.result == 200) {
            var dataObject = data.data;
            var beginTime = dataObject.beginTime;
            var endTime = dataObject.endTime;

            if(dataObject.templateId!=0){
                $("#minutes").val(parseInt(beginTime/60));
                $("#seconds").val(beginTime-parseInt(beginTime/60)*60);
                var defaultValueObject = dataObject.content;
                $.createPlug(dataObject.templateId,dataObject.partyId,defaultValueObject);
                $("#danmuId").val(dataObject.id);

            }else{

                $("#videoMinutes").val(parseInt(beginTime/60));
                $("#videoSeconds").val(beginTime-parseInt(beginTime/60)*60);
                $("#lastTime").val(parseInt(endTime)-parseInt(beginTime));

                $("#vediodanmuId").val(dataObject.id);
                setSpecialButtonBorder("videoDanmu",dataObject.msg,dataObject.content.idd);


            }


            /*var type= dataObject.type;
            var direction= dataObject.direction;
            $(".danmuType-array").select2().val(type).trigger("change");
            $(".danmuPosition-array").select2().val(direction).trigger("change");
            var beginTime = dataObject.beginTime;
            $("#danmuId").val(dataObject.id);
            $("#minutes").val(parseInt(beginTime/60));
            $("#seconds").val(beginTime-parseInt(beginTime/60)*60);
            var endTime = dataObject.endTime;
            var color= dataObject.color;
            var content = dataObject.content;
            if(type==0){
                $("#danmuMsg").val(content);
                setButtonBorder("danmuColor",color);
            }else if(type==3){
                $("#blingMsg").val(content);
                setButtonBorder("blingDanmuColor",color);
            }else if(type==1){
                $("#lastTime").val(parseInt(endTime)-parseInt(beginTime))
                //setButtonBorder("videoDanmu",color);
                setSpecialButtonBorder("videoDanmu",content);
            }else if(type==2){
                setImageBorder("imageDanmu",content);
            }else if(type==4){
                setImageBorder("expressionDanmu",content);
            }

            insertData.id= dataObject.id;
            insertData.code = id;
            insertData.content = content;
            insertData.color=color;
            updateFlg =false;
            setDanmuButtonStatus();
            setBlingDanmuButtonStatus();*/
        }
    }, function (data) {
        console.log(data);
    });
}

//设置动画
var setElement = function (content, id) {
    setSpecialButtonBorder("videoDanmu",content,id);
}

function setSpecialButtonBorder(divId,name,id){
    $("#videoId").val(id);
    $("#videoName").val(name);
    var buttonArray=$('#'+divId).find('input[type="button"]');
    if(buttonArray!=null &&  buttonArray.length>0){
        for(var i=0; i<buttonArray.length; i++){
            var buttonTitle = $(buttonArray[i]).attr("idAttr");
            if(id==buttonTitle){
                $(buttonArray[i]).addClass("button-border-color");
            }else{
                $(buttonArray[i]).removeClass("button-border-color");
            }
        }
    }
}