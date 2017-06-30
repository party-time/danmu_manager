var g_page_url,g_address_id;
var findById = function(){
    var url = location.href;
    var pageUrl;
    var ajaxUrl,obj;
    if(url.indexOf('url=')!=-1){
        pageUrl =  url.substr(url.indexOf('=')+1);
        g_page_url = pageUrl;
        ajaxUrl = '/v1/api/admin/cms/getPage';
        obj = {
                url:pageUrl
            }
    }else if( url.indexOf('addressId')!=-1){
        g_address_id = url.substr(url.indexOf('=')+1);
        ajaxUrl = '/v1/api/admin/cms/getPageByAddressId';
        obj = {
               addressId:url.substr(url.indexOf('=')+1)
        }
    }

    $.danmuAjax(ajaxUrl, 'GET','json',obj, function (data) {
        if(data.result == 200){
            if(data.data.page){
                $('#pageId').attr('id',data.data.page.id);
            }
            if(g_address_id){
                $('#pageName').html('影院商品管理');
            }
            var html = '';
            for(var i=0;i<data.data.columnObjectList.length;i++){
                html += '<div class="widget">';
                html += '<div class="widget-header">';
                html += '<i class="icon-list-alt"></i>';
                html += '<h3>'+data.data.columnObjectList[i].column.title+'</h3>'+
                    '<a onclick="openSelectItem(\''+data.data.columnObjectList[i].column.id+'\')">添加商品</a>'+
                    '<a style="margin-left:10px;" onclick="delColumn(\''+data.data.columnObjectList[i].column.id+'\',\''+data.data.columnObjectList[i].column.title+'\')">删除</a>';
                html += '</div><div class="widget-content" id="column_'+data.data.columnObjectList[i].column.id+'">';
                    if(data.data.columnObjectList[i].objectList){
                        for( var j=0;j<data.data.columnObjectList[i].objectList.length;j++){
                            var obj = data.data.columnObjectList[i].objectList[j];
                            html +=  '<div style="width:10%;display:inline-block;margin:1ex;"><p>'+obj.name+'</p><a onclick="delItem(this,\''+obj.id+'\',\''+data.data.columnObjectList[i].column.id+'\')">删除</a></div>';

                        }
                    }
                html += '</div></div>';

            }
            $('#columnDiv').html(html);
        }else{
            if(data.result_msg){
                alert(data.result_msg);
            }else{
                alert('删除失败');
            }
        }
    }, function (data) {
        console.log(data);
    });
}


var openCreateColumn = function(){
    $('#myModalLabel').html('新增栏目');
    var html='<form id="edit-profile" class="form-horizontal">'+
             '<div class="control-group" style="margin-top: 18px;">'+
             '<label class="control-label" style="width:60px">栏目名称</label><div class="controls" style="margin-left:60px;">'+
             '<input type="text" class="span4" id="title"  /></div><br></div></form>';
    $('#modalBody').html(html);
    $('#myModal').modal('show');
}


var createColumn = function(){
    var title = $('#title').val();
    if( '' == title){
        alert('栏目的标题不能为空');
        return;
    }
    var obj = {
        title:title,
        url:g_page_url,
        addressId:g_address_id
    }
    $.danmuAjax('/v1/api/admin/cms/createColumn', 'POST','json',obj, function (data) {
        if(data.result == 200){
            $('#title').val('');
            $('#myModal').modal('hide');
            findById();
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

var delColumn = function(id,name){
    var obj = {
        url:g_page_url,
        columnId:id
    }
    if(confirm('确定要删除'+name+'吗？')){
        $.danmuAjax('/v1/api/admin/cms/delColumn', 'GET','json',obj, function (data) {
            if(data.result == 200){
                findById();
            }else{
                if(data.result_msg){
                    alert(data.result_msg);
                }else{
                    alert('删除失败');
                }
            }
        }, function (data) {
            console.log(data);
        });
     }
}

var openSelectItem = function(columnId){
    $('#modalBody').html('<table id="tableList" class="table table-striped" table-height="360"></table>');
    $('#myModalLabel').html('选择商品');
    var tableUrl = '/v1/api/admin/item/page';
    var queryObject = {
        pageSize: 6
    }
    var columnsArray =[
        {
            field: 'name',
            title: '商品名称',
            align: 'center'
        },
        {
            title: '操作',
            align: 'center',
            formatter: function (value, row, index) {
                return '<a class="btn" onclick="selectItem(\''+row.id+'\',\''+row.name+'\',\''+columnId+'\')" >添加</a>';
            }
        }
    ];
    var tableSuccess = function(){
        $('#modalBody').find('.pull-left').remove();
    }
    $.initTable('tableList', columnsArray, queryObject, tableUrl,tableSuccess);
    var buttonHtml = '<button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>'
    $('#modalFooter').html(buttonHtml);
    $('#modalody').find('.pull-left').remove();
    $('#myModal').modal('show');

}

var selectItem = function(itemId,itemName,columnId){

    var obj = {
        itemId:itemId,
        columnId:columnId
    }
    $.danmuAjax('/v1/api/admin/cms/selectItem', 'GET','json',obj, function (data) {
        if(data.result == 200){
             var html = '<div style="width:10%;display:inline-block;margin:1ex;"><p>'+itemName+'</p><a onclick="delItem(this,\''+itemId+'\',\''+columnId+'\')">删除</a></div>';
             $('#column_'+columnId).append(html);
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

var delItem = function(object,itemId,columnId){
    $(object).parent().remove();
    var obj = {
        itemId:itemId,
        columnId:columnId
    }
    if(confirm('确定要删除吗？')){
        $.danmuAjax('/v1/api/admin/cms/delItem', 'GET','json',obj, function (data) {
            if(data.result == 200){

            }else{
                if(data.result_msg){
                    alert(data.result_msg);
                }else{
                    alert('删除失败');
                }
            }
        }, function (data) {
            console.log(data);
        });
    }

}


findById();