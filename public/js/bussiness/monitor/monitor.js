var tableUrl = '/v1/api/admin/monitor/page';
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
        title: '报警标题',
        align: 'center'
    },
    {
        field: 'key',
        title: '报警key',
        align: 'center'
    },
    {
        title: '操作',
        align: 'center',
        formatter: function (value, row, index) {
            return '<a class="btn" onclick="openUpdateH5temp(\''+row.id+'\')">修改</a>'+
            '<a class="btn" onclick="del(\''+row.id+'\',\''+row.tempTitle+'\')">删除</a>';
        },
        events: 'operateEvents'
    }
];

var quaryObject = {
    pageSize: 20
};


var openAddMonitor = function(){
    $('#myModalLabel').html('创建报警');
    var htmlStr = '<form id="edit-profile" class="form-horizontal"><div class="control-group" style="margin-top: 18px;">'+
       '<label class="control-label" style="width:60px">报警名称</label><div class="controls" style="margin-left:60px;">'+
       '<input type="text" class="span4" id="title"> </div><br>';
       htmlStr +='<label class="control-label" style="width:60px">报警人员id</label><div class="controls" style="margin-left:60px;">'+
          '<textarea class="span4" id="adminIds"></textarea><span>多个人员id请用逗号分隔</span></div><br>';
       htmlStr +='<label class="control-label" style="width:60px">报警key</label><div class="controls" style="margin-left:60px;">'+
       '<input type="text" class="span4" id="key" onblur="checkKey()"></div><br>';
       htmlStr +='<label class="control-label" style="width:60px">报警内容</label><div class="controls" style="margin-left:60px;">'+
                '<textarea class="span4" style="height:100px" id="content"></textarea></div><br>';
       htmlStr +='<label class="control-label" style="width:60px">报警内容占位符</label><div class="controls" style="margin-left:60px;">'+
                       '<span class="span4">场地名称:${addressName},用户名称:${userName}</span></div><br>';
       htmlStr+='</div></form>';
    $('#modalBody').html(htmlStr);
    var buttonHtml = '<button class="btn btn-primary" onclick="save()">保存</button>';
    $('#modalFooter').html(buttonHtml);
    $('#myModal').modal('show');
}

var checkKey = function(){
    var obj ={
        key:$('#key').val()
    }
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


var save = function(){
    if( '' == $('#title').val()){
        alert("报警名称不能为空");
        return;
    }
    if( '' == $('#adminIds').val()){
        alert('报警人员id不能为空');
        return;
    }
    if( '' == $('#key').val()){
        alert('报警的key不能为空');
        return;
    }
    if( '' == $('#content').val()){
        alert('报警的内容不能为空');
        return;
    }
    var obj ={
        title:$('#title').val(),
        adminUserIds:$('#adminIds').val(),
        key:$('#key').val(),
        content:$('#content').val()
    }
    $.danmuAjax('/v1/api/admin/monitor/save', 'POST','json',obj, function (data) {
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

//加载表格数据
$.initTable('tableList', columnsArray, quaryObject, tableUrl);