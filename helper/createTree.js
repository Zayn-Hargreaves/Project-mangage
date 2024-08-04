let count = 0;
const createTree = (arr,parentId="") =>{
    const tree = []
    arr.forEach(element => {
        if (element.parent_id === parentId) {
            const newItem = element
            const children = createTree(arr, element.id)
            count++
            newItem.index = count
            if (children.length > 0) {
                newItem.children = children
            }
            tree.push(newItem)
        }
    });
    return tree
}
module.exports.tree = (arr, parentId = "") => {
    count = 0
    const tree = createTree(arr, parentId = "")
    return tree
}