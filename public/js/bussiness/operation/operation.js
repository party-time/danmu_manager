var tableUrl = '/v1/api/admin/operationLog/page';
var columnsArray = [
    {
        title: '序号',
        align: 'center',
        formatter: function (value, row, index) {
            return index+1;
        }
    },
    {
        field: 'title',
        title: '标题',
        align: 'center'
    },
    {
        field: 'key',
        title: '日志key',
        align: 'center'
    },
    {
        title: '操作',
        align: 'center',
        formatter: function (value, row, index) {
            return '<a class="btn" onclick="openUpdateMonitor(\''+row.id+'\')">修改</a>';
        },
        events: 'operateEvents'
    }
];

var quaryObject = {
    pageSize: 20
};


var openAddMonitor = function(){
    $('#myModalLabel').html('创建日志模版');
    var htmlStr = '<form id="edit-profile" class="form-horizontal"><div class="control-group" style="margin-top: 18px;">'+
       '<label class="control-label" style="width:60px">日志名称</label><div class="controls" style="margin-left:60px;">'+
       '<input type="text" class="span4" id="title"> </div><br>';
       htmlStr +='<label class="control-label" style="width:60px">日志key</label><div class="controls" style="margin-left:60px;">'+
       '<input type="text" class="span4" id="key" onblur="checkKey()"></div><br>';
       htmlStr +='<label class="control-label" style="width:60px">日志内容</label><div class="controls" style="margin-left:60px;">'+
                '<textarea class="span4" style="height:100px" id="content"></textarea></div><br>';
       htmlStr +='<label class="control-label" style="width:60px">日志内容占位符</label><div class="controls" style="margin-left:60px;">'+
                       '<span class="span4">时间:${time},管理员:${adminUser},活动名称:${partyName},弹幕名称:${danmuName}'+
                       ',模拟指令:${cmd},颜色:${color},内容:${content},场地:${address},X:{x},Y:{y}</span></div><br>';
       htmlStr+='</div></form>';
    $('#modalBody').html(htmlStr);
    var buttonHtml = '<button class="btn btn-primary" onclick="save()">保存</button>';
    $('#modalFooter').html(buttonHtml);
    $('#myModal').modal('show');
}

var openUpdateMonitor = function(id){
    var obj={
        id:id
    }
    $.danmuAjax('/v1/api/admin/operationLog/get', 'GET','json',obj, function (data) {
        if(data.result == 200) {
            $('#myModalLabel').html('修改日志模版');

            var htmlStr = '<form id="edit-profile" class="form-horizontal"><div class="control-group" style="margin-top: 18px;">'+
            '<label class="control-label" style="width:60px">日志名称</label><div class="controls" style="margin-left:60px;">'+
            '<input type="text" class="span4" id="title" value="'+data.data.title+'"> </div><br>';
            htmlStr +='<label class="control-label" style="width:60px">日志key</label><div class="controls" style="margin-left:60px;">'+
            '<input type="text" class="span4" id="key" onblur="checkKey()" value="'+data.data.key+'" oldVal="'+data.data.key+'"></div><br>';
            htmlStr +='<label class="control-label" style="width:60px">日志内容</label><div class="controls" style="margin-left:60px;">'+
                    '<textarea class="span4" style="height:100px" id="content">'+data.data.content+'</textarea></div><br>';
            htmlStr +='<label class="control-label" style="width:60px">日志内容占位符</label><div class="controls" style="margin-left:60px;">'+
                                   '<span class="span4">时间:${time},管理员:${adminUser},活动名称:${partyName},弹幕名称:${danmuName}'+
                                   ',模拟指令:${cmd},颜色:${color},内容:${content},场地:${address},X:{x},Y:{y}</span></div><br>';
            htmlStr+='</div></form>';
            $('#modalBody').html(htmlStr);
            var buttonHtml = '<button class="btn btn-primary" onclick="update(\''+id+'\')">修改</button>';
            $('#modalFooter').html(buttonHtml);
            $('#myModal').modal('show');
        }else{
            alert('查询失败');
        }
    }, function (data) {
        console.log(data);
    });

}

var checkKey = function(){
    var obj ={
        key:$('#key').val()
    }
    var oldVal = $('#key').attr('oldVal');
    if( oldVal ){
        if(oldVal != $('#key').val()){
            $.danmuAjax('/v1/api/admin/operationLog/countByKey', 'GET','json',obj, function (data) {
                if(data.result == 200) {
                    if(data.data > 0){
                        alert("key有重复,请重新填写");
                        return;
                    }
                }else{
                    alert('查询失败');
                }
            }, function (data) {
                console.log(data);
            });
        }
    }else{
        $.danmuAjax('/v1/api/admin/monitor/countByKey', 'GET','json',obj, function (data) {
            if(data.result == 200) {
                if(data.data > 0){
                    alert("key有重复,请重新填写");
                    return;
                }
            }else{
                alert('查询失败');
            }
        }, function (data) {
            console.log(data);
        });
    }
}


var save = function(){
    if( '' == $('#title').val()){
        alert("日志名称不能为空");
        return;
    }

    if( '' == $('#key').val()){
        alert('日志的key不能为空');
        return;
    }

    if( '' == $('#content').val()){
        alert('日志的内容不能为空');
        return;
    }

    var obj ={
        title:$('#title').val(),
        adminUserIds:$('#adminIds').val(),
        key:$('#key').val(),
        wechatTempId:$('#wechatTempId').val(),
        content:$('#content').val()
    }
    $.danmuAjax('/v1/api/admin/operationLog/save', 'POST','json',obj, function (data) {
        if(data.result == 200) {
            console.log(data);
            $('#myModal').modal('hide');
            $.initTable('tableList', columnsArray, quaryObject, tableUrl);
            alert('创建成功');
        }else{
            if(data.result_msg){
                alert(data.result_msg);
            }else{
                alert('创建失败');
            }
        }
    }, function (data) {
        console.log(data);
    });
}

var update = function(id){
    if( '' == $('#title').val()){
        alert("日志名称不能为空");
        return;
    }

    if( '' == $('#key').val()){
        alert('日志的key不能为空');
        return;
    }

    if( '' == $('#content').val()){
        alert('日志的内容不能为空');
        return;
    }
    var obj ={
        id:id,
        title:$('#title').val(),
        key:$('#key').val(),
        content:$('#content').val()
    }
    $.danmuAjax('/v1/api/admin/operationLog/update', 'POST','json',obj, function (data) {
        if(data.result == 200) {
            console.log(data);
            $('#myModal').modal('hide');
            $.initTable('tableList', columnsArray, quaryObject, tableUrl);
            alert('修改成功');
        }else{
            if(data.result_msg){
                alert(data.result_msg);
            }else{
                alert('修改失败');
            }
        }
    }, function (data) {
        console.log(data);
    });
}

//加载表格数据
$.initTable('tableList', columnsArray, quaryObject, tableUrl);