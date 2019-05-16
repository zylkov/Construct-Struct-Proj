function addHtmlProject(dataProjects, id, title, discription){
    let htmlProj=`
    <div id="project${id}" class="card project d-flex flex-column align-items-stretch">
        <div class="card-body flex-grow-2">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">${discription}</p>
        
        </div>
        <div class="card-buttons">
                <a href="/project/${id}" class="btn btn-primary mybtn-open">Открыть</a>
                <a href="#" class="btn btn-danger mybtn-remove">Удалить</a>
        </div>
    </div>`;

    let jqObjProj = $(htmlProj);

    jqObjProj.find(".mybtn-remove").click(()=>{
        
        let callbackRemoveProj = (result) =>
        {
            if(result){
                removeProject(dataProjects, id);
                removeHtmlProject(id);
            }
        }

        confirmModal("Удаление проекта",`Вы уверены что хотите удалить проект "${title}"`,callbackRemoveProj);
    });

    $(".projects").append(jqObjProj);
}

function removeHtmlProject(id){
    $(`.projects #project${id}`).remove();
}

function editHtmlProject(id, title, discription){
    let jqProjObj = $(`.projects #project${id}`);
    jqProjObj.find(".card-title").text(title);
    jqProjObj.find(".card-text").text(discription);
}

function showHtmlProjects(dataProjects){
    dataProjects.forEach(element => {
        addHtmlProject(dataProjects, element.id, element.title, element.discription);
    });
}

function addProject(dataProjects, id, title, discription){
    window.dataProjects.push({id, title, discription});
}

function removeProject(dataProjects, id){

    window.dataProjects = dataProjects.filter(proj => proj.id !== id);

}

function editProject(dataProjects, id, title, discription){
    let projIndex = dataProjects.findIndex(proj => proj.id === id);
    dataProjects[projIndex] = {id, title, discription};
}



$(document).ready(function() {
    dataProjects = [
        {
            id:1,
            title:"Проект1",
            discription:"Это проект"
        },
        {
            id:2,
            title:"Проект2",
            discription:"Это проект dsdsds"
        },
        {
            id:3,
            title:"Проект3",
            discription:"Это пfsfseewefwfewfewf"
        }
    ];

    showHtmlProjects(dataProjects);

    $(".navbar .mybtn-add").click(()=>{
        modals = $("#newProjectModal");
        modals.find(".mybtn-saveAdd").click(()=>{
            modals.modal('hide');
            let id = getRandomInt(0,100);
            let title = modals.find("#nameFormControlInput").val();
            let discription = modals.find("#discriptionFormControlTextarea").val();

            addProject(dataProjects, id, title, discription);
            addHtmlProject(dataProjects, id, title, discription);
            modals.find("mybtn-saveAdd").off("click");
        });
        modals.modal("show");
    });

});