var tableUrl = '/v1/api/admin/party/list';
var danmuLibraryList = [];
var columnsArray = [
    {
        field: 'name',
        title: '名称',
        align: 'center'
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
            return '<button type="button" class = "sendPrize" onclick="delParty(\''+row.id+'\',\''+row.name+'\')">删除</button>'+
            '<button type="button" class = "sendPrize" id="row_' + row.id + '">弹幕审核</button>'+
            '<button type="button" class = "sendPrize" id="row_' + row.id + '">资源管理</button>'+
            '<button type="button" class = "sendPrize" id="row_' + row.id + '">定时弹幕</button>'+selectHtml;

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
    window.location.href="addParty";
}

getAllDanmuLibrary();

//加载表格数据
$.initTable('tableList', columnsArray, quaryObject, tableUrl);