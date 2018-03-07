(function () {
    var searchSug = $('.search-suggest'),
        timer = null;

    // function deBounce(func, delay) {
    //     clearTimeout(timer);
    //     timer = setTimeout(func, delay);
    // }
    
    function deBounce (func, delay) {
        var timer = null;
        return function () {
            //console.log(delay);
            var _this = this;
            clearTimeout(timer);
            timer = setTimeout(func.bind(_this), delay);           
        }
    }
    
    $('#input-text').keyup(deBounce(getDataList, 500));
       
    // deBounce1(function() {
    //     console.log(this);
    // }, 1000)

    
    function getDataList() {
        $.ajax({
            type: 'GET',
            url: 'https://api.douban.com/v2/movie/search?q=' + $('#input-text').val() + '&count=7',
            dataType: 'jsonp',
            success: renderList,
            error: function () {
                console.error('请求失败');
            }
        })
        function renderList(data) {
            console.log(data);
            if (data.count > 0) {
                searchSug.html('');
                var tempStr = '';
                var sgUl = $("<ul></ul>");
                data = data.subjects;
                data.forEach(function (ele, index) {
                    var $Li = $("<li></li>"),
                        $A = $("<a href='./itemPage.html?id=" + ele.id + "'></a>"),
                        $Img = $("<img src=" + ele.images.small + ">"),
                        $P1 = $("<p>" + ele.title + "</p>");
                    sgUl.append($Li.append($A.append($Img, $P1)));
                })
                sgUl.appendTo(searchSug);
                searchSug.css('display', 'block');
            }else {
                searchSug.css('display', 'none');
            }
        }

        $('.sub-btn').on('click', function (e) {
            e.preventDefault();
            //console.log(e);
            window.location.href = 'listPage.html?q=' + $('#input-text').val() + '&page=1';
        })
    }
})()