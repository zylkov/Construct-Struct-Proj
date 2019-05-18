


$(document).ready(function() {
    $('a[data-toggle="pill"]').on('shown.bs.tab', function (e) {
        let nameTab = $(e.target).text();
        
        nameTab==="Подпроекты" ? $(".mybtn-add").css("display", "block") : $(".mybtn-add").css("display", "none");
      })
});