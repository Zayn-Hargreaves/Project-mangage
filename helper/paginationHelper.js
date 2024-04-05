module.exports = (objectPagination,query,countProducts) =>{
    //pagination
    if(query.page){
    objectPagination.currentPage = parseInt(query.page);
    }
    objectPagination.skip = (objectPagination.currentPage -1) * objectPagination.limitItem;
    const totalPage= Math.ceil(countProducts/objectPagination.limitItem);
    objectPagination.totalPage = totalPage;
    //end pagination
    return objectPagination;
}