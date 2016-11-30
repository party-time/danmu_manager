var danmuTypeArray = [{id: 0, text: '普通弹幕'}, {id: 1, text: '动画'}, {id: 2, text: '图片'}, {id: 3, text: '闪光字'}, {id: 4, text: '表情'}];
var positionArray = [{id: 0, text: '全部'}, {id: 1, text: '左上'}, {id: 2, text: '顶部'}, {id: 3, text: '右上'}, {id: 4, text: '左下'}, {id: 5, text: '底部'}, {id: 6, text: '右下'}];

var tableUrl = '/v1/api/admin/timerDanmu/page';
var chartUrl = '/v1/api/admin/timerDanmu/chart';
var baseUrl = "http://testimages.party-time.cn/upload";
var danmuAddUrl = '/v1/api/admin/timerDanmu/save';
var divIndex = 0;
var direction=0 ;//方位
//var partyId = "582a86620cf2d2a9f936ce77";
//var partyId='582a86620cf2d2a9f936ce77';
var partyId;
var insertData = new Object();





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
        field: 'time', title: '时间', align: 'center', formatter: function (value, row, index) {
            return parseInt(row.time / 60) + "分" + row.time % 60 + "秒";
        }
    },
    {
        field: 'operate', title: '删除', align: 'center', formatter: function (value, row, index) {
        return "<button class='btn btn-danger remove' href='javascript:void(0)' title='remove'>删除</button>";
    }, events: 'operateEvents'
    }
];
window.operateEvents = {
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
};
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
    initable();
    initCarts();
    initDanmuTypeDiv(divIndex);
    $.danmuAjax('/v1/api/admin/colors', 'GET', 'json', {}, function (data) {
        if (data.result == 200) {
            var colorArray = data.data.danmuColors;
            var html = ''
            for (var i = 0; i < colorArray.length; i++) {
                var color = colorArray[i];
                html += '<button class="btn"  style="width: 65px; height:30px;margin-top: 1px; margin-right: 0.5em; background-color: ' + color + '" onclick="setElement(\'' + color + '\')"></button>';
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
                    html += '<img src="' + baseUrl + expression.smallFileUrl + '" style="width: 50px; height: 50px;margin-left: 1em;" onclick="setElement(\'' + expression.smallFileUrl + '\',\'' + expression.id + '\')"/>';
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
                    html += '<img src="' + baseUrl + image.fileUrl + '" style="width: 50px; height: 50px;margin-left: 1em;" title="' + image.resourceName + '" onclick="setElement(\'' + image.fileUrl + '\',\'' + image.id + '\')"/>';
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
    insertData.type = parseInt(divIndex);
    var value = parseInt(divIndex);
    switch (divIndex) {
        case 0:
            insertData.color = content;
            break;
        case 1:
            insertData.code = id;
            insertData.content = content;
            break;
        case 2:
            insertData.code = id;
            insertData.content = content;
            break;
        case 3:
            insertData.color = content;
            break;
        case 4:
            insertData.code = id;
            insertData.content = content;
            break;
        default:
            return;
    }

}


$("#danmuMsg").keydown(function () {
    var size = 40-$("#danmuMsg").val().length;

    if(size<0){
        $.setControlDisabledStateByCss('sendDanmuButton',true);
        $("#danmuMsgCount").html('别输了，字数超过上限了');
    }else{
        $("#danmuMsgCount").html('你还可以输入的字数:'+size);
        $.setControlDisabledStateByCss('sendDanmuButton',false);
    }


})
$("#danmuMsg").keyup(function () {
    var size = 40-$("#danmuMsg").val().length;
    if(size<0){
        $.setControlDisabledStateByCss('sendDanmuButton',true);
        $("#danmuMsgCount").html('别输了，字数超过上限了');
    }else{
        $("#danmuMsgCount").html('你还可以输入的字数:'+size);
        $.setControlDisabledStateByCss('sendDanmuButton',false);
    }
})



$("#blingMsg").keydown(function () {
    var size = 8-$("#blingMsg").val().length;

    if(size<0){
        $.setControlDisabledStateByCss('sendBlingDanmuButton',true);
        $("#blingMsgCount").html('别输了，字数超过上限了');
    }else{
        $("#blingMsgCount").html('你还可以输入的字数:'+size);
        $.setControlDisabledStateByCss('sendBlingDanmuButton',false);
    }


})
$("#blingMsg").keyup(function () {
    var size = 8-$("#blingMsg").val().length;
    if(size<0){
        $.setControlDisabledStateByCss('sendBlingDanmuButton',true);
        $("#blingMsgCount").html('别输了，字数超过上限了');
    }else{
        $("#blingMsgCount").html('你还可以输入的字数:'+size);
        $.setControlDisabledStateByCss('sendBlingDanmuButton',false);
    }
})

var danmuAddOperateHandler = function () {

    insertData.partyId = partyId;
    var minute = $("#minutes").val();
    var seconds = $("#seconds").val();

    if (minute == "") {
        minute = 0;
    }
    if(seconds==""){
        alert("请填写时间,最少填写个秒");
        return;
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

    /*if(divIndex!=0 && divIndex!=4){
        if(direction<0){
            alert('请设置弹幕位置!');
            return;
        }
        insertData.direction=direction;
    }*/

     insertData.direction=direction;

    var time = parseInt(minute*60) + parseInt(seconds);
    insertData.time = time;
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
            //direction =parseInt(data.data);
            //alert(direction)
            //$(".danmuPosition-array").select2('val',"'"+direction+"'");
            initable();
            initCarts();
            clearValue();
        }
    });

}

var clearValue = function () {
    $("#danmuMsg").val('');
    $("#blingMsg").val('');
    $("#blingMsgCount").html('你还可以输入的字数:'+40);
    $("#danmuMsgCount").html('你还可以输入的字数:'+40);
    insertData = new Object();
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