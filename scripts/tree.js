//helper functions, it turned out chrome doesn't support Math.sgn() 
function signum(x) {
    return (x < 0) ? -1 : 1;
}
function absolute(x) {
    return (x < 0) ? -x : x;
}


function drawPath(svg, path, startX, startY, endX, endY) {
    // get the path's stroke width (if one wanted to be  really precize, one could use half the stroke size)
    var stroke =  parseFloat(path.attr("stroke-width"));
    
    // check if the svg is big enough to draw the path, if not, set heigh/width
    if (svg.attr("height") <  endY)                 svg.attr("height", endY + stroke);
    if (svg.attr("width" ) < (startX + stroke) )    svg.attr("width", (startX + stroke));
    if (svg.attr("width" ) < (endX   + stroke) )    svg.attr("width", (endX   + stroke));
    
    path.attr("d", `M ${startX},${startY} 
    l 0,${endY-startY-15} 
    q 0,15 15,15
    l ${endX-startX-15},0`);
}

function connectElements(svg, path, startElem, endElem) {
    var svgContainer= $("#svgContainer");

    // if first element is lower than the second, swap!
    if(startElem.offset().top > endElem.offset().top){
        var temp = startElem;
        startElem = endElem;
        endElem = temp;
    }

    // get (top, left) corner coordinates of the svg container   
    var svgTop  = svgContainer.offset().top;
    var svgLeft = svgContainer.offset().left;

    // get (top, left) coordinates for the two elements
    var startCoord = startElem.offset();
    var endCoord   = endElem.offset();

    // calculate path's start (x,y)  coords
    // we want the x coordinate to visually result in the element's mid point
    var startX = startCoord.left + 0.5*startElem.outerWidth() - svgLeft;    // x = left offset + 0.5*width - svg's left offset
    var startY = startCoord.top  + startElem.outerHeight() - svgTop;        // y = top offset + height - svg's top offset

        // calculate path's end (x,y) coords
    var endX = endCoord.left + 0.5*endElem.outerWidth() - svgLeft;
    var endY = endCoord.top  - svgTop;

    // call function for drawing the path
    drawPath(svg, path, startX, startY, endX, endY);

}

function connectChild(svg, path, startElem, endElem) {
    var svgContainer= svg;

    // if first element is lower than the second, swap!
    if(startElem.offset().top > endElem.offset().top){
        var temp = startElem;
        startElem = endElem;
        endElem = temp;
    }

    // get (top, left) corner coordinates of the svg container   
    var svgTop  = svgContainer.offset().top;
    var svgLeft = svgContainer.offset().left;

    // get (top, left) coordinates for the two elements
    var startCoord = startElem.offset();
    var endCoord   = endElem.offset();

    // calculate path's start (x,y)  coords
    // we want the x coordinate to visually result in the element's mid point
    var startX = startCoord.left + 0.5*startElem.outerWidth() - svgLeft;    // x = left offset + 0.5*width - svg's left offset
    var startY = startCoord.top  + startElem.outerHeight() - svgTop;        // y = top offset + height - svg's top offset

        // calculate path's end (x,y) coords
    var endX = endCoord.left  - svgLeft;
    var endY = endCoord.top + 0.5*startElem.outerHeight() - svgTop;

    // call function for drawing the path
    drawPath(svg, path, startX, startY, endX, endY);

}

function createPath(svg, id){
    
    path = document.createElementNS("http://www.w3.org/2000/svg","path");
    path.setAttribute("id",id);
    path.setAttribute("d","M0 0");
    path.setAttribute("stroke","#000");
    path.setAttribute("fill","none");
    path.setAttribute("stroke-width","3px");
    document.getElementById("svg1").appendChild(path);
}

function connectChildNode(idparent, idchild){
    svg = $("#svg1");
    createPath(svg,`path${idchild}`);
    path=$(`#path${idchild}`);
    
    startElem = $(`#block${idparent} .parent .node .title`).first();
    
    endElem = $(`#block${idchild} .parent .node .title`).first();
   
    connectChild(svg, path, startElem, endElem);
}

function removeConnectNode(idchild){
    path=$(`#path${idchild}`);
    path.remove();
}

function removeConnectChildNodes(tree, root, childrens){ 
    childrens.forEach(function(node){
        removeConnectNode(node.model.id);
        nodeChildren = getChildrensNode(tree, root, node.model.id);

        if(nodeChildren.length > 0)
            removeConnectChildNodes(tree, root, nodeChildren);
    });
}

function updateConnectChildNode(idparent, idchild){
    svg = $("#svg1");
    path=$(`#path${idchild}`);

    startElem = $(`#block${idparent} .parent .node .title`).first();
    endElem = $(`#block${idchild} .parent .node .title`).first();
    connectChild(svg, path, startElem, endElem);
}

function addHTMLBlock(el,id,title){
    
    htmlblock=`
    <div class="block" id="block${id}">
        <div class="parent">
            <div class="node">
                <div class="title">
                    <div class="text">
                        ${title}
                    </div>
                </div>
                <div class="tool">
                    <button class="MyBtn MyBtn-info btn btn-outline-info btn-sm">
                    Информация
                    </button>
                    <button class="MyBtn MyBtn-addchild btn btn-outline-success btn-sm">
                    Добавить
                    </button>
                    <button class="MyBtn MyBtn-addfunct btn btn-outline-success btn-sm">
                    Добавить Функцию
                    </button>
                    
                    <button class="MyBtn MyBtn-editchild btn btn-outline-warning btn-sm">
                    Редактировать
                    </button>
                    <button class="MyBtn MyBtn-move btn btn-outline-warning btn-sm">
                    Вырезать
                    </button>
                    <button class="MyBtn MyBtn-paste btn btn-primary btn-sm" style="display:none;">
                    Вставить
                    </button>

                    <button class="MyBtn MyBtn-remove btn btn-outline-danger btn-sm">
                    Удалить
                    </button>
                </div>
            </div>

            <div class="list-funct">
            </div>

        </div>

        <div class="childrens">
        </div>
    </div>`;
    
    el.append(htmlblock);

}

function showChildBlock(idparent,id,title){
    parent = $(`#block${idparent} .childrens `).first();
    addHTMLBlock(parent,id,title);
}

function showChangeTitleBlock(id, title){
    block = $(`#block${id} .parent .node .title .text`).first();
    block.text(title);
}

function removeBlock (id){
    block = $(`#block${id}`);
    block.remove();
}


function addHTMLFunct(el,id,title){
    htmlblock=`
    <div class="funct" id="funct${id}">

              <div class="title">
                <div class="text">
                  ${title}
                </div>
              </div>

              <div class="tool">
                <button class="MyBtn MyBtn-info btn btn-outline-info btn-sm" >
                 Информация
                </button>
                
                <button class="MyBtn MyBtn-edit btn btn-outline-warning btn-sm">
                 Редактировать
                </button>

                <button class="MyBtn MyBtn-remove btn btn-outline-danger btn-sm">
                 Удалить
                </button>
              </div>

    </div>`;
    el.append(htmlblock);
    
}

function showListFunct (idel, listfuncts){
    el = $(`#block${idel} .parent .list-funct `).first();
    
    listfuncts.forEach(function(element) {
        
        addHTMLFunct(el, element.id, element.title);
    });
}

function showBlockFunct(idblock, id, title){
    el = $(`#block${idblock} .parent .list-funct `).first();
    addHTMLFunct(el, id, title);

}

function getBlockFunct(idblock, id){
    return $(`#block${idblock} .parent .list-funct `).find(`#funct${id}`).first();
}

function removeBlockFunct(idblock, id){
    el = getBlockFunct(idblock, id);
    el.remove();
}

function showChangeTitleBlockFunct(idblock, id, title){
    block = getBlockFunct(idblock, id);
    block =  block.find(".title .text");
    block.text(title);
}

function showTree(tree){
    
    tree.walk(function(node){
        id = node.model.id;
        title = node.model.title;
        listfunct = node.model.listfunct;

        console.log(`Имя : ${title}`);
        
        path = node.getPath();
        console.log(`Путь : `,path);
        
        if(path.length === 2)
        {
            addHTMLBlock($("#tree"),id,title);
            showListFunct(id,listfunct);
            
        }
        else if(path.length >= 3)
        {
            idparent = node.parent.model.id;
            showChildBlock(idparent, id, title);
            connectChildNode(idparent,id);
            showListFunct(id,listfunct);
        }
        
        

    });
}

function showPartTree(childrens, parentNode){
    childrens.forEach(function(node){
        id = node.model.id;
        title = node.model.title;
        listfunct = node.model.listfunct;
        path = parentNode.getPath(); 

        
        if(path.length === 1){
            addHTMLBlock($("#tree"),id,title);
            showListFunct(id,listfunct);
        }
        else{
            showChildBlock(parentNode.model.id, id, title);
            showListFunct(id,listfunct);
            connectChildNode(parentNode.model.id, id);
        }
        
        if(node.children.length > 0)
            showPartTree(node.children, node);
    });
}

function updatePath(tree){
    
    tree.walk(function(node){
        path = node.getPath();
        
        if(path.length >= 3){
            id = node.model.id;
            idparent = node.parent.model.id;
            updateConnectChildNode(idparent,id);
        }
    });
}

function getNode(root,id){
    return root.first({strategy: 'post'}, function (node) {
        return node.model.id === id;
    });
}

function addChildNode(tree,root,idparent,id,title, discription ="" ,children=[],listfunct=[]){
    

    node = tree.parse({id,title,children,listfunct,discription});
    nodeparent = getNode(root,idparent);

    nodeparent.addChild(node);
    return true;
}

function getChildrensNode(tree, root, id){
    node = getNode(root,id);
    return node.children;
}

function getParentNode(tree, root, id){
    node = getNode(root,id);
    return node.parent;
}

function removeNode(tree, root, id){
    
    node = root.first({strategy: 'post'}, function (node) {
        return node.model.id === id;
    });
    
    node.drop();

    return true;
}

var ID = function () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
  };


function getInfoFunctBlock(id){
    return new Promise((resolve, reject) => {

        setTimeout(() => {
        let info = {id,title:"Фун Блок",discription:"Описание блока"}
        resolve(info);
        }, 1000);
    
    });
}

function getInfoFunct(idParent, id){
    return new Promise((resolve, reject) => {

        setTimeout(() => {
        let info = {idParent, id, title:"Функция", discription:"Описание функции", type:"struct"}
        resolve(info);
        }, 1000);
    
    });
}


function getDataTree(){
    return new Promise((resolve,reject) => {
        let testdata = {
            id:0,
            title:"Начало дерева",
            children:[
                {
                    id:1,
                    title:"Блок 1",
                    discription:"Я блок ы",
                    listfunct:[
                        {
                        id:1,
                        title:"Функция 1",
                        discription:" лалала",
                        type:"single"
                    }],
                    children:[
                    {
                        id:2,
                        title:"Блок 1 - 1",
                        discription:"",
                        children:[],
                        listfunct:[]
                    },
                    {
                        id:3,
                        title:"Блок 1 - 2",
                        discription:"",
                        children:[],
                        listfunct:[]
                    }, 
                    ]
                },
                {
                    id:4,
                    title:"Блок 2",
                    discription:"",
                    listfunct:[],
                    children:[
                    {
                        id:5,
                        title:"Блок 2 - 1",
                        discription:"",
                        listfunct:[],
                        children:[
                            {
                                id:6,
                                title:"Блок 2 - 1 - 1",
                                discription:"",
                                children:[],
                                listfunct:[
                                    {
                                        id:2,
                                        title:"Функция 1",
                                        discription:"",
                                        type:"single"
                                    },
                                    {
                                        id:3,
                                        title:"Функция 2",
                                        discription:"",
                                        type:"single"
                                    },
                                    {
                                        id:4,
                                        title:"Функция 3",
                                        discription:"",
                                        type:"single"
                                    }
                                ]
                            }
                        ]
                    } 
                    ]
                }
            ]
        }

        setTimeout(() => {
            resolve(testdata);
            }, 1000);
    });
}


$(document).ready(function() {
    // reset svg each time 
    $("#svg1").attr("height", "0");
    $("#svg1").attr("width", "0");

    
    getDataTree().then((treeData)=>{
        $("#loaderTreeContainer").removeClass("d-flex").addClass("d-none");
        $("#displayContainer").css("display","block");
        data = treeData;
        tree = new TreeModel();
        root = tree.parse(data);

        showTree(root);  
        setAllListner(tree, root);
        


        $("#functionInfoModal #typeFunctionFormControlSelect").change(() => {
            value = $(this).val();
            if(value === "single" || value === "discription")
                $("#functionInfoModal #functionInfoModalStruct").addClass("d-none")
            else
                $("#functionInfoModal #functionInfoModalStruct").removeClass("d-none");
        });
    });
});

function setAllListner(tree,root){
    setListanerOnUpdListFunct = 
    function(all = true, node = null){
        listFunct = all ? $(".block .parent .list-funct") : node.find(".parent .list-funct");
        listFunct.arrive(".funct", function(newFunctItem){
            setListnerOnFunctionTool(tree, root, "funct", $(newFunctItem));
        });
    }

    setListnerOnNodeTool(tree,root);
    setListnerOnFunctionTool(tree,root);
    setListanerOnUpdListFunct();

    $("#tree").arrive(".block", function(newitem){
        setListnerOnNodeTool(tree, root, false, $(newitem));
        setListnerOnFunctionTool(tree, root, "listfunct", $(newitem));
        setListanerOnUpdListFunct(false, $(newitem));
    });

}

function setListnerOnFunctionTool(tree,root,type = "all", node = null) {

    button = 
    function(tag){
       return (
        type === "all" ? $(`.funct .tool ${tag}`) :
        type === "listfunct" ? node.find(`.parent .list-funct`).first().find(`.funct .tool ${tag}`) :
        type === "funct" ? node.find(`.tool ${tag}`).first() :
        console.warn(`type: ${type} not exist`) 
        );
    }

    getIdFunct=
    function(jqButtonFunct){
        parent = jqButtonFunct.parents(".funct").eq(0);
        idparent = parent.attr("id");
        id = parseInt(idparent.replace("funct",""));
        return id
    }

    button(".MyBtn-info").click(function(){
        let idFunct = getIdFunct($(this));
        let idNode = getIdNodeChild($(this));
        console.log("Нажата функция под id: ",idFunct);
        console.log("Родитель id:", idNode);

        let node = getNode(root, idNode);
        let objIndex = node.model.listfunct.findIndex((obj => obj.id === idFunct));
        let functModel = node.model.listfunct[objIndex];
        let callbackReady = (modals) => {
            modals.find("#functionInfoModalTitle").text(functModel.title);
            let discriptionFormControlTextarea = modals.find("#discriptionFormControlTextarea");
            let typeFunctionFormControlSelect = modals.find("#typeFunctionFormControlSelect");
            let buttonSaveChange = modals.find(".mybtn-savechange");
            
            discriptionFormControlTextarea.val("");
            discriptionFormControlTextarea.val(functModel.discription);

            typeFunctionFormControlSelect.val(functModel.type);
            if(functModel.type === "single" || functModel.type === "discription")
                $("#functionInfoModal #functionInfoModalStruct").addClass("d-none")
            else
                $("#functionInfoModal #functionInfoModalStruct").removeClass("d-none");

            buttonSaveChange.click(()=>{
                node.model.listfunct[objIndex].discription = discriptionFormControlTextarea.val();
                node.model.listfunct[objIndex].type = typeFunctionFormControlSelect.val();
                buttonSaveChange.off();
                modals.modal('hide');
            });

            modals.on('hide.bs.modal', () => {
                buttonSaveChange.off();
                modals.off("hide.bs.modal");   
            });
        }

        openModal("functionInfoModal", callbackReady);
    });
    button(".MyBtn-remove").click(function(){
        idNode = getIdNodeChild($(this));
        idFunct = getIdFunct($(this));
        node = getNode(root, idNode);
        let callRemoveFunct = (result) =>{
            if(result){
                node.model.listfunct = node.model.listfunct.filter(funct => funct.id !== idFunct);
                removeBlockFunct(idNode, idFunct);
            }
        }

        confirmModal("Удаление функции",`Вы точно хотите удалить функцию `,callRemoveFunct);
        
        
    });
    button(".MyBtn-edit").click(function(){
        idNode = getIdNodeChild($(this));
        idFunct = getIdFunct($(this));

        node = getNode(root, idNode); 
        objIndex = node.model.listfunct.findIndex((obj => obj.id === idFunct));

        let changeTitle = (result) => {
            console.log("Изменено");
            node.model.listfunct[objIndex].title = result;
            showChangeTitleBlockFunct(idNode, idFunct, result);
        };

        promptModal("Новое название функции", "Введите новое название функции", node.model.listfunct[objIndex].title, changeTitle);
    })
}

function setListnerOnNodeTool(tree,root,all = true, node = null){

    button = 
    function(tag){
       return all ? $(`.block .parent .node .tool ${tag}`) : node.find(`.parent .node .tool ${tag}`).first();
    }

    button(".MyBtn-info").click(function(){
        let idNode = getIdNodeChild($(this));
        console.log("Был нажат блок под id",idNode);
        let node = getNode(root, idNode);

        let callbackReady = (modals) => {
            
            modals.find("#nodeInfoModalTitle").text(node.model.title);
            let discriptionFormControlTextarea = modals.find("#discriptionFormControlTextarea");
            let buttonSaveChange = modals.find(".mybtn-savechange");
            discriptionFormControlTextarea.val("");
            discriptionFormControlTextarea.val(node.model.discription);

            buttonSaveChange.click(()=>{
                console.log(`Данные будут записанны в ф.б. id ${idNode}`,discriptionFormControlTextarea.val());
                node.model.discription = discriptionFormControlTextarea.val();
                buttonSaveChange.off();
                modals.modal('hide');
            });

            modals.on('hide.bs.modal', () => {
                buttonSaveChange.off();
                modals.off("hide.bs.modal");   
            });
        };

        openModal("nodeInfoModal", callbackReady);

    });
 
    button(".MyBtn-addchild").click(function(){
        
        idNode = getIdNodeChild($(this));
        nodeParent = getNode(root, idNode);
        
        let callbackAddChild = (result) => {
            newdata = {id:getRandomInt(10,100),title:result,discription:""};
            
            addChildNode(tree,root,idNode,newdata.id,newdata.title, newdata.discription);
            showChildBlock(idNode,newdata.id,newdata.title);
            connectChildNode(idNode,newdata.id);
            updatePath(root);
        };
        
        promptModal("Создание нового функционального блока",
        `Введите название нового функционального блока зависимового от блока "${nodeParent.model.title}" `,
        "Новый блок", callbackAddChild);
    });
    button(".MyBtn-addfunct").click(function(){
        idNode = getIdNodeChild($(this));
        node = getNode(root,idNode);

        let callbackAddFunct = (result) => {
            newFunct = {id:getRandomInt(10,100), title:result, discription:"", type: "single"};
            node.model.listfunct.push(newFunct);
            showBlockFunct(idNode,newFunct.id,newFunct.title);
        }

        promptModal("Создание нового функции",
        `Введите название новой функции функционального блока "${node.model.title}" `,
        "Новая функция", callbackAddFunct);

    });
    button(".MyBtn-editchild").click(function(){
        idNode = getIdNodeChild($(this));
        node = getNode(root,idNode);

        let callbackEditChild = (result) => {
            node.model.title = result;
            showChangeTitleBlock(idNode,result);
        }

        promptModal("Новое название функционального блока", "Введите новое название функционального блока", node.model.title, callbackEditChild);
        

    });
    button(".MyBtn-move").click(function(){
        idNode = getIdNodeChild($(this));
        node = getNode(root,idNode);
        children = node.children

        

        $(`#block${idNode} .node .title`).css("border-color","#ffc107");
        $(`#block${idNode} .node .title`).css("background-color","#fff9e9");

        allButton = $('.block .parent .node .tool .MyBtn')
        allButton.prop("disabled",true);
        allButton.addClass("d-none");

        buttonPaste = $(`.block .node`).not($(`#block${idNode} .node`)).find(".MyBtn-paste");
        buttonPaste.removeClass("d-none");
        buttonPaste.prop("disabled",false);
        buttonPaste.css("display","block");

        buttonMoveToStart = $("#mybtn-movetostart");
        buttonMoveToStart.removeClass("d-none");

        updatePath(root);

        buttonPaste.click(function(){
            idContanire = getIdNodeChild($(this));
            nodeContanire = getNode(root,idContanire);

            removeConnectChildNodes(tree, root,[node]);
            removeBlock(node.model.id);
            removeNode(tree, root, idNode);
            addChildNode(tree, root, idContanire, node.model.id, node.model.title, node.model.discription, node.model.children, node.model.listfunct);
            
            nodeChild = getNode(root,node.model.id);
            
            showPartTree([nodeChild],nodeChild.parent);
            
            buttonPaste.off("click");
            buttonPaste.css("display","none");
            allButton.prop("disabled",false);
            allButton.removeClass("d-none");
            buttonMoveToStart.addClass("d-none");
            updatePath(root);
        });   

    });

    button(".MyBtn-remove").click(function(){
        idNode = getIdNodeChild($(this));
        removedNode = getNode(root, idNode); 
        childrens = getChildrensNode(tree, root, idNode);
        parentNode = getParentNode(tree, root, idNode)
        idParent = parentNode.model.id;

        let callRemoveFunctBlock = (result)=>{
            if(result){
                result = false;
                // если дети есть
                if(childrens.length > 0){
                    result = true;
                    
                    childrens.forEach(function(node){
                        removeBlock(node.model.id);
                    });
                    // удаление линий у дочерних и их зависимых блоков 
    
                    removeConnectChildNodes(tree, root, childrens);
                }
                removeConnectNode(idNode);
                removeBlock(idNode);
    
                removeNode(tree, root, idNode);
    
                // Добавления дочерних объектов на место удаленного родителя
                updatePath(root);
                return result;
                
            }
            return result;
        }


        let callRemoveChildFunctBlock = (on) => {
            if(on){
                childrens.forEach(function(node){
                            
                    addChildNode(tree, root, idParent, node.model.id, node.model.title, node.model.discription, node.model.children, node.model.listfunct);
                });            
                showPartTree(childrens,parentNode);
                updatePath(root);
            }

        }
        
        confirmModal("Удаление функционального блока",`Вы точно хотите удалить функциональный блок ${removedNode.model.title}`,callRemoveFunctBlock).then((result)=>{
            if(result)
                confirmModal("Удаление функционального блока",`Вы хотите оставить дочерние объекты функционального блока?`,callRemoveChildFunctBlock);
        });
        
    });
}

function getIdNodeChild(jqblockchild){
    parent = jqblockchild.parents(".block").eq(0);
    idparent = parent.attr("id");
    id = parseInt(idparent.replace("block",""));
    return id
}


