$(function(){
    LanguageEvent();
    AvatarEvnet();
    $('.khala-setting-createRoom').click(function(){
        if(getParam('room-no')){
            OnSubmit('/room?room-no='+getParam('room-no'));
        } else {
            OnSubmit('/create-room');
        }
    })
    $('.khala-setting-apply').click(function(){
        OnSubmit('/');
    })
    $('.khala-setting-cancel').click(function(){
        location.href = '/';
    })
})
// 언어 정보 설정
function LanguageEvent(){
    $('.khala-setting-language>ul>li').click(function(e){
        let langData = $(e.target).attr('data-lang');
        if(langData){
        	// 클릭된 언어로 세팅
            $('.khala-setting p').text($(e.target).text());
            $('.khala-setting p').attr('data-lang', $(e.target).attr('data-lang'));
        }
        // 언어 세팅박스 off
        if($('.khala-setting-language').attr('class').indexOf('active')>=0);{
            $('.khala-setting-language').removeClass('active');
        }
    })// 언어 세팅박스 on
    $('.khala-setting-language p').click(function(){
        $('.khala-setting-language').addClass('active');
    })
}
//선택된 아바타에 select 클래스 부여
function AvatarEvnet(){
    $('.khala-setting-avatar>ul>li').click(function(e){
        let items = $('.khala-setting-avatar>ul>li');
        let index = items.index(this);
        items.removeClass('select');
        items.eq(index).addClass('select');
    })
}
//선택된 아이템으로 쿠키생성
function OnSubmit(targetPath){
    let nickname = $('.khala-setting-item input[type="text"]').val();
    let language = $('.khala-setting-language-selected').attr('data-lang');
    let avatar = $('.khala-setting-avatar>ul>li').index($('.khala-setting-avatar>ul>li.select'));
    let khalaConfig = JSON.stringify({
        "nickname": nickname,
        "language": language,
        "avatar": avatar
    })
    console.log(language)
    document.cookie = `khala-config=${khalaConfig}; path=/`;
    location.href = targetPath;
}
function getParam(sname) {
    var params = location.search.substr(location.search.indexOf("?") + 1);
    var sval = "";
    params = params.split("&");
    for (var i = 0; i < params.length; i++) {
        temp = params[i].split("=");
        if ([temp[0]] == sname) { sval = temp[1]; }
    }
    return sval;
}