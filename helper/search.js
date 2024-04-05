module.exports = (query)=>{
    let objectSearch = {
        keyword:""
    };
    if (query.keyword){
        objectSearch.keyword = query.keyword;
        const regex = new RegExp(objectSearch,"i");
        objectSearch.regex = regex;
    }
    return objectSearch;
}