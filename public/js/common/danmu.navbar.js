var drawNavbar = function(){
    var htmlStr = '<li><a href="/party"><i class="icon-gamepad"></i><span>活动管理</span> </a> </li>';
        htmlStr += '<li><a href="/cinema"><i class="icon-film"></i><span>影院管理</span> </a> </li>';
        htmlStr += '<li><a href="/user"><i class="icon-user"></i><span>用户管理</span> </a></li>';
        htmlStr +='<li><a href="/blockword"><i class="icon-bar-chart"></i><span>屏蔽词管理</span> </a> </li>';
        htmlStr +='<li><a href="/predanmu"><i class="icon-list-alt"></i><span>预制弹幕管理</span> </a> </li>';
        htmlStr +='<li><a href="/adDanmuLibrary"><i class="icon-play-circle"></i><span>广告管理</span> </a> </li>';
        htmlStr += '<li><a href="/wechat"><i class="icon-camera"></i><span>微信自动回复管理</span> </a> </li>';
        htmlStr += '<li><a href="/reward"><i class="icon-font"></i><span>打赏管理</span> </a> </li>';
        var nick = $.cookie('nick');
        if(nick == '管理员'){
            htmlStr +=  '<li><a href="/adminmanager"><i class="icon-bold"></i><span>管理员管理</span> </a> </li>';
        }
    $('.mainnav').html(htmlStr);
}

