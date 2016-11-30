var tableUrl = '/v1/api/admin/reward/page';
var columnsArray = [
    {
        title: '序号',
        align: 'center',
        formatter: function (value, row, index) {
            return index+1;
        }
    },
    {
        field: 'wechatUser.imgUrl',
        title: '微信头像',
        align: 'center',
        width:'30%',
        formatter: function (value, row, index) {
            return '<img width="30%" src="'+row.imgUrl+'" />';
        }
    },
    {
        field: 'wechatUser.nick',
        title: '微信昵称',
        align: 'center'
    },
    {
        field: 'party.name',
        title: '活动',
        align: 'center',
    },
    {
        field: 'wechatReward.total_fee',
        title: '金额',
        align: 'center',
    },
    {
        field: 'wechatReward.createTime',
        title: '时间',
        align: 'center',
    }
];
var quaryObject = {
    pageSize: 20
};

//加载表格数据
$.initTable('tableList', columnsArray, quaryObject, tableUrl);