$(function(){
    let isLoading = true;
    const SCAN_COUNT = 5;
    const isRunOut = false;
    
    LoadBoard(function() {
        ActMasonry();
        isLoading = false;
    });

    // Addform Textarea Resize >>
    $('textarea.board-item-text').on('change, keydown, keyup', function() {
        $('textarea.board-item-text').css('height', '1px');
        $('textarea.board-item-text').css('height', this.scrollHeight+'px');
        ActMasonry();
    })
    // << Addform Textarea Resize

    // Addform 활성화 >>
    $('.addform-active').click(function() {
        $('.khala-board-addform').addClass('act');
        // Addform의 내용을 post로 변경
        $('.khala-board-addform .addform-active').text('post');
        // Addform Active 버튼의 기능이 본래의 기능을 잃고 전송 기능을 이벤트로 가짐 >>
        $('.khala-board-addform .addform-active').click(function() {
            var replaceText = $('textarea.board-item-text').val();
            replaceText.replace(/(?:\r\n|\r|\n)/g,'<br/>')
            $('textarea.board-item-text').val(replaceText);
            document.querySelector('.khala-board-addform form').submit();
        });
        ActMasonry();
    })
    // << Addform 활성화

    // 비로그인 상태일 때 표시되는 posting button(addform-login)을 누르면 Login버튼으로 변경 >>
    $('.addform-login').click(function() {
        $('.khala-board-addform').addClass('act');
        $('.khala-board-addform .addform-login').text('login');
        $('.khala-board-addform .addform-login').click(function() {
            document.location.href = "/login.jsp";
        });
        ActMasonry();
    })
    // << 비로그인 상태일 때 표시되는 posting button(addform-login)을 누르면 Login버튼으로 변경

    // Scroll Event (Load additional posting) >>
    $(document).scroll(function(e) {
        if($('.khala-board-container').height()-$(window).height() < $(window).scrollTop()+($(window).height()/5)){
            if(!isLoading){
                $('.loading-icon').addClass('act');
                isLoading = true;
                LoadBoard(function(){
                    ActMasonry();
                    isLoading = false;
                });
            }
        };
    })
    // << Scroll Event (Load additional posting)

    // 글 삭제 event handler >>
    $(document).on('click', '.board-item-delete', function(e) {
        if(confirm('Only the author himself can delete the posting. Are you sure you want to delete the posting?')){
            const id = $(e.target).closest('.khala-board-item').attr('data-id');
            $.ajax({
                type: "post",
                url: "/board-delete-action.jsp",
                data: {
                    bbsId: id
                },
                dataType: "text",
                success: function (res) {
                    console.log(res)
                    alert('Success delete to posting.');
                    console.log($(e.target).closest('.khala-board-item'));
                    $(e.target).closest('.khala-board-item').remove();
                    ActMasonry();
                },
                error: function (error) {
                    console.dir(error);
                    alert('Only the author himself can delete the article.');
                }
            });
        }
    })
    // << 글 삭제 event handler

    // AJAX를 통해 board-load.jsp로부터 BoardAccess.LoadBoard()의 리턴값 받아오기 >>
    function LoadBoard(callback){
        let appentCount = 0;
        if(totalItemCount<=0){
            $('.khala-board-list').addClass('act');
            callback();
            HandlePostRunOut();
            return;
        }
        $.ajax({
            type: "post",
            url: "/board-load.jsp",
            data: {
                count: loadedCount,
                scanCount: loadedCount>SCAN_COUNT ? String(SCAN_COUNT) : loadedCount,
            },
            dataType: "text",
            success: function (response) {
                if(!JSON.parse(response)) {
                    HandlePostRunOut();
                    return;
                }
                const data = ObjectToArray(JSON.parse(response));
                console.log('langth:'+data);
                for(var i=0; i<Object.keys(data).length; i++){
                    totalItemCount--;
                    if(data[i].available=="1") {
                        const boardItemForm = `
                            <li class="khala-board-item" data-id="${ data[i].bbsId }" style="animation-delay: ${ 400+(50*appentCount)+'ms' }">
                                <div class="board-item-head">
                                    <h3 class="board-item-title">
                                    ${ data[i].title }
                                    </h3>
                                    <span class="board-item-created">
                                    ${ data[i].date }
                                    </span>
                                </div>
                                <div class="board-item-contents">
                                    <p class="board-item-text">
                                    ${ data[i].content.replace(/(\n|\r\n)/g, '<br>') }
                                    </p>
                                </div>
                                <div class="board-item-foot">
                                    <h4 class="board-item-writer">
                                        ${ data[i].userId }
                                    </h4>
                                    <input type="button" class="board-item-delete" value="delete">
                                </div>
                            </li>
                        `
                        if(i==(Object.keys(data).length-1)){
                            loadedCount=Number(data[i].bbsId)-1;
                        }
                        $('.khala-board-list').append(boardItemForm);
                        appentCount++;
                    }
                }
                $('.khala-board-list').addClass('act');
                $('.loading-icon').removeClass('act');
                callback();
            },
            error: function (error) {
                console.error(error);
            },
            complete: function () {
                callback();
                console.log($('.khala-board-list'));
            }
        });
    }
    // << AJAX를 통해 board-load.jsp로부터 BoardAccess.LoadBoard()의 리턴값 받아오기

    function HandlePostRunOut() {
        if(isRunOut) return;
        const FROM_POST_RUN_OUT = `
            <h2 class="board-notice-runout">
                Loaded all the posts! ¯\\_(ツ)_/¯
            </h2>
        `
        $('.khala-board-container').append(FROM_POST_RUN_OUT);
        $(document).off('scroll');
        $('.loading-icon').removeClass('act');
        isRunOut = true;
    }

    // Masonry 디자인 적용 >>
    function ActMasonry() {
        var msnry = new Masonry( '.khala-board-list', {
            // options
            itemSelector: '.khala-board-item',
            columnWidth: '.grid-sizer',
            gutter: 15
        });
    }
    // << Masonry 디자인 적용
    
    function ObjectToArray (obj){
        let returnArr = {};
        Object.keys(obj).sort((a, b) => b-a).forEach((key, index) => {
            returnArr[index] = obj[key];
        })
        return returnArr;
    }
})

