$(function() {
    $('a.index-link').click(function(e) {
        e.preventDefault();
        let target = $(this).attr('href');
        $('html, body').animate({
            scrollTop: ($(target).offset().top - $('#khala-header').outerHeight()-10),
        }, 500)
    })
})