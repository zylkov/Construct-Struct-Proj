function turnLoadingOnModal(modals, on){
    if(on){
        modals.find(".loading").removeClass("d-none").addClass("d-flex");
        modals.find(".loaded").addClass("d-none");
    }
    else{
        modals.find(".loading").removeClass("d-flex").addClass("d-none");
        modals.find(".loaded").removeClass("d-none");
    }
}

function promptModal(title = "Заголовок", question = "Вопрос?" , defualtAnswer = "", callbackAnswered = ()=>{}){
    modals = $("#proptModal");
    modals.find("#proptModalTitle").text(title);
    modals.find("#questionText").text(question);
    answerInput = modals.find("#answerInput");
    answerInput.val(defualtAnswer);

    button = modals.find("#answerOnQuestion");
    button.click(()=>{
        callbackAnswered(answerInput.val());
        modals.modal('hide');
        button.off("click");
    });

    modals.modal("show");

}


$(document).ready(function() {

    $("#proptModal").keypress((e)=>{
        if(e.keyCode==13)
            $("#proptModal #answerOnQuestion").click();
    });

});