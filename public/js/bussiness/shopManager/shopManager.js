var tableUrl = '/v1/api/admin/item/page';

var columnsArray = [
    {
        title: '序号',
        align: 'center',
        formatter: function (value, row, index) {
            return index+1;
        }
    },
    {
        field: 'name',
        title: '商品名称',
        align: 'center'
    },
    {
        title: '操作',
        align: 'center',
        formatter: function (value, row, index) {
            return '<a class="btn" onclick="openUpdateItem(\''+row.id+'\')">修改</a><a class="btn" onclick="delItem(\''+row.id+'\',\''+row.name+'\')">删除</a>';
        },
        events: 'operateEvents'
    }
];
var quaryObject = {
    pageSize: 20
};

var addItem = function(){
    window.location.href="/shopManager/add";
}

var openUpdateItem = function(id){
    window.location.href="/shopManager/update?id="+id;
}

var delItem = function(id,name){
     var obj = {
        id:id
     }
     if(confirm('确定要删除商品:'+name+'吗？')){
         $.danmuAjax('/v1/api/admin/item/del', 'GET','json',obj, function (data) {
            if(data.result == 200){
                window.location.href='/shopManager';
            }else{
                if(data.result_msg){
                    alert(data.result_msg)
                }else{
                    alert('删除失败')
                }
            }
        }, function (data) {
            console.log(data);
        });
     }
}

//加载表格数据
$.initTable('tableList', columnsArray, quaryObject, tableUrl);