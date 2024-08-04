const SettingGeneral = require("../../model/setting-general")
module.exports.general = async (req, res) => {
    const settingsGeneral = await SettingGeneral.findOne({})
    res.render("admin/page/settings/general", {
        pageTitle: "Trang cài đặt chung",
        settingGeneral: settingsGeneral
    })
}
module.exports.generalPatch = async (req, res) => {
    const settingGeneral = await SettingGeneral.findOne({});

    if (settingGeneral) {
        await SettingGeneral.updateOne({
            _id: settingGeneral.id
        }, req.body);
    } else {
        const record = new SettingGeneral(req.body)
        record.save()
    }
    res.redirect("back")
}