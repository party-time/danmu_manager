var g_item_id;
var tableUrl = '/v1/api/admin/cmdTemp/page';
var columnsArray = [
    {
        title: '序号',
        align: 'center',
        formatter: function (value, row, index) {
            return index+1;
        }
    },
    {
        field: 'id',
        title: '指令id',
        align: 'center'
    },
    {
        field: 'name',
        title: '指令名称',
        align: 'center'
    },
    {
        title: '操作',
        align: 'center',
        formatter: function (value, row, index) {
            return '<a class="btn" onclick="selectCmd(\''+row.id+'\',\''+row.name+'\')">选择</a>';
        },
        events: 'operateEvents'
    }
];

var quaryObject = {
    pageSize: 8
};

var findAllDmCmd = function(){
    $.initTable('tableList', columnsArray, quaryObject, tableUrl);
    $('#myModal').modal('show');
}

var selectCmd = function(id,name){
    $('#selectCmd').html(name+'<a class="btn" onclick="delCmd()">删除</a>');
    $('#selectCmd').attr('dmCmdId',id);
    $('#myModal').modal('hide');
}

var delCmd = function(){
    $('#selectCmd').html('');
    $('#selectCmd').attr('dmCmdId','');
}

var findDmCmdById = function(id){
    var obj = {
        id:id
    }
    $.danmuAjax('/v1/api/admin/cmdTemp/find', 'GET','json',obj, function (data) {
        if(data.result == 200){
            selectCmd(data.data.cmdTempId,data.data.tempName);
        }else{
            if(data.result_msg){
                alert(data.result_msg)
            }else{
                alert('查询失败')
            }
        }
    }, function (data) {
        console.log(data);
    });

}

var findById = function(){
    var url = location.href;
    if(url.indexOf('id=')!=-1){
        var id = url.substr(url.indexOf('=')+1);
        g_item_id = id;
        var obj = {
            id:id
        }
        $.danmuAjax('/v1/api/admin/item/get', 'GET','json',obj, function (data) {
            if(data.result == 200){
                $('#name').val(data.data.name);
                $('#title').val(data.data.title);
                $('#truePrice').val(data.data.truePrice);
                $('#showPrice').val(data.data.showPrice);
                $('#content').val(data.data.content);
                $('#type').val(data.data.type);
                findDmCmdById(data.data.dmCmdId);
            }else{
                if(data.result_msg){
                    alert(data.result_msg)
                }else{
                    alert('查询失败')
                }
            }
        }, function (data) {
            console.log(data);
        });
    }

}

var updateItem = function(){
    var name = $('#name').val();
    var title = $('#title').val();
    var truePrice = $('#truePrice').val();
    var showPrice = $('#showPrice').val();
    var content = $('#content').val();
    var type = $('#type').val();
    var dmCmdId = $('#selectCmd').attr('dmCmdId');

    if( '' == name ){
        alert('商品名称不能为空');
        return;
    }

    if( '' == title ){
        alert('商品标题不能为空');
        return;
    }

    if( '' == truePrice){
        alert('真实价格不能为空');
        return;
    }

    if( '' == showPrice){
        alert('展示价格不能为空');
        return;
    }

    if( '' == content){
        alert('商品详情不能为空');
        return;
    }

    var reg = /^[0-9]*$/g;
    if(!reg.test(truePrice)){
        alert('真实价格只能为数字');
        return;
    }
    var reg1 = /^[0-9]*$/g;
    if(!reg1.test(showPrice)){
        alert('展示价格只能为数字');
        return;
    }

    var obj = {
        id:g_item_id,
        name:name,
        title:title,
        truePrice:truePrice,
        showPrice:showPrice,
        content:content,
        type:type,
        dmCmdId:dmCmdId
    }

    $.danmuAjax('/v1/api/admin/item/update', 'POST','json',obj, function (data) {
        if(data.result == 200){
            window.location.href='/shopManager';
        }else{
            if(data.result_msg){
                alert(data.result_msg)
            }else{
                alert('保存失败')
            }
        }
    }, function (data) {
        console.log(data);
    });

}

var returnList = function(){
    window.location.href="/shopManager";
}

findById();