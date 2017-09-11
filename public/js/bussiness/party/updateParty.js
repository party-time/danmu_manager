
var _update_partyId;
var _update_partyName;

var selectObjId,selectObjOption;

var findPartyById = function(){
    var url = location.href;
    var partyId = '';
    if(url.indexOf('id=')!=-1){
        partyId = url.substr(url.indexOf('=')+1);
        _update_partyId = partyId;
    }
    if('' != partyId){
        var obj = {
            'partyId': partyId
        }
        $.danmuAjax('/v1/api/admin/party/getUpdateParty', 'GET','json',obj, function (data) {
            if( data.result == 200){
                if(data.data){
                    $('#name').val(data.data.party.name);
                    _update_partyName = data.data.party.name;
                    $('#partyType').val(data.data.party.type);
                    selectMovie();
                    if(data.data.party.type == 1){
                         $('#movieAlias').append("<option value='"+data.data.movieAlias.value+"' selected>"+data.data.movieAlias.name+"</option>");

                    }else{
                        if( null != data.data.danmuAddressList ){
                            for( var i=0;i<data.data.danmuAddressList.length;i++){
                                var html = '<span class="_s'+data.data.danmuAddressList[i].id+'">'+data.data.danmuAddressList[i].name+'</span><a class="btn _a'+data.data.danmuAddressList[i].id+'" onclick="removeAddress(\''+data.data.danmuAddressList[i].id+'\')" addressId="'+data.data.danmuAddressList[i].id+'" isdb="1" >删除</a>';
                                if( i % 5 == 0){
                                    $('#selectAddress').append('<br>');
                                    $('#selectAddress').append(html);
                                }else{
                                    $('#selectAddress').append(html);
                                }
                            }

                        }
                    }
                    getAllDanmuLibrary(partyId);
                }else{
                    alert('查询失败');
                }
            }
        }, function (data) {
            console.log(data);
        });
    }else{
        alert('partyId不能为空');
    }
}
var dl_count=0;
var _danmuLibraryList;

var getAllDanmuLibrary = function(partyId,callback) {
    $.danmuAjax('/v1/api/admin/preDm/getAllLibraryNotInIds', 'GET','json',null, function (data) {
        if (data.result == 200) {
            _danmuLibraryList = data.data;
            var dl = {
                id:'0',
                name:'选择弹幕库'
            }
            _danmuLibraryList.unshift(dl);
        }
    });
    $.danmuAjax('/v1/api/admin/danmuLibraryParty/getAllByPartyId?partyId='+partyId, 'GET','json',null, function (data) {
        if (data.result == 200) {

           var partyDanmuLibraryList = new Array();
           if(data.data && data.data.length > 0){
                for( var i=0;i<data.data.length;i++){
                    var danmuLibrary = {
                        id:data.data[i].id,
                        densitry:data.data[i].densitry,
                        danmuLibraryId:data.data[i].danmuLibraryId
                    }
                    partyDanmuLibraryList.unshift(danmuLibrary);
                }
           }else{
               var danmuLibrary = {
                   id:'',
                   densitry:'',
                   danmuLibraryId:''
               }
               partyDanmuLibraryList.unshift(danmuLibrary);
           }
           $.danmuAjax('/v1/api/admin/preDm/getAllLibraryNotInIds', 'GET','json',null, function (data) {
                if (data.result == 200) {
                    var danmuLibraryList = data.data;
                    var selectHtml = '';
                    var dl = {
                         id:'0',
                         name:'选择弹幕库'
                    }
                    danmuLibraryList.unshift(dl);
                    for( var i=0;i<partyDanmuLibraryList.length;i++){
                        selectHtml += '<select class="dlSelect"  style="width: 100px;margin-bottom: 0px;" id="danmuLibraryId'+i+'" onchange="changeDmSelect(this)">';
                        for(var j=0;j<danmuLibraryList.length;j++){
                              if( danmuLibraryList[j].id ==  partyDanmuLibraryList[i].danmuLibraryId){
                                    selectHtml += '<option value='+danmuLibraryList[j].id+' selected>'+danmuLibraryList[j].name+'</option>';
                              }else{
                                    selectHtml += '<option value='+danmuLibraryList[j].id+'>'+danmuLibraryList[j].name+'</option>';
                              }
                        }
                        selectHtml += '</select>';
                        selectHtml +='<input type="text" class="dlText" style="width:20px;" maxLength="2" value="'+partyDanmuLibraryList[i].densitry+'" danmuParty="'+partyDanmuLibraryList[i].id+'"/>';
                        selectHtml += '<a class="btn rmDmL" onclick="delDmLibrary(this)" style="">-</a>';

                        ++dl_count;
                    }
                    $('#selectPreDm').html(selectHtml);
                    for(var i=0;i<partyDanmuLibraryList.length;i++){
                        var dmSelect = $('#danmuLibraryId'+i);
                        for( var j=0;j<partyDanmuLibraryList.length;j++){
                            if( $('#danmuLibraryId'+i).val() != partyDanmuLibraryList[j].danmuLibraryId){
                                $('#danmuLibraryId'+i+' option[value='+partyDanmuLibraryList[j].danmuLibraryId+']').remove();
                            }

                        }
                    }
                    if( callback ){
                        callback();
                    }

                }else{
                    alert(data.result_msg);
                }
           }, function (data) {
                console.log(data);
            });

        } else {
            alert(data.result_msg);
        };
    }, function (data) {
        console.log(data);
    });
}

var addDanmuLibrary = function() {
    if( dl_count >= 3){
        alert('只能增加3个弹幕库');
        return;
    }
    var dmLibrarySelectList = new Array();
    if($('.dlSelect')){
        $('.dlSelect').each(function(){
            if($(this).val()!=0){
                dmLibrarySelectList.unshift($(this).val());
            }
        });
    }
    var selectHtml = '<select class="dlSelect"  style="width: 100px;margin-bottom: 0px;" id="danmuLibraryId'+dl_count+'" onchange="changeDmSelect(this)">';
    var selectoption = '';
    if( null != _danmuLibraryList){
       for( var i=0;i<_danmuLibraryList.length;i++){
            if( dl_count == 1){
                 console.log(_danmuLibraryList[i].id);
                if(_danmuLibraryList[i].id ==0 || _danmuLibraryList[i].id != $('#danmuLibraryId'+0).val()){
                    selectHtml += '<option value='+_danmuLibraryList[i].id+'>'+_danmuLibraryList[i].name+'</option>';
                }
            }else if( dl_count == 2){
                if(   _danmuLibraryList[i].id ==0 || _danmuLibraryList[i].id != $('#danmuLibraryId'+0).val() && _danmuLibraryList[i].id != $('#danmuLibraryId'+1).val()  ){
                     selectHtml += '<option value='+_danmuLibraryList[i].id+'>'+_danmuLibraryList[i].name+'</option>';
                }
            }
       }
    }
    selectHtml += '</select>';
    selectHtml +='<input type="text" class="dlText" style="width:20px;" maxLength="2"/>';
    if($('#selectPreDm').html() == ''){
        $('#selectPreDm').html(selectHtml);
    }else{
        if(dl_count == 1){
            selectHtml = '<a class="btn rmDmL" onclick="delDmLibrary(this)">-</a>'+selectHtml+'<a class="btn rmDmL" onclick="delDmLibrary(this)">-</a>';
        }else{
            selectHtml += '<a class="btn rmDmL" onclick="delDmLibrary(this)">-</a>';
        }
        $('#selectPreDm').append(selectHtml);
    }
    dl_count++;
}

var changeDmSelect = function(obj){
    var option = $(obj).val();
    var thisId = $(obj).attr('id');
    if(dl_count > 0 ){
        for(var i=0;i<dl_count;i++){
            var thisVal = $('#danmuLibraryId'+i).val();
            var selectHtml = '';
            if(thisId != 'danmuLibraryId'+i){
                $('#danmuLibraryId'+i).empty();
                selectHtml = '<select class="dlSelect"  style="width: 100px;margin-bottom: 0px;" id="danmuLibraryId'+dl_count+'" onchange="changeDmSelect(this)">';
                if( null != _danmuLibraryList){
                   var danmuLibraryList = new Array();
                   for( var j=0;j<_danmuLibraryList.length;j++){
                        console.log('i:'+i+',dl_count:'+dl_count);
                        if( i==0 && dl_count == 2){
                            if(_danmuLibraryList[j].id != $('#danmuLibraryId'+1).val() ){
                                danmuLibraryList.push(_danmuLibraryList[j]);
                            }
                        }else if(i==0 && dl_count == 3){
                             if(_danmuLibraryList[j].id != $('#danmuLibraryId'+1).val() && _danmuLibraryList[j].id != $('#danmuLibraryId'+2).val()){
                                danmuLibraryList.push(_danmuLibraryList[j]);
                             }
                        }
                        if( i==1 && dl_count == 2){
                            if(_danmuLibraryList[j].id != $('#danmuLibraryId'+0).val()){
                                danmuLibraryList.push(_danmuLibraryList[j]);
                            }
                        }else if( i==1 &&  dl_count == 3){
                           if(_danmuLibraryList[j].id != $('#danmuLibraryId'+0).val() && _danmuLibraryList[j].id != $('#danmuLibraryId'+2).val() ){
                               danmuLibraryList.push(_danmuLibraryList[j]);
                           }
                        }
                        if( i==2 && dl_count == 2){
                            if(_danmuLibraryList[j].id != $('#danmuLibraryId'+0).val()){
                                danmuLibraryList.push(_danmuLibraryList[j]);
                            }
                        }else if(i==2 && dl_count == 3){
                            if(_danmuLibraryList[j].id != $('#danmuLibraryId'+0).val() && _danmuLibraryList[j].id != $('#danmuLibraryId'+1).val()){
                                danmuLibraryList.push(_danmuLibraryList[j]);
                            }
                        }
                   }

                   for(var j=0;j<danmuLibraryList.length;j++){
                        if(j==0){
                            if(danmuLibraryList[j].id !=0){
                                selectHtml += '<option value="0">选择弹幕库</option>';
                            }
                        }
                        selectHtml += '<option value='+danmuLibraryList[j].id+'>'+danmuLibraryList[j].name+'</option>';
                   }
                }
                selectHtml += '</select>';
                $('#danmuLibraryId'+i).html(selectHtml);
                $('#danmuLibraryId'+i).val(thisVal);
            }
        }
    }
}


var delDmLibrary = function(obj){
    var id = $(obj).prev('.dlText').attr('danmuParty');
    $.danmuAjax('/v1/api/admin/danmuLibraryParty/del?id='+id, 'GET','json',null, function (data) {
        if( data.result == 200){
            var thisId = $(obj).attr('id');
                $(obj).prev('.dlText').remove();
                $(obj).prev('.dlSelect').remove();
                if(dl_count == 2){
                     $(obj).prev('.btn.rmDmL').remove();
                }
                $(obj).remove();
                for(var i=0;i<dl_count+1;i++){
                    var thisVal = $('#danmuLibraryId'+i).val();
                    var selectHtml = '';

                    $('#danmuLibraryId'+i).empty();
                    selectHtml = '<select class="dlSelect"  style="width: 100px;margin-bottom: 0px;" id="danmuLibraryId'+dl_count+'" onchange="changeDmSelect(this)">';
                    if( null != _danmuLibraryList){
                       var danmuLibraryList = new Array();
                       for( var j=0;j<_danmuLibraryList.length;j++){
                            console.log('i:'+i+',dl_count:'+dl_count);
                            if( i==0 && dl_count == 2){
                                if(_danmuLibraryList[j].id != $('#danmuLibraryId'+1).val() ){
                                    danmuLibraryList.push(_danmuLibraryList[j]);
                                }
                            }else if(i==0 && dl_count == 3){
                                 if(_danmuLibraryList[j].id != $('#danmuLibraryId'+1).val() && _danmuLibraryList[j].id != $('#danmuLibraryId'+2).val()){
                                    danmuLibraryList.push(_danmuLibraryList[j]);
                                 }
                            }
                            if( i==1 && dl_count == 2){
                                if(_danmuLibraryList[j].id != $('#danmuLibraryId'+0).val()){
                                    danmuLibraryList.push(_danmuLibraryList[j]);
                                }
                            }else if( i==1 &&  dl_count == 3){
                               if(_danmuLibraryList[j].id != $('#danmuLibraryId'+0).val() && _danmuLibraryList[j].id != $('#danmuLibraryId'+2).val() ){
                                   danmuLibraryList.push(_danmuLibraryList[j]);
                               }
                            }
                            if( i==2 && dl_count == 2){
                                if(_danmuLibraryList[j].id != $('#danmuLibraryId'+0).val()){
                                    danmuLibraryList.push(_danmuLibraryList[j]);
                                }
                            }else if(i==2 && dl_count == 3){
                                if(_danmuLibraryList[j].id != $('#danmuLibraryId'+0).val() && _danmuLibraryList[j].id != $('#danmuLibraryId'+1).val()){
                                    danmuLibraryList.push(_danmuLibraryList[j]);
                                }
                            }
                       }

                       for(var j=0;j<danmuLibraryList.length;j++){
                            if(j==0){
                                if(danmuLibraryList[j].id !=0){
                                    selectHtml += '<option value="0">选择弹幕库</option>';
                                }
                            }
                            selectHtml += '<option value='+danmuLibraryList[j].id+'>'+danmuLibraryList[j].name+'</option>';
                       }
                    }
                    selectHtml += '</select>';
                    $('#danmuLibraryId'+i).html(selectHtml);
                    $('#danmuLibraryId'+i).val(thisVal);

                }
                dl_count--;
        }else{
            alert('删除失败');
        }
    }, function (data) {
        console.log(data);
    });

}

var initMovieAlias = function(){
    $.danmuAjax('/v1/api/admin/party/movieAlias', 'GET','json',null, function (data) {
        if( data.result == 200){
            var movieAliasList = data.data;
            for(var i=0;i<movieAliasList.length;i++){
                $('#movieAlias').append("<option value='"+movieAliasList[i].value+"'>"+movieAliasList[i].name+"</option>");
            }
        }
    }, function (data) {
        console.log(data);
    });
}

var selectMovie = function(){
    var partyType = $('#partyType').val();
    if(partyType == 0){
        $('#movieTable').hide();
        $('#partyTable').show();
        $('#selectAddressTable').show();
    }else{
        $('#movieTable').show();
        $('#partyTable').hide();
        $('#selectAddressTable').hide();
    }
}

var openAddress = function(){
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
                return '<a class="btn" onclick="selectAddress(\''+row.id+'\',\''+row.name+'\')">选择</a>';
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

var selectAddress = function(id,name){
    var html = '<span class="_s'+id+'">'+name+'</span><a class="btn _a'+id+'" onclick="removeAddress(\''+id+'\')" addressId="'+id+'">删除</a>';
    var spanList = $('#selectAddress').children('span');
    if(spanList.length % 5 == 0){
        $('#selectAddress').append('<br>');
        $('#selectAddress').append(html);
    }else{
        $('#selectAddress').append(html);
    }
    openAddress();

}

var removeAddress = function(id){
    var isDb = $('.btn._a'+id).attr('isdb');
    if( null != isDb){
        var obj = {
            partyId:_update_partyId,
            addressId:id
        }
        $.danmuAjax('/v1/api/admin/partyAddressRelation/delByPartyIdAndAddressId', 'GET','json',obj, function (data) {
            if(data.result == 200) {
              console.log(data);
              alert('删除成功');
             }else{
                alert('删除失败');
             }
        }, function (data) {
            console.log(data);
        });
    }
    $('._s'+id).remove();
    $('.btn._a'+id).remove();
    var spanList = $('#selectAddress').children('span');
    if(spanList.length ==0){
        $('#selectAddress').empty();
    }
}

var findPartyByName = function(){
    var name = $('#name').val();
    if('' != name){
        if( name != _update_partyName){
            var obj = {
                'name': name
            }
            $.danmuAjax('/v1/api/admin/party/name', 'GET','json',obj, function (data) {
                if( data.result == 200){
                    if(data.data){
                        if(!$('#name').parent().children('.help-block').html()){
                            $('#name').after('<p class="help-block" style="color:red">活动名称重复</p>');
                        }
                        $('#saveParty').attr('disabled',true);
                    }else{
                        if($('#name').parent().children('.help-block').html()){
                            $('#name').parent().children('.help-block').remove();
                        }
                        $('#saveParty').attr('disabled',false);
                    }
                }
            }, function (data) {
                console.log(data);
            });
        }
    }else{
        if(!$('#name').parent().children('.help-block').html()){
            $('#name').after('<p class="help-block" style="color:red">活动名称不能为空</p>');
        }
    }
};

var saveParty = function(){
    var partyType = $('#partyType').val();
    var densitrys='',ids='',idNum=0,densitryNum=0;

     var dlTextMsg= '';
     var dlCount=0;
    if($('.dlSelect')){
        $('.dlSelect').each(function(){
            if($(this).val()!=0){
                ids += $(this).val();
                ids += ',';
                idNum++;
                var densitry = $(this).next('.dlText').val();
                if( densitry == ''){
                     dlTextMsg='请填写弹幕密度';
                     return;
                }
                var reg = /^[0-9]*$/g;
                if(!reg.test(densitry)){
                    dlTextMsg='弹幕密度只能为正整数';
                    return;
                }

                if(densitry==0){
                    dlTextMsg='弹幕密度不能为0';
                    return;
                }
                dlCount += parseInt(densitry);
                densitrys += ''+densitry;
                densitrys += ',';
                densitryNum++;
            }else{
                var densitry = $(this).next('.dlText').val();
                if( densitry ){
                    dlTextMsg='如果填写了弹幕密度，请选择弹幕库';
                    return;
                }
            }
        });
        if( ids != ''){
            ids = ids.substr(0,ids.length-1);
        }
        if( densitrys != ''){
            densitrys = densitrys.substr(0,densitrys.length-1);
        }
    }

    if( dlTextMsg != ''){
        alert(dlTextMsg);
        return;
    }
    if( dlCount > 15){
        alert('弹幕密度总数不能大于15');
        return;
    }
    if( ids != '' ){
        if( densitrys == ''){
            alert('请填写弹幕密度');
            return;
        }
        if(idNum != densitryNum){
            alert('请填写弹幕密度');
            return;
        }
    }

    if( partyType == 0){
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

        if( aList.length == 0){
            alert("请选择场地");
            return;
        }

        var obj = {
            'name': $('#name').val(),
            'type':partyType,
            'addressIds':addressIds,
            'id':_update_partyId,
            'densitrys':densitrys,
            'ids':ids
        }
        findPartyByName();
    }else{

        var obj = {
            'name': $('#name').val(),
            'type':partyType,
            'movieAlias': $('#movieAlias').val(),
            'densitrys':densitrys,
            'ids':ids,
            'id':_update_partyId
        }

        findPartyByName();
        //findPartyByShortName();
    }


    if(!$('.help-block').html()){
        $.danmuAjax('/v1/api/admin/party/save', 'POST','json',obj, function (data) {
            if( data.result == 200){
                window.location.href='/party/resource?partyId='+data.data.id+"&type="+partyType;
            }else{
                if(data.result_msg){
                    alert(data.result_msg)
                }else{
                    alert('保存失败')
                }
            }
        }, function (data) {
            console.log(data);
        });
    }else{
        $('#saveParty').attr('disabled',true);
    }
}

var returnPartyList = function(){
    window.location.href='/party/';
}


initMovieAlias();
findPartyById();