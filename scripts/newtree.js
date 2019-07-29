//start point 
$(document).ready(function() {
    window.state = {
        lodingCircle:true,
        dataTree:{},
    };




    getDataTree().then((treeData)=>{
        window.state = turnLoading(window.state);
        const treeTool = new TreeModel();
        let dataTree = treeTool.parse(treeData);
        window.state = changeState(window.state, "dataTree", dataTree);
        showTree();
    });

});


// State Functions
function changeState(state, index, data){
    return {...state, [index]:data}
}

function useModelNode(id){
    let node = window.state.dataTree.first({strategy: 'post'}, function (node) {
        return node.model.id === id;
    });

    const setDataInNode = (nameModel, data) => {
        node.model[nameModel] = data
    }

    return [node, setDataInNode]
}

function turnLoading(state){
    if (state.lodingCircle === true) {
        $("#loaderTreeContainer").removeClass("d-flex").addClass("d-none");
        $("#displayContainer").css("display","block");

        return changeState(state, "lodingCircle", false);

    } else{
        $("#loaderTreeContainer").removeClass("d-none").addClass("d-flex");
        $("#displayContainer").css("display","none");

        return changeState(state, "lodingCircle", true);
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

// Logick Functions

function showTree(){
    
    window.state.dataTree.walk(function(node){
        const id = node.model.id;
        const title = node.model.title;
        const listfunct = node.model.listfunct;

        console.log(`Имя : ${title}`);
        
        const path = node.getPath();
        console.log(`Путь : `,path);
        
        if(path.length === 2)
        {
            addHTMLBlock($("#tree"),id,title);
            //showListFunct(id,listfunct);
        }
        // else if(path.length >= 3)
        // {
        //     const idparent = node.parent.model.id;
        //     showChildBlock(idparent, id, title);
        //     connectChildNode(idparent,id);
        //     showListFunct(id,listfunct);
        // }
        
        

    });
}

// HTML Manipulation Functions

function addHTMLBlock(el,id,title){
    
    const htmlblock=`
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

    let jqEl = $(htmlblock);
    setListnerOnNodeTool(jqEl, id);
    el.append(jqEl);

}

function setListnerOnNodeTool(jqNode, idNode){
   
    jqNode.find(`.parent .node .tool button`).click(function(){
        console.log(`Была нажата кнопка ${ $(this).text() } на элементе id:${idNode} `);
    });

    const button = function(tag){
        jqNode.find(`.parent .node .tool ${tag}`).first();
    }

    let [node, setDataInNode] = useModelNode(idNode);

    // button(".MyBtn-info").click(()=>{});
    // button(".MyBtn-addchild").click(()=>{});
    // button(".MyBtn-addfunct").click(()=>{});
    // button(".MyBtn-editchild").click(()=>{});
    // button(".MyBtn-move").click(()=>{});
    // button(".MyBtn-paste").click(()=>{});
    // button(".MyBtn-remove").click(()=>{});
}

