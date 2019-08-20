


$(document).ready(function() {
  window.dataProject ={
    infoDataCreated:"2010-01-01",
    infoDiscription:"Это проект",
    title:"Проект1"
  }

  instalizationData();

  $('a[data-toggle="pill"]').on('shown.bs.tab', function (e) {
      let nameTab = $(e.target).text();
      
      nameTab==="Подпроекты" ? $(".mybtn-add").css("display", "block") : $(".mybtn-add").css("display", "none");
      if(nameTab==="Настройки"){
        $("#info-title-edit").val(window.dataProject.title);
        $("#info-discription-edit").val(window.dataProject.infoDiscription);
      }
  });

  $("#btn-info-save-changes").click(() => { 
    window.dataProject.title =  $("#info-title-edit").val();
    window.dataProject.infoDiscription = $("#info-discription-edit").val();
    instalizationData();
  });

});

function instalizationData(){
  $("#info-title .card-body .card-text").text(window.dataProject.title);
  $("#info-data-created .card-body .card-text").text(window.dataProject.infoDataCreated);
  $("#info-discription .card-body .card-text").text(window.dataProject.infoDiscription);


}