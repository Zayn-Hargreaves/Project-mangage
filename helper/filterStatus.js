module.exports = (query) =>{
    let filterStatus = [
       { name: "tất cả",
        status: "",
        class: ""
        },
       {name:"hoạt động",
        status:"active",
        class: ""
        },
       {name:"dừng hoạt động",
        status:"inactive",
        class: ""
        }
    ];
    if( query.status){
        const index = filterStatus.findIndex(item=> item.status == query.status);
        filterStatus[index].class = "active";
    }else{
        const index = filterStatus.findIndex(item=> item.status == "");
        filterStatus[index].class = "active";
    }
    return filterStatus;
}