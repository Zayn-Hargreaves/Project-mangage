
const ProductCategory = require("../model/products-category.model");

module.exports.getSubcategory = async (parentId) => {
    const getCategory = async (parentId) => {
        const subs = await ProductCategory.find({
            parent_id: parentId,
            status: "active",
            deleted: false
        })
    
        let allSub = [...subs];
    
        for (const sub of subs) {
            const childs = await getCategory(sub.id); // đệ quy
            allSub = allSub.concat(childs); //nối hai hay nhiều array lại với nhau
        }
    
        return allSub;
    }

    const result = await getCategory(parentId);
    return result;
}