const { default: mongoose } = require("mongoose");
const forgotPasswordSchema = new mongoose.Schema(
  {
    email: String,
    otp: String,
    expireAt: {
        type: Date,
        expires: 180    //Thời gian hết hạn
    }
  },
  {
    // khi sét timestamps là true thì sẽ tự tạo sản createAt và updateAt
    timestamps: true
  }
);

const ForgotPassword = mongoose.model("ForgotPasswordSchema", forgotPasswordSchema, "forgot-password"); // cái tham số thứ 3 là tên connection product

module.exports = ForgotPassword;

// tk MongoDB
// username: lenhathuy9a6
// Password: zPL4peRvD3BIrhis