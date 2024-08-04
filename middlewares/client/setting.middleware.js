const SettingGeneral = require("../../model/setting-general")
module.exports.SettingGeneral = async(req, res, next) =>{
    const settingGeneral = await SettingGeneral.findOne({})
    res.locals.settingGeneral = settingGeneral
    next();
}