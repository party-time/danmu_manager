var url_pre = '/v1/api/admin/adDanmuLibrary';
var tableUrl = url_pre+'/list';
var quaryObject = {
    pageSize: 5,
    flg:$("#deleteFlg").val()
};

var columnsArray = [
    {
        field: 'id',
        title: '编号',
        align: 'center'
    },
    {
        field: 'name',
        title: '名称',
        align: 'center'
    },
    {
        field: 'isDelete',
        title: '删除状态',
        align: 'center',
        formatter: function (value, row, index) {
            if (row.isDelete == 1) {
                return  "<button class='btn' href='javascript:void(0)'  onclick='danmuLibraryRecovery(\""+row.id+"\",\""+row.name+"\")' title='remove'>还原</button>";
            }else{
                var str="";
                str+="<a class='btn btn-info remove' href='/adDanmuLibrary/add?id="+row.id+"' title='remove'>编辑</a> &nbsp;";
                str+="<a class='btn btn-info remove' href='/adDanmuLibrary/edit?id="+row.id+"' title='remove'>弹幕编辑</a> &nbsp;";
                str+="<button class='btn btn-danger remove' href='javascript:void(0)'  onclick='delAdDanmuLibrary(\""+row.id+"\",\""+row.name+"\")' title='remove'>删除</button>";
                return str;
            }
        }, events:'operateEvents'
    }
];

var danmuLibraryRecovery = function (id,name) {
    if (confirm('确定要还原' + name + '广告弹幕库吗？')) {
        var obj = {
            'id': id
        }
        $.danmuAjax(url_pre+'/recovery', 'GET', 'json', obj, function (data) {
            if (data.result == 200) {
                init();
            } else {
                alert("活动未结束")
            }
        });
    }
}

var delAdDanmuLibrary = function (id,name) {
    if (confirm('确定要删除' + name + '广告弹幕库吗？如果删除,对应的广告弹幕文件一并被删除!!!')) {
        //判断弹幕库是否被使用
        var obj = {
            'id': id
        }
        $.danmuAjax(url_pre+'/del', 'GET', 'json', obj, function (data) {
            if (data.result == 200) {
                //window.location.href='/adDanmuLibrary';
                init();
            } else {
                alert("活动未结束")
            }
        });
    }

};


//加载广告旦暮库

//加载表格数据
function resetTable() {
    quaryObject.flg = $("#deleteFlg").val();
    quaryObject.pageNumber=1;
    $.initTable('tableList', columnsArray, quaryObject, tableUrl);
}
function init() {
    quaryObject.flg = $("#deleteFlg").val();
    $.initTable('tableList', columnsArray, quaryObject, tableUrl);
}

init();

