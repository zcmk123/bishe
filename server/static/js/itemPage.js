(function () {
    var url = window.location.search,
    id = url.slice(1).split('=')[1];
    console.log(id);

    function getDataList() {
        $.ajax({
            type: 'GET',
            url: 'https://api.douban.com/v2/movie/subject/' + id,
            dataType: 'jsonp',
            success: renderPage,
            error: function () {
                console.error('请求失败');
            }
        })
        function renderPage (data) {
            console.log(data);
            var movContent = $(".mov-content"),
            dataRating = data.rating.average == 0 ? '(暂无评分)' : data.rating.average;
            
            $Content = $("<div class='content'></div>");
            $Title = $("<h1>"+ data.title + "    " + "评分:" + dataRating +"</h1>");
            $Summary = $("<p>"+ data.summary +"</p>");
            $Img = $("<img src="+ data.images.medium +"></img>");
                   
            movContent.append($Img, $Content.append($Title, $Summary));
        }
    }
    getDataList();
})()