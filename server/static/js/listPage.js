(function () {
    var url = window.location.search,
        q = url.slice(1).split('&')[0].split('=')[1],
        page = url.slice(1).split('&')[1].split('=')[1],
        start = (parseInt(page) - 1) * 20;

    function getDataList() {
        $.ajax({
            type: 'GET',
            url: 'https://api.douban.com/v2/movie/search?q=' + q + '&start=' + start,
            dataType: 'jsonp',
            success: renderList,
            error: function () {
                console.error('请求失败');
            }
        })
    }
    getDataList();
    function renderList(data) {
        console.log(data);
        var dataArr = data.subjects,
            total = data.total;
            count = data.count,
            totalPages = Math.ceil(total / count),//总页数
            
            $Ul = $("<ul></ul>");
        dataArr.forEach(function (ele, index) {
            var $Li = $("<li></li>"),
                $A = $("<a href='./itemPage.html?id=" + ele.id + "'></a>"),
                $Img = $("<img src=" + ele.images.medium + ">"),
                $H1 = $('<h1 class="ls-title">' + ele.title + ' ' + ele.year + '年' + '</h1>'),
                $P = $('<p class="ls-content">' + '评分：' + (ele.rating.average == 0 ? '暂无评分' : ele.rating.average) + '</p>');
            $A.append($Img, $H1, $P);
            $Li.append($A);
            $Ul.append($Li);
        })
        $Ul.appendTo($('.list-data'));

        //渲染分页部分
        //function pages 。。。。
        // pageList(1, 12);
        pageList(page, totalPages);
    }

    function pageList(nowNum, allNum) {
        var $Div = $('.changePage');
        nowNum = parseInt(nowNum);
        // 首页
        if (nowNum > 5 && allNum >= 10) {
            var $A = document.createElement('a');
            $A.href = 'listPage.html?q=' + q + '&page=1';
            $A.innerHTML = '首页';
            $($A).addClass('non-active');
            $Div.append($A);
        }
        //上一页
        if (nowNum > 1) {
            var $A = document.createElement('a');
            $A.href = 'listPage.html?q=' + q + '&page=' + (nowNum - 1);
            $A.innerHTML = '上一页';
            $($A).addClass('non-active');
            $Div.append($A);
        }
        // 9个一组
        if (allNum <= 9) {
            for (var i = 1; i <= allNum; i++) {
                var $A = document.createElement('a');
                $A.href = 'listPage.html?q=' + q + '&page=' + i;
                if (nowNum === i) {
                    $A.innerHTML = i;
                    $($A).addClass('active');
                } else {
                    $A.innerHTML = i;
                    $($A).addClass('non-active');
                }
                $Div.append($A);
            }
        }else {
            // 以nowNum数为中心 一共 9个数  向左右两侧扩散5 - 1 个数
            for (var i = 1; i <= 9; i++) {
                var $A = document.createElement('a');
                // 当前页数 小于5 时 向左扩散会出现小于1的书 要做特殊处理
                if (nowNum < 5) {
                    $A.href = 'listPage.html?q=' + q + '&page=' + i;
                    if (nowNum === i) {
                        $A.innerHTML = i;
                        $($A).addClass('active');
                    } else {
                        $A.innerHTML = i;
                        $($A).addClass('non-active');
                    }
                } else if (allNum - nowNum < 4) {
                    // 最后几页向右扩散 时也会出问题  所以阻止扩散 只显示最后九页                        
                    $A.href = 'listPage.html?q=' + q + '&page=' + (allNum - 9 + i);
                    // 特殊处理后4几页
                    if ((allNum - nowNum) === 0 && i === 9) {
                        $A.innerHTML = allNum - 9 + i;
                        $($A).addClass('active');
                    } else if ((allNum - nowNum) === 1 && i === 8) {
                        $A.innerHTML = allNum - 9 + i;
                        $($A).addClass('active');
                    } else if ((allNum - nowNum) === 2 && i === 7) {
                        $A.innerHTML = allNum - 9 + i;
                        $($A).addClass('active');
                    } else if ((allNum - nowNum) === 3 && i === 6) {
                        $A.innerHTML = allNum - 9 + i;
                        $($A).addClass('active');
                    } else {
                        $A.innerHTML = (allNum - 9 + i);
                        $($A).addClass('non-active');
                    }
                } else {
                    // 正常处理方式 以nowNum为中心 向两侧扩散 4个数
                    $A.href = 'listPage.html?q=' + q + '&page=' + (nowNum - 5 + i);
                    if (i === 5) {
                        $A.innerHTML = nowNum - 5 + i;
                        $($A).addClass('active');
                    } else {
                        $A.innerHTML = (nowNum - 5 + i);
                        $($A).addClass('non-active');
                    }
                }
                $Div.append($A);
            }
        }
        // 尾页
        if ((allNum - nowNum) > 5) {
            var $A = document.createElement('a');
            $A.href = 'listPage.html?q=' + q + '&page=' + allNum;
            $A.innerHTML = '尾页';
            $($A).addClass('non-active');
            $Div.append($A);
        }
        // 下一页
        if ((allNum - nowNum) > 0) {
            var $A = document.createElement('a');
            $A.href = 'listPage.html?q=' + q + '&page=' + (nowNum + 1);
            $A.innerHTML = '下一页';
            $($A).addClass('non-active');
            $Div.append($A);
        }                                                                                                                   
    }

})()