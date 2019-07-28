//start point 
$(document).ready(function() {
    window.state = {
        lodingCircle:true,
        dataTree:{},
    };



    window.state = turnLoading(window.state);

    getDataTree().then((treeData)=>{
        window.state = turnLoading(window.state);
        const treeTool = new TreeModel();
        let dataTree = treeTool.parse(treeData);
        window.state = changeState(window.state, "dataTree", dataTree);
        //showTree();
    });

});


// State Functions
function changeState(state, index, data){
    return {...state, [index]:data}
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

// HTML Manipulation Functions

