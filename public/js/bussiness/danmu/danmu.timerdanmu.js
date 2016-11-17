var data = [{id: 0, text: '普通弹幕'}, {id: 1, text: '动画'}, {id: 2, text: '图片'}, {id: 3, text: '闪光字'}, {id: 4, text: '表情'}];
var tableUrl = '/v1/api/admin/timerDanmu/page';
var chartUrl = '/v1/api/admin/timerDanmu/chart';
var baseUrl = "http://testimages.party-time.cn/upload";
var danmuAddUrl = '/v1/api/admin/timerDanmu/save';
var divIndex = 0;
var partyId = "582a86620cf2d2a9f936ce77";
var insertData = new Object();


$(".js-example-data-array").select2({
    data: data,
    minimumResultsForSearch: -1,
});

$(".js-example-data-array").select2('val', '0');
$(".js-example-data-array").change(function (data) {
    //var aaa = $(".js-example-data-array  option:selected").val();
    //alert(aaa);
    divIndex = data.target.selectedIndex;
    initDanmuTypeDiv(divIndex);
});

var initDanmuTypeDiv = function (type) {
    for (var i = 0; i < data.length; i++) {
        var id = data[i].id;
        if (type == id) {
            $("#danmu_li_" + id).show();
        } else {
            $("#danmu_li_" + id).hide();
        }
    }
}


var columnsArray = [
    {field: '', title: '编号', align: 'center', formatter: function (value, row, index) {return index + 1;}},
    {field: 'typeName', title: '内容', align: 'center'},
    {field: 'content', title: '内容', halign: "center", align: "left", formatter: function (value, row, index) {
            if (row.type == 0 || row.type == 3) {
                return '<span style="background-color: ' + row.color + '"> ' + row.content + '</span>';
            } else if (row.type == 4 || row.type == 2) {
                return ' <img src="' + baseUrl + row.content + '" style="width: 30px;height: 30px;"/>'
            } else if (row.type != 0 && row.type != 3 && row.type != 4 && row.type != 2) {
                return row.content;
            }
        }
    },
    {field: 'time', title: '时间', align: 'center', formatter: function (value, row, index) {return parseInt(row.time / 60) + "分" + row.time % 60 + "秒";}},
    {field: 'operate', title: '删除', align: 'center', formatter: function (value, row, index) {
        return "<a class='icon-remove-sign remove' href='javascript:void(0)' title='remove'></a>";
        },events: 'operateEvents'
    }
];
window.operateEvents = {
    'click .remove': function (e, value, row, index) {
        $.danmuAjax('/v1/api/admin/timerDanmu/delete', 'GET','json',{danmuId:row.id}, function (data) {
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

    $.danmuAjax('/v1/api/admin/initResource', 'GET', 'json', {partyId: partyId}, function (data) {
        if (data.result == 200) {
            //$scope.expressions = data.data.expressions;
            //$scope.specialImages = data.data.specialImages;

            var html = '';
            var expressionArray = data.data.expressions;
            var imageArray = data.data.specialImages;
            for (var i = 0; i < expressionArray.length; i++) {
                var expression = expressionArray[i];
                html += '<img src="' + baseUrl + expression.smallFileUrl + '" style="width: 50px; height: 50px;margin-left: 1em;" onclick="setElement(\'' + expression.smallFileUrl + '\',\'' + expression.id + '\')"/>';
            }
            $(".expressionDanmu").empty().html(html);

            html = '';
            var imageArray = data.data.specialImages;
            for (var i = 0; i < imageArray.length; i++) {
                var image = imageArray[i];
                html += '<img src="' + baseUrl + image.fileUrl + '" style="width: 50px; height: 50px;margin-left: 1em;" title="' + image.resourceName + '" onclick="setElement(\'' + image.fileUrl + '\',\'' + image.id + '\')"/>';
            }
            $(".imageDanmu").empty().html(html);

            html = '';
            var videoDanmuArray = data.data.specialVideos;
            for (var i = 0; i < videoDanmuArray.length; i++) {
                var specialVideo = videoDanmuArray[i];
                html += '<button type="button" class="btn btn-sm btn-default" style="margin-left: 1em" onclick="setElement(\'' + specialVideo.resourceName + '\',\'' + specialVideo.id + '\')" >' + specialVideo.resourceName + '</button>';
            }
            $(".videoDanmu").empty().html(html);
        } else {
            alert("资源加载失败")
        }
    });
}
getAllDanmuLibrary();


//设置动画
var setElement = function (content, id) {
    insertData.type = divIndex;
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
var danmuAddOperateHandler = function () {

    insertData.partyId=partyId;
    var minute = $("#minutes").val();
    var seconds = $("#seconds").val();
    var time = parseInt(minute * 60) + parseInt(seconds);
    insertData.time = time;
    if (divIndex == 0) {
        insertData.content = $("#danmuMsg").val();
    } else if (divIndex == 3) {
        insertData.content = $("#blingMsg").val();
    }

    //alert($.objectCovertJson(insertData));
    //clearValue();
    $.danmuAjax(danmuAddUrl, 'POST', 'json', insertData, function (data) {
        quaryObject.pageNumber = 1
        if (data.result == 200) {
            initable();
            initCarts();
            clearValue();
        }
    });

}

var clearValue = function () {
    insertData = new Object();
}


function initHighcharts(data) {
    if(data==null){
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
