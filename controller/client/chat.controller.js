const uploadToCloudary = require("../../helper/uploadToCloudary")
const Chat = require("../../model/chat.model")
const User = require("../../model/user.model")
const chatSocket = require("../../socket/client/chat.socket")

module.exports.index = async (req, res) =>{
    chatSocket(req,res)
    const room_chat_id = req.params.roomChatId
    const chats= await Chat.find({
        room_chat_id:room_chat_id,
        deleted:false
    })
    for (const chat of chats) {
        const inforUser = await User.findOne({
            _id:chat.user_id
        })
        chat.inforUser= inforUser
    }
    res.render("client/page/chat/index",{
        pageTitle:"chat",
        chats:chats
    })
}