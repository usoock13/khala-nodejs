$(function() {
    // perspective(200rem)
    // rotateX(6deg)
    // rotateY(-45deg) rotateY(45deg)
    let HORISONTAL_COEFF = 18/$(window).height();
    let VERTICAL_COEFF = 70/$(window).width();
    const DEFAULT_TRANSFORM = "perspective(200rem) ";

    let contentsIndex = 0;
    const MAX_CONTENTS_INDEX = $('.intro-image-item.contents img').length;

    $(document).mousemove(function(e) {

        $('.intro-image-item').css(
            'transform', `${DEFAULT_TRANSFORM} 
            rotateX(${HORISONTAL_COEFF*(-e.pageY)+9}deg) 
            rotateY(${VERTICAL_COEFF*e.pageX-35}deg)`
        );
        $('.intro-image-item.frame').css('top', (-HORISONTAL_COEFF*(-e.pageY)-9*2));
        $('.intro-image-item.frame').css('left', -(VERTICAL_COEFF*e.pageX-35));

        $('.intro-image-item.contents').css('top', (-HORISONTAL_COEFF*(-e.pageY)-9)*2);
        $('.intro-image-item.contents').css('left', VERTICAL_COEFF*e.pageX-35);
        
        $('.intro-image-item.shadow').css('top', (-HORISONTAL_COEFF*(-e.pageY)-9));
        $('.intro-image-item.shadow').css('left', (VERTICAL_COEFF*e.pageX-35)/2);
    })

    setInterval(function(){
        contentsIndex = (contentsIndex+1) % MAX_CONTENTS_INDEX;
        $('.intro-image-item.contents img').removeClass('act');
        $('.intro-image-item.shadow img').removeClass('act');
        
        $('.intro-image-item.contents img').eq(contentsIndex).addClass('act');
        $('.intro-image-item.shadow img').eq(contentsIndex).addClass('act');
    }, 4000)
})