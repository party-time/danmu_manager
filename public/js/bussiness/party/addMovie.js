var findMovie = function(){
    $.danmuAjax('/v1/api/admin/spider/findMovie', 'GET','json',null, function (data) {
        if( data.result == 200){
            var movieList = data.data;
            for(var i=0;i<movieList.length;i++){
                $('#selectMovie').append("<option value='"+movieList[i].id+"'>"+movieList[i].name+" 评分:"+movieList[i].score+"</option>");
            }
        }
    }, function (data) {
        console.log(data);
    });
}

findMovie();