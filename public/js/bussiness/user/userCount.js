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
var tableUrl = '/v1/api/admin/wechatCount/page';
var columnsArray = [
    {
        field: 'addressName',
        title: '地址',
        align: 'center'
    },
    {
        title: '周一',
        align: 'center',
        formatter: function (value, row, index) {
            if(row){
                return new Date(parseInt(row.startDate)).format('yyyy-MM-dd hh:mm:ss');
            }
        }
    },{
        title: '周日',
        align: 'center',
        formatter: function (value, row, index) {
            if(row){
                return new Date(parseInt(row.endDate)).format('yyyy-MM-dd hh:mm:ss');
            }
        }
    },
    {
        field: 'count',
        title: '人数',
        align: 'center'
    }
];
var quaryObject = {
    pageSize: 20
};


var searchNick = function(){
    var nick = $("#searchNick").val();
    if( '' != nick){
        quaryObject = {
            nick:nick,
            pageSize:20
        }
        $.initTable('tableList', columnsArray, quaryObject, tableUrl);
    }
}

var delUser = function(id,nick){
    if (confirm('确认要删除用户“' + nick + '”吗？')) {

        $.danmuAjax('/v1/api/admin/wechatmanager/del?id='+id, 'GET','json',null, function (data) {
            if (data.result == 200) {
                console.log(data);

                var nick = $("#searchNick").val();
                if( '' != nick){
                    searchNick();
                }else{
                    $.initTable('tableList', columnsArray, quaryObject, tableUrl);
                }
            }else{
                alert('删除失败')
            }
        }, function (data) {
            console.log(data);
        });
    }
}


var openAddress = function(wechatUserId){
    var aList = $('#selectAddress').children('a');
    var addressIds = '';
    if( aList && aList.length > 0){
        for(var i=0;i<aList.length;i++){
            addressIds += $(aList[i]).attr('addressId');
            if( i < aList.length-1){
                addressIds += ',';
            }
        }
    }
    var addressTableUrl = '/v1/api/admin/address/queryAll';
    var addressQueryObject = {
        addressIds:addressIds,
        pageSize:6
    }
    var addressColumnsArray =[
        {
            field: 'name',
            title: '名称',
            align: 'center'
        },
        {
            title: '操作',
            align: 'center',
            formatter: function (value, row, index) {
                return '<a class="btn" onclick="assignAddress(\''+row.id+'\',\''+wechatUserId+'\')">选择</a>';
            }
        }
    ];

    var tableSuccess = function(){
        $('#modalBody').find('.pull-left').remove();
    }
    $.initTable('addressTableList', addressColumnsArray, addressQueryObject, addressTableUrl,tableSuccess);
    $('#myModalLabel').html('场地管理');
    var buttonHtml = '<button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>';
    $('#modalFooter').html(buttonHtml);
    $('#modalody').find('.pull-left').remove();
    $('#myModal').modal('show');
}

var sendBiaoBai = function(wechatId){
    $.danmuAjax('/v1/api/admin/wechatmanager/sendBiaobai?wechatId='+wechatId, 'GET','json',null, function (data) {
        if(data.result == 200){
            console.log(data);
            alert('发送成功');
        }else{
            alert('发送失败');
        }
    }, function (data) {
        console.log(data);
    });
}

var dasang = function(wechatId){
    $.danmuAjax('/v1/api/admin/wechatmanager/dashang?wechatId='+wechatId, 'GET','json',null, function (data) {
        if(data.result == 200){
            console.log(data);
            alert('发送成功');
        }else{
            alert('发送失败');
        }
    }, function (data) {
        console.log(data);
    });
}

var assignAddress = function(addressId,wechatId){
    $.danmuAjax('/v1/api/admin/wechatmanager/assignAddress?addressId='+addressId+'&wechatId='+wechatId, 'GET','json',null, function (data) {
        if(data.result == 200){
            console.log(data);
            $('#myModal').modal('hide');
            $.initTable('tableList', columnsArray, quaryObject, tableUrl);
            alert('设置成功');

        }else{
            alert('设置失败');
        }
    }, function (data) {
        console.log(data);
    });
}

//加载表格数据
$.initTable('tableList', columnsArray, quaryObject, tableUrl);