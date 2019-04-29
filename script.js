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
    console.log(path);
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
    console.log(startElem.html())
    endElem = $(`#block${idchild} .parent .node .title`).first();
    console.log(endElem.html())
    connectChild(svg, path, startElem, endElem)
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
                    <button>
                    Информация
                    </button>
                    <button>
                    Добавить
                    </button>
                    <button>
                    Удалить
                    </button>
                    <button>
                    Редактировать
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

function addChildBlock(idparent,id,title){
    parent = $(`#block${idparent} .childrens `).first();
    addHTMLBlock(parent,id,title);
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
                <button>
                 Информация
                </button>
                <button>
                 Удалить
                </button>
                <button>
                 Редактировать
                </button>
              </div>

    </div>`;
    el.append(htmlblock);
    
}

function addListFunct (idel, listfuncts){
    el = $(`#block${idel} .parent .list-funct `).first();
    
    listfuncts.forEach(function(element) {
        
        addHTMLFunct(el, element.id, element.title);
    });
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

    root.walk(function(node){
        id = node.model.id;
        title = node.model.title;
        listfunct = node.model.listfunct;

        console.log(`Имя : ${title}`);
        
        path = node.getPath();
        console.log(`Путь : `,path);
        
        if(path.length === 2)
        {
            addHTMLBlock($("#tree"),id,title);
            addListFunct(id,listfunct);
            
        }
        else if(path.length >= 3)
        {
            idparent = path[path.length - 2].model.id;
            addChildBlock(idparent, id, title);
            connectChildNode(idparent,id);
            addListFunct(id,listfunct);
        }
        
        

    });

    

    
});

$(window).resize(function () {
    // reset svg each time 
    
    
});