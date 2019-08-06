//start point 
$(document).ready(function() {
    window.state = {
        lodingCircle:true,
        dataTree:{},
    };




    getDataTree().then((treeData)=>{
        turnLoading();
        const treeTool = new TreeModel();
        let dataTree = treeTool.parse(treeData);
        changeState("dataTree", dataTree);
        showTree();
    });

});


// State Functions

function changeState(index, data){
    const newState = {...window.state, [index]:data};
    console.group(`Change State`);
    console.log(`Model: ${index}`);
    console.log(`Past data:`, window.state[index]);
    window.state = newState;
    console.log(`Current data:`, window.state[index]);
    console.groupEnd();
    return newState;
}

function addChildNode(idParent, dataNewNode){
    const treeTool = new TreeModel();
    const newNode = treeTool.parse(dataNewNode);
    
    console.group(`Change Node id${idParent} children`);
    const nodeParent = getNode(idParent);
    console.log(`Past data:`, nodeParent.children);
    nodeParent.addChild(newNode);
    console.log(`Current data:`, nodeParent.children);
    console.groupEnd();
    return true;

}

function getNode(id){
    return window.state.dataTree.first({strategy: 'post'}, function (node) {
        return node.model.id === id;
    });
    
}

function getParentNode(id){
    return getNode(id).parent
}

function removeNode(id){
    const node = getNode(id);
    node.drop();
    console.log(`Remove node id${id}`);
    
    return true;
}

// *Hook model node
function useModelNode(id){
    let node = window.state.dataTree.first({strategy: 'post'}, function (node) {
        return node.model.id === id;
    });

    const setDataInNode = (nameModel, data) => {
        console.group(`Change Node id ${id}`);
        console.log(`Model: ${nameModel}`);
        console.log(`Past data:`, node.model[nameModel]);
        node.model[nameModel] = data;
        console.log(`Current data:`, node.model[nameModel]);
        console.groupEnd();
    }

    return [node.model, setDataInNode];
}

// *Hook model node function
function useModelNodeFunction(idNode, idFunction){
    let node = window.state.dataTree.first({strategy: 'post'}, function (node) {
        return node.model.id === idNode;
    });

    const objIndex = node.model.listfunct.findIndex((obj => obj.id === idFunction));
    
    let modelFunction = node.model.listfunct[objIndex];
    const setDataInFunctionNode = (nameModel, data) => {
        console.group(`Change Function id ${idFunction} Node ${idNode}`);
        console.log(`Model: ${nameModel}`);
        console.log(`Past data:`, node.model.listfunct[objIndex][nameModel]);
        node.model.listfunct[objIndex][nameModel] = data;
        console.log(`Current data:`, node.model.listfunct[objIndex][nameModel]);
        console.groupEnd();
    }
    const removeFunctionNode = () => {
        console.log(`Remove Function id ${idFunction} Node ${idNode}`);
        node.model.listfunct = node.model.listfunct.filter(funct => funct.id !== idFunction);
    }

    return [modelFunction, setDataInFunctionNode, removeFunctionNode];
}

function turnLoading(){
    if (window.state.lodingCircle === true) {
        $("#loaderTreeContainer").removeClass("d-flex").addClass("d-none");
        $("#displayContainer").css("display","block");
        changeState("lodingCircle", false);
        return false;

    } else{
        $("#loaderTreeContainer").removeClass("d-none").addClass("d-flex");
        $("#displayContainer").css("display","none");
        changeState(state, "lodingCircle", true)
        return true;
    }
}

function getDataTree(){
    return new Promise((resolve,reject) => {
        const testdata = {
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
                        },
                        {
                            id:2,
                            title:"Функция 2",
                            discription:" лалала",
                            type:"single"
                        },
                    ],
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
                    listfunct:[
                        {
                            id:1,
                            title:"Функция 1",
                            discription:" лалала",
                            type:"single"
                        },
                        {
                            id:2,
                            title:"Функция 2",
                            discription:" лалала",
                            type:"single"
                        },
                    ],
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

// Logic Functions

function showTree(){
    
    window.state.dataTree.walk(function(node){
        const id = node.model.id;
        const title = node.model.title;
        const listFunct = node.model.listfunct;

        console.log(`Имя : ${title}`);
        
        const path = node.getPath();
        console.log(`Путь : `,path);
        
        if(path.length === 2)
        {
            addHTMLBlock($("#tree"), id, title);
            showListFunct($("#tree"), id, listFunct);
        }
        else if(path.length >= 3)
        {
            const idParent = node.parent.model.id;
            showChildBlock($("#tree"), idParent, id, title);
            connectChildNode($("#tree"), idParent, id);
            showListFunct($("#tree"), id, listFunct);
        }
        
        

    });
}

function showPartTree(idParent, childrens){
    console.log("Test data:",[idParent, childrens]);
    console.group(`show part tree in node id${idParent}`);
    childrens.forEach((child)=>{
        const id = child.id;
        const title = child.title;
        const listFunct = child.listfunct;
        const nodeChild = getNode(id);
        const path = nodeChild.getPath();
        console.log(`Node id${id} path:`,path);
        console.groupEnd();

        if(path.length === 2)
        {
            addHTMLBlock($("#tree"), id, title);
            showListFunct($("#tree"), id, listFunct);
        }
        else if(path.length >= 3)
        {
            const idParentBlock = nodeChild.parent.model.id;
            showChildBlock($("#tree"), idParentBlock, id, title);
            connectChildNode($("#tree"), idParentBlock, id);
            showListFunct($("#tree"), id, listFunct);
        }

        if(nodeChild.children.length > 0)
            showPartTree(id, nodeChild.model.children);

    });
}

function showListFunct (jqTree, idNode, listFuncts){
    const jqNode = jqTree.find(`#block${idNode} .parent .list-funct `).first();
    
    listFuncts.forEach(function(elementFunct) {
        addHTMLFunct(jqNode, idNode, elementFunct.id, elementFunct.title);
    });
}

function showBlockFunct(idNode, id, title){
    const jqNode = $(`#block${idNode} .parent .list-funct `).first();
    addHTMLFunct(jqNode, idNode, id, title);
}

function showChildBlock(jqTree, idParent, id, title){
    const jqParent = jqTree.find(`#block${idParent} .childrens `).first();
    addHTMLBlock(jqParent, id, title);
}



// HTML Manipulation Functions

function addHTMLFunct(jqNode, idNode, id, title){
    const htmlblock=`
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

    let jqEl = $(htmlblock);
    setListnerOnFunctionTool(jqEl, id, idNode);
    jqNode.append(jqEl);
    
}

 

function setListnerOnFunctionTool(jqFuctional, idFuctional, idNode){
   
    jqFuctional.find(`.tool button`).click(function(){
        console.log(`Была нажата кнопка на функции id:${idFuctional} элемента id:${idNode} с названем:${ $(this).text() } `);
    });

    const button = function(tag){
        return jqFuctional.find(`.tool ${tag}`).first();
    }

    let [functModel, setFunctModel, removeFunctionNode] = useModelNodeFunction(idNode, idFuctional);
   

    button(".MyBtn-info").click(()=>{
        const callbackReadyInfo = (modals) => {
            let discriptionFormControlTextarea = modals.find("#discriptionFormControlTextarea");
            let typeFunctionFormControlSelect = modals.find("#typeFunctionFormControlSelect");
            let buttonSaveChange = modals.find(".mybtn-savechange");
            
            discriptionFormControlTextarea.val("");
            discriptionFormControlTextarea.val(functModel.discription);
            
            typeFunctionFormControlSelect.val(functModel.type);
            if(functModel.type === "single" || functModel.type === "discription") // не меняеться тип
                $("#functionInfoModal #functionInfoModalStruct").addClass("d-none")
            else
                $("#functionInfoModal #functionInfoModalStruct").removeClass("d-none");
            
            buttonSaveChange.click(()=>{
                setFunctModel("discription", discriptionFormControlTextarea.val());
                setFunctModel("type", typeFunctionFormControlSelect.val());
                buttonSaveChange.off();
                modals.modal('hide');
            });

            modals.on('hide.bs.modal', () => {
                buttonSaveChange.off();
                modals.off("hide.bs.modal");   
            });
        }

        openModal("functionInfoModal", callbackReadyInfo);

    });

    button(".MyBtn-edit").click(()=>{
        const callchangeTitle = (newTitle) => {
            setFunctModel("title", newTitle);
            jqFuctional.find(".title .text").text(newTitle);
        }

        promptModal("Новое название функции",
        "Введите новое название функции", 
        functModel.title, callchangeTitle);
    });
    
    button(".MyBtn-remove").click(()=>{
        const callRemoveFunction = (result) => {
            if(result){
                removeFunctionNode();
                jqFuctional.remove();
            }
        }
        
        confirmModal("Удаление функции",
        `Вы точно хотите удалить функцию id ${idFuctional} блока id ${idNode}`, 
        callRemoveFunction);

    });
}

function addHTMLBlock(jqParent, idNode, titleNode){
    
    const htmlBlock=`
    <div class="block" id="block${idNode}">
        <div class="parent">
            <div class="node">
                <div class="title">
                    <div class="text">
                        ${titleNode}
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

    let jqEl = $(htmlBlock);
    setListnerOnNodeTool(jqEl, idNode);
    jqParent.append(jqEl);

}

function setListnerOnNodeTool(jqNode, idNode){
   
    jqNode.find(`.parent .node .tool button`).click(function(){
        console.log(`Была нажата кнопка ${ $(this).text() } на элементе id:${idNode} `);
    });

    const button = function(tag){
        return jqNode.find(`.parent .node .tool ${tag}`).first();
    }

    const addHTMLBlockChild = (id, title) => {
        addHTMLBlock(jqNode.find(".childrens").first(), id, title);
    }

    const removeConnectChildNodes = (childrens) => {
        childrens.forEach((child)=>{
            removeConnect(child.id);
            if(child.children.length > 0)
                removeConnectChildNodes(child.children);
        });
    }


    let [node, setDataInNode] = useModelNode(idNode); 

    button(".MyBtn-info").click(()=>{
        const callbackReadyInfo = (modals) => {
            modals.find("#nodeInfoModalTitle").text(node.title);
            let discriptionFormControlTextarea = modals.find("#discriptionFormControlTextarea");
            let buttonSaveChange = modals.find(".mybtn-savechange");
            discriptionFormControlTextarea.val("");
            discriptionFormControlTextarea.val(node.discription);

            buttonSaveChange.click(()=>{
                setDataInNode("discription",discriptionFormControlTextarea.val());
                buttonSaveChange.off();
                modals.modal('hide');
            });

            modals.on('hide.bs.modal', () => {
                buttonSaveChange.off();
                modals.off("hide.bs.modal");   
            });
        }

        openModal("nodeInfoModal", callbackReadyInfo);
    });
    button(".MyBtn-addchild").click(()=>{
        const callbackAddChild = (result) => {
            newdata = {id:getRandomInt(10,100), title:result, discription:"", listfunct:[], children:[]};
            
            addChildNode(idNode, newdata);
            addHTMLBlockChild(newdata.id, result);
            connectChildNode($("#tree"), idNode, newdata.id);
            updatePath();
        };

        promptModal("Создание нового функционального блока",
        `Введите название нового функционального блока зависимового от блока "${node.title}" `,
        "Новый блок", callbackAddChild);
    });
    button(".MyBtn-addfunct").click(()=>{
        const callbackAddFunct = (result) => {
            newFunct = {id:getRandomInt(10,100), title:result, discription:"", type: "single"};
            setDataInNode("listfunct",[...node.listfunct, newFunct]);
            showBlockFunct(idNode,newFunct.id,newFunct.title); // mb remove
        }

        promptModal("Создание нового функции",
        `Введите название новой функции функционального блока "${node.title}" `,
        "Новая функция", callbackAddFunct);
    });
    button(".MyBtn-editchild").click(()=>{
        const callbackEditNode = (result) => {
            setDataInNode("title",result);
            let title = jqNode.find(".parent .node .title .text").first();
            title.text(node.title);
        }

        promptModal("Новое название функционального блока", "Введите новое название функционального блока", node.title, callbackEditNode);
    });
    button(".MyBtn-move").click(()=>{});
    button(".MyBtn-paste").click(()=>{});
    button(".MyBtn-remove").click(()=>{
        const childrens = node.children;
        const parentNode = getParentNode(idNode);
        const callRemoveNode = (result) => {
            if(result){
                result = false;
                if(childrens.length > 0){
                    result = true;

                    childrens.forEach((child)=>{
                        jqNode.find(`.childrens #block${child.id}`).remove();
                        
                    });
                    removeConnectChildNodes(childrens);
                }
                removeConnect(idNode);
                jqNode.remove();
                removeNode(idNode);

                updatePath();
                return result;
            }
            return result;
        }

        const callRemoveChildNode = (on) => {
            if(on){
                childrens.forEach((node)=>{

                    addChildNode(parentNode.model.id, node);
                });
                showPartTree(parentNode.model.id, childrens);
                updatePath();
            }
        }

        confirmModal("Удаление функционального блока",`Вы точно хотите удалить функциональный блок ${node.title}`,
        callRemoveNode).then((result)=>{
            if(result)
                confirmModal("Удаление функционального блока",`Вы хотите оставить дочерние объекты функционального блока?`,
                callRemoveChildNode);
        });

       
    });
}

// SVG Logic Functions
function removeConnect(idNode){
    $(`#path${idNode}`).remove();
}


function updatePath(){
    window.state.dataTree.walk((node)=>{
        const path = node.getPath();

        if(path.length >= 3){
            const idChild = node.model.id;
            const idParent = node.parent.model.id;
            const svg = $("#svg1");
            const path = $(`#path${idChild}`);

            const startElem = $(`#block${idParent} .parent .node .title`).first();
            const endElem = $(`#block${idChild} .parent .node .title`).first();
            connectChild(svg, path, startElem, endElem);
        }
    });
}


function connectChildNode(jqTree, idParent, idChild){
    const svg = $("#svg1");
    createPath(svg,`path${idChild}`);

    const path = $(`#path${idChild}`);
    const startElem = jqTree.find(`#block${idParent} .parent .node .title`).first();
    const endElem = jqTree.find(`#block${idChild} .parent .node .title`).first();
    connectChild(svg, path, startElem, endElem);
}

function connectChild(svg, path, startElem, endElem) {
    const svgContainer= svg;

    // if first element is lower than the second, swap!
    if(startElem.offset().top > endElem.offset().top){
        let temp = startElem;
        startElem = endElem;
        endElem = temp;
    }

    // get (top, left) corner coordinates of the svg container   
    const svgTop  = svgContainer.offset().top;
    const svgLeft = svgContainer.offset().left;

    // get (top, left) coordinates for the two elements
    const startCoord = startElem.offset();
    const endCoord   = endElem.offset();

    // calculate path's start (x,y)  coords
    // we want the x coordinate to visually result in the element's mid point
    const startX = startCoord.left + 0.5*startElem.outerWidth() - svgLeft;    // x = left offset + 0.5*width - svg's left offset
    const startY = startCoord.top  + startElem.outerHeight() - svgTop;        // y = top offset + height - svg's top offset

        // calculate path's end (x,y) coords
    const endX = endCoord.left  - svgLeft;
    const endY = endCoord.top + 0.5*startElem.outerHeight() - svgTop;

    // call function for drawing the path
    drawPath(svg, path, startX, startY, endX, endY);

}

// SVG Manipulation Functions

function createPath(svg, id){
    
    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("id", id);
    path.setAttribute("d", "M0 0");
    path.setAttribute("stroke", "#000");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-width", "3px");
    document.getElementById("svg1").appendChild(path);
}

function drawPath(svg, path, startX, startY, endX, endY) {
    // get the path's stroke width (if one wanted to be  really precize, one could use half the stroke size)
    const stroke =  parseFloat(path.attr("stroke-width"));
    
    // check if the svg is big enough to draw the path, if not, set heigh/width
    if (svg.attr("height") <  endY)                 svg.attr("height", endY + stroke);
    if (svg.attr("width" ) < (startX + stroke) )    svg.attr("width", (startX + stroke));
    if (svg.attr("width" ) < (endX   + stroke) )    svg.attr("width", (endX   + stroke));
    
    path.attr("d", `M ${startX},${startY} 
    l 0,${endY-startY-15} 
    q 0,15 15,15
    l ${endX-startX-15},0`);
}

