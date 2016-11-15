var tableUrl = '/v1/api/admin/address/page';
var columnsArray = [
    {
        field: 'name',
        title: '名称',
        align: 'center'
    },
    {
        field: 'cityId',
        title: '城市',
        halign: "center",
        align: "center",
        formatter:function(value, row, index){
            for (var i = 0; i < _cities.length; i++) {
                if (_cities[i].CityID == row.cityId) {
                    return _cities[i].name;
                }
            }
            return '-';
        }
    },
    {
        field: 'address',
        title: '地址',
        align: 'center',
    },
    {
        field: 'id', title: '操作',
        align: 'center',
        formatter: function (value, row, index) {
            return '<a class="btn" >删除</a><a class="btn" >修改</a><a class="btn" >屏幕管理</a>'
        },
        events: 'operateEvents'
    }
];
var quaryObject = {
    pageSize: 20
};

//加载表格数据
$.initTable('tableList', columnsArray, quaryObject, tableUrl);