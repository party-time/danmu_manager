
var url_pre ='/v1/api/admin/adDanmu';
var tableUrl = url_pre+'/list';

var chartUrl = '/v1/api/admin/timerDanmu/chart';
var baseUrl = _baseImageUrl;
var danmuAddUrl = url_pre+'/save';
var danmuDelUrl = url_pre+'/del'
var divIndex = 0;
var direction=0 ;//方位
var libraryId;
var insertData = new Object();





var columnsArray = [
    {
        field: '', title: '编号', align: 'center', formatter: function (value, row, index) {
        return index + 1;
    }
    },
    {field: 'typeName', title: '类型', align: 'center'},
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
        return "<button class='btn btn-danger remove' href='javascript:void(0)' title='remove'>删除</button>";
    }, events: 'operateEvents'
    }
];
window.operateEvents = {
    'click .remove': function (e, value, row, index) {
        $.danmuAjax(danmuDelUrl, 'GET', 'json', {danmuId: row.id}, function (data) {
            if (data.result == 200) {
                initable();
            }
        }, function (data) {
            console.log(data);
        });
    }
};
var quaryObject = {pageSize: 10, libraryId: libraryId};

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


var getVideoPage = function(pageNo){
    var obj={
        fileType:3,
        pageNo:pageNo,
        pageSize:10
    };
    $.danmuAjax('/v1/api/admin/resource/page', 'GET','json',obj, function (data) {
        $(".videoDanmu").empty();
        var html ='';
        for(var i=0;i<data.rows.length;i++){
            var specialVideo = data.rows[i];
            var buttonName = specialVideo.resourceName.substring(0,4);
            html += '<input class="btn"  style=" width: 65px; height:30px;margin-top: 1px; margin-right: 0.5em; " onclick="setElement(\'' + specialVideo.resourceName + '\',\'' + specialVideo.id + '\')" title="' + specialVideo.resourceName + '" value="'+buttonName+'"></input>';
        }
        var totalPageNo =  parseInt((data.total  + obj.pageSize -1) / obj.pageSize);
        var footer='<div>';
        var next = pageNo+1;
        var last = pageNo -1;
        if(pageNo == 1 && totalPageNo > 1){
            footer += '第'+obj.pageNo+'页<a onclick="getVideoPage('+next+')">下一页</a> 共'+totalPageNo+'页</div>';
        }else if(pageNo == totalPageNo &&totalPageNo>1){
            footer += '<a onclick="getVideoPage('+last+')">上一页</a>第'+obj.pageNo+'页 共'+totalPageNo+'页</div>';
        }else if(totalPageNo == 1){
            footer += '第'+obj.pageNo+'页';
        }else{
            footer += '<a onclick="getVideoPage('+last+')">上一页</a>第'+obj.pageNo+'页<a onclick="getVideoPage('+next+')">下一页</a> 共'+totalPageNo+'页</div>';
        }
        $(".videoDanmu").html(html+"<br/>"+footer);
    }, function (data) {
        console.log(data);
    });
}

var getAllDanmuLibrary = function () {
    var url = location.href.substring(location.href.indexOf("?")+1);
    libraryId =  url.substr(url.indexOf('=') + 1);
    quaryObject.libraryId = libraryId;
    initable();
    getVideoPage(1)

    $.initTitle({'divId':'typeTitleDiv'});
}
getAllDanmuLibrary();



$(".timeDanmuButton").click(function(){
    $.danmuAjax('/v1/api/admin/adDanmu/createFile', 'GET', 'json', {libraryId:libraryId}, function (data) {
        if (data.result == 200) {
            //initable();
            //initCarts();
        }
    }, function (data) {
        console.log(data);
    });
});



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
            var buttonTitle = $(buttonArray[i]).attr("title");
            if(id==buttonTitle){
                $(buttonArray[i]).addClass("button-border-color");
            }else{
                $(buttonArray[i]).removeClass("button-border-color");
            }
        }
    }
}