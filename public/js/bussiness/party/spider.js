Date.prototype.format = function(f){
    var o ={
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(),    //day
        "h+" : this.getHours(),   //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
        "S" : this.getMilliseconds() //millisecond
    }
    if(/(y+)/.test(f))f=f.replace(RegExp.$1,(this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(f))f = f.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));return f
}

var tableUrl = '/v1/api/admin/spider/list';
    var danmuLibraryList = [];
    var columnsArray = [
        {
            field: 'name',
            title: '电影名称',
            align: 'center'
        },
        {
            title: '数据来源',
            align: 'center',
            formatter: function (value, row, index) {
                if(row.source == 0){
                    return "豆瓣";
                }else{
                    return "未知";
                }
            }
        },
        {
            field: 'date',
            title: '上映时间',
            align: 'center',
            formatter: function (value, row, index) {
                  return new Date(parseInt(row.date)).format('yyyy-MM-dd');
            }
        },
        {
            field: 'score',
            title: '评分',
            align: 'center',
        },
        {
            title: '操作',
            align: 'center',
            formatter: function (value, row, index) {
                var str = '';

                str = '<a class="btn" onclick="openUpdateSpider(\''+row.id+'\',\''+row.name+'\')">修改</a>';

                return str;
            },
            events:'operateEvents'
        }
    ];
    var quaryObject = {
        pageSize: 20
    };

var openUpdateSpider = function(id){
    var obj={
        id:id
    }
    $.danmuAjax('/v1/api/admin/spider/get', 'GET','json',obj, function (data) {
        if(data.result == 200) {
            $('#myModalLabel').html('修改爬虫数据');
                var htmlStr = '<form id="edit-profile" class="form-horizontal"><div class="control-group" style="margin-top: 18px;">'+
                   '<label class="control-label" style="width:60px">电影名称</label><div class="controls" style="margin-left:60px;">'+
                   '<input type="text" class="span4"  maxlength="16" id="name" value="'+data.data.name+'"> </div><br>';
                   htmlStr +='<label class="control-label" style="width:60px">电影时长</label><div class="controls" style="margin-left:60px;">'+
                  '<input type="text" class="span4"  maxlength="16" id="time" value="'+data.data.time+'"> </div><br>';
                  htmlStr +='<label class="control-label" style="width:60px">上映时间</label><div class="controls" style="margin-left:60px;">'+
                   '<input type="text" class="span4"  maxlength="16" id="date" value="'+new Date(parseInt(data.data.date)).format('yyyy-MM-dd')+'"> </div><br>';
                   htmlStr +='<label class="control-label" style="width:60px">评分</label><div class="controls" style="margin-left:60px;">'+
                   '<input type="text" class="span4"  maxlength="16" id="score" value="'+data.data.score+'"></div><br>';

                   htmlStr+='</div></form>';
                $('#modalBody').html(htmlStr);
                var buttonHtml = '<button class="btn btn-primary" onclick="updateSpider(\''+data.data.id+'\')">修改</button>';
                $('#modalFooter').html(buttonHtml);
                $('#myModal').modal('show');
        }else{
            alert('打开失败');
        }
    }, function (data) {
        console.log(data);
    });
}

var updateSpider = function(id){

    var object = {
        'id': id,
        'name': $('#name').val(),
        'time': $('#time').val(),
        'dateStr': $('#date').val(),
        'score': $('#score').val()
    };

    $.danmuAjax('/v1/api/admin/spider/update', 'POST','json',object, function (data) {
        if (data.result == 200) {
            console.log(data);
            window.location.href='/party/spider';
          }else{
             alert('更新失败');
          }
    }, function (data) {
        console.log(data);
    });
}

$.initTable('tableList', columnsArray, quaryObject, tableUrl);