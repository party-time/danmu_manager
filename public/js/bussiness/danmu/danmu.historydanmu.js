var tableUrl = '/api/historyDanmu/page';
var sendPrizeUrl = '/api/historyDanmu/addPrize';
var columnsArray = [
    {
        field: 'nick',
        title: '昵称',
        align: 'center'
    },
    {
        field: 'msg',
        title: '弹幕信息',
        halign: "center",
        align: "left"
    },
    {
        field: 'url',
        title: '图片',
        align: 'center',
        formatter: function (value, row, index) {
            return '<img src="' + value + '" style="width: 30px;height: 30px;"/>';
        }
    },
    {
        field: '', title: '操作',
        align: 'center',
        formatter: function (value, row, index) {
            if (row.send) {
                return '已发送';
            } else {
                return '<button type="button" class = "sendPrize" id="row_' + row.id + '">发奖品</button>';
            }
        },
        events: 'operateEvents'
    }
];
var quaryObject = {
    addressId: '580078b30cf28b271aea44e5',
    partyId: '581a9dc50cf2852c417a9b31'
};
//加载表格数据
$.initTable('tableList', columnsArray, quaryObject, tableUrl);

window.operateEvents = {
    'click .sendPrize': function (e, value, row, index) {
        var object = {
            'openId': row.openId,
            'danmuId': row.id,
            'addressId': '580078b30cf28b271aea44e5',
            'partyId': '581a9dc50cf2852c417a9b31'
        }
        $.danmuAjax(sendPrizeUrl, 'GET', object, function (data) {
            if (data.result == 200) {
                row.send = true;
                $('#tableList').bootstrapTable('updateRow', {index: index, row: row});
            }
        }, function (data) {
            console.log(data);
        });
    }
};
function sucess(data) {
    alert(data);
}
function error(data) {
    alert(data);
}