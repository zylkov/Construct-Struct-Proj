//helper functions, it turned out chrome doesn't support Math.sgn() 
function signum(x) {
    return (x < 0) ? -1 : 1;
}
function absolute(x) {
    return (x < 0) ? -x : x;
}

 /*function drawPath(svg, path, startX, startY, endX, endY) {
    // get the path's stroke width (if one wanted to be  really precize, one could use half the stroke size)
    var stroke =  parseFloat(path.attr("stroke-width"));
    // check if the svg is big enough to draw the path, if not, set heigh/width
    if (svg.attr("height") <  endY)                 svg.attr("height", endY);
    if (svg.attr("width" ) < (startX + stroke) )    svg.attr("width", (startX + stroke));
    if (svg.attr("width" ) < (endX   + stroke) )    svg.attr("width", (endX   + stroke));
    
    var deltaX = (endX - startX) * 0.15;
    var deltaY = (endY - startY) * 0.15;
    // for further calculations which ever is the shortest distance
    var delta  =  deltaY < absolute(deltaX) ? deltaY : absolute(deltaX);

    // set sweep-flag (counter/clock-wise)
    // if start element is closer to the left edge,
    // draw the first arc counter-clockwise, and the second one clock-wise
    var arc1 = 0; var arc2 = 1;
    if (startX > endX) {
        arc1 = 1;
        arc2 = 0;
    }
    // draw tha pipe-like path
    // 1. move a bit down, 2. arch,  3. move a bit to the right, 4.arch, 5. move down to the end 
    path.attr("d",  "M"  + startX + " " + startY +
                    " V" + (startY + delta) +
                    " A" + delta + " " +  delta + " 0 0 " + arc1 + " " + (startX + delta*signum(deltaX)) + " " + (startY + 2*delta) +
                    " H" + (endX - delta*signum(deltaX)) + 
                    " A" + delta + " " +  delta + " 0 0 " + arc2 + " " + endX + " " + (startY + 3*delta) +
                    " V" + endY );
}
*/
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
                    <button class="btn">
                    Информация
                    </button>
                    <button class="btn btn-addchild">
                    Добавить
                    </button>
                    <button class="btn btn-addfunct">
                    Добавить Функцию
                    </button>
                    <button class="btn btn-remove">
                    Удалить
                    </button>
                    <button class="btn btn-editchild">
                    Редактировать
                    </button>
                    <button class="btn btn-move">
                    Вырезать
                    </button>
                    <button class="btn btn-paste" style="display:none;">
                    Вставить
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
                <button class="btn btn-info">
                 Информация
                </button>
                <button class="btn">
                 Удалить
                </button>
                <button class="btn">
                 Редактировать
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

function removeBlockFunct(idblock, id){
    el = $(`#block${idblock} .parent .list-funct `).find(`#funct${id}`).first();
    el.remove();
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

function addChildNode(tree,root,idparent,id,title,children=[],listfunct=[]){
    

    node = tree.parse({id,title,children,listfunct});
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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
 }


$(document).ready(function() {
    // reset svg each time 
    $("#svg1").attr("height", "0");
    $("#svg1").attr("width", "0");

    data = {
        id:0,
        title:"Начало дерева",
        children:[
            {
                id:1,
                title:"Блок 1",
                listfunct:[
                    {
                    id:1,
                    title:"Функция 1"
                }],
                children:[
                {
                    id:2,
                    title:"Блок 1 - 1",
                    children:[],
                    listfunct:[]
                },
                {
                    id:3,
                    title:"Блок 1 - 2",
                    children:[],
                    listfunct:[]
                }, 
                ]
            },
            {
                id:4,
                title:"Блок 2",
                listfunct:[],
                children:[
                {
                    id:5,
                    title:"Блок 2 - 1",
                    listfunct:[],
                    children:[
                        {
                            id:6,
                            title:"Блок 2 - 1 - 1",
                            children:[],
                            listfunct:[
                                {
                                    id:2,
                                    title:"Функция 1"
                                },
                                {
                                    id:3,
                                    title:"Функция 2"
                                },
                                {
                                    id:4,
                                    title:"Функция 2"
                                }
                            ]
                        }
                    ]
                } 
                ]
            }
        ]
    }
    
    tree = new TreeModel();
    root = tree.parse(data);

    showTree(root);  
    setAllListner(tree, root);  
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
        type === "listfunct" ? node.find(`.parent .list-funct .funct .tool ${tag}`).first() :
        type === "funct" ? node.find(`.tool ${tag}`).first() :
        console.warn(`type: ${type} not exist`) 
        );
    }

    button(".btn-info").click(function(){
        console.log("Нажата функция");
    });
}

function setListnerOnNodeTool(tree,root,all = true, node = null){

    button = 
    function(tag){
       return all ? $(`.block .parent .node .tool ${tag}`) : node.find(`.parent .node .tool ${tag}`).first();
    }

 
    button(".btn-addchild").click(function(){
        
        idNode = getIdNodeChild($(this));
        result = prompt("Введите название блока:", "Нет названия");
    
        newdata = {id:getRandomInt(10,100),title:result};
        
        addChildNode(tree,root,idNode,newdata.id,newdata.title);
        showChildBlock(idNode,newdata.id,newdata.title);
        connectChildNode(idNode,newdata.id);
        updatePath(root);
        
    });
    button(".btn-addfunct").click(function(){
        idNode = getIdNodeChild($(this));
        result = prompt("Введите название функции:", "Нет названия");
        node = getNode(root,idNode);
        newFunct = {id:getRandomInt(10,100), title:result};
        node.model.listfunct.push(newFunct);
        showBlockFunct(idNode,newFunct.id,newFunct.title);
    });
    button(".btn-editchild").click(function(){
        idNode = getIdNodeChild($(this));
        result = prompt("Введите новое название блока:", "Нет названия");
        node = getNode(root,idNode);
        node.model.title = result;
        showChangeTitleBlock(idNode,result);
        

    });
    button(".btn-move").click(function(){
        idNode = getIdNodeChild($(this));
        node = getNode(root,idNode);
        children = node.children

        

        $(`#block${idNode} .node .title`).css("background-color","red");

        allButton = $('.block .parent .node .tool .btn')
        allButton.prop("disabled",true);

        buttonPaste = $(`.block .node`).not($(`#block${idNode} .node`)).find(".btn-paste");
        buttonPaste.prop("disabled",false);
        buttonPaste.css("display","block");

        updatePath(root);

        buttonPaste.click(function(){
            idContanire = getIdNodeChild($(this));
            nodeContanire = getNode(root,idContanire);

            removeConnectChildNodes(tree, root,[node]);
            removeBlock(node.model.id);
            removeNode(tree, root, idNode);
            addChildNode(tree, root, idContanire, node.model.id, node.model.title, node.model.children, node.model.listfunct);
            
            nodeChild = getNode(root,node.model.id);
            
            showPartTree([nodeChild],nodeChild.parent);
            
            buttonPaste.off("click");
            buttonPaste.css("display","none");
            allButton.prop("disabled",false);
            updatePath(root);
        });   

    });

    button(".btn-remove").click(function(){

        result = confirm("Вы точно хотите удалить блок?");

        if(result){
            idNode = getIdNodeChild($(this));
            result = true;

           

            childrens = getChildrensNode(tree, root, idNode);
            parentNode = getParentNode(tree, root, idNode)
            idParent = parentNode.model.id;
            // если дети есть
            if(childrens.length > 0){
                result = confirm("Вы хотите удалить дочерние объекты блока ?");

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
            if(!result){
                
                childrens.forEach(function(node){
                    
                    addChildNode(tree, root, idParent, node.model.id, node.model.title, node.model.children);
                });
      
                
                showPartTree(childrens,parentNode);
            }
            updatePath(root);
        }
    });
}

function getIdNodeChild(jqblockchild){
    parent = jqblockchild.parents(".block").eq(0);
    idparent = parent.attr("id");
    id = parseInt(idparent.replace("block",""));
    return id

}


