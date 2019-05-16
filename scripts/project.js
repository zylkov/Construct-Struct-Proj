$(document).ready(function() {
    console.log("HI");
    $("#tabToggle label").click((e)=>{
        e.preventDefault();
        let tabObj = $(this).find("input");
        console.log("jq obj",tabObj);
        tabObj.tab("show");
    });
});