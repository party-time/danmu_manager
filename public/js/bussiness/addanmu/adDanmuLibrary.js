var url_pre = '/v1/api/admin/adDanmuLibrary';
var tableUrl = url_pre+'/list';
var danmuLibraryList = [];
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
                return "已经删除";
            }else{
                var str="";
                str+="<button class='btn btn-danger remove' href='javascript:void(0)'  onclick='delAdDanmuLibrary(\""+row.id+"\",\""+row.name+"\")' title='remove'>删除</button> &nbsp;";
                str+="<a class='btn btn-info remove' href='/adDanmuLibrary/edit?id="+row.id+"' title='remove'>编辑</a>";
                return str;
            }
        }, events:'operateEvents'
    }
];
var quaryObject = {
    pageSize: 20
};


var delAdDanmuLibrary = function (id,name) {
    if (confirm('确定要删除' + name + '广告弹幕库吗？')) {
        //判断弹幕库是否被使用
        var obj = {
            'id': id
        }
        $.danmuAjax(url_pre+'/del', 'GET', 'json', obj, function (data) {
            if (data.result == 200) {
                window.location.href='/adDanmuLibrary';
            } else {
                alert("活动未结束")
            }
        });
    }

};




//加载广告旦暮库

//加载表格数据
$.initTable('tableList', columnsArray, quaryObject, tableUrl);
