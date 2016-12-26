var tableUrl = '/v1/api/admin/party/list';
var danmuLibraryList = [];
var columnsArray = [
    {
        field: 'name',
        title: '名称',
        align: 'center'
    },
    {
        title: '类型',
        align: 'center',
        formatter: function (value, row, index) {
            if( null != row.type){
                if( row.type == 0){
                    return "活动";
                }else{
                    return "电影";
                }
            }else{
                return "活动";
            }
        }
    },
    {
        field: 'startTimeStr',
        title: '开始时间',
        halign: "center",
        align: "left"
    },
    {
        field: 'endTimeStr',
        title: '结束时间',
        align: 'center',
    },
    {
        field: 'shortName',
        title: '简称',
        align: 'center',
    },
    {
        field: 'danmuLibraryId', title: '操作',
        align: 'center',
        formatter: function (value, row, index) {
            var selectHtml = '<select id="dl_'+row.id+'" onchange="changeDanmuLibrary(\''+row.id+'\')" style="width: 100px;margin-bottom: 0px;">';
            if( null != danmuLibraryList){
                for( var i=0;i<danmuLibraryList.length;i++){
                        if(value == danmuLibraryList[i].id){
                            selectHtml += '<option value='+danmuLibraryList[i].id+' selected="selected">'+danmuLibraryList[i].name+'</option>';
                        }else{
                            selectHtml += '<option value='+danmuLibraryList[i].id+'>'+danmuLibraryList[i].name+'</option>';
                        }

                }
            }
            selectHtml += '</select>';
            return '<a class="btn" onclick="delParty(\''+row.id+'\',\''+row.name+'\')">删除</a>'+
            '<a class="btn" href="#" onclick="openDanmuCheck(\''+row.name+'\',\''+row.id+'\')">弹幕审核</a>'+
            '<a class="btn" href="#" onclick="openPartyResource(\''+row.id+'\')">资源管理</a>'+
            '<a class="btn" href="#" onclick="openAddress(\''+row.name+'\',\''+row.id+'\')">场地管理</a>'+
            '<a class="btn" href="#" onclick="openTimerDanmu(\''+row.id+'\')">定时弹幕</a>'+selectHtml;

        },
        events: 'operateEvents'
    }
];
var quaryObject = {
    pageSize: 20
};


var getAllDanmuLibrary = function() {
    $.danmuAjax('/v1/api/admin/getAllDanmuLibrary', 'GET','json',null, function (data) {
        if (data.result == 200) {
           danmuLibraryList = data.data;
          var dl = {
                 id:'0',
                 name:'选择弹幕库'
              }
           danmuLibraryList.unshift(dl);
        } else {
            alert(data.result_msg);
        };
    }, function (data) {
        console.log(data);
    });
}


var changeDanmuLibrary = function(partyId){
    var danmuLibraryId = $('#'+'dl_'+partyId).val();
    var obj = {
        'partyId':partyId,
        'danmuLibraryId':danmuLibraryId
    }
    $.danmuAjax('/v1/api/admin/party/updatePartyDanmuLibrary', 'GET','json',obj, function (data) {
            if (data.result == 200) {
              console.log(data);
              }
        }, function (data) {
            console.log(data);
        });
}

var delParty = function(id,name){
    if(confirm('确定要删除'+name+'活动吗？')){
        var obj = {
            'id':id
        }
        $.danmuAjax('/v1/api/admin/party/del', 'GET','json',obj, function (data) {
            if( data.result == 200){
                $.initTable('tableList', columnsArray, quaryObject, tableUrl);
            }else{
                alert('更新失败')
            }

        }, function (data) {
            console.log(data);
        });
    }

};

var addParty = function(){
    window.location.href="/party/add";
}

var openAddress = function(partyName,partyId){
    var addressTableUrl = '/v1/api/admin/address/queryByPartyId';
    var addressQueryObject = {
        partyId:partyId,
        pageSize: 6
    }
    var addressColumnsArray =[
        {
            field: 'name',
            title: '名称',
            align: 'center'
        },
        {
           field: 'id', title: '操作',
           align: 'center',
           formatter: function (value, row, index) {
                return '<a class="btn" onclick="delAddress(\''+partyName+'\',\''+row.name+'\',\''+partyId+'\',\''+row.id+'\')">删除</a>';
           }
        }
    ];
    var tableSuccess = function(){
        $('#modalBody').find('.pull-left').remove();
    }
    $.initTable('addressTableList', addressColumnsArray, addressQueryObject, addressTableUrl,tableSuccess);
    $('#myModalLabel').html(partyName+'的场地管理');
    var buttonHtml = '<button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>' +
    '<button class="btn btn-primary" onclick="openMoreAddress(\''+partyName+'\',\''+partyId+'\')">查看更多场地</button>';
    $('#modalFooter').html(buttonHtml);
    $('#modalody').find('.pull-left').remove();
    $('#myModal').modal('show');
}

var openMoreAddress = function(partyName,partyId){
    var addressTableUrl = '/v1/api/admin/address/queryNoParty';
    var addressQueryObject = {
        partyId:partyId,
        pageSize: 6
    }
    var addressColumnsArray =[
        {
            field: 'name',
            title: '名称',
            align: 'center'
        },
        {
           field: 'id', title: '操作',
           align: 'center',
           formatter: function (value, row, index) {
                return '<a class="btn" onclick="selectAddress(\''+partyName+'\',\''+partyId+'\',\''+row.id+'\')">添加</a>';
           }
        }
    ];

    var tableSuccess = function(){
        $('#modalBody').find('.pull-left').remove();
    }
    $.initTable('addressTableList', addressColumnsArray, addressQueryObject, addressTableUrl,tableSuccess);

    var buttonHtml = '<button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>' +
    '<button class="btn btn-primary" onclick="openAddress(\''+partyName+'\',\''+partyId+'\')">本活动的场地</button>';
    $('#modalFooter').html(buttonHtml);
}


var selectAddress = function(partyName,partyId,addressId){
    var obj = {
        partyId:partyId,
        addressId:addressId
    }
    $.danmuAjax('/v1/api/admin/partyAddressRelation/save', 'GET','json',obj, function (data) {
        if(data.result == 200) {
          console.log(data);
          openAddress(partyName,partyId);
          alert('添加成功');
         }else{
            alert('添加失败');
         }
    }, function (data) {
        console.log(data);
    });

}

var delAddress = function(partyName,addressName,partyId,addressId){
    if(confirm('确定要删除'+addressName+'吗？')){
        var obj = {
            partyId:partyId,
            addressId:addressId
        }
        $.danmuAjax('/v1/api/admin/partyAddressRelation/delByPartyIdAndAddressId', 'GET','json',obj, function (data) {
            if(data.result == 200) {
              console.log(data);
              openAddress(partyName,partyId);
              alert('删除成功');
             }else{
                alert('删除失败');
             }
        }, function (data) {
            console.log(data);
        });
    }

}

var openNewWindow = function(url){
    window.open(url);
}

var openDanmuCheck = function(partyName,partyId){
    var addressTableUrl = '/v1/api/admin/address/queryByPartyId';
    var addressQueryObject = {
        partyId:partyId,
        pageSize: 6
    }
    var addressColumnsArray =[
        {
            field: 'name',
            title: '名称',
            align: 'center'
        },
        {
           field: 'id', title: '操作',
           align: 'center',
           formatter: function (value, row, index) {
                return '<a class="btn" onclick="openNewWindow(\'/party/danmuCheck?partyId='+partyId+'&addressId='+row.id+'\')">审核</a>';
           }
        }
    ];
    $.initTable('addressTableList', addressColumnsArray, addressQueryObject, addressTableUrl,null,'还没有添加场地，请去添加场地');
    $('#myModalLabel').html(partyName+'的弹幕审核');
    var buttonHtml = '<button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>';
    $('#modalFooter').html(buttonHtml);
    $('#modalBody').find('.pull-left').remove();
    $('#myModal').modal('show');
}

var openTimerDanmu = function(partyId){
       openNewWindow('/party/timerDanmu?partyId='+partyId);
}

var openPartyResource = function(partyId){
       openNewWindow('/party/resource?partyId='+partyId);
}

var searchParty = function(){
    var quaryObject = {
        pageSize: 20,
        type:$('#searchType').val()
    };
    $.initTable('tableList', columnsArray, quaryObject, tableUrl);
}

getAllDanmuLibrary();

//加载表格数据
$.initTable('tableList', columnsArray, quaryObject, tableUrl);