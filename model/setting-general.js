const { default: mongoose } = require("mongoose");



const settingGeneralSchema = new mongoose.Schema(
  {
    websiteName: String,
    logo: String,
    phone: String,
    email: String,
    address: String,
    copyright:String
  },
  {
    // khi sét timestamps là true thì sẽ tự tạo sản createAt và updateAt
    timestamps: true
  }
);

const SettingGeneral = mongoose.model("SettingGeneral", settingGeneralSchema, "settings-general"); // cái tham số thứ 3 là tên connection product

module.exports = SettingGeneral;

// tk MongoDB
// username: lenhathuy9a6
// Password: zPL4peRvD3BIrhis