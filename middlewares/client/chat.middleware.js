const RoomChat = require("../../model/rooms-chat.model")

module.exports.isAccess = async(req, res,next) =>{
    const room_chat_id = req.params.roomChatId
    const userId = res.locals.user.id
    const existUserInRoomChat = await RoomChat.findOne({
        _id:room_chat_id,
        "users.user_id":userId,
        deleted:false
    })
    if(existUserInRoomChat){
        next();
    }else{
        res.redirect("/")
    }
}