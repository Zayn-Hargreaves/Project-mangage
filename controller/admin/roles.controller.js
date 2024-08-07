const roles = require("../../model/roles.model")
const systemConfig = require('../../config/system')
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }
    const records = await roles.find(find)
    // console.log(records) 
    res.render("admin/page/roles/index", {
        pageTitle: "Trang nhóm quyền ",
        records: records
    })
}
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    }
    const records = await roles.find(find)
    res.render("admin/page/roles/create", {
        pageTitle: "Trang tao nhóm quyền ",
        records: records
    })
}
module.exports.createPost = async (req, res) => {
    const records = new roles(req.body)
    // console.log(records)
    await records.save()
    res.redirect(`${systemConfig.prefixAdmin}/roles`)
}
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id
        let find = {
            _id: id,
            deleted: false
        }
        const data = await roles.findOne(find)
        res.render("admin/page/roles/edit", {
            pageTitle: "sua nhom quyen",
            data: data
        })
    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/roles`)
    }
}
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id
        await roles.updateOne({ _id: id }, req.body)
        req.flash("success", "cap nhat thanh cong")
    } catch (error) {
        req.flash("error", "cap nhat that bai")
        res.redirect("back")
    }
}
//[delete] /admin/roles/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    await roles.updateOne({ _id: id }, { deleted: true, deleteAt: new Date() });
    req.flash("success", `đã xoá sản phẩm thành công`)
    res.redirect("back")
}
module.exports.permissions = async (req, res) => {
    let find = {
        deleted: false
    }
    const records = await roles.find(find)
    res.render("admin/page/roles/permissions", {
        pageTitle: "Trang phân quyền",
        records: records
    })
}
module.exports.permissionsPatch = async (req, res) => {
    try {
        const permissions = JSON.parse(req.body.permissions)
        for (const item of permissions) {
            await roles.updateOne({ _id: item.id }, { permissions: item.permissions })
        }
        req.flash("success", "cap nhat thanh cong")
        res.redirect('back')
    } catch (error) {
        req.flash("error","cap nhat that bai")
    }

}