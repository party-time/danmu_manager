var danmuTypeArray = [{id: 0, text: '普通弹幕'}, {id: 1, text: '动画'}, {id: 2, text: '图片'}, {id: 3, text: '闪光字'}, {id: 4, text: '表情'}];
var positionArray = [{id: 0, text: '全部'}, {id: 1, text: '左上'}, {id: 2, text: '顶部'}, {id: 3, text: '右上'}, {id: 4, text: '左下'}, {id: 5, text: '底部'}, {id: 6, text: '右下'}];

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

$(".danmuType-array").change(function (data) {
    //var aaa = $(".js-example-data-array  option:selected").val();
    //alert(aaa);
    divIndex = data.target.value;
    initDanmuTypeDiv(divIndex);
    if(divIndex==4){
        $(".danmuPositionDiv").hide();
    }else{
        $(".danmuPositionDiv").show();
        $(".danmuPosition-array").val(null).select2({data: positionArray, minimumResultsForSearch: -1});
        direction=0;
    }

    //选择普通弹幕
    if(divIndex==0){
        //触发aajx设置弹幕类型
    }
});

$(".danmuPosition-array").change(function (data) {
    direction = data.target.value;
});

var initDanmuTypeDiv = function (type) {
    for (var i = 0; i < danmuTypeArray.length; i++) {
        var id = danmuTypeArray[i].id;
        if (type == id) {
            $("#danmu_li_" + id).show();
        } else {
            $("#danmu_li_" + id).hide();
        }
        if(type==1){
            $("#danmu_li_endTime").show();
        }else{
            $("#danmu_li_endTime").hide();
        }
    }
}


var columnsArray = [
    {
        field: '', title: '编号', align: 'center', formatter: function (value, row, index) {
        return index + 1;
    }
    },
    {field: 'typeName', title: '内容', align: 'center'},
    {
        field: 'content', title: '内容', halign: "center", align: "left", formatter: function (value, row, index) {
        if (row.type == 0 || row.type == 3) {
            return '<span style="background-color: ' + row.color + '"> ' + row.content + '</span>';
        } else if (row.type == 4 || row.type == 2) {
            return ' <img src="' + baseUrl + row.content + '" style="width: 30px;height: 30px;"/>'
        } else if (row.type != 0 && row.type != 3 && row.type != 4 && row.type != 2) {
            return row.content;
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
/*window.operateEvents = {
    'click .remove': function (e, value, row, index) {
        $.danmuAjax('/v1/api/admin/timerDanmu/delete', 'GET', 'json', {danmuId: row.id}, function (data) {
            if (data.result == 200) {
                initable();
                initCarts();
            }
        }, function (data) {
            console.log(data);
        });
    }
};*/
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
    partyId =  url.substr(url.indexOf('=') + 1);
    quaryObject.partyId = partyId;

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
    initDanmuTypeDiv(divIndex);
    $.danmuAjax('/v1/api/admin/colors', 'GET', 'json', {}, function (data) {
        if (data.result == 200) {
            var colorArray = data.data.danmuColors;
            var html = ''
            for (var i = 0; i < colorArray.length; i++) {
                var color = colorArray[i];
                html += '<button class="btn"  style=" width: 65px; height:30px;margin-top: 1px; margin-right: 0.5em; padding-left: 0px; background-color: ' + color + '" onclick="setElement(\'' + color + '\')">'+color+'</button>';
            }
            $(".danmuColor").empty().html(html);
        } else {
            alert("资源加载失败")
        }
    });

    $.danmuAjax('/v1/api/admin/initResource', 'GET', 'json', quaryObject, function (data) {
        if (data.result == 200) {
            //$scope.expressions = data.data.expressions;
            //$scope.specialImages = data.data.specialImages;

            var html = '';
            var expressionArray = data.data.expressions;
            if(expressionArray!=null){
                for (var i = 0; i < expressionArray.length; i++) {
                    var expression = expressionArray[i];
                    html += '<img src="' + baseUrl + expression.smallFileUrl + '" style="width: 50px; height: 50px;margin-left: 1em;"  title="' + expression.smallFileUrl + '" onclick="setElement(\'' + expression.smallFileUrl + '\',\'' + expression.id + '\')"/>';
                }
                $(".expressionDanmu").empty().html(html);
            }else{
                $("#danmu_li_4").empty();
                removeFormTypeArray(4);
            }


            html = '';
            var imageArray = data.data.specialImages;
            if(imageArray!=null){
                for (var i = 0; i < imageArray.length; i++) {
                    var image = imageArray[i];
                    html += '<img src="' + baseUrl + image.fileUrl + '" style="width: 50px; height: 50px;margin-left: 1em;" title="' + image.fileUrl + '" onclick="setElement(\'' + image.fileUrl + '\',\'' + image.id + '\')"/>';
                }
                $(".imageDanmu").empty().html(html);
            }else{
                $("#danmu_li_2").empty();
                removeFormTypeArray(2);
            }


            html = '';
            var videoDanmuArray = data.data.specialVideos;
            if(videoDanmuArray!=null){
                for (var i = 0; i < videoDanmuArray.length; i++) {
                    var specialVideo = videoDanmuArray[i];
                    //html += '<button type="button" class="btn btn-sm btn-default" style="margin-left: 1em" onclick="setElement(\'' + specialVideo.resourceName + '\',\'' + specialVideo.id + '\')" >' + specialVideo.resourceName + '</button>';
                    var buttonName = specialVideo.resourceName.substring(0,4);
                    html += '<button class="btn"  style=" width: 65px; height:30px;margin-top: 1px; margin-right: 0.5em; " onclick="setElement(\'' + specialVideo.resourceName + '\',\'' + specialVideo.id + '\')" title="' + specialVideo.resourceName + '">' + buttonName + '</button>';
                }
                $(".videoDanmu").empty().html(html);
            }else{
                $("#danmu_li_1").empty();
                removeFormTypeArray(1);
            }
        } else {
            alert("资源加载失败")
        }
        $(".danmuType-array").select2({data: danmuTypeArray, minimumResultsForSearch: -1});
        $(".danmuPosition-array").select2({data: positionArray, minimumResultsForSearch: -1});
    });
}

function removeFormTypeArray(id){
    var tempArray = [];
    for(var i=0; i<danmuTypeArray.length; i++){
        if(id!=danmuTypeArray[i].id){
            tempArray.push(danmuTypeArray[i]);
        }
    }
    danmuTypeArray = tempArray;
}
getAllDanmuLibrary();




//设置动画
var setElement = function (content, id) {
    var value = parseInt(divIndex);
    switch (value) {
        case 0:
            insertData.color = content;
            setButtonBorder("danmuColor",content);
            break;
        case 1:
            insertData.code = id;
            insertData.content = content;
            setSpecialButtonBorder("videoDanmu",content);
            break;
        case 2:
            insertData.code = id;
            insertData.content = content;
            setImageBorder("imageDanmu",content);
            break;
        case 3:
            insertData.color = content;
            setButtonBorder("blingDanmuColor",content);
            break;
        case 4:
            insertData.code = id;
            insertData.content = content;
            setImageBorder("expressionDanmu",content);
            break;
        default:
            return;
    }

}


$("#danmuMsg").keydown(function () {
    setDanmuButtonStatus();
});
$("#danmuMsg").keyup(function () {
    setDanmuButtonStatus();
});



$("#blingMsg").keydown(function () {
    setBlingDanmuButtonStatus();
})

$("#blingMsg").keyup(function () {
    setBlingDanmuButtonStatus();
})

function setDanmuButtonStatus(){
    var size = 40-$("#danmuMsg").val().length;
    if(size<0){
        $.setControlDisabledStateByCss('sendDanmuButton',true);
        $("#danmuMsgCount").html('别输了，字数超过上限了');
    }else{
        $("#danmuMsgCount").html('你还可以输入的字数:'+size);
        $.setControlDisabledStateByCss('sendDanmuButton',false);
    }
}

function setBlingDanmuButtonStatus(){
    var size = 8-$("#blingMsg").val().length;
    if(size<0){
        $.setControlDisabledStateByCss('sendBlingDanmuButton',true);
        $("#blingMsgCount").html('别输了，字数超过上限了');
    }else{
        $("#blingMsgCount").html('你还可以输入的字数:'+size);
        $.setControlDisabledStateByCss('sendBlingDanmuButton',false);
    }
}




var danmuAddOperateHandler = function () {

    insertData.type = parseInt(divIndex);
    insertData.partyId = partyId;
    var minute = $("#minutes").val();
    var seconds = $("#seconds").val();

    var movieStatus = $("#movieStatus").val();


    if (minute == "") {
        minute = 0;
    }
    if(seconds=="" && movieStatus==0){
        alert("请填写时间,最少填写个秒");
        return;
    }else if(seconds==""){
        seconds=0;
    }

    if (isNaN(minute)) {
        alert('分钟请填写数字');
        return;
    }
    if (isNaN(seconds)) {
        alert('秒请填写数字');
        return;
    }else{
        if(seconds>59){
            alert('秒数请限制在0~59秒之间');
            return;
        }
    }

     insertData.direction=direction;

    var beginTime = parseInt(minute*60) + parseInt(seconds);
    insertData.beginTime = beginTime;
    if (divIndex == 0) {
        if($("#danmuMsg").val()==null || $("#danmuMsg").val()==""){
            alert('请填写弹幕');
            return;
        }else{
            insertData.content =$("#danmuMsg").val();
        }

    } else if (divIndex == 3) {
        if($("#blingMsg").val()==null || $("#blingMsg").val()==""){
            alert('请填写闪光字');
            return;
        }else{
            insertData.content =$("#blingMsg").val();
        }
    }else if (divIndex == 1) {
        if(insertData.content==null){
            alert('请选择动画');
            return;
        }
        var lastTime = $("#lastTime").val();
        if(lastTime==""){
            alert("亲，最少写个持续时间吧!");
            return;
        }

        if (isNaN(lastTime)) {
            alert('分钟请填写数字');
            return;
        }
        insertData.lastTime = lastTime;

    }else if (divIndex == 2) {
        if(insertData.content==null){
            alert('请选择图片');
            return;
        }
    }else if (divIndex == 4) {
        if(insertData.content==null){
            alert('请选择表情');
            return;
        }
    }

    $.danmuAjax(danmuAddUrl, 'POST', 'json', insertData, function (data) {
        quaryObject.pageNumber = 1
        if (data.result == 200) {
            initable();
            initCarts();
            clearValue();

            if (divIndex == 0) {
                setButtonBorder("danmuColor","");
            } else if (divIndex == 3) {
                setButtonBorder("blingDanmuColor","");
            }
        }
    });

}




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
                alert(data.result_msg);
                initable();
                initCarts();
                $("#uploadFileId2").val('');
                $('#myModal').modal('hide');
            }else{
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
            var type= dataObject.type;
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
            setBlingDanmuButtonStatus();
        }
    }, function (data) {
        console.log(data);
    });
}

var clearValue = function () {
    $("#danmuId").val('');
    $("#danmuMsg").val('');
    $("#blingMsg").val('');
    $("#minutes").val('');
    $("#seconds").val('');
    $("#endMinutes").val('');
    $("#endSeconds").val('');
    $("#blingMsgCount").html('你还可以输入的字数:'+40);
    $("#danmuMsgCount").html('你还可以输入的字数:'+40);
    insertData = new Object();

    setSpecialButtonBorder()
    setButtonBorder("danmuColor","null");
    setButtonBorder("blingDanmuColor","null");
    setButtonBorder("videoDanmu","null");
    setImageBorder("imageDanmu","null");
    setImageBorder("expressionDanmu","null");
}


function setImageBorder(id,name){
    var buttonArray=$('#'+id).find('img');
    if(buttonArray!=null &&  buttonArray.length>0){
        for(var i=0; i<buttonArray.length; i++){
            var buttonTitle = $(buttonArray[i]).attr("title");
            if(name==buttonTitle){
                $(buttonArray[i]).addClass("button-border-color");
            }else{
                $(buttonArray[i]).removeClass("button-border-color");
            }
        }
    }
}

function setSpecialButtonBorder(id,name){
    var buttonArray=$('#'+id).find('button');
    if(buttonArray!=null &&  buttonArray.length>0){
        for(var i=0; i<buttonArray.length; i++){
            var buttonTitle = $(buttonArray[i]).attr("title");
            if(name==buttonTitle){
                $(buttonArray[i]).addClass("button-border-color");
            }else{
                $(buttonArray[i]).removeClass("button-border-color");
            }
        }
    }
}
function setButtonBorder(id,color){
    var colorButtonArray=$('#'+id).find('button');
    if(colorButtonArray!=null &&  colorButtonArray.length>0){
        for(var i=0; i<colorButtonArray.length; i++){
            var buttonColor = $(colorButtonArray[i]).html();
            if(buttonColor==color){
                $(colorButtonArray[i]).addClass("button-border-color");
            }else{
                $(colorButtonArray[i]).removeClass("button-border-color");
            }
        }
    }
}