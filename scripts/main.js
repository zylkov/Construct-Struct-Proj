function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


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

function confirmModal(title = "Заголовок", question = "Вопрос?" , callbackAnswered = ()=>{}){
    return new Promise((resolve, reject) => {

        id = $("confirmModal").length + getRandomInt(0,100);

        htmlModal = `
        <div class="modal fade" id="confirmModal${id}" class="confirmModal" tabindex="-1" role="dialog" aria-labelledby="confirmModalTitle${id}" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title" id="confirmModalTitle${id}">Заголовок</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>
                <div class="modal-body">
                    
                <div class="form-group">
                    <label class="questionTextConfirm">Описание</label>
                </div>

                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-danger answerNo"  >Нет</button>
                <button type="button" class="btn btn-success answerYes" >Да</button>
                </div>
            </div>
            </div>
        </div> `;

        $("#modalContainer").append(htmlModal);

        modals = $(`#confirmModal${id}`);
        console.log("Я раб");
        modals.find(`#confirmModalTitle${id}`).text(title);
        modals.find(".questionTextConfirm").text(question);

        answerYes = modals.find(".answerYes");
        answerNo = modals.find(".answerNo");
        console.log(answerNo);
        answerYes.click(()=>{
            returnData = callbackAnswered(true);
            answerYes.off("click");
            modals.modal('hide');
            modals.on('hidden.bs.modal', function (e) {
                modals.modal('dispose');
                resolve(returnData);
            });
            
        });

        answerNo.click(()=>{
            returnData = callbackAnswered(false);
            answerNo.off("click");
            modals.modal('hide');
            modals.on('hidden.bs.modal', function (e) {
                modals.modal('dispose');
                resolve(returnData);
            });
            
        });
        modals.modal("show");
        
        
    });
}


$(document).ready(function() {

    $("#proptModal").keypress((e)=>{
        if(e.keyCode==13)
            $("#proptModal #answerOnQuestion").click();
    });

});